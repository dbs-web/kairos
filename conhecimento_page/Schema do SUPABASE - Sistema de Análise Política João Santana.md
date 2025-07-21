# Schema do SUPABASE - Sistema de Análise Política João Santana

## Visão Geral

Este documento detalha a estrutura do banco de dados SUPABASE para o sistema de coleta e análise de dados políticos baseado na metodologia de João Santana. O schema foi projetado para capturar informações abrangentes sobre candidatos, cenários políticos e estratégias de campanha, permitindo que a IA gere análises estratégicas autênticas.

## Estrutura das Tabelas

### 1. Tabela: `candidates` (Candidatos)

Esta tabela armazena informações básicas sobre os candidatos/parlamentares.

```sql
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Dados Pessoais Básicos (Módulo 1)
    full_name VARCHAR(255) NOT NULL,
    urn_name VARCHAR(255), -- Novo campo: Nome de Urna
    age INTEGER,
    birth_place VARCHAR(255),
    marital_status VARCHAR(50),
    education TEXT,
    current_profession VARCHAR(255),
    previous_profession VARCHAR(255),
    hobbies TEXT,
    favorite_team VARCHAR(100), -- Novo campo: Time de Futebol
    religion VARCHAR(100), -- Novo campo: Religião
    
    -- Histórico Político (Módulo 1)
    party_affiliation VARCHAR(100),
    party_history TEXT, -- Novo campo: Histórico de Partidos (JSONB seria melhor)
    political_experience_years INTEGER,
    previous_positions TEXT[], -- Array de cargos anteriores
    main_achievements TEXT,
    main_projects TEXT,
    government_vision TEXT, -- Novo campo: Visão de Governo
    candidate_number VARCHAR(20), -- Novo campo: Número do Candidato
    previous_slogans TEXT, -- Novo campo: Slogan(s) de Campanhas Anteriores (JSONB seria melhor)
    political_mentors_allies TEXT, -- Novo campo: Padrinhos Políticos e Aliados Históricos
    
    -- Características Pessoais, Narrativa Pessoal, Imagem Pública (Módulo 1)
    strengths TEXT,
    weaknesses TEXT,
    family_structure TEXT,
    family_relevance_public_image TEXT,
    life_story TEXT,
    personal_values TEXT,
    political_motivations TEXT,
    electorate_connection TEXT,
    current_public_perception TEXT,
    positive_associations TEXT,
    negative_associations TEXT,
    media_mentions_summary TEXT,
    
    -- Comunicação e Imagem Pública (Módulo 2 - Novos campos)
    voice_characteristics TEXT, -- Novo campo: Voz (Técnica, Popular, etc.)
    tone_variations TEXT, -- Novo campo: Tom (Otimista, Crítico, etc.)
    brand_archetype VARCHAR(100), -- Novo campo: Arquétipo de Marca
    keywords_jargons TEXT, -- Novo campo: Palavras-chave e Jargões
    recurrent_metaphors TEXT, -- Novo campo: Metáforas e analogias
    uses_data_stats BOOLEAN, -- Novo campo: Usa dados e estatísticas
    dress_style_appearance TEXT, -- Novo campo: Estilo de vestimenta e aparência
    
    -- Metadados
    created_by UUID REFERENCES auth.users(id),
    status VARCHAR(20) DEFAULT 'active'
);
```

### 2. Tabela: `social_media_profiles` (Perfis de Redes Sociais)

Armazena informações detalhadas sobre a presença digital do candidato.

```sql
CREATE TABLE social_media_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    platform VARCHAR(100) NOT NULL, -- Ex: Facebook, Instagram, Twitter
    profile_link VARCHAR(500) NOT NULL,
    engagement_analysis TEXT, -- Análise de performance (engajamento médio, melhores posts)
    content_type_analysis TEXT -- Tipo de conteúdo que mais posta
);
```

### 3. Tabela: `political_mandates` (Mandatos Políticos)

Armazena informações detalhadas sobre os mandatos e cargos executivos do candidato.

