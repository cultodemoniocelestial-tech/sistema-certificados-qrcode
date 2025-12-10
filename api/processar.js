import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';
import formidable from 'formidable';
import { PDFDocument } from 'pdf-lib';
import pdfParse from 'pdf-parse';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Desabilitar body parser padrão para usar formidable
  },
};

// Função para extrair informações do PDF
async function extrairInformacoesPDF(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  const texto = data.text;

  // Padrões para extrair informações
  const padroes = {
    nome: [
      /(?:certificamos que|certifica-se que|nome[:\s]+)([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç\s]+)/i,
      /aluno[:\s]+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç\s]+)/i,
      /participante[:\s]+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç\s]+)/i
    ],
    curso: [
      /curso[:\s]+([A-Za-z0-9\sáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ\-]+)/i,
      /treinamento[:\s]+([A-Za-z0-9\sáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ\-]+)/i,
      /workshop[:\s]+([A-Za-z0-9\sáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ\-]+)/i
    ],
    cargaHoraria: [
      /(\d+)\s*(?:horas?|h)/i,
      /carga\s*horária[:\s]+(\d+)/i,
      /duração[:\s]+(\d+)\s*(?:horas?|h)/i
    ],
    data: [
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
      /(\d{1,2}\s+de\s+\w+\s+de\s+\d{4})/i,
      /data[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i
    ]
  };

  const info = {
    nome: '',
    curso: '',
    cargaHoraria: '',
    data: ''
  };

  // Extrair nome
  for (const padrao of padroes.nome) {
    const match = texto.match(padrao);
    if (match && match[1]) {
      info.nome = match[1].trim();
      break;
    }
  }

  // Extrair curso
  for (const padrao of padroes.curso) {
    const match = texto.match(padrao);
    if (match && match[1]) {
      info.curso = match[1].trim();
      break;
    }
  }

  // Extrair carga horária
  for (const padrao of padroes.cargaHoraria) {
    const match = texto.match(padrao);
    if (match && match[1]) {
      info.cargaHoraria = match[1].trim();
      break;
    }
  }

  // Extrair data
  for (const padrao of padroes.data) {
    const match = texto.match(padrao);
    if (match && match[1]) {
      info.data = match[1].trim();
      break;
    }
  }

  return info;
}

// Função para adicionar QR Code ao PDF
async function adicionarQRCodeAoPDF(pdfBuffer, qrCodeDataURL, codigo) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Converter QR Code de Data URL para bytes
  const qrCodeImageBytes = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
  const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);

  const qrSize = 100;
  const { width, height } = firstPage.getSize();

  // Posicionar QR Code no canto inferior direito
  firstPage.drawImage(qrCodeImage, {
    x: width - qrSize - 20,
    y: 20,
    width: qrSize,
    height: qrSize,
  });

  // Adicionar código abaixo do QR Code
  firstPage.drawText(`Código: ${codigo}`, {
    x: width - qrSize - 20,
    y: 10,
    size: 8,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Parse do formulário com formidable
    const form = formidable({ maxFileSize: 4.5 * 1024 * 1024 }); // 4.5 MB máximo
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const certificadoFile = files.certificado?.[0];
    
    if (!certificadoFile) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Ler o PDF
    const pdfBuffer = fs.readFileSync(certificadoFile.filepath);

    // Extrair informações do PDF
    const info = await extrairInformacoesPDF(pdfBuffer);

    // Gerar código único
    const codigo = uuidv4();

    // Criar URL de validação
    const baseURL = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const urlValidacao = `${baseURL}/validar.html?codigo=${codigo}`;

    // Gerar QR Code
    const qrCodeDataURL = await QRCode.toDataURL(urlValidacao);

    // Adicionar QR Code ao PDF
    const pdfComQRCode = await adicionarQRCodeAoPDF(pdfBuffer, qrCodeDataURL, codigo);

    // Upload do PDF para Vercel Blob
    const blob = await put(`certificados/${codigo}.pdf`, pdfComQRCode, {
      access: 'public',
      addRandomSuffix: false,
    });

    // Salvar no banco de dados PostgreSQL
    await sql`
      INSERT INTO certificados (codigo, aluno, curso, carga_horaria, data_emissao, url_validacao, url_pdf, status)
      VALUES (${codigo}, ${info.nome}, ${info.curso}, ${info.cargaHoraria}, ${info.data}, ${urlValidacao}, ${blob.url}, 'ativo')
    `;

    // Limpar arquivo temporário
    fs.unlinkSync(certificadoFile.filepath);

    // Retornar resposta
    return res.status(200).json({
      success: true,
      codigo,
      informacoes: info,
      urlPDF: blob.url,
      urlValidacao,
      mensagem: 'Certificado processado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao processar certificado:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar certificado',
      detalhes: error.message 
    });
  }
}
