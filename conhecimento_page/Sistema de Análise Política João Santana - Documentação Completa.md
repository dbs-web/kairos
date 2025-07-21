# Sistema de Análise Política João Santana - Documentação Completa

## 1. Introdução

Este documento detalha o Sistema de Análise Política João Santana, uma ferramenta desenvolvida para auxiliar marketeiros políticos na coleta de informações detalhadas sobre candidatos e na geração de análises estratégicas, inspiradas na metodologia de João Santana. O sistema visa fornecer insights profundos para a tomada de decisões em campanhas eleitorais.

## 2. Visão Geral do Sistema

O sistema é composto por um frontend intuitivo (aplicação web) para coleta de dados e um backend robusto (API Flask) para processamento e armazenamento das informações em um banco de dados Supabase. Além disso, prompts de Inteligência Artificial são utilizados para gerar análises estratégicas baseadas nos dados coletados.

## 3. Arquitetura do Sistema

### 3.1. Frontend (React)

O frontend é uma aplicação React que oferece uma interface amigável para o usuário inserir as informações do candidato. Ele é dividido em seções para organizar a coleta de dados de forma lógica e abrangente.

### 3.2. Backend (Flask)

O backend é uma API RESTful desenvolvida em Flask, responsável por:
- Receber os dados do frontend.
- Validar e processar as informações.
- Interagir com o banco de dados Supabase (CRUD).
- Preparar os dados para as análises da IA.

### 3.3. Banco de Dados (Supabase)

O Supabase é utilizado como o banco de dados principal, oferecendo um ambiente escalável e seguro para armazenar todas as informações do candidato, cenário político, eleitorado, etc. O schema do banco de dados foi cuidadosamente projetado para refletir a complexidade da metodologia de João Santana.

### 3.4. Módulo de IA

O módulo de IA utiliza prompts estruturados para gerar análises estratégicas. Esses prompts são alimentados com os dados coletados e processados, permitindo que a IA simule o raciocínio e as abordagens de João Santana na avaliação de viabilidade, posicionamento, segmentação, comunicação, riscos e táticas.

## 4. Instalação e Configuração

### 4.1. Pré-requisitos

- Node.js (versão 18 ou superior)
- Python (versão 3.9 ou superior)
- pnpm (gerenciador de pacotes Node.js)
- pip (gerenciador de pacotes Python)
- Uma conta Supabase configurada

### 4.2. Configuração do Backend

1. **Clone o repositório do backend:**
   ```bash
   git clone <URL_DO_REPOSITORIO_BACKEND>
   cd joao-santana-backend
   ```

2. **Crie e ative o ambiente virtual:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do diretório `joao-santana-backend` com as seguintes variáveis:
   ```
   DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database_name>"
   # Exemplo para Supabase:
   # DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
   ```
   Substitua `<user>`, `<password>`, `<host>`, `<port>` e `<database_name>` pelas suas credenciais do Supabase.

5. **Execute as migrações do banco de dados (se necessário):**
   ```bash
   flask db upgrade
   ```
   (Assumindo que você configurou o Flask-Migrate. Caso contrário, você precisará criar as tabelas manualmente no Supabase ou usar um script de inicialização.)

6. **Inicie o servidor Flask:**
   ```bash
   python src/main.py
   ```
   O backend estará rodando em `http://localhost:5000`.

### 4.3. Configuração do Frontend

1. **Clone o repositório do frontend:**
   ```bash
   git clone <URL_DO_REPOSITORIO_FRONTEND>
   cd joao-santana-political-form
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Inicie o servidor de desenvolvimento React:**
   ```bash
   pnpm run dev --host
   ```
   O frontend estará acessível em `http://localhost:5173`.

## 5. Uso do Sistema

### 5.1. Acessando o Formulário

Abra seu navegador e acesse `http://localhost:5173`. Você verá a interface do formulário de coleta de dados.

### 5.2. Preenchendo o Formulário

O formulário é dividido em várias seções (abas) para organizar as informações do candidato. Preencha cada campo com o máximo de detalhes possível. Quanto mais informações forem fornecidas, mais rica e precisa será a análise gerada pela IA.

