# 🎓 Sistema de Certificados com QR Code

Sistema completo para gerenciar certificados digitais com validação por QR Code. Extrai automaticamente informações de certificados PDF, gera código único, insere QR Code no documento e fornece página web para validação.

---

## 🚀 Funcionalidades

✅ **Extração Automática de Dados**
- Lê certificados em PDF e extrai automaticamente:
  - Nome do aluno
  - Nome do curso
  - Carga horária
  - Data de emissão

✅ **Geração de Código Único**
- Utiliza UUID v4 para garantir unicidade
- Cada certificado recebe um código exclusivo

✅ **QR Code Automático**
- Gera QR Code com link de validação
- Insere o QR Code diretamente no PDF original
- Posicionado no canto inferior direito do certificado

✅ **Validação em Tempo Real**
- Página web para verificar autenticidade
- Escaneia o QR Code → redirecionamento automático
- Mostra todos os dados do certificado

✅ **Banco de Dados SQLite**
- Armazenamento seguro de todos os certificados
- Histórico completo de emissões
- Status de cada certificado (ativo/revogado)

---

## 📋 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite3** - Banco de dados
- **QRCode** - Geração de QR Codes
- **UUID** - Geração de códigos únicos
- **pdf-parse** - Extração de texto de PDFs
- **pdf-lib** - Manipulação de PDFs
- **Multer** - Upload de arquivos

---

## 🔧 Instalação

### 1. Instalar dependências

```bash
cd /home/ubuntu/sistema-certificados
npm install
```

### 2. Iniciar o servidor

```bash
node server.js
```

O servidor será iniciado em `http://localhost:3000`

---

## 📖 Como Usar

### **1️⃣ Fazer Upload de Certificado**

1. Acesse: `http://localhost:3000/upload.html`
2. Clique ou arraste um certificado PDF
3. Clique em "Processar Certificado"
4. O sistema irá:
   - Extrair os dados automaticamente
   - Gerar código único
   - Criar QR Code
   - Inserir QR Code no PDF
5. Baixe o certificado com QR Code
6. Envie ao aluno

### **2️⃣ Validar Certificado**

**Opção A: Escanear QR Code**
- O aluno escaneia o QR Code com o celular
- É redirecionado automaticamente para a página de validação
- Os dados aparecem instantaneamente

**Opção B: Digitar Código Manualmente**
1. Acesse: `http://localhost:3000/validar.html`
2. Digite o código do certificado
3. Clique em "Verificar"
4. Veja os dados e status do certificado

---

## 📁 Estrutura do Projeto

```
sistema-certificados/
├── server.js              # Servidor Express + API
├── database.js            # Configuração do banco SQLite
├── package.json           # Dependências do projeto
├── certificados.db        # Banco de dados (criado automaticamente)
├── public/                # Páginas web
│   ├── index.html         # Página inicial
│   ├── upload.html        # Upload de certificados
│   └── validar.html       # Validação de certificados
├── uploads/               # Arquivos temporários (criado automaticamente)
└── certificados/          # Certificados processados (criado automaticamente)
```

---

## 🔌 API Endpoints

### **POST /api/processar-certificado**

Processa um certificado PDF e adiciona QR Code.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `certificado` (arquivo PDF)

**Response:**
```json
{
  "sucesso": true,
  "mensagem": "Certificado processado com sucesso!",
  "dados": {
    "codigo": "ce4d2f3a-8b22-4cb1-9c0d-bfe31d8f47d1",
    "aluno": "João Silva",
    "curso": "Excel Avançado",
    "cargaHoraria": "40h",
    "dataEmissao": "10/01/2024",
    "urlValidacao": "http://localhost:3000/validar?id=ce4d2f3a-8b22-4cb1-9c0d-bfe31d8f47d1",
    "urlDownload": "http://localhost:3000/certificados/certificado_ce4d2f3a-8b22-4cb1-9c0d-bfe31d8f47d1.pdf"
  }
}
```

### **GET /api/validar/:codigo**

Valida um certificado pelo código.

**Request:**
- Method: `GET`
- URL: `/api/validar/ce4d2f3a-8b22-4cb1-9c0d-bfe31d8f47d1`

**Response (Válido):**
```json
{
  "valido": true,
  "status": "ativo",
  "dados": {
    "aluno": "João Silva",
    "curso": "Excel Avançado",
    "cargaHoraria": "40h",
    "dataEmissao": "10/01/2024",
    "codigo": "ce4d2f3a-8b22-4cb1-9c0d-bfe31d8f47d1"
  }
}
```