```sql
CREATE TABLE political_mandates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    position VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    commission_roles TEXT, -- Cargos em Comissões Parlamentares
    key_projects_laws TEXT, -- Projetos de Lei (JSONB seria melhor para array de objetos com título, ementa, status, link)
    important_votes TEXT, -- Votações importantes (JSONB seria melhor para array de objetos com tema, voto, justificativa)
    achievements_details TEXT, -- Obras e Realizações
    social_programs TEXT -- Programas Sociais
);
```

### 4. Tabela: `parliamentary_amendments` (Emendas Parlamentares)

Armazena detalhes sobre as emendas parlamentares do candidato.

```sql
CREATE TABLE parliamentary_amendments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    fiscal_year INTEGER, -- ano_orcamentario
    amendment_type VARCHAR(100), -- tipo_emenda
    amendment_code VARCHAR(100), -- codigo_emenda
    destination_municipality VARCHAR(255), -- municipio_destino
    thematic_area VARCHAR(100), -- area_tematica
    object_description TEXT, -- objeto_descricao
    status VARCHAR(50), -- status
    proof_link VARCHAR(500) -- link_comprovacao
);
```

### 5. Tabela: `thematic_positions` (Posicionamentos Temáticos)

Armazena o posicionamento do candidato por tema.

```sql
CREATE TABLE thematic_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    area VARCHAR(100) NOT NULL, -- Ex: Economia, Segurança Pública
    current_position TEXT, -- Posição Atual
    historical_positions TEXT, -- Histórico de Posições
    literal_quotes TEXT -- Citações literais
);
```

### 6. Tabela: `election_history` (Histórico de Eleições)

Armazena o histórico de eleições disputadas pelo candidato.

```sql
CREATE TABLE election_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    election_year INTEGER NOT NULL,
    position_disputed VARCHAR(255) NOT NULL,
    total_votes INTEGER,
    result VARCHAR(100), -- Ex: 'Eleito', 'Não Eleito', 'Segundo Turno'
    geographic_vote_analysis TEXT -- JSONB seria melhor para mapa de calor
);
```

### 7. Tabela: `research_cross_sections` (Cruzamentos de Pesquisa)

Armazena detalhes dos cruzamentos de pesquisas de opinião.

```sql
CREATE TABLE research_cross_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_id UUID REFERENCES research_data(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    candidate_name VARCHAR(255), -- Nosso ou adversário
    segment_type VARCHAR(100), -- Ex: "Geral", "Região", "Renda"
    segment_value VARCHAR(255), -- Ex: "Capital", "Até 2 SM", "Feminino"
    stimulated_vote_intention DECIMAL(5,2), -- Intenção de voto estimulada (%)
    rejection_rate DECIMAL(5,2), -- Rejeição (%)
    spontaneous_vote_intention DECIMAL(5,2) -- Intenção de voto espontânea (%)
);
```

### 8. Tabela: `municipal_support` (Apoio Municipal)

Armazena o mapeamento de forças locais e apoios municipais.

```sql
CREATE TABLE municipal_support (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    municipality_name VARCHAR(255) NOT NULL,
    mayor_name VARCHAR(255),
    mayor_party VARCHAR(100),
    alliance_status VARCHAR(100), -- Ex: 'Aliado Estratégico', 'Oposição Declarada'
    local_leaders TEXT, -- Vice-prefeitos, vereadores, ex-prefeitos
    strategic_observations TEXT -- Observações estratégicas
);
```

### 9. Tabela: `external_competitors` (Concorrentes Externos)

Armazena informações sobre adversários na disputa eleitoral.

```sql
CREATE TABLE external_competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    competitor_name VARCHAR(255) NOT NULL,
    party VARCHAR(100),
    current_position VARCHAR(255),
    summary_profile TEXT,
    threat_level VARCHAR(50) -- Alta/Média/Baixa
);
```

### 10. Tabela: `internal_competitors` (Concorrentes Internos)

Armazena informações sobre disputas na chapa ou federação.

