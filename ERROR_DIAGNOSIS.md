# Diagnóstico do Erro no Vercel

## 🔴 Erro Identificado

**Mensagem:** `Error [ERR_REQUIRE_ESM]: require() of ES Module`

## 🔍 Causa Raiz

O Vercel está configurado para usar **ES Modules** (import/export), mas o código das funções serverless está usando **CommonJS** (require/module.exports).

**Arquivos afetados:**
- `/api/processar.js` - Usa `require()`
- `/api/validar.js` - Usa `require()`
- `/api/certificados.js` - Usa `require()`

## ✅ Solução

Converter todos os arquivos de funções serverless de CommonJS para ES Modules:

**Antes (CommonJS):**
```javascript
const { Pool } = require('pg');
module.exports = async (req, res) => { ... }
```

**Depois (ES Modules):**
```javascript
import { Pool } from 'pg';
export default async (req, res) => { ... }
```

## 📝 Alterações Necessárias

1. ✅ Converter `api/processar.js` para ES Modules
2. ✅ Converter `api/validar.js` para ES Modules  
3. ✅ Converter `api/certificados.js` para ES Modules
4. ✅ Adicionar `"type": "module"` no `package.json`
5. ✅ Commit e push para GitHub
