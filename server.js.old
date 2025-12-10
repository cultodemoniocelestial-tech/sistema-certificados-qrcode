const express = require('express');
const cors = require('cors');
const multer = require('multer');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const pdfParse = require('pdf-parse');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/certificados', express.static('certificados'));

// Configurar upload de arquivos
const upload = multer({ dest: 'uploads/' });

// Criar diretórios necessários
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('certificados')) fs.mkdirSync('certificados');
if (!fs.existsSync('public')) fs.mkdirSync('public');

// ========================================
// ROTA 1: Upload e Processamento do Certificado
// ========================================
app.post('/api/processar-certificado', upload.single('certificado'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
    }

    console.log('📄 Arquivo recebido:', req.file.originalname);

    // Ler o PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    
    // Extrair texto do PDF
    const pdfData = await pdfParse(dataBuffer);
    const texto = pdfData.text;
    
    console.log('📝 Texto extraído do PDF');

    // Extrair informações do certificado usando regex
    const dadosExtraidos = extrairDadosCertificado(texto);
    
    if (!dadosExtraidos.aluno) {
      return res.status(400).json({ 
        erro: 'Não foi possível extrair os dados do certificado',
        textoExtraido: texto.substring(0, 500) // Primeiros 500 caracteres para debug
      });
    }

    // Gerar código único
    const codigoUnico = uuidv4();
    const urlValidacao = `${BASE_URL}/validar?id=${codigoUnico}`;

    // Gerar QR Code
    const qrCodeDataURL = await QRCode.toDataURL(urlValidacao, {
      width: 200,
      margin: 1
    });

    // Salvar no banco de dados
    await salvarCertificado({
      codigo: codigoUnico,
      aluno: dadosExtraidos.aluno,
      curso: dadosExtraidos.curso,
      carga_horaria: dadosExtraidos.cargaHoraria,
      data_emissao: dadosExtraidos.dataEmissao,
      url_validacao: urlValidacao
    });

    // Inserir QR Code no PDF original
    const pdfComQR = await inserirQRCodeNoPDF(dataBuffer, qrCodeDataURL);
    
    // Salvar PDF com QR Code
    const nomeArquivoFinal = `certificado_${codigoUnico}.pdf`;
    const caminhoFinal = path.join(__dirname, 'certificados', nomeArquivoFinal);
    fs.writeFileSync(caminhoFinal, pdfComQR);

    // Remover arquivo temporário
    fs.unlinkSync(req.file.path);

    console.log('✅ Certificado processado com sucesso!');

    res.json({
      sucesso: true,
      mensagem: 'Certificado processado com sucesso!',
      dados: {
        codigo: codigoUnico,
        aluno: dadosExtraidos.aluno,
        curso: dadosExtraidos.curso,
        cargaHoraria: dadosExtraidos.cargaHoraria,
        dataEmissao: dadosExtraidos.dataEmissao,
        urlValidacao: urlValidacao,
        urlDownload: `${BASE_URL}/certificados/${nomeArquivoFinal}`
      }
    });

  } catch (erro) {
    console.error('❌ Erro ao processar certificado:', erro);
    res.status(500).json({ 
      erro: 'Erro ao processar certificado',
      detalhes: erro.message 
    });
  }
});

// ========================================
// ROTA 2: Validar Certificado
// ========================================
app.get('/api/validar/:codigo', (req, res) => {
  const codigo = req.params.codigo;

  db.get(
    'SELECT * FROM certificados WHERE codigo = ?',
    [codigo],
    (err, row) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao buscar certificado' });
      }

      if (!row) {
        return res.json({ 
          valido: false,
          mensagem: 'Certificado não encontrado' 
        });
      }

      res.json({
        valido: true,
        status: row.status,
        dados: {
          aluno: row.aluno,
          curso: row.curso,
          cargaHoraria: row.carga_horaria,
          dataEmissao: row.data_emissao,
          codigo: row.codigo
        }
      });
    }
  );
});

