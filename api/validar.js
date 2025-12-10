import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { codigo } = req.query;

    if (!codigo) {
      return res.status(400).json({ 
        error: 'Código do certificado não fornecido' 
      });
    }

    // Buscar certificado no banco de dados
    const result = await sql`
      SELECT * FROM certificados 
      WHERE codigo = ${codigo}
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({
        valido: false,
        mensagem: 'Certificado não encontrado'
      });
    }

    const certificado = result.rows[0];

    if (certificado.status !== 'ativo') {
      return res.status(200).json({
        valido: false,
        mensagem: 'Certificado inválido ou revogado',
        dados: {
          codigo: certificado.codigo,
          status: certificado.status
        }
      });
    }

    // Certificado válido
    return res.status(200).json({
      valido: true,
      mensagem: 'Certificado válido',
      dados: {
        codigo: certificado.codigo,
        aluno: certificado.aluno,
        curso: certificado.curso,
        cargaHoraria: certificado.carga_horaria,
        dataEmissao: certificado.data_emissao,
        urlPDF: certificado.url_pdf,
        status: certificado.status
      }
    });

  } catch (error) {
    console.error('Erro ao validar certificado:', error);
    return res.status(500).json({ 
      error: 'Erro ao validar certificado',
      detalhes: error.message 
    });
  }
}
