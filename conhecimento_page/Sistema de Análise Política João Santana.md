# Sistema de Análise Política João Santana

Um sistema completo para marketeiros políticos coletarem informações detalhadas de candidatos/parlamentares e gerarem análises estratégicas baseadas na metodologia consagrada de João Santana.

## 🎯 Visão Geral

Este sistema democratiza o acesso a análises políticas sofisticadas, permitindo que campanhas de diferentes tamanhos se beneficiem de insights estratégicos baseados na metodologia de um dos maiores estrategistas de marketing político do mundo.

### Principais Funcionalidades

- **Formulário Completo**: Coleta estruturada de dados sobre candidato, cenário político, eleitorado, mensagem e estratégia de marketing
- **Análise por IA**: Geração automática de análises estratégicas no estilo João Santana
- **Interface Intuitiva**: Design responsivo e user-friendly para marketeiros políticos
- **API Robusta**: Backend Flask com endpoints RESTful para todas as operações
- **Banco de Dados Estruturado**: Schema otimizado para armazenamento e consulta de dados políticos

## 🏗️ Arquitetura

### Frontend
- **React 18** com Vite
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **Lucide React** para ícones

### Backend
- **Flask** com Python 3.11
- **SQLAlchemy** como ORM
- **Flask-CORS** para integração frontend/backend
- **SQLite** (desenvolvimento) / **PostgreSQL** (produção)

### IA e Análises
- Sistema de prompts estruturados baseados na metodologia João Santana
- Integração com APIs de IA (OpenAI, Anthropic, etc.)
- Análises especializadas: viabilidade, posicionamento, segmentação, comunicação

## 🚀 Instalação Rápida

### Pré-requisitos
- Node.js 18+
- Python 3.9+
- Git

### 1. Clone o Repositório
```bash
git clone <repository-url>
cd sistema-joao-santana
```

### 2. Configure o Backend
```bash
cd joao-santana-backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
# ou venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### 3. Configure o Frontend
```bash
cd ../joao-santana-political-form
npm install
npm run build
cp -r dist/* ../joao-santana-backend/src/static/
```

### 4. Execute o Sistema
```bash
cd ../joao-santana-backend
source venv/bin/activate
python src/main.py
```

Acesse: http://localhost:5000

## 📋 Estrutura do Projeto

```
sistema-joao-santana/
├── joao-santana-political-form/     # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   └── CandidateForm.jsx    # Componente principal do formulário
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── joao-santana-backend/            # Backend Flask
│   ├── src/
│   │   ├── models/
│   │   │   ├── candidate.py         # Modelo de dados do candidato
│   │   │   └── user.py
│   │   ├── routes/
│   │   │   ├── candidate.py         # Rotas da API
│   │   │   └── user.py
│   │   ├── static/                  # Arquivos do frontend buildado
│   │   └── main.py                  # Aplicação principal
│   ├── requirements.txt
│   └── venv/
├── joao_santana_ai_prompts.md       # Sistema de prompts para IA
├── supabase_schema.md               # Schema do banco de dados
├── DOCUMENTACAO_SISTEMA_JOAO_SANTANA.md  # Documentação completa
└── README.md
```

## 🎨 Interface do Sistema

O sistema possui uma interface dividida em 5 seções principais:

### 1. **Candidato**
- Dados pessoais e profissionais
- Histórico político
- Características pessoais
- Narrativa pessoal
- Imagem pública atual

### 2. **Cenário Político**
- Tipo de eleição e cargo
- Contexto geográfico
- Análise de concorrentes
- Partidos e alianças
- Conjuntura política
- Legislação eleitoral

### 3. **Eleitorado**
- Dados demográficos
- Características psicográficas
- Comportamento eleitoral
- Segmentos-chave
- Canais de comunicação

### 4. **Mensagem**
- Eixos temáticos
- Slogan e conceito
- Diferenciais do candidato
- Propostas principais
- Tom da comunicação

### 5. **Marketing**
- Equipe de marketing
- Canais de mídia
- Estratégias digitais
- Mobilização
- Plano de crise

## 🤖 Sistema de IA

O sistema utiliza prompts especializados que capturam a essência da metodologia João Santana:

### Tipos de Análise
- **Viabilidade Eleitoral**: Avaliação das chances de sucesso
- **Estratégia de Posicionamento**: Definição da identidade da campanha
- **Segmentação Eleitoral**: Estratégias por grupo de eleitores
- **Estratégia de Comunicação**: Planos para todos os canais
- **Análise de Riscos**: Identificação de ameaças e oportunidades
- **Recomendações Táticas**: Ações específicas e cronogramas

### Características das Análises
- Baseadas na metodologia consagrada de João Santana
- Linguagem profissional e direta
- Recomendações práticas e acionáveis
- Consideração de recursos e limitações
- Foco na viabilidade eleitoral

## 📊 API Endpoints

### Candidatos
- `GET /api/candidates` - Lista todos os candidatos
- `POST /api/candidates` - Cria novo candidato
- `GET /api/candidates/{id}` - Busca candidato específico
- `PUT /api/candidates/{id}` - Atualiza candidato
- `DELETE /api/candidates/{id}` - Remove candidato
- `POST /api/candidates/{id}/analyze` - Gera análise IA

### Exemplo de Uso da API
```javascript
// Criar novo candidato
const response = await fetch("/api/candidates", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    full_name: "João Silva",
    age: 45,
    election_type: "municipal",
    // ... outros campos
  })
});

// Gerar análise
const analysis = await fetch(`/api/candidates/${id}/analyze`, {
  method: "POST"
});
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```bash
# Backend
FLASK_ENV=development
DATABASE_URL=sqlite:///app.db
OPENAI_API_KEY=your_openai_key
SECRET_KEY=your_secret_key

# Frontend
VITE_API_URL=http://localhost:5000
```

### Banco de Dados
O sistema suporta SQLite (desenvolvimento) e PostgreSQL (produção). Para PostgreSQL:

```bash
pip install psycopg2-binary
export DATABASE_URL=postgresql://user:password@localhost/dbname
```

### Integração com IA
Configure sua chave de API da OpenAI:
```bash
export OPENAI_API_KEY=sk-your-key-here
```

## 🚀 Deploy em Produção

### Usando Docker
```dockerfile
# Dockerfile exemplo
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "src.main:app"]
```

### Deploy no Heroku
```bash
# Procfile
web: gunicorn --bind 0.0.0.0:$PORT src.main:app
```

### Deploy com Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📈 Monitoramento e Métricas

O sistema inclui:
- Logs estruturados para todas as operações
- Métricas de performance da API
- Monitoramento de uso de IA
- Alertas para erros críticos

## 🔒 Segurança

- Validação rigorosa de entrada
- Sanitização de dados
- Rate limiting nas APIs
- HTTPS obrigatório em produção
- Criptografia de dados sensíveis

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:
- Email: suporte@sistema-joao-santana.com
- Documentação: [Link para documentação completa]
- Issues: [GitHub Issues]

## 🙏 Agradecimentos

- João Santana pela metodologia que inspirou este sistema
- Comunidade de desenvolvedores que contribuíram com bibliotecas utilizadas
- Profissionais de marketing político que forneceram feedback

---

**Desenvolvido com ❤️ para democratizar o acesso a análises políticas de qualidade**


