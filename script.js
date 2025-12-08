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

let DATA_STORE = null;

// 🔥 NOVA FUNÇÃO → detecta a refeição com regra dos 19h + almoço do dia seguinte
function detectarRefeicaoAtualComRegra() {
  const agora = new Date();
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const hm = hora * 100 + minuto;

  // Após 19h → exibir almoço do dia seguinte
  if (hm > 1900) return "proximo_almoco";

  // Almoço: 11h30–13h30
  if (hm >= 1130 && hm <= 1330) return "almoco";

  // Janta: 17h00–19h00
  if (hm >= 1700 && hm <= 1900) return "janta";

  // Entre almoço e janta → próxima é janta
  if (hm > 1330 && hm < 1700) return "janta";

  // Antes do almoço → próxima é almoço
  return "almoco";
}

// 🔥 Função que renderiza automaticamente o cardápio
function carregarAutomatico() {
  const hoje = new Date();
  let dia = hoje.getDate();
  let mes = hoje.getMonth() + 1;

  const refeicaoDetectada = detectarRefeicaoAtualComRegra();

  // Regras especiais
  if (refeicaoDetectada === "proximo_almoco") {
    // Passou das 19h → avança o dia
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

    // Se for próximo dia → sempre carregar almoço
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

// 🔥 Função isolada para renderizar o cardápio
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
      lastUpdateEl.textContent = "Atualizado em " + dados.ultima_atualizacao;
    }

    dateSelect.innerHTML = '<option value="">Selecione a data...</option>';
    Object.keys(dados).forEach(key => {
      if (key === "ultima_atualizacao") return;

      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = optionLabel(dados[key].dia, key);
      dateSelect.appendChild(opt);
    });

    // 🔥 Após carregar datas → carregamento automático com regra dos 19h
    carregarAutomatico();

  } catch(err) {
    dateSelect.innerHTML = '<option value="">Erro ao carregar datas</option>';
    output.innerHTML = `<div class="card"><p class="meta">Erro: ${err.message}</p></div>`;
    console.error(err);
  }
}

// initialize on load
document.addEventListener('DOMContentLoaded', init);
