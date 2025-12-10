# 🚀 Guia de Deploy - Sistema de Certificados

Este guia mostra como fazer o deploy permanente do sistema em diferentes plataformas gratuitas.

---

## 📦 Repositório GitHub

**URL:** https://github.com/cultodemoniocelestial-tech/sistema-certificados-qrcode

O código já está versionado e pronto para deploy!

---

## 🎯 Opções de Deploy Gratuito

### **Opção 1: Render.com (RECOMENDADO)**

✅ **Vantagens:**
- 100% gratuito
- Deploy automático do GitHub
- Suporte a disco persistente
- SSL/HTTPS automático
- Fácil configuração

**Passos:**

1. **Criar conta no Render**
   - Acesse: https://render.com
   - Faça login com GitHub

2. **Criar novo Web Service**
   - Clique em "New +" → "Web Service"
   - Conecte o repositório: `sistema-certificados-qrcode`
   - Clique em "Connect"

3. **Configurar o serviço**
   - **Name:** sistema-certificados-qrcode
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

4. **Adicionar disco persistente (importante!)**
   - Na seção "Disks", clique em "Add Disk"
   - **Name:** certificados-disk
   - **Mount Path:** `/opt/render/project/src/certificados`
   - **Size:** 1 GB

5. **Deploy**
   - Clique em "Create Web Service"
   - Aguarde o deploy (3-5 minutos)
   - Sua URL será: `https://sistema-certificados-qrcode.onrender.com`

6. **Configurar variável de ambiente**
   - Vá em "Environment"
   - Adicione: `BASE_URL` = `https://sistema-certificados-qrcode.onrender.com`
   - Salve

**Pronto! Seu sistema está no ar! 🎉**

---

### **Opção 2: Railway.app**

✅ **Vantagens:**
- Deploy super rápido
- Interface moderna
- Suporte a volumes

**Passos:**

1. **Criar conta no Railway**
   - Acesse: https://railway.app
   - Faça login com GitHub

2. **Criar novo projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha: `sistema-certificados-qrcode`

3. **Configurar variáveis**
   - Clique em "Variables"
   - Adicione: `PORT` = `3000`
   - Adicione: `BASE_URL` = (será gerado automaticamente)

4. **Deploy automático**
   - Railway faz deploy automaticamente
   - Sua URL será gerada

**Pronto! Sistema no ar! 🚀**

---

### **Opção 3: Heroku**

⚠️ **Nota:** Heroku não tem mais plano gratuito, mas é uma opção se você tiver créditos.

**Passos:**

1. **Instalar Heroku CLI**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Criar app**
   ```bash
   cd /home/ubuntu/sistema-certificados
   heroku create sistema-certificados-qrcode
   ```

4. **Deploy**
   ```bash
   git push heroku master
   ```

5. **Configurar variável**
   ```bash
   heroku config:set BASE_URL=https://sistema-certificados-qrcode.herokuapp.com
   ```

---

### **Opção 4: Vercel (Limitado)**

⚠️ **Limitações:** Vercel é serverless, não suporta upload de arquivos persistentes. Use apenas para testes.