**Seções do Formulário:**
- **Candidato**: Dados pessoais, histórico profissional e político, características pessoais.
- **Cenário Político**: Informações sobre o contexto eleitoral, tipo de eleição, características geográficas e socioeconômicas.
- **Eleitorado**: Dados demográficos e psicográficos do eleitorado, comportamento eleitoral e segmentos-chave.
- **Mensagem**: Eixos temáticos, slogan, conceito central, diferenciais e propostas.
- **Marketing**: Estratégias de comunicação, canais de mídia, estratégias digitais, mobilização e plano de crise.
- **Redes Sociais**: Links e análises de perfis em diversas plataformas.
- **Mandatos**: Detalhes sobre cargos políticos anteriores, projetos e leis.
- **Emendas**: Informações sobre emendas parlamentares (se aplicável).
- **Posicionamentos**: Posições do candidato sobre temas específicos.
- **Histórico Eleitoral**: Resultados de eleições anteriores disputadas.
- **Apoio Municipal**: Mapeamento de forças e apoios locais.
- **Concorrentes Externos**: Análise de adversários na disputa eleitoral.
- **Concorrentes Internos**: Análise de disputas dentro da chapa ou federação.
- **Monitoramento de Mídia**: Dados sobre reportagens, influenciadores e jornalistas.
- **Vulnerabilidades**: Dossiê de polêmicas, escândalos e acusações passadas.

### 5.3. Gerando a Análise da IA

Após preencher todas as informações relevantes, clique no botão "Gerar Análise João Santana". O sistema enviará os dados para o backend, que os processará e os utilizará para alimentar os prompts da IA. A análise gerada será exibida na tela ou disponibilizada para download, dependendo da implementação final.

## 6. Estrutura do Banco de Dados (Supabase)

O banco de dados Supabase é estruturado para armazenar de forma organizada todas as informações coletadas. As principais tabelas incluem:

- `candidates`: Informações gerais do candidato.
- `social_media_profiles`: Detalhes dos perfis em redes sociais.
- `political_mandates`: Histórico de mandatos políticos.
- `parliamentary_amendments`: Informações sobre emendas parlamentares.
- `thematic_positions`: Posicionamentos do candidato por tema.
- `election_history`: Histórico de eleições disputadas.
- `research_cross_sections`: Cruzamentos de pesquisas de opinião.
- `municipal_support`: Mapeamento de apoios municipais.
- `external_competitors`: Dados sobre concorrentes externos.
- `internal_competitors`: Dados sobre concorrentes internos.
- `media_monitoring`: Monitoramento de mídia.
- `vulnerability_dossiers`: Dossiê de vulnerabilidades.
- `political_scenarios`: Contexto político e eleitoral.
- `electorate_analysis`: Análise detalhada do eleitorado.
- `campaign_messaging`: Estratégia de mensagem da campanha.
- `marketing_strategy`: Estratégia de comunicação e marketing.
- `research_data`: Dados quantitativos de pesquisas.
- `ai_analyses`: Análises geradas pela IA.
- `content_generation`: Conteúdos gerados pela IA.

Para o schema completo e detalhado, consulte o arquivo `supabase_schema.md`.

## 7. Prompts de Inteligência Artificial

Os prompts da IA são a base para a geração das análises estratégicas. Eles foram cuidadosamente elaborados para simular o raciocínio de João Santana, abordando aspectos como:

- **Viabilidade Eleitoral**: Diagnóstico inicial, análise competitiva, potencial eleitoral e fatores críticos de sucesso.
- **Estratégia de Posicionamento**: Posicionamento central, narrativa da campanha, eixos temáticos e estratégia de diferenciação.
- **Segmentação Eleitoral**: Mapeamento do eleitorado, priorização estratégica e estratégias por segmento.
- **Estratégia de Comunicação**: Arquitetura da comunicação, estratégia de mídia, comunicação digital, eventos e mobilização, gestão de crise.
- **Análise de Riscos e Oportunidades**: Mapeamento de oportunidades, riscos internos e externos, cenários eleitorais e estratégias de mitigação.
- **Recomendações Táticas**: Cronograma de ações para os próximos 90 dias, com foco em estruturação, consolidação e aceleração da campanha.

Para o conteúdo completo dos prompts, consulte o arquivo `joao_santana_ai_prompts.md`.

## 8. Manutenção e Atualização

O sistema foi projetado para ser modular e extensível, permitindo futuras atualizações e a adição de novas funcionalidades. Recomenda-se:

- Manter as dependências do frontend e backend atualizadas.
- Realizar backups regulares do banco de dados Supabase.
- Monitorar o desempenho do sistema e os logs para identificar possíveis problemas.
- Refinar os prompts da IA com base no feedback das análises geradas e novas tendências do marketing político.

## 9. Considerações Finais

Este sistema é uma ferramenta poderosa para auxiliar marketeiros políticos, mas não substitui a expertise humana, a intuição e a capacidade de adaptação a cenários imprevistos. Ele deve ser utilizado como um complemento estratégico para otimizar a tomada de decisões e a execução de campanhas eleitorais.

Esperamos que esta ferramenta contribua para campanhas mais eficazes e informadas, promovendo um processo democrático mais robusto.


