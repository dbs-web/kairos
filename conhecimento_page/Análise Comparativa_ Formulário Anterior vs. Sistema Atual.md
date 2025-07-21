# Análise Comparativa: Formulário Anterior vs. Sistema Atual

## Introdução

Esta análise tem como objetivo comparar o conteúdo do formulário de coleta de dados previamente utilizado pelo usuário com o schema do banco de dados e a estrutura do formulário implementados no Sistema de Análise Política João Santana. O foco é identificar se todos os campos e conceitos do formulário anterior foram contemplados e se há oportunidades de aprimoramento ou adição de novas funcionalidades baseadas nas informações fornecidas.

## Módulo 1: Perfil Fundamental do Candidato (A Identidade)

### Formulário Anterior:
- **1.1. Dados Biográficos:** Nome Completo e Nome de Urna, Data e Local de Nascimento, Histórico Familiar, Formação Acadêmica, Trajetória Profissional (fora da política), Hobbies, Interesses Pessoais, Time de Futebol, Religião.
- **1.2. Perfil Político Básico:** Partido Atual e Filiação, Histórico de Partidos, Visão de Governo, Número do Candidato, Slogan(s) de Campanhas Anteriores e Atual, Padrinhos Políticos e Aliados Históricos.

### Sistema Atual (`candidates` table):
- `full_name`, `age`, `birth_place`, `marital_status`, `education`, `current_profession`, `previous_profession` (Dados Biográficos).
- `party_affiliation`, `political_experience_years`, `previous_positions`, `main_achievements`, `main_projects` (Histórico Político).
- `strengths`, `weaknesses`, `hobbies`, `family_structure`, `family_relevance_public_image`, `life_story`, `personal_values`, `political_motivations`, `connection_with_electorate`, `current_public_perception`, `positive_associations`, `negative_associations`, `media_mentions_summary`, `social_media_presence` (Características Pessoais, Narrativa Pessoal, Imagem Pública).

### Comparativo e Lacunas:
- **Nome de Urna:** Não explicitamente presente no schema atual. Pode ser adicionado como um campo `urn_name` em `candidates`.
- **Histórico Familiar detalhado:** O campo `family_structure` é mais genérico. O formulário anterior sugere um detalhamento maior (pais, cônjuge, filhos - informações públicas e relevantes). Pode ser um campo `JSONB` para maior flexibilidade ou um campo de texto mais descritivo.
- **Time de Futebol:** Não presente. Pode ser adicionado como um campo `favorite_team` em `candidates`.
- **Religião:** Não presente. Pode ser adicionado como um campo `religion` em `candidates`.
- **Histórico de Partidos (quais, por que saiu, com justificativa):** O campo `party_affiliation` é o atual. Um campo `party_history` (TEXT ou JSONB) poderia ser adicionado para detalhar a trajetória partidária.
- **Visão de Governo (liberal, desenvolvimentista, social, etc.):** Não explicitamente presente. O campo `political_motivations` pode abranger isso, mas um campo `government_vision` (TEXT) seria mais direto.
- **Número do Candidato:** Não presente. Pode ser adicionado como `candidate_number` (VARCHAR) em `candidates`.
- **Slogan(s) de Campanhas Anteriores e Atual:** O campo `campaign_slogan` está em `campaign_messaging`, mas foca no atual. Um campo `previous_slogans` (TEXT ou JSONB) em `candidates` ou `campaign_messaging` seria útil.
- **Padrinhos Políticos e Aliados Históricos:** Não explicitamente presente. Pode ser adicionado como `political_mentors_allies` (TEXT) em `candidates`.

## Módulo 2: Comunicação e Imagem Pública (Como se Apresenta)

### Formulário Anterior:
- **2.1. Voz e Tom:** Voz (Técnica ou Popular? Agressiva ou Conciliadora? Formal ou Informal?), Tom (Otimista, Crítico, Propositivo, Denuncista? Varia por contexto?), Arquétipo de Marca.
- **2.2. Estilo e Linguagem:** Palavras-chave e Jargões, Metáforas e analogias, Uso de dados e estatísticas, Estilo de vestimenta e aparência.
- **2.3. Presença Digital:** Links para perfis em redes sociais, Análise de performance (engajamento médio, melhores posts), Tipo de conteúdo que mais posta.

