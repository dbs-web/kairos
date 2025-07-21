
## Notas sobre a Metodologia de João Santana

Com base na pesquisa inicial, os principais pilares da abordagem de João Santana no marketing político parecem incluir:

1.  **Conexão Emocional e Narrativa:** Criação de campanhas que evocam sentimentos patrióticos e emocionais, construindo uma narrativa forte que ressoa com o eleitorado. Isso inclui o uso de jingles e músicas que se tornam a marca da campanha.
2.  **Análise Profunda do Eleitorado:** Entendimento das necessidades, anseios e comportamentos do eleitorado para traçar uma linha tênue entre as expectativas da sociedade e as propostas do candidato. Isso envolve a análise de ideologias e crenças coletivas.
3.  **Construção de Imagem e Percepção:** Foco na imagem do candidato, não apenas em sua aparência física, mas também na percepção pública de suas qualidades (juventude, boa aparência, inteligência, oratória, etc.).
4.  **Adaptação e Inovação:** Capacidade de adaptar as estratégias às novas mídias e tecnologias (como o uso massivo das redes sociais na campanha de Lula em 2006) e de inovar na forma de veicular a mensagem.
5.  **Planejamento Sistêmico e de Longo Prazo:** Embora o marketing eleitoral seja de curto prazo, o marketing político visa a construção da imagem em longo prazo, com um planejamento sistêmico que fortaleça a imagem do político e suas realizações.
6.  **Desestabilização de Adversários (quando necessário):** A pesquisa mencionou que ele utilizava táticas para desestabilizar adversários, o que sugere uma abordagem combativa e estratégica no confronto.
7.  **Foco em Problemas Sociais e Soluções:** Campanhas que se centram em problemas de grande apelo social e na apresentação de soluções para esses problemas.

### Pontos a serem aprofundados para o formulário:

*   Como traduzir 


esses pilares em campos de dados para o formulário?
*   Quais informações específicas sobre o candidato, o eleitorado e o cenário político são cruciais para essa análise?
*   Como capturar a "essência simbólica da comunicação política" e os "desafios éticos e estruturais" que ele menciona?

### Estrutura Geral do Sistema (Esboço Inicial):

1.  **Formulário de Coleta de Dados:** Interface amigável para marketeiros preencherem informações detalhadas sobre o candidato e o contexto da campanha.
2.  **SUPABASE:** Banco de dados para armazenar as informações de forma estruturada.
3.  **Módulo de Análise de IA:** Processa os dados do SUPABASE e gera análises e conteúdos, simulando a perspectiva de João Santana.
4.  **Interface de Visualização/Geração:** Apresenta os resultados da IA aos usuários (marketeiros/candidatos).

### Próximos Passos na Fase 1:

*   Refinar a lista de informações necessárias para o formulário, com base nos pilares identificados.
*   Começar a pensar na categorização dessas informações para o schema do Supabase.
*   Considerar a inclusão de campos para dados quantitativos (pesquisas, demografia) e qualitativos (percepção, narrativa).




### Detalhamento das Informações para o Formulário (Pense como João Santana):

Para que a IA possa 'pensar como João Santana', o formulário deve coletar dados que permitam uma análise estratégica profunda. Aqui estão as categorias e exemplos de informações que seriam cruciais:

**1. Perfil do Candidato/Parlamentar:**
    *   **Dados Pessoais:** Nome completo, idade, local de nascimento, estado civil, formação acadêmica, profissão anterior/atual.
    *   **Histórico Político:** Cargos anteriores (e resultados), filiação partidária, tempo de atuação política, principais projetos/leis defendidos/aprovados.
    *   **Características Pessoais:** Pontos fortes (carisma, oratória, experiência, etc.), pontos fracos (fragilidades, histórico controverso), hobbies, interesses, família (estrutura, relevância na imagem pública).
    *   **Narrativa Pessoal:** História de vida (origem, superações, momentos marcantes), valores pessoais, motivações para a política, como se conecta com o eleitorado em nível pessoal.
    *   **Imagem Pública Atual:** Como é percebido pelo público (pesquisas de opinião, menções na mídia, redes sociais), principais associações (positivas e negativas).

**2. Cenário Político e Eleitoral:**
    *   **Tipo de Eleição:** (Municipal, Estadual, Federal - Executivo, Legislativo).
    *   **Contexto Geográfico:** Região/cidade/estado da campanha, características socioeconômicas e culturais do local.
    *   **Análise de Concorrentes:** Principais adversários (pontos fortes, fracos, histórico, imagem pública), estratégias esperadas dos concorrentes.
    *   **Partidos e Alianças:** Força do partido do candidato, potenciais aliados e oponentes, histórico de alianças na região.
    *   **Conjuntura Política Atual:** Principais temas em debate, crises, escândalos, humor do eleitorado (otimismo, pessimismo, raiva).
    *   **Legislação Eleitoral:** Restrições e oportunidades da legislação atual (financiamento, tempo de TV, etc.).

**3. Eleitorado e Segmentação:**
    *   **Dados Demográficos:** Distribuição por idade, gênero, renda, escolaridade, religião, etnia na área de atuação.
    *   **Dados Psicográficos:** Valores, crenças, estilo de vida, aspirações, medos, frustrações do eleitorado.
    *   **Comportamento Eleitoral:** Histórico de votação na região, fidelidade partidária, temas que mais mobilizam o eleitorado.
    *   **Segmentos-Chave:** Identificação de grupos específicos a serem focados (jovens, mulheres, empresários, trabalhadores, etc.) e suas particularidades.
    *   **Canais de Comunicação Preferenciais:** Onde o eleitorado busca informação (TV, rádio, redes sociais, jornais, boca a boca).

**4. Mensagem e Posicionamento:**
    *   **Eixos Temáticos:** Principais bandeiras da campanha (saúde, educação, segurança, economia, etc.), prioridade de cada tema.
    *   **Slogan e Conceito da Campanha:** Ideia central que a campanha deseja transmitir.
    *   **Diferenciais do Candidato:** O que o torna único e melhor que os concorrentes.
    *   **Propostas Principais:** Detalhamento das soluções para os problemas identificados.
    *   **Tom da Comunicação:** (Otimista, combativo, conciliador, técnico, emocional).

**5. Estratégia de Comunicação e Marketing:**
    *   **Orçamento da Campanha:** Estimativa de recursos disponíveis.
    *   **Equipe de Marketing:** Principais membros e suas expertises.
    *   **Canais de Mídia:** (TV, rádio, internet, eventos, mobilização de rua), proporção de investimento em cada um.
    *   **Estratégias Digitais:** Presença em redes sociais, tipo de conteúdo, influenciadores, segmentação de anúncios.
    *   **Estratégias de Mobilização:** Eventos, comícios, voluntariado, boca a boca.
    *   **Plano de Crise:** Como lidar com ataques, notícias negativas, erros do candidato.

Essas categorias e exemplos servirão como base para a criação do schema do Supabase e, posteriormente, para o desenvolvimento do formulário. O próximo passo será detalhar a estrutura do banco de dados.