// ========================================
// ROTA 3: Health Check
// ========================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL
  });
});

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

// Extrair dados do certificado usando regex
function extrairDadosCertificado(texto) {
  const dados = {
    aluno: null,
    curso: null,
    cargaHoraria: null,
    dataEmissao: null
  };

  // Remover quebras de linha excessivas e normalizar espaços
  texto = texto.replace(/\s+/g, ' ').trim();

  // Padrões comuns de certificados
  // Nome do aluno - várias variações possíveis
  const padrõesNome = [
    /(?:certificamos que|certifica-se que|conferido a)\s+([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+(?:\s+[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+)+)/i,
    /nome[:\s]+([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+(?:\s+[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+)+)/i,
    /aluno[:\s]+([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+(?:\s+[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+)+)/i,
    /participou do\s+(?:curso\s+)?(?:de\s+)?[^\s]+\s+([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+(?:\s+[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+)+)/i
  ];

  for (const padrao of padrõesNome) {
    const match = texto.match(padrao);
    if (match) {
      dados.aluno = match[1].trim();
      break;
    }
  }

  // Nome do curso
  const padrõesCurso = [
    /curso[:\s]+(?:de\s+)?([^,\n\.]+?)(?:\s+com carga|,|\.|$)/i,
    /(?:no curso de|do curso)\s+([^,\n\.]+?)(?:\s+com carga|,|\.|$)/i,
    /participou do\s+(?:curso\s+)?(?:de\s+)?([^,\n\.]+?)(?:\s+com carga|,|\.|$)/i
  ];

  for (const padrao of padrõesCurso) {
    const match = texto.match(padrao);
    if (match) {
      dados.curso = match[1].trim();
      break;
    }
  }

  // Carga horária
  const matchCarga = texto.match(/(\d+)\s*(?:horas?|h)/i);
  if (matchCarga) {
    dados.cargaHoraria = `${matchCarga[1]}h`;
  }

  // Data de emissão
  const matchData = texto.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (matchData) {
    dados.dataEmissao = `${matchData[1]}/${matchData[2]}/${matchData[3]}`;
  } else {
    // Tentar formato por extenso
    const matchDataExtenso = texto.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i);
    if (matchDataExtenso) {
      dados.dataEmissao = `${matchDataExtenso[1]} de ${matchDataExtenso[2]} de ${matchDataExtenso[3]}`;
    }
  }

  return dados;
}

// Salvar certificado no banco
function salvarCertificado(dados) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO certificados (codigo, aluno, curso, carga_horaria, data_emissao, url_validacao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [dados.codigo, dados.aluno, dados.curso, dados.carga_horaria, dados.data_emissao, dados.url_validacao],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

// Inserir QR Code no PDF
async function inserirQRCodeNoPDF(pdfBuffer, qrCodeDataURL) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  
  // Converter DataURL para bytes
  const qrCodeBytes = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
  const qrCodeImage = await pdfDoc.embedPng(qrCodeBytes);
  
  const { width, height } = firstPage.getSize();
  
  // Posicionar QR Code no canto inferior direito
  const qrSize = 80;
  const margin = 20;
  
  firstPage.drawImage(qrCodeImage, {
    x: width - qrSize - margin,
    y: margin,
    width: qrSize,
    height: qrSize
  });
  
  // Adicionar texto abaixo do QR Code
  firstPage.drawText('Validar certificado', {
    x: width - qrSize - margin - 5,
    y: margin - 12,
    size: 8,
    color: rgb(0, 0, 0)
  });
  
  return await pdfDoc.save();
}

// ========================================
// INICIAR SERVIDOR
// ========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Servidor rodando em ${BASE_URL}`);
  console.log(`📋 Upload: ${BASE_URL}/upload.html`);
  console.log(`✅ Validação: ${BASE_URL}/validar.html`);
  console.log(`\n💾 Banco de dados: certificados.db\n`);
});
