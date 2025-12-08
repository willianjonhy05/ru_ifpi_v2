// script.js
// Carrega data.json, popula selects, aplica dark mode persistente,
// exibe cardápios com animação e carrega automaticamente a refeição do dia.

// util: format option label -> "terça-feira (02)"
function optionLabel(dia, key){
  const dayNumber = key.split('-')[0];
  return `${dia} (${dayNumber})`;
}

// persist dark mode preference
const darkToggle = document.getElementById('darkToggle');
const body = document.body;

// initialize preference
const DARK_KEY = 'cardapio_dark_v1';
if (localStorage.getItem(DARK_KEY) === '1') body.classList.add('dark');

function setDarkState(on){
  if(on) {
    body.classList.add('dark');
    darkToggle.textContent = '☀️';
    darkToggle.setAttribute('aria-pressed','true');
    localStorage.setItem(DARK_KEY,'1');
  } else {
    body.classList.remove('dark');
    darkToggle.textContent = '🌙';
    darkToggle.setAttribute('aria-pressed','false');
    localStorage.removeItem(DARK_KEY);
  }
}

darkToggle.addEventListener('click', () => {
  setDarkState(!body.classList.contains('dark'));
});

// DOM refs
const dateSelect = document.getElementById('dateSelect');
const mealSelect = document.getElementById('mealSelect');
const loadBtn = document.getElementById('loadBtn');
const output = document.getElementById('output');
const lastUpdateEl = document.getElementById('lastUpdate');

// 🔥 NOVA REF DO STATUS DO REFEITÓRIO
const statusRefeitorio = document.getElementById('statusRefeitorio');

let DATA_STORE = null;

// 🔥 NOVA FUNÇÃO: Status de refeição aberta / próxima refeição
function atualizarStatusRefeitorio() {
  const agora = new Date();
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const hm = hora * 100 + minuto;

  let mensagem = "";

  // Horários
  const almocoInicio = 1130;
  const almocoFim = 1330;

  const jantaInicio = 1700;
  const jantaFim = 1900;

  if ((hm >= almocoInicio && hm <= almocoFim)) {
    mensagem = "🍽️ Estamos servindo agora: almoço";
  }
  else if (hm >= jantaInicio && hm <= jantaFim) {
    mensagem = "🍽️ Estamos servindo agora: janta";
  }
  else {
    if (hm < almocoInicio) {
      mensagem = "🍽️ A próxima refeição é: almoço";
    }
    else if (hm > almocoFim && hm < jantaInicio) {
      mensagem = "🍽️ A próxima refeição é: janta";
    }
    else if (hm > jantaFim) {
      mensagem = "🍽️ A próxima refeição é: almoço de amanhã";
    }
  }

  statusRefeitorio.textContent = mensagem;
}

// 🔥 FUNÇÃO QUE DETECTA REFEIÇÃO AUTOMÁTICA + REGRA DAS 19H
function detectarRefeicaoAtualComRegra() {
  const agora = new Date();
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const hm = hora * 100 + minuto;

  if (hm > 1900) return "proximo_almoco";
  if (hm >= 1130 && hm <= 1330) return "almoco";
  if (hm >= 1700 && hm <= 1900) return "janta";
  if (hm > 1330 && hm < 1700) return "janta";
  return "almoco";
}

// 🔥 Carregamento automático com a regra especial
function carregarAutomatico() {
  const hoje = new Date();
  let dia = hoje.getDate();
  let mes = hoje.getMonth() + 1;

  const refeicaoDetectada = detectarRefeicaoAtualComRegra();

  if (refeicaoDetectada === "proximo_almoco") {
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    dia = amanha.getDate();
    mes = amanha.getMonth() + 1;
  }

  const diaStr = String(dia).padStart(2, '0');
  const mesStr = String(mes).padStart(2, '0');
  const chave = `${diaStr}-${mesStr}`;

  if (DATA_STORE[chave]) {
    dateSelect.value = chave;

    if (refeicaoDetectada === "proximo_almoco") {
      mealSelect.value = "almoco";
    } else {
      mealSelect.value = refeicaoDetectada;
    }

    carregarCardapio();
  }
}

