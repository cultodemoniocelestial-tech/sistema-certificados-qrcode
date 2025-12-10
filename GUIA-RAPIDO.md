# 🚀 Guia Rápido - Sistema de Certificados

## ⚡ Como Usar em 3 Passos

### **1️⃣ Processar Certificado**

1. Acesse a página de upload
2. Arraste ou clique para selecionar um PDF
3. Clique em "Processar Certificado"
4. Baixe o certificado com QR Code
5. Envie ao aluno

### **2️⃣ Aluno Valida o Certificado**

**Opção A: QR Code (Recomendado)**
- Abra a câmera do celular
- Aponte para o QR Code
- Toque no link que aparecer
- Veja os dados automaticamente

**Opção B: Código Manual**
- Acesse a página de validação
- Digite o código do certificado
- Clique em "Verificar"

### **3️⃣ Pronto!**

O sistema mostra:
- ✅ Status: Válido ou Inválido
- 👤 Nome do aluno
- 📚 Curso realizado
- ⏱️ Carga horária
- 📅 Data de emissão

---

## 📱 Teste Agora!

### Usar Certificado de Exemplo

Um certificado de exemplo já foi criado para você testar:

**Arquivo:** `certificado-exemplo.pdf`

**Dados do certificado:**
- **Aluno:** Maria Silva Santos
- **Curso:** Desenvolvimento Web Full Stack
- **Carga horária:** 120 horas
- **Data:** 15/12/2024

### Como Testar

1. Acesse a página de upload
2. Faça upload do arquivo `certificado-exemplo.pdf`
3. Baixe o certificado processado
4. Teste a validação usando o QR Code ou código

---

## 🌐 URLs do Sistema

- **Página Inicial:** http://localhost:3000
- **Upload:** http://localhost:3000/upload.html
- **Validação:** http://localhost:3000/validar.html

---

## 🔧 Comandos Úteis

### Iniciar o Servidor
```bash
cd /home/ubuntu/sistema-certificados
node server.js
```

### Ver Certificados Processados
```bash
ls -lh /home/ubuntu/sistema-certificados/certificados/
```

### Ver Banco de Dados
```bash
sqlite3 /home/ubuntu/sistema-certificados/certificados.db "SELECT * FROM certificados;"
```

### Parar o Servidor
```bash
# Pressione Ctrl+C no terminal onde o servidor está rodando
```

---

## 💡 Dicas

1. **Formato do PDF:** O sistema funciona melhor com certificados que têm texto selecionável (não imagens escaneadas)

2. **Padrões de Extração:** O sistema reconhece automaticamente:
   - "Certificamos que [NOME]"
   - "Nome: [NOME]"
   - "Aluno: [NOME]"
   - "Curso de [CURSO]"
   - "No curso [CURSO]"
   - "[X] horas"
   - Datas no formato DD/MM/AAAA

3. **Personalização:** Se seus certificados têm formato diferente, edite a função `extrairDadosCertificado()` no arquivo `server.js`

4. **QR Code:** Por padrão, o QR Code é inserido no canto inferior direito. Você pode alterar a posição editando a função `inserirQRCodeNoPDF()`

---

## ❓ Perguntas Frequentes

**P: O sistema funciona offline?**
R: Sim! O servidor roda localmente. Apenas a validação por QR Code precisa de internet.

**P: Posso processar vários certificados de uma vez?**
R: Atualmente, um por vez. Para processar em lote, você pode usar a API diretamente.

**P: Como revogar um certificado?**
R: Acesse o banco de dados e altere o status para "revogado":
```bash
sqlite3 certificados.db "UPDATE certificados SET status='revogado' WHERE codigo='[CODIGO]';"
```

**P: O QR Code expira?**
R: Não! O código é permanente enquanto estiver no banco de dados.

**P: Posso usar em produção?**
R: Sim! Veja a seção "Deploy em Produção" no README.md

---

## 🎯 Próximos Passos

1. ✅ Teste com o certificado de exemplo
2. ✅ Faça upload dos seus próprios certificados
3. ✅ Personalize os padrões de extração se necessário
4. ✅ Configure para produção (opcional)

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor no terminal
2. Consulte o README.md completo
3. Teste a API diretamente usando curl ou Postman

---

**Bom uso! 🎉**