**Passos:**

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd /home/ubuntu/sistema-certificados
   vercel --prod
   ```

3. **Seguir instruções**
   - Confirme o projeto
   - Deploy será feito automaticamente

⚠️ **Importante:** Os certificados processados não serão salvos permanentemente no Vercel.

---

## 🔧 Configuração Pós-Deploy

### 1. Atualizar BASE_URL

Após o deploy, você precisa configurar a variável `BASE_URL` com a URL real do seu site.

**Exemplo:**
```
BASE_URL=https://sistema-certificados-qrcode.onrender.com
```

Isso garante que os QR Codes gerados apontem para o site correto.

### 2. Testar o Sistema

1. Acesse a URL do seu site
2. Faça upload do `certificado-exemplo.pdf`
3. Baixe o certificado com QR Code
4. Escaneie o QR Code e verifique se funciona

### 3. Monitorar Logs

**Render:**
- Vá em "Logs" no painel do serviço

**Railway:**
- Clique em "View Logs"

**Heroku:**
```bash
heroku logs --tail
```

---

## 📊 Limites dos Planos Gratuitos

| Plataforma | Memória | CPU | Disco | Sleep |
|------------|---------|-----|-------|-------|
| Render     | 512 MB  | Compartilhado | 1 GB | Após 15 min inativo |
| Railway    | 512 MB  | Compartilhado | 1 GB | Após 5 min inativo |
| Heroku     | 512 MB  | Compartilhado | - | Após 30 min inativo |
| Vercel     | 1 GB    | Serverless | Temporário | - |

**Nota sobre Sleep:**
- Quando o serviço "dorme", a primeira requisição pode demorar 30-60 segundos
- Após acordar, funciona normalmente
- Para evitar sleep, você pode usar serviços de "ping" como UptimeRobot

---

## 🔄 Deploy Automático

Todas as plataformas suportam deploy automático:

1. Você faz alterações no código
2. Faz commit no GitHub
3. A plataforma detecta e faz deploy automaticamente

**Configurar:**
- Render: Já configurado por padrão
- Railway: Já configurado por padrão
- Heroku: Use GitHub integration no painel

---

## 🛡️ Segurança

### Variáveis de Ambiente Recomendadas

```env
NODE_ENV=production
PORT=3000
BASE_URL=https://seu-dominio.com
```

### Backup do Banco de Dados

O banco SQLite fica no disco. Para fazer backup:

**Render:**
1. Acesse o shell do serviço
2. Execute: `cp certificados.db backup.db`
3. Baixe via SFTP ou API

**Melhor opção:** Migrar para PostgreSQL em produção (todas as plataformas oferecem PostgreSQL gratuito)

---

## 🌐 Domínio Customizado

Todas as plataformas permitem domínio customizado:

**Render:**
1. Vá em "Settings" → "Custom Domain"
2. Adicione seu domínio
3. Configure DNS conforme instruções

**Railway:**
1. Clique em "Settings" → "Domains"
2. Adicione domínio customizado

**Heroku:**
```bash
heroku domains:add seudominio.com
```

---

## 📈 Melhorias para Produção

### 1. Migrar para PostgreSQL

```bash
npm install pg
```

Altere `database.js` para usar PostgreSQL.

### 2. Adicionar Autenticação

Proteja a rota de upload com autenticação.

### 3. Limitar Upload

Configure limite de tamanho de arquivo no multer.

### 4. Rate Limiting

Adicione rate limiting para evitar abuso:

```bash
npm install express-rate-limit
```

### 5. Monitoramento

Use serviços como:
- UptimeRobot (monitorar uptime)
- LogRocket (monitorar erros)
- Google Analytics (monitorar acessos)

---

## 🆘 Solução de Problemas

### Erro: "Application Error"

**Causa:** Servidor não iniciou corretamente.

**Solução:**
1. Verifique os logs
2. Confirme que `PORT` está configurado
3. Verifique se todas as dependências foram instaladas

### Erro: "Cannot find module"

**Causa:** Dependências não instaladas.

**Solução:**
```bash
npm install
```

### Certificados não são salvos

**Causa:** Disco não persistente.

**Solução:**
1. Configure disco persistente (Render)
2. Ou use serviço de storage externo (AWS S3, Cloudinary)

### QR Code aponta para localhost

**Causa:** `BASE_URL` não configurado.

**Solução:**
Configure a variável `BASE_URL` com a URL real do site.

---

## 📞 Suporte

- **Render:** https://render.com/docs
- **Railway:** https://docs.railway.app
- **Heroku:** https://devcenter.heroku.com

---

## ✅ Checklist de Deploy

- [ ] Código commitado no GitHub
- [ ] Plataforma escolhida (Render recomendado)
- [ ] Serviço criado e conectado ao GitHub
- [ ] Disco persistente configurado (se Render)
- [ ] Variável `BASE_URL` configurada
- [ ] Deploy realizado com sucesso
- [ ] Sistema testado (upload + validação)
- [ ] QR Code testado
- [ ] Logs verificados

---

**Seu sistema está pronto para o mundo! 🌍🚀**