### Sistema Atual (`campaign_messaging` e `candidates` tables):
- `communication_tone`, `messaging_style` (Voz e Tom).
- `social_media_presence` (em `candidates`, mas pode ser mais detalhado).

### Comparativo e Lacunas:
- **Voz (detalhada):** `communication_tone` e `messaging_style` cobrem o básico, mas a granularidade de 


Voz (Técnica ou Popular? Agressiva ou Conciliadora? Formal ou Informal?) e Tom (Otimista, Crítico, Propositivo, Denuncista? Varia por contexto?) pode ser aprimorada. Um campo `voice_characteristics` (TEXT) e `tone_variations` (TEXT) em `campaign_messaging` seria útil.
- **Arquétipo de Marca:** Não presente. Pode ser adicionado como `brand_archetype` (VARCHAR) em `campaign_messaging`.
- **Estilo e Linguagem (detalhado):** `keywords_jargons` (TEXT), `recurrent_metaphors` (TEXT), `uses_data_stats` (BOOLEAN), `dress_style_appearance` (TEXT) poderiam ser adicionados em `campaign_messaging`.
- **Presença Digital (detalhado):** O campo `social_media_presence` em `candidates` é muito genérico. Seria ideal ter uma tabela separada `social_media_profiles` com campos como `platform` (VARCHAR), `profile_link` (VARCHAR), `engagement_analysis` (TEXT), `content_type_analysis` (TEXT) e `candidate_id` (FK).

## Módulo 3: Trajetória Política e Legado (O Histórico e a Prova de Trabalho)

### Formulário Anterior:
- **3.1. Mandatos, Cargos e Atuação:** Lista de todos os mandatos e cargos executivos com datas, Cargos em Comissões Parlamentares, Projetos de Lei de sua autoria (Listar os mais importantes com ementa, status e link), Votações mais importantes e polêmicas (Registrar o voto e a justificativa pública da época), Obras e Realizações, Programas Sociais criados ou implementados.
- **3.2. Prova de Trabalho: Tabela: `emendas_parlamentares`:** `id_emenda`, `ano_orcamentario`, `tipo_emenda`, `codigo_emenda`, `municipio_destino`, `area_tematica`, `objeto_descricao`, `valor_destinado`, `status`, `link_comprovacao`.

### Sistema Atual (`candidates` table):
- `previous_positions` (TEXT[]), `main_achievements` (TEXT), `main_projects` (TEXT) cobrem parte disso.

### Comparativo e Lacunas:
- **Mandatos e Cargos detalhados:** `previous_positions` é um array de texto. Seria mais robusto ter uma tabela `political_mandates` com campos como `candidate_id` (FK), `position` (VARCHAR), `start_date` (DATE), `end_date` (DATE), `commission_roles` (TEXT), `key_projects_laws` (JSONB - array de objetos com título, ementa, status, link), `important_votes` (JSONB - array de objetos com tema, voto, justificativa), `achievements_details` (TEXT), `social_programs` (TEXT).
- **Tabela `emendas_parlamentares`:** Esta é uma lacuna significativa. Uma nova tabela `parliamentary_amendments` com os campos sugeridos é crucial para candidatos legislativos. Os campos `municipio_destino` (VARCHAR), `area_tematica` (VARCHAR), `objeto_descricao` (TEXT), `valor_destinado` (DECIMAL), `status` (VARCHAR), `link_comprovacao` (VARCHAR) seriam muito úteis.

## Módulo 4: Plataforma e Posicionamentos (O Que Defende)

### Formulário Anterior:
- **4.1. Eixos Programáticos:** Principais bandeiras da campanha atual.
- **4.2. Posicionamento por Tema (Tabela Detalhada):** Áreas (Economia, Segurança Pública, Saúde, Educação, Meio Ambiente, Pautas Sociais/Costumes, Infraestrutura, Relações Exteriores), Posição Atual, Histórico de Posições e Citações literais.

### Sistema Atual (`campaign_messaging` table):
- `thematic_axes` (JSONB), `main_campaign_themes` (TEXT[]), `main_proposals` (JSONB) cobrem os eixos programáticos e propostas.

### Comparativo e Lacunas:
- **Posicionamento por Tema detalhado:** O sistema atual tem `thematic_axes` e `main_proposals`. Seria ideal ter uma tabela `thematic_positions` com campos como `candidate_id` (FK), `area` (VARCHAR), `current_position` (TEXT), `historical_positions` (TEXT), `literal_quotes` (TEXT). Isso permitiria uma análise mais granular do posicionamento do candidato em diversas pautas.