```sql
CREATE TABLE internal_competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    competitor_name VARCHAR(255) NOT NULL,
    party VARCHAR(100),
    vote_geography TEXT, -- tags
    main_electorate_profile TEXT,
    last_election_disputed INTEGER,
    total_votes_last_election INTEGER,
    vote_by_municipality_link VARCHAR(500),
    main_platforms_issues TEXT,
    strengths TEXT,
    weaknesses_vulnerabilities TEXT,
    synergy_conflict_analysis VARCHAR(255) -- "Soma, compete ou é irrelevante?"
);
```

### 11. Tabela: `media_monitoring` (Monitoramento de Mídia)

Armazena informações sobre o monitoramento de reportagens, influenciadores e jornalistas.

```sql
CREATE TABLE media_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    report_link VARCHAR(500), -- link da reportagem
    content_tone VARCHAR(50), -- positive/negative/neutral
    influencer_journalist TEXT, -- influenciadores e jornalistas
    observation TEXT -- observações
);
```

### 12. Tabela: `vulnerability_dossiers` (Dossiê de Vulnerabilidades)

Armazena informações sobre polêmicas, escândalos e acusações passadas.

```sql
CREATE TABLE vulnerability_dossiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    issue_summary TEXT, -- Resumo do caso (polêmica, escândalo, etc.)
    status VARCHAR(100), -- Ex: 'arquivado', 'em andamento', 'resolvido'
    official_defense TEXT, -- Defesa/explicação oficial do candidato
    controversial_statements TEXT, -- JSONB seria melhor para array de objetos
    weak_points_management TEXT -- Pontos fracos na gestão ou trajetória
);
```

### Tabelas Existentes (Atualizadas ou Mantidas)

#### `political_scenarios` (Cenários Políticos)

Armazena informações sobre o contexto político e eleitoral de cada campanha.

```sql
CREATE TABLE political_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Tipo de Eleição
    election_type VARCHAR(50) NOT NULL, -- 'municipal', 'estadual', 'federal'
    position_type VARCHAR(50) NOT NULL, -- 'executivo', 'legislativo'
    specific_position VARCHAR(100), -- 'prefeito', 'deputado_federal', etc.
    
    -- Contexto Geográfico
    geographic_region VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(100),
    socioeconomic_characteristics TEXT,
    cultural_characteristics TEXT,
    
    -- Análise de Concorrentes (mantido, mas agora com tabelas mais detalhadas)
    main_competitors JSONB, -- Array de objetos com dados dos concorrentes
    competitors_strengths TEXT,
    competitors_weaknesses TEXT,
    expected_strategies TEXT,
    
    -- Partidos e Alianças
    party_strength_region TEXT,
    potential_allies TEXT,
    potential_opponents TEXT,
    alliance_history TEXT,
    
    -- Conjuntura Política
    main_debate_topics TEXT[],
    current_crises TEXT,
    scandals_context TEXT,
    electorate_mood VARCHAR(100), -- 'otimista', 'pessimista', 'raivoso', etc.
    
    -- Legislação Eleitoral
    financing_restrictions TEXT,
    tv_time_allocation TEXT,
    legal_opportunities TEXT,
    legal_constraints TEXT,

    -- Análise SWOT (se o marketeiro preencher como entrada)
    swot_input TEXT -- Novo campo: SWOT do Candidato (TEXT ou JSONB)
);
```

#### `electorate_analysis` (Análise do Eleitorado)

Contém dados detalhados sobre o eleitorado e segmentação.

```sql
CREATE TABLE electorate_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Dados Demográficos
    age_distribution JSONB, -- {"18-25": 20, "26-35": 25, ...}
    gender_distribution JSONB,
    income_distribution JSONB,
    education_distribution JSONB,
    religion_distribution JSONB,
    ethnicity_distribution JSONB,
    
    -- Dados Psicográficos
    values_beliefs TEXT,
    lifestyle_patterns TEXT,
    aspirations TEXT,
    fears_frustrations TEXT,
    
    -- Comportamento Eleitoral
    voting_history TEXT,
    party_loyalty TEXT,
    mobilizing_topics TEXT[],
    voting_patterns TEXT,
    
    -- Segmentos-Chave
    key_segments JSONB, -- Array de objetos com segmentos específicos
    segment_priorities TEXT,
    segment_strategies TEXT,
    
    -- Canais de Comunicação
    preferred_media_channels JSONB, -- {"tv": 40, "radio": 20, "social": 30, ...}
    information_sources TEXT,
    communication_habits TEXT,

    -- Perfil do Eleitorado Fiel (IBGE e Atitudinal)
    loyal_electorate_ibge_data TEXT, -- Novo campo: Análise cruzada com dados IBGE
    loyal_electorate_attitudinal_profile TEXT -- Novo campo: Perfil Atitudinal via pesquisas qualitativas
);
```