// render helper: create a card for a meal list
function renderMealCard(title, subtitle, itens, emoji){
  const card = document.createElement('div');
  card.className = 'card';

  const h = document.createElement('h2');
  h.textContent = title;
  card.appendChild(h);

  if(subtitle){
    const p = document.createElement('p');
    p.className = 'meta';
    p.textContent = subtitle;
    card.appendChild(p);
  }

  const ul = document.createElement('ul');
  ul.className = 'meal-list';

  itens.forEach(it => {
    const li = document.createElement('li');
    li.className = 'meal-item';

    const spanIcon = document.createElement('span');
    spanIcon.className = 'icon';
    spanIcon.textContent = emoji || '🍽️';

    const spanText = document.createElement('span');
    spanText.className = 'text';
    spanText.textContent = it;

    li.appendChild(spanIcon);
    li.appendChild(spanText);

    ul.appendChild(li);
  });

  card.appendChild(ul);
  return card;
}

// 🔥 Função principal de renderização
function carregarCardapio() {
  output.innerHTML = '';
  const selected = dateSelect.value;
  const meal = mealSelect.value;

  if(!selected){
    output.innerHTML = `<div class="card"><p class="meta">Por favor selecione uma data.</p></div>`;
    return;
  }
  if(!meal){
    output.innerHTML = `<div class="card"><p class="meta">Por favor selecione a refeição.</p></div>`;
    return;
  }

  const info = DATA_STORE[selected];
  if(!info){
    output.innerHTML = `<div class="card"><p class="meta">Data não encontrada.</p></div>`;
    return;
  }

  const dayLabel = `${info.dia} (${selected.split('-')[0]})`;

  const headerCard = document.createElement('div');
  headerCard.className = 'card';
  const h2 = document.createElement('h2');
  h2.textContent = dayLabel;
  headerCard.appendChild(h2);
  headerCard.appendChild(Object.assign(document.createElement('p'), { className: 'meta', textContent: 'Cardápio selecionado' }));
  output.appendChild(headerCard);

  if(meal === 'almoco' || meal === 'ambas'){
    if(info.almoco?.length){
      const card = renderMealCard('Almoço', '', info.almoco, '🍽️');
      output.appendChild(card);
    }
  }

  if(meal === 'janta' || meal === 'ambas'){
    if(info.janta?.length){
      const card = renderMealCard('Janta', '', info.janta, '🍽️');
      output.appendChild(card);
    }
  }

  setTimeout(() => {
    output.firstElementChild?.scrollIntoView({behavior:'smooth', block:'start'});
  }, 50);
}

// Botão manual
loadBtn.addEventListener('click', carregarCardapio);

// fetch data.json and populate dates
async function init(){
  try {
    const resp = await fetch('data.json', {cache: "no-store"});
    if(!resp.ok) throw new Error('Não foi possível carregar data.json');
    const dados = await resp.json();
    DATA_STORE = dados;

    if (dados.ultima_atualizacao) {
      lastUpdateEl.textContent = "📅 Atualizado em " + dados.ultima_atualizacao;
    }

    dateSelect.innerHTML = '<option value="">Selecione a data...</option>';
    Object.keys(dados).forEach(key => {
      if (key === "ultima_atualizacao") return;

      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = optionLabel(dados[key].dia, key);
      dateSelect.appendChild(opt);
    });

    carregarAutomatico();

  } catch(err) {
    dateSelect.innerHTML = '<option value="">Erro ao carregar datas</option>';
    output.innerHTML = `<div class="card"><p class="meta">Erro: ${err.message}</p></div>`;
    console.error(err);
  }
}

// initialize on load
document.addEventListener('DOMContentLoaded', () => {
  init();
  atualizarStatusRefeitorio();  // 🔥 NOVA FUNÇÃO EXECUTADA AQUI
});
