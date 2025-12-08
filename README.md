# 📅 Cardápio Semanal do RU

Aplicação simples, moderna e responsiva para exibir o **cardápio semanal do Refeitório do Campus Teresina Central do IFPI**, com suporte a *dark mode*, animações, exibição de datas e seleção de refeições.

---

## 🚀 Funcionalidades

* ✔️ Seleção de **data**
* ✔️ Escolha entre **Almoço**, **Janta** ou **Ambas**
* ✔️ Layout 100% **responsivo** (mobile first)
* ✔️ **Modo escuro** com preferência salva no navegador
* ✔️ Exibição de **última atualização** do cardápio
* ✔️ Animações suaves para os cards
* ✔️ Ícones e emojis para melhorar a experiência
* ✔️ Horário de funcionamento do RU exibido no rodapé

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