## Módulo 5: Dados Eleitorais e Opinião Pública (Onde e Para Quem)

### Formulário Anterior:
- **5.1. Histórico e Geografia do Voto:** Tabela de todas as eleições que disputou (ano, cargo, votos, resultado), Geolocalização do Voto (Mapa de calor).
- **5.2. Perfil do Eleitorado Fiel:** Análise cruzada de suas zonas de maior votação com dados do IBGE, Perfil Atitudinal (via pesquisas qualitativas).
- **5.3. Inteligência de Pesquisas de Opinião:** Tabela 1: `pesquisas_eleitorais` (Registro Mestre), Tabela 2: `cruzamentos_pesquisa` (Detalhes Estratégicos).

### Sistema Atual (`electorate_analysis` e `research_data` tables):
- `electorate_analysis` cobre `age_distribution`, `gender_distribution`, `income_distribution`, `education_distribution`, `religion_distribution`, `ethnicity_distribution`, `values_beliefs`, `lifestyle_patterns`, `aspirations`, `fears_frustrations`, `voting_history`, `party_loyalty`, `mobilizing_topics`, `voting_patterns`, `key_segments`, `segment_priorities`, `segment_strategies`, `preferred_media_channels`, `information_sources`, `communication_habits`.
- `research_data` cobre `research_date`, `research_institute`, `sample_size`, `margin_error`, `confidence_level`, `voting_intention`, `candidate_approval`, `candidate_rejection`, `priority_issues`, `demographic_breakdown`, `geographic_breakdown`, `research_notes`, `strategic_insights`.

### Comparativo e Lacunas:
- **Histórico de Eleições Detalhado:** O sistema atual não tem uma tabela específica para o histórico de eleições disputadas com votos e resultados. Uma tabela `election_history` com campos como `candidate_id` (FK), `election_year` (INTEGER), `position_disputed` (VARCHAR), `total_votes` (INTEGER), `result` (VARCHAR), `geographic_vote_analysis` (TEXT ou JSONB para mapa de calor) seria valiosa.
- **Perfil do Eleitorado Fiel (IBGE e Atitudinal):** O sistema atual tem campos para distribuição demográfica e psicográfica, mas a ligação direta com dados do IBGE e o perfil atitudinal específico do eleitorado fiel poderia ser mais explícita. O campo `key_segments` em `electorate_analysis` pode ser usado para isso, mas talvez com mais detalhes na descrição.
- **Inteligência de Pesquisas de Opinião (Cruzamentos):** O sistema atual tem a tabela `research_data` que é um bom começo. No entanto, a granularidade da tabela `cruzamentos_pesquisa` do formulário anterior (`segmento_tipo`, `segmento_valor`, `intencao_voto_estimulada`, `rejeicao`, `intencao_voto_espontanea`) é mais detalhada. Isso poderia ser incorporado ao campo `demographic_breakdown` e `geographic_breakdown` em `research_data` como JSONB mais estruturado, ou criar uma nova tabela `research_cross_sections` com `research_id` (FK), `segment_type` (VARCHAR), `segment_value` (VARCHAR), `stimulated_vote_intention` (DECIMAL), `rejection_rate` (DECIMAL), `spontaneous_vote_intention` (DECIMAL).

## Módulo 6: Análise do Ecossistema Político (O Campo de Batalha)

### Formulário Anterior:
- **6.1. Análise SWOT do Nosso Candidato:** Forças, Fraquezas, Oportunidades, Ameaças.
- **6.2. Tabela: `apoio_municipal`:** `municipio_nome`, `prefeito_nome`, `prefeito_partido`, `status_alianca`, `liderancas_locais_relevantes`, `observacoes_estrategicas`.
- **6.3. Tabela: `concorrentes_externos`:** `nome_concorrente`, `partido`, `cargo_atual`, `perfil_resumido`, `nivel_ameaca`.
- **6.4. Tabela: `concorrentes_internos`:** `nome_concorrente_chapa`, `partido`, `geografia_do_voto`, `perfil_do_eleitor_principal`, `ultima_eleicao_disputada`, `total_votos_ultima_eleicao`, `link para votacao_por_municipio`, `principais_bandeiras_pautas`, `pontos_fortes`, `pontos_fracos_vulnerabilidades`, `analise_sinergia_conflito`.
- **6.5. Monitoramento de Mídia:** Mapeamento de reportagens (links, teor), Mapeamento de influenciadores e jornalistas.

