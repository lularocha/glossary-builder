# Regras de Qualidade da Geração de Glossários

Estas regras são incorporadas ao prompt do LLM (`api/generate.ts`) para garantir um glossário consistente e de alta qualidade. O provedor do modelo é selecionado pela variável de ambiente `LLM_PROVIDER` (veja `api/_llm.ts`).

---

## Regras de Seleção de Termos

### Cobertura Hierárquica

Equilibre os 12 termos entre os níveis de dificuldade:

- **3-4 termos fundamentais** (importância 9-10): Blocos de construção sem os quais não se entende o tema
- **4-5 conceitos centrais** (importância 7-8): Ideias centrais que definem o domínio
- **3-4 termos práticos/aplicados** (importância 5-7): Como os conceitos são usados na prática

### Princípios de Seleção

1. A **palavra semente DEVE ser o primeiro termo**, com importância 10
2. Inclua os "átomos" fundamentais (os menores blocos de construção do conceito)
3. Antes de incluir uma variante especializada, garanta que sua categoria-mãe exista
   - Exemplo: Inclua "Função de Ativação" antes de "ReLU"
4. Prefira termos canônicos/históricos a nomes informais
   - Exemplo: "Perceptron" em vez de "Neurônio Artificial"
5. Os termos devem formar uma progressão lógica de aprendizado, do fundamental ao avançado

---

## Regras de Formatação

### Capitalização do Nome do Termo

- **Abreviações/siglas**: Sempre escritas em CAIXA ALTA (ex.: "API", "BASH", "HTML", "REST")
- **Termos comuns**: Use a capitalização de título padrão (ex.: "Gradiente Descendente", "Rede Neural")

Se a palavra semente for inserida como abreviação, ela deve permanecer em caixa alta como nome do termo no glossário gerado.

---

## Regras de Definição

### Estrutura Padrão (Termos Comuns)

1. **Frase 1**: O QUE é (categoria + característica distintiva)
2. **Frase 2**: POR QUE importa ou COMO é usado

### Estrutura de Abreviação/Sigla

Para termos que são abreviações ou siglas:

1. **Frase 1**: Indique o que significa (ex.: "API significa Application Programming Interface.")
2. **Quebra de linha** (`\n`)
3. **Frase 2**: O QUE é (categoria + característica principal)
4. **Frase 3**: POR QUE importa ou COMO é usado

### Diretrizes de Escrita

- Comece com "Um/Uma [categoria]..." ou "O/A [substantivo/processo]..." para classificar de imediato
- Nunca use o termo que está sendo definido dentro da própria definição
- Evite quantificadores vagos ("vários", "diferentes", "muitos") - seja específico
- Para conceitos abstratos, inclua um exemplo concreto ou uma analogia
- **Máximo de 50 palavras** por definição (a frase de expansão das abreviações não conta no limite)
- Cada definição deve ser compreensível sem precisar ler outras definições antes

### Exemplo de uma Boa Definição (Termo Comum)

```
Termo: Gradiente Descendente
Definição: Um algoritmo de otimização que ajusta parâmetros iterativamente,
movendo-se na direção de maior decréscimo de uma função de perda. É a base de
como as redes neurais aprendem a partir dos dados de treinamento.
```

### Exemplo de uma Boa Definição (Abreviação)

```
Termo: API
Definição: API significa Application Programming Interface.
Um conjunto de protocolos e ferramentas que define como componentes de software
devem interagir. Essencial para criar sistemas modulares e interoperáveis capazes
de se comunicar entre diferentes plataformas.
```

---

## Calibração da Pontuação de Importância

| Pontuação | Significado                                               | Exemplo (Redes Neurais)            |
| --------- | --------------------------------------------------------- | ---------------------------------- |
| 10        | A própria palavra semente                                 | Rede Neural                        |
| 9         | Pré-requisitos absolutos - sem eles não se entende o tema | Pesos, Função de Ativação          |
| 8         | Conceitos centrais do domínio                             | Retropropagação, Função de Perda   |
| 7         | Conceitos de apoio importantes                            | Gradiente Descendente, Overfitting |
| 6         | Termos relacionados comumente encontrados                 | Dropout, Normalização em Lote      |
| 5         | Tópicos especializados ou avançados                       | LSTM, Mecanismo de Atenção         |

---

## Regras de Consistência

1. **Sem referências órfãs**: Todos os `relatedTerms` DEVEM referenciar termos que existam no glossário
2. **Relações bidirecionais**: Se o Termo A lista o Termo B como relacionado, o Termo B também deve listar o Termo A (quando fizer sentido)
3. **Gramática consistente**: Todas as definições devem começar com um artigo + substantivo/gerúndio

---

## Configuração da API

Estas configurações garantem qualidade tanto na geração do glossário quanto na expansão de termos:

| Configuração  | Valor                                                                                        | Finalidade                                    |
| ------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `model`       | deepseek-chat (padrão), gemini-2.5-flash, ou claude-sonnet-4-6 (via variável `LLM_PROVIDER`) | Equilíbrio entre qualidade e velocidade       |
| `temperature` | 0.7                                                                                          | Reduz a variabilidade mantendo a criatividade |
| `max_tokens`  | 4096 (geração) / 2048 (expansão)                                                             | Suficiente para um resultado detalhado        |

---

## Saiba Mais / Expansão de Termos

O recurso "Saiba Mais" permite expandir qualquer termo com contexto adicional e citação de fontes.

### Regras de Conteúdo da Expansão

1. **Parágrafos**: 1-3 parágrafos, cada um com 40-80 palavras
   - Amplie as aplicações práticas ou casos de uso
   - Explique padrões comuns ou boas práticas
   - Esclareça nuances ou casos extremos
   - NÃO repita a definição original

2. **Citação de Fontes**: 1-3 fontes apenas de categorias confiáveis:
   - Documentação oficial (docs de linguagem/framework)
   - MDN Web Docs (para tecnologias web)
   - Especificações da W3C
   - RFCs e padrões oficiais
   - Documentação de editoras respeitáveis (Oracle, Microsoft, Google)

3. **Regras de URL**:
   - **NUNCA** inclua links da Wikipédia
   - Só inclua a URL se houver alta confiança de que ela existe e é estável
   - Em caso de dúvida sobre a validade da URL, forneça o nome da fonte sem a URL
   - Prefira caminhos de documentação estáveis a posts de blog datados
