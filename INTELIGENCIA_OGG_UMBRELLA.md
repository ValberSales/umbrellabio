# DOSSIÊ DE INTELIGÊNCIA CORPORATIVA — UMBRELLA CORP. (OGG IND)

**Classificação:** CONFIDENCIAL // NÍVEL EXECUTIVO RED QUEEN  
**Corporação:** Umbrella Corp. (`Login: 2608107-01`)  
**Simulação:** `UTFPR_PB_2026_2` — Agroindústria de Biocombustíveis (OGG Industrial)  
**Horizonte Consolidado:** Períodos 01 a 05 (Histórico Auditado) + Período 06 (Decisões Preenchidas — Leitura Estrita)  
**Diretoria Executiva (Equipe):** Valber, Allan, Humberto, Mateus  

---

## 1. Posicionamento Estratégico Inicial e Arquitetura Operacional

Na fundação da operação (`visualizar_empresa.php`), a **Umbrella Corp.** estabeleceu sua diretriz corporativa sob a estratégia genérica de **Foco / Diferenciação Tecnológica e Qualidade Premium**:

- **Planta Industrial Base (Sede Fabril):** Instalada na **Região 4** (isenção de frete de distribuição na própria região e proximidade do maior mercado consumidor).
- **Região de Liderança:** **Região 4**
- **Região de Forte Atuação Secundária:** **Região 3**
- **Região de Expansão Oportunística:** **Região 2** (aberta a partir do Período 4)
- **Região Não Atendida:** **Região 1** (0 unidades planejadas ou vendidas entre P1 e P6)
- **Proposta de Valor B2B:** Biocombustível de alta densidade energética e pureza química (Grau de Inovação elevado, Embalagem Premium e atendimento técnico consultivo), permitindo captura de valor via preço premium e margens brutas superiores a 70%.

---

## 2. Regras de Engenharia, Custos e Contabilidade do Simulador (Descobertas e Correções Críticas)

A auditoria direta nos relatórios e regras do **OGG Ind**, somada à validação operacional dos períodos P1 a P6, corrige distorções da versão preliminar do documento e esclarece todas as dúvidas contábeis:

### 2.1. CORREÇÃO CRÍTICA: Lead Time de Módulos Fabris e Capacidade Nominal Efetiva em P5 (900.000 un)
- **Regra de Ouro do Simulador (Maturação $P+1$):** A compra de um módulo fabril no período $P$ gera desembolso de CAPEX (R\$ 1,50 milhão), registro no Imobilizado e incidência de custos fixos/contratação preparatória no próprio período $P$, mas **só aumenta a capacidade produtiva operacional no período subsequente ($P+1$)**.
- **Prova Matemática Incontestável nos Dados:**
  - **P1:** Compra do 1º Módulo (R\$ 1,50 mi). Capacidade operacional efetiva no P1 = **0 un** (Produção Real = **0 un**). O módulo comprado no P1 só passou a produzir no P2!
  - **P2:** 1 módulo operacional (capacidade nominal de **900.000 un**; produção limitada pelo estoque inicial de MP a $573.750 \times 87,00\% = \mathbf{499.163\text{ un}}$).
  - **P3:** 1 módulo operacional ($\text{Capacidade Nominal} = \mathbf{900.000\text{ un}}$). Produção a plena carga: $900.000 \times 88,50\% (\text{produtividade}) = \mathbf{796.500\text{ un}}$ (100% de utilização do módulo ativo!).
  - **P4:** 1 módulo operacional ($\text{Capacidade Nominal} = \mathbf{900.000\text{ un}}$). Produção a plena carga: $900.000 \times 89,75\% (\text{produtividade}) = \mathbf{807.750\text{ un}}$ (100% de utilização do módulo ativo!).
  - **P5:** Compra do 2º Módulo (R\$ 1,50 mi no Fluxo de Caixa do P5). Como o novo módulo só produz em $P+1$ (P6), **no Período 5 a capacidade nominal operacional ainda era de 900.000 unidades**! A produção real de **810.000 unidades** corresponde exatamente a **100% da capacidade nominal disponível ajustada pela produtividade de 90,00%** ($900.000 \times 90,00\% = \mathbf{810.000\text{ un}}$)!
  - **P6:** Agora sim, no Período 6, o 2º módulo comprado no P5 entra em operação produtiva, dobrando a **Capacidade Nominal Operacional para 1.800.000 unidades**!
