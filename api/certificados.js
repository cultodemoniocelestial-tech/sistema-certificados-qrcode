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
    // Buscar todos os certificados
    const result = await sql`
      SELECT codigo, aluno, curso, carga_horaria, data_emissao, status, url_pdf
      FROM certificados
      ORDER BY id DESC
      LIMIT 100
    `;

    return res.status(200).json({
      success: true,
      total: result.rows.length,
      certificados: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar certificados:', error);
    return res.status(500).json({ 
      error: 'Erro ao listar certificados',
      detalhes: error.message 
    });
  }
}
