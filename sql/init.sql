-- Criar tabela de certificados
CREATE TABLE IF NOT EXISTS certificados (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(255) UNIQUE NOT NULL,
  aluno VARCHAR(255) NOT NULL,
  curso VARCHAR(255) NOT NULL,
  carga_horaria VARCHAR(50),
  data_emissao VARCHAR(50),
  url_validacao VARCHAR(500) NOT NULL,
  url_pdf VARCHAR(500),
  status VARCHAR(50) DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índice no código para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_certificados_codigo ON certificados(codigo);

-- Criar índice no status
CREATE INDEX IF NOT EXISTS idx_certificados_status ON certificados(status);

-- Inserir certificado de exemplo (opcional)
INSERT INTO certificados (codigo, aluno, curso, carga_horaria, data_emissao, url_validacao, status)
VALUES (
  'exemplo-123-456-789',
  'João Silva',
  'Excel Avançado',
  '40',
  '10/12/2024',
  'https://sistema-certificados-qrcode.vercel.app/validar.html?codigo=exemplo-123-456-789',
  'ativo'
) ON CONFLICT (codigo) DO NOTHING;