- **Impacto na Análise dos 4 Ps (Praça):**
  - Diferentemente do que supunha o rascunho anterior (que interpretou o indicador patrimonial do relatório de P5 como se a usina 2 já pudesse produzir em P5 e estivesse com 45% de ociosidade), **a Produção operou no teto máximo (100% de programação sobre 900.000 un) durante P3, P4 e P5**.
  - A elevação do Custo Fixo para R\$ 1,50 milhão e do quadro para 58 funcionários em P5 (elevando o custo fixo unitário de R\$ 0,93 para R\$ 1,85/un) não foi "ociosidade de fábrica", mas sim o **pedágio pré-operacional obrigatório no período de aquisição do 2º módulo (P5)** para destravar a capacidade de **1.800.000 un no P6** — decisão indispensável, pois as vendas em P4 (1,02 mi) e P5 (1,07 mi) já superavam o teto físico de 1 módulo (810 mil un) e estavam esgotando o estoque de produto acabado (850k $\rightarrow$ 637k $\rightarrow$ 380k un).

### 2.2. Engenharia de Produto e Proporção Exata de Insumos (2 : 2 : 1)
- **Fórmula Oficial Confirmada:** Cada **1 unidade de Biocombustível** produzida consome exatamente:
  - **2 unidades de MP1** (*Sementes Oleaginosas*)
  - **2 unidades de MP2** (*Insumos Químicos Tipo A*)
  - **1 unidade de MP3** (*Insumos Químicos Tipo B*)
- **Lead Time de Suprimentos:** Toda matéria-prima adquirida no período $P$ é entregue no início do período $P+1$. A fábrica só produz no período $P$ utilizando o saldo de matéria-prima em estoque no início da rodada.
- **Custo de Estocagem de MP:** Taxa fixa de **2,0% por período** sobre o valor financeiro do estoque final de matéria-prima:
  - P1: $2\% \times \text{R\$ } 1.197.607,50 = \text{R\$ } 23.952,15$
  - P2: $2\% \times \text{R\$ } 1.869.671,70 = \text{R\$ } 37.393,43$
  - P3: $2\% \times \text{R\$ } 2.349.259,65 = \text{R\$ } 46.985,19$
  - P4: $2\% \times \text{R\$ } 5.038.213,54 = \text{R\$ } 100.764,27$
  - P5: $2\% \times \text{R\$ } 5.711.190,48 = \text{R\$ } 114.223,81$

### 2.3. Desvendando o CPV e o "Custo Variável" (Conciliação Exata ao Centavo)
A conciliação contábil exata dos relatórios do OGG esclarece por que o **Custo Variável** subiu de R\$ 1,73/un (P3) para R\$ 4,42/un (P5):

1. **Custo da Matéria-Prima das Unidades Vendidas ($\text{CMV}_{\text{MP}}$):**
   $$\text{CMV}_{\text{MP}} = \text{Estoque Inicial de P.A.} + \text{Custo de MP Aplicada na Produção} - \text{Estoque Final de P.A.}$$
   - **P3:** $\text{R\$ } 800.515,80 + \text{R\$ } 1.864.659,00 - \text{R\$ } 1.622.585,77 = \mathbf{\text{R\$ } 1.042.589,03}$ (R\$ 2,341/un vendida)
   - **P4:** $\text{R\$ } 1.622.585,77 + \text{R\$ } 2.187.326,12 - \text{R\$ } 1.045.735,55 = \mathbf{\text{R\$ } 2.764.176,34}$ (R\$ 2,708/un vendida)
   - **P5:** $\text{R\$ } 1.045.735,55 + \text{R\$ } 2.256.023,05 - \text{R\$ } 328.682,30 = \mathbf{\text{R\$ } 2.973.076,30}$ (R\$ 2,785/un vendida — 38,68% do CPV, somando R\$ 2,26 mi da produção do período + R\$ 0,72 mi da baixa de 257.450 unidades do estoque de P.A.).

2. **Natureza do "Custo Variável" no Fluxo de Caixa:**
   O item **Custo Variável** corresponde aos **encargos variáveis comerciais sobre a Receita Bruta de Vendas** (**Impostos sobre Vendas de 12,5% + Comissão da Força de Vendas**):
   - **P3:** **14,5%** ($12,5\% \text{ impostos} + 2,0\% \text{ comissão}$) $\times \text{R\$ } 5.300.108,20 = \mathbf{\text{R\$ } 768.515,69}$ (R\$ 1,726/un vendida).
   - **P4:** **17,5%** ($12,5\% \text{ impostos} + 5,0\% \text{ comissão}$) $\times \text{R\$ } 21.820.212,00 = \mathbf{\text{R\$ } 3.818.537,11}$ (R\$ 3,741/un vendida).
   - **P5:** **16,5%** ($12,5\% \text{ impostos} + 4,0\% \text{ comissão efetiva}$) $\times \text{R\$ } 28.568.231,50 = \mathbf{\text{R\$ } 4.713.758,19}$ (R\$ 4,416/un vendida — 61,32% do CPV).