### Sistema Atual (`political_scenarios` table):
- `main_competitors` (JSONB), `competitors_strengths` (TEXT), `competitors_weaknesses` (TEXT) cobrem parte da análise de concorrentes.
- `swot_analysis` (TEXT) em `ai_analyses` é gerado pela IA, mas não é um campo de entrada.

### Comparativo e Lacunas:
- **Análise SWOT:** O sistema atual gera a SWOT, mas não a coleta como entrada. Se a ideia é que o marketeiro preencha, um campo `swot_input` (TEXT ou JSONB) em `candidates` ou `political_scenarios` seria necessário.
- **Tabela `apoio_municipal`:** Esta é uma lacuna. Uma nova tabela `municipal_support` com campos como `candidate_id` (FK), `municipality_name` (VARCHAR), `mayor_name` (VARCHAR), `mayor_party` (VARCHAR), `alliance_status` (VARCHAR), `local_leaders` (TEXT), `strategic_observations` (TEXT) é muito relevante.
- **Tabela `concorrentes_externos`:** O campo `main_competitors` em `political_scenarios` é JSONB, o que permite flexibilidade. No entanto, uma tabela `external_competitors` com campos mais estruturados como `candidate_id` (FK), `competitor_name` (VARCHAR), `party` (VARCHAR), `current_position` (VARCHAR), `summary_profile` (TEXT), `threat_level` (VARCHAR) seria mais robusta para consultas e análises.
- **Tabela `concorrentes_internos`:** Esta é uma lacuna. Uma tabela `internal_competitors` com campos como `candidate_id` (FK), `competitor_name` (VARCHAR), `party` (VARCHAR), `vote_geography` (TEXT), `main_electorate_profile` (TEXT), `last_election_disputed` (INTEGER), `total_votes_last_election` (INTEGER), `vote_by_municipality_link` (VARCHAR), `main_platforms_issues` (TEXT), `strengths` (TEXT), `weaknesses_vulnerabilities` (TEXT), `synergy_conflict_analysis` (TEXT) é essencial para campanhas legislativas ou em chapas.
- **Monitoramento de Mídia:** O campo `media_mentions_summary` em `candidates` é um resumo. Uma tabela `media_monitoring` com campos como `candidate_id` (FK), `report_link` (VARCHAR), `content_tone` (VARCHAR - positive/negative/neutral), `influencer_journalist` (TEXT), `observation` (TEXT) seria mais completa.

## Módulo 7: Vulnerabilidades e Pontos de Crise ("Arquivo Confidencial" e War Room)

### Formulário Anterior:
- **7.1. Dossiê de Vulnerabilidades:** Lista de todas as polêmicas, escândalos, acusações e investigações passadas (resumo, status, defesa oficial), Declarações polêmicas ou controversas, Pontos fracos na gestão ou trajetória.
- **7.2. Plano Estratégico de Resposta a Crises:** Banco de argumentos e talking points pré-aprovados.

### Sistema Atual (`marketing_strategy` table):
- `crisis_management_plan` (TEXT), `attack_response_strategy` (TEXT), `negative_news_protocol` (TEXT), `candidate_error_management` (TEXT) cobrem o plano de crise.

### Comparativo e Lacunas:
- **Dossiê de Vulnerabilidades:** Esta é uma lacuna significativa. Uma tabela `vulnerabilities_dossier` com campos como `candidate_id` (FK), `issue_summary` (TEXT), `status` (VARCHAR), `official_defense` (TEXT), `controversial_statements` (JSONB - array de objetos com data, fonte, contexto), `weak_points_management` (TEXT) é crucial para a gestão de crise.
- **Banco de Argumentos/Talking Points:** O campo `attack_response_strategy` em `marketing_strategy` pode ser usado para isso, mas um campo `approved_talking_points` (TEXT ou JSONB) seria mais explícito.

## Conclusão e Recomendações

O sistema atual já contempla uma vasta gama de informações e está bem estruturado para a análise de IA. No entanto, o formulário anterior apresenta um nível de granularidade e especificidade em certas áreas que seria extremamente valioso para aprofundar as análises e a autenticidade da 

