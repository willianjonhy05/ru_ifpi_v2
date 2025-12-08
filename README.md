# 📅 Cardápio Semanal do RU – IFPI Teresina Central

Aplicação moderna, rápida e totalmente responsiva para exibir o **cardápio semanal do Refeitório do IFPI Campus Teresina Central**, com suporte a *dark mode*, animações, seleção de datas, detecção automática da refeição atual e exibição do horário de funcionamento.

---

## 🚀 Funcionalidades

- ✔️ Seleção de **data** do cardápio  
- ✔️ Escolha entre **Almoço**, **Janta** ou **Ambas**  
- ✔️ **Carregamento automático inteligente** da refeição do dia  
  - Detecta se é almoço ou janta  
  - Após 19h, carrega automaticamente o **almoço do dia seguinte**  
- ✔️ Exibição do **status atual do refeitório**  
  - "Estamos servindo agora: almoço/janta"  
  - "Próxima refeição: …"  
- ✔️ **Modo escuro persistente** (salvo no navegador)  
- ✔️ Animações suaves nos cards  
- ✔️ Layout 100% **responsivo** (mobile first)  
- ✔️ Exibição da **última atualização** do cardápio  
- ✔️ Uso de JSON para manter os dados organizados  
- ✔️ Interface limpa, simples e leve  

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído usando tecnologias simples e eficientes, com foco em velocidade e compatibilidade:

- **HTML5** – estrutura semântica, meta tags completas e SEO otimizado  
- **CSS3** – responsividade nativa, animações, variáveis, e modo escuro  
- **JavaScript Vanilla (ES6+)** –  
  - carregamento do `data.json`,  
  - sistema de filtros,  
  - animações,  
  - status automático do RU,  
  - dark mode persistente,  
  - regra especializada da refeição pós-19h  
- **JSON** – armazenamento das refeições por dia  
- **Fetch API** – leitura assíncrona do arquivo de dados  
- **LocalStorage** – mantém o dark mode ativado entre recargas  
- **Acessibilidade** via ARIA Live na área de resultados  

---


## 🗂️ Estrutura dos Arquivos

```
📁 projeto/
 ├── index.html
 ├── styles.css
 ├── script.js
 └── data.json
```

---

## 🧠 Como Funciona

* O arquivo `data.json` contém toda a estrutura do cardápio semanal.
* O `script.js`:

  * Carrega o JSON,
  * Popula o seletor de datas,
  * Gerencia exibição das refeições,
  * Controla o dark mode,
  * Exibe a última data de atualização.
* O `styles.css` aplica todo o estilo moderno com variáveis, sombras e animações.
* O HTML organiza os elementos e exibe o horário de funcionamento do RU.

---

## 🕒 Horário de Funcionamento do RU

* 🍽️ **Almoço:** 11h30 às 13h30
* 🌙 **Jantar:** 17h às 19h

---

## 🔧 Como executar

Basta abrir o arquivo **index.html** no navegador.
Se estiver utilizando `fetch()`, hospede o projeto em qualquer serviço simples, como:

* GitHub Pages
* Netlify
* Vercel

---

## 📝 Licença

Projeto livre para uso e modificação.

---

Feito com ❤️ para tornar o acesso ao cardápio mais rápido e prático.