**Response (Inválido):**
```json
{
  "valido": false,
  "mensagem": "Certificado não encontrado"
}
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `certificados`

| Campo          | Tipo         | Descrição                          |
|----------------|--------------|-------------------------------------|
| id             | INTEGER      | ID auto-incremento (chave primária) |
| codigo         | VARCHAR(255) | Código único (UUID)                 |
| aluno          | VARCHAR(255) | Nome do aluno                       |
| curso          | VARCHAR(255) | Nome do curso                       |
| carga_horaria  | VARCHAR(100) | Carga horária do curso              |
| data_emissao   | VARCHAR(100) | Data de emissão                     |
| url_validacao  | VARCHAR(255) | URL de validação                    |
| status         | VARCHAR(50)  | Status (ativo/revogado)             |
| criado_em      | DATETIME     | Data de criação no sistema          |

---

## 🎨 Personalização

### Alterar Posição do QR Code

Edite a função `inserirQRCodeNoPDF()` no arquivo `server.js`:

```javascript
// Posição atual: canto inferior direito
const qrSize = 80;
const margin = 20;

firstPage.drawImage(qrCodeImage, {
  x: width - qrSize - margin,  // Direita
  y: margin,                   // Inferior
  width: qrSize,
  height: qrSize
});
```

### Alterar Tamanho do QR Code

```javascript
const qrSize = 100; // Aumentar para 100px
```

### Adicionar Mais Padrões de Extração

Edite a função `extrairDadosCertificado()` no arquivo `server.js` e adicione novos padrões regex.

---

## 🔒 Segurança

- ✅ Códigos únicos gerados com UUID v4
- ✅ Validação server-side
- ✅ Banco de dados local (SQLite)
- ✅ Upload apenas de arquivos PDF
- ✅ Sanitização de dados

---

## 📝 Fluxo Completo

```
1. Administrador faz upload do certificado PDF
   ↓
2. Sistema extrai dados automaticamente
   ↓
3. Gera código único (UUID)
   ↓
4. Cria QR Code com link de validação
   ↓
5. Insere QR Code no PDF original
   ↓
6. Salva dados no banco
   ↓
7. Administrador baixa certificado com QR
   ↓
8. Envia certificado ao aluno
   ↓
9. Aluno escaneia QR Code
   ↓
10. Sistema valida e mostra dados
```

---

## 🐛 Solução de Problemas

### Erro: "Não foi possível extrair os dados"

**Causa:** O formato do certificado não corresponde aos padrões de extração.

**Solução:** 
1. Verifique o conteúdo do PDF
2. Adicione novos padrões regex na função `extrairDadosCertificado()`
3. O sistema retorna os primeiros 500 caracteres para debug

### Porta 3000 já está em uso

**Solução:**
```bash
# Encontrar processo usando a porta
lsof -i :3000

# Matar o processo
kill -9 [PID]

# Ou alterar a porta no server.js
const PORT = 3001;
```

### Banco de dados corrompido

**Solução:**
```bash
# Deletar banco e reiniciar
rm certificados.db
node server.js
```

---

## 📦 Deploy em Produção

### Opção 1: VPS (DigitalOcean, AWS, etc.)

```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar projeto
git clone [seu-repositorio]
cd sistema-certificados

# Instalar dependências
npm install

# Usar PM2 para manter rodando
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

### Opção 2: Heroku

```bash
# Criar Procfile
echo "web: node server.js" > Procfile

# Deploy
heroku create
git push heroku main
```

### Opção 3: Vercel (requer adaptação para serverless)

---

## 🔄 Próximas Melhorias

- [ ] Painel administrativo
- [ ] Autenticação de usuários
- [ ] Exportar relatórios
- [ ] Envio automático por e-mail
- [ ] Suporte a múltiplos templates
- [ ] Revogar certificados
- [ ] Histórico de validações
- [ ] API REST completa

---

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente.

---

## 👨‍💻 Suporte

Para dúvidas ou problemas:
1. Verifique a seção "Solução de Problemas"
2. Revise os logs do servidor
3. Teste os endpoints da API manualmente

---

## 🎉 Pronto para Usar!

O sistema está **100% funcional** e pronto para processar certificados!

**Acesse:** http://localhost:3000

**Bom uso! 🚀**