#### `campaign_messaging` (Mensagem e Posicionamento)

Armazena informações sobre a estratégia de mensagem da campanha.

```sql
CREATE TABLE campaign_messaging (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Eixos Temáticos
    thematic_axes JSONB, -- {"saude": {"priority": 1, "details": "..."}, ...}
    main_campaign_themes TEXT[],
    theme_priorities TEXT,
    
    -- Slogan e Conceito
    campaign_slogan VARCHAR(255),
    central_concept TEXT,
    campaign_narrative TEXT,
    
    -- Diferenciais
    candidate_differentials TEXT,
    unique_value_proposition TEXT,
    competitive_advantages TEXT,
    
    -- Propostas
    main_proposals JSONB, -- Array de objetos com propostas detalhadas
    solution_framework TEXT,
    implementation_strategy TEXT,
    
    -- Tom da Comunicação
    communication_tone VARCHAR(100), -- 'otimista', 'combativo', 'conciliador', etc.
    messaging_style TEXT,
    emotional_appeal_strategy TEXT
);
```

#### `marketing_strategy` (Estratégia de Marketing)

Contém informações sobre a estratégia de comunicação e marketing da campanha.

```sql
CREATE TABLE marketing_strategy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Equipe
    marketing_team JSONB, -- Array de objetos com membros da equipe
    team_expertise TEXT,
    external_consultants TEXT,
    
    -- Canais de Mídia
    media_channels JSONB, -- Detalhamento de cada canal
    media_investment_proportion JSONB,
    media_strategy_timeline TEXT,
    
    -- Estratégias Digitais
    social_media_presence JSONB, -- Presença em cada rede social (mantido, mas agora com tabela mais detalhada)
    content_strategy TEXT,
    influencer_strategy TEXT,
    digital_advertising_segmentation TEXT,
    
    -- Mobilização
    event_strategy TEXT,
    rally_planning TEXT,
    volunteer_mobilization TEXT,
    grassroots_strategy TEXT,
    
    -- Plano de Crise
    crisis_management_plan TEXT,
    attack_response_strategy TEXT,
    negative_news_protocol TEXT,
    candidate_error_management TEXT,
    approved_talking_points TEXT -- Novo campo: Banco de argumentos e talking points pré-aprovados
);
```

#### `research_data` (Dados de Pesquisa)

Armazena dados quantitativos de pesquisas eleitorais e de opinião.

```sql
CREATE TABLE research_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadados da Pesquisa
    research_date DATE,
    research_institute VARCHAR(255),
    sample_size INTEGER,
    margin_error DECIMAL(4,2),
    confidence_level DECIMAL(4,2),
    contractor VARCHAR(255), -- Novo campo: contratante
    tse_registration VARCHAR(255), -- Novo campo: registro_tse
    full_report_link VARCHAR(500), -- Novo campo: link_relatorio_completo
    
    -- Intenção de Voto
    voting_intention JSONB, -- {"candidate_name": percentage, ...}
    voting_intention_trend TEXT,
    
    -- Avaliação do Candidato
    candidate_approval DECIMAL(5,2),
    candidate_rejection DECIMAL(5,2),
    candidate_knowledge DECIMAL(5,2),
    
    -- Temas Prioritários
    priority_issues JSONB, -- {"saude": 35, "educacao": 25, ...}
    issue_performance JSONB, -- Performance do candidato em cada tema
    
    -- Segmentação (mantido, mas agora com tabela mais detalhada para cruzamentos)
    demographic_breakdown JSONB, -- Intenção de voto por segmento
    geographic_breakdown JSONB,
    
    -- Observações
    research_notes TEXT,
    strategic_insights TEXT
);
```