3. **Fechamento Exato do CPV na DRE:**
   $$\text{CPV} = \text{CMV}_{\text{MP}} + \text{Custo Variável Comercial}$$
   - **P3:** $\text{R\$ } 1.042.589,03 + \text{R\$ } 768.515,69 = \mathbf{\text{R\$ } 1.811.104,72}$ (R\$ 4,067/un)
   - **P4:** $\text{R\$ } 2.764.176,34 + \text{R\$ } 3.818.537,11 = \mathbf{\text{R\$ } 6.582.713,45}$ (R\$ 6,449/un)
   - **P5:** $\text{R\$ } 2.973.076,30 + \text{R\$ } 4.713.758,19 = \mathbf{\text{R\$ } 7.686.834,49}$ (R\$ 7,201/un)

### 2.4. Depreciação e Origem do "Valor do Bônus"
- **Depreciação:** Não há depreciação periódica na DRE ou no Balanço Patrimonial do OGG Ind. Cada módulo fabril permanece registrado pelo custo histórico de R\$ 1.500.000,00 (R\$ 1,50 mi até P4; R\$ 3,00 mi em P5).
- **Valor do Bônus (R\$ 6,00 mi em P3 e R\$ 6,00 mi em P4):** Aportes governamentais extraordinários do cenário macroeconômico (Crise Sanitária do vírus "Corotinho" no P3 e Reforma Institucional "República Enéas Carneiro" no P4). Em P5 o bônus foi zero e a empresa entregou R\$ 14,06 milhões de LAIR puramente operacional.

---

## 3. Séries Históricas Auditadas e Corrigidas (Períodos 1 a 5 + P6)

| Indicador Operacional e Financeiro | P01 | P02 | P03 | P04 | P05 | P06 (Planejado) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Módulos Comprados no Período | +1 | 0 | 0 | 0 | +1 | 0 |
| Módulos Operacionais Ativos na Produção | 0 (em inst.) | 1 | 1 | 1 | **1** *(2º em inst.)* | **2** |
| **Capacidade Nominal Operacional (un)** | **0 (inst.) / 900k** | **900.000** | **900.000** | **900.000** | **900.000** | **1.800.000** |
| Capacidade Patrimonial Fim do Período (un) | 900.000 | 900.000 | 900.000 | 900.000 | 1.800.000 | 1.800.000 |
| Produtividade Total (%) | 84,50% | 87,00% | 88,50% | 89,75% | 90,00% | ~91%+ |
| **Quantidade Produzida (un)** | **0** | **499.163** | **796.500** | **807.750** | **810.000** | **1.800.000 (prev)** |
| Utilização da Capacidade Operacional Ativa | 0% | 55,5% | 88,5% (100% prog) | 89,8% (100% prog) | **90,0% (100% prog)** | 100% prog |
| Quantidade Vendida (un) | 0 | 0 | 445.348 | 1.020.773 | 1.067.450 | 2.079.842 (plan) |
| Receita de Vendas (R\$ mi) | 0,00 | 0,00 | 5,30 | 21,82 | 28,57 | 61,22 (plan) |
| Preço Médio Praticado (R\$/un) | – | – | 11,90 | 21,37 | 26,76 | 29,43 (plan) |
| Margem Bruta (%) | – | – | 65,8% | 69,8% | 73,1% | >74% (proj) |
| Estoque Final Produto Acabado (un) | 0 | 499.163 | 850.315 | 637.292 | 379.842 | ~100.000 (proj) |
| Estoque Final Matéria-Prima (R\$ mi) | 1,20 | 1,87 | 2,35 | 5,04 | 5,71 | – |
| Investimento em P&D (R\$ mi) | 1,35 | 1,05 | 1,50 | 2,70 | 0,90 | 2,40 |
| Grau de Inovação | 1 | 1 | 1 | 2 | 2 | 2 → 3 (alvo) |
| Nº de Funcionários | 22 | 29 | 31 | 34 | 58 | 58 |
| Custo Fixo de Produção (R\$ mi) | 0,60 | 0,60 | 0,75 | 0,75 | 1,50 | 1,50 |
| Lucro Líquido do Período (R\$ mi) | -2,17 | -2,79 | 0,06 | 12,46 | 11,95 | >20,0 (proj) |
| Caixa Final Ajustado (R\$ mi) | 5,13 | 1,44 | 1,27 | 10,50 | 20,47 | >48,0 (proj) |