#### `ai_analyses` (Análises da IA)

Armazena as análises geradas pela IA baseadas na metodologia João Santana.

```sql
CREATE TABLE ai_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Tipo de Análise
    analysis_type VARCHAR(100), -- 'viabilidade', 'estrategia', 'posicionamento', etc.
    analysis_title VARCHAR(255),
    
    -- Conteúdo da Análise
    executive_summary TEXT,
    detailed_analysis TEXT,
    strategic_recommendations TEXT,
    tactical_suggestions TEXT,
    
    -- Análises Específicas (Metodologia João Santana)
    scenario_analysis TEXT, -- Análise de Cenário Político
    electorate_segmentation TEXT, -- Segmentação Eleitoral Profunda
    strategic_triangle TEXT, -- Candidato, Mensagem, Eleitorado
    swot_analysis TEXT, -- Análise SWOT Política
    
    -- Adaptações Contextuais
    election_type_adaptation TEXT,
    territorial_context_adaptation TEXT,
    electoral_moment_adaptation TEXT,
    
    -- Metadados
    confidence_score DECIMAL(3,2), -- Confiança da IA na análise (0-1)
    data_completeness DECIMAL(3,2), -- Completude dos dados usados (0-1)
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Versionamento
    version INTEGER DEFAULT 1,
    previous_version_id UUID REFERENCES ai_analyses(id)
);
```

#### `content_generation` (Geração de Conteúdo)

Armazena conteúdos gerados pela IA para a campanha.

```sql
CREATE TABLE content_generation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES ai_analyses(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Tipo de Conteúdo
    content_type VARCHAR(100), -- 'discurso', 'post_social', 'press_release', etc.
    content_category VARCHAR(100), -- 'proposta', 'ataque', 'defesa', 'mobilizacao'
    target_audience VARCHAR(255),
    
    -- Conteúdo
    title VARCHAR(500),
    content TEXT,
    call_to_action TEXT,
    
    -- Metadados
    tone VARCHAR(100),
    style VARCHAR(100),
    estimated_impact VARCHAR(100), -- 'alto', 'medio', 'baixo'
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'approved', 'published'
    approved_by UUID REFERENCES auth.users(id),
    published_at TIMESTAMP WITH TIME ZONE
);
```

## Relacionamentos e Índices

### Relacionamentos Principais:
- Um candidato pode ter múltiplos cenários políticos (para diferentes eleições)
- Cada candidato tem uma análise de eleitorado
- Cada candidato tem uma estratégia de mensagem
- Cada candidato tem uma estratégia de marketing
- Múltiplas pesquisas podem ser associadas a um candidato
- Múltiplas análises de IA podem ser geradas para um candidato
- Conteúdos são gerados baseados nas análises
- Um candidato pode ter múltiplos perfis de redes sociais
- Um candidato pode ter múltiplos mandatos políticos
- Um candidato pode ter múltiplas emendas parlamentares
- Um candidato pode ter múltiplos posicionamentos temáticos
- Um candidato pode ter múltiplos históricos de eleições
- Uma pesquisa pode ter múltiplos cruzamentos de pesquisa
- Um candidato pode ter múltiplos apoios municipais
- Um candidato pode ter múltiplos concorrentes externos
- Um candidato pode ter múltiplos concorrentes internos
- Um candidato pode ter múltiplos monitoramentos de mídia
- Um candidato pode ter múltiplos dossiês de vulnerabilidades

### Índices Recomendados:
```sql
-- Índices para performance
CREATE INDEX idx_candidates_created_by ON candidates(created_by);
CREATE INDEX idx_political_scenarios_candidate_id ON political_scenarios(candidate_id);
CREATE INDEX idx_electorate_analysis_candidate_id ON electorate_analysis(candidate_id);
CREATE INDEX idx_campaign_messaging_candidate_id ON campaign_messaging(candidate_id);
CREATE INDEX idx_marketing_strategy_candidate_id ON marketing_strategy(candidate_id);
CREATE INDEX idx_research_data_candidate_id ON research_data(candidate_id);
CREATE INDEX idx_research_data_date ON research_data(research_date);
CREATE INDEX idx_ai_analyses_candidate_id ON ai_analyses(candidate_id);
CREATE INDEX idx_ai_analyses_type ON ai_analyses(analysis_type);
CREATE INDEX idx_content_generation_candidate_id ON content_generation(candidate_id);
CREATE INDEX idx_content_generation_type ON content_generation(content_type);

-- Novos índices para as novas tabelas
CREATE INDEX idx_social_media_profiles_candidate_id ON social_media_profiles(candidate_id);
CREATE INDEX idx_political_mandates_candidate_id ON political_mandates(candidate_id);
CREATE INDEX idx_parliamentary_amendments_candidate_id ON parliamentary_amendments(candidate_id);
CREATE INDEX idx_thematic_positions_candidate_id ON thematic_positions(candidate_id);
CREATE INDEX idx_election_history_candidate_id ON election_history(candidate_id);
CREATE INDEX idx_research_cross_sections_research_id ON research_cross_sections(research_id);
CREATE INDEX idx_municipal_support_candidate_id ON municipal_support(candidate_id);
CREATE INDEX idx_external_competitors_candidate_id ON external_competitors(candidate_id);
CREATE INDEX idx_internal_competitors_candidate_id ON internal_competitors(candidate_id);
CREATE INDEX idx_media_monitoring_candidate_id ON media_monitoring(candidate_id);
CREATE INDEX idx_vulnerability_dossiers_candidate_id ON vulnerability_dossiers(candidate_id);
```

## Políticas de Segurança (RLS - Row Level Security)

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE political_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE electorate_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_messaging ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_generation ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_profiles ENABLE ROW LEVEL SECURITY; -- Nova tabela
ALTER TABLE political_mandates ENABLE ROW LEVEL SECURITY; -- Nova tabela
ALTER TABLE parliamentary_amendments ENABLE ROW LEVEL SECURITY; -- Nova tabela
ALTER TABLE thematic_positions ENABLE ROW LEVEL SECURITY; -- Nova tabela
ALTER TABLE election_history ENABLE ROW LEVEL SECURITY; -- Nova tabela
ALTER TABLE research_cross_sections ENABLE ROW LEVEL SECURITY; -- Nova tabela
ALTER TABLE municipal_support ENABLE ROW LEVEL SECURITY; -- Nova tabela
ALTER TABLE external_competitors ENABLE ROW LEVEL SECURITY; -- Nova tabela
ALTER TABLE internal_competitors ENABLE ROW LEVEL SECURITY; -- Nova tabela
ALTER TABLE media_monitoring ENABLE ROW LEVEL SECURITY; -- Nova tabela
ALTER TABLE vulnerability_dossiers ENABLE ROW LEVEL SECURITY; -- Nova tabela

-- Políticas de acesso (usuários só veem seus próprios dados)
CREATE POLICY "Users can view own candidates" ON candidates
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert own candidates" ON candidates
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own candidates" ON candidates
    FOR UPDATE USING (auth.uid() = created_by);

-- Políticas similares para outras tabelas...
-- (Serão geradas políticas para todas as novas tabelas)
```

## Considerações de Design

### 1. Flexibilidade
O schema foi projetado para ser flexível, usando campos JSONB para dados estruturados que podem variar entre campanhas.

### 2. Escalabilidade
A estrutura permite adicionar novos tipos de análise e conteúdo sem modificar o schema base.

### 3. Auditoria
Todas as tabelas incluem timestamps de criação e atualização para auditoria.

### 4. Versionamento
As análises da IA incluem versionamento para acompanhar a evolução das estratégias.

### 5. Segurança
Row Level Security garante que usuários só acessem seus próprios dados.

Este schema fornece a base sólida para o sistema de análise política baseado na metodologia de João Santana, permitindo coleta abrangente de dados e geração de análises estratégicas sofisticadas.




