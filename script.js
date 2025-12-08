// script.js
// Carrega data.json, popula selects, aplica dark mode persistente e exibe cardápios com animação.

// util: format option label -> "terça-feira (02)"
function optionLabel(dia, key){
  const dayNumber = key.split('-')[0];
  return `${dia} (${dayNumber})`;
}

// persist dark mode preference
const darkToggle = document.getElementById('darkToggle');
// const prefersContrastBtn = document.getElementById('prefersContrast');
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

// optional: high-contrast toggle
// prefersContrastBtn.addEventListener('click', () => {
//   document.querySelectorAll('.meal-item .icon').forEach(el => {
//     el.style.boxShadow = el.style.boxShadow ? '' : '0 0 0 3px rgba(255,255,255,0.04) inset';
//   });
// });

// DOM refs
const dateSelect = document.getElementById('dateSelect');
const mealSelect = document.getElementById('mealSelect');
const loadBtn = document.getElementById('loadBtn');
const output = document.getElementById('output');

let DATA_STORE = null;

// NOVO: referência ao campo de atualização
const lastUpdateEl = document.getElementById('lastUpdate');

// fetch data.json and populate dates
async function init(){
  try {
    const resp = await fetch('data.json', {cache: "no-store"});
    if(!resp.ok) throw new Error('Não foi possível carregar data.json');
    const dados = await resp.json();
    DATA_STORE = dados;

    // NOVO: mostra última atualização
    if (dados.ultima_atualizacao) {
      lastUpdateEl.textContent = "Atualizado em " + dados.ultima_atualizacao;
    } else {
      lastUpdateEl.textContent = "Atualizado recentemente";
    }

    // clear and populate
    dateSelect.innerHTML = '<option value="">Selecione a data...</option>';
    Object.keys(dados).forEach(key => {
      if (key === "ultima_atualizacao") return; // ignora o campo novo

      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = optionLabel(dados[key].dia, key);
      dateSelect.appendChild(opt);
    });

  } catch(err) {
    dateSelect.innerHTML = '<option value="">Erro ao carregar datas</option>';
    output.innerHTML = `<div class="card"><p class="meta">Erro: ${err.message}</p></div>`;
    console.error(err);
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

// Load button handler
loadBtn.addEventListener('click', () => {
  output.innerHTML = ''; // clear
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
    if(info.almoco && info.almoco.length){
      const card = renderMealCard('Almoço', '', info.almoco, '🍽️');
      output.appendChild(card);
    } else {
      const c = document.createElement('div'); 
      c.className='card'; 
      c.innerHTML = `<p class="meta">Sem informação de almoço.</p>`; 
      output.appendChild(c);
    }
  }

  if(meal === 'janta' || meal === 'ambas'){
    if(info.janta && info.janta.length){
      const card = renderMealCard('Janta', '', info.janta, '🌙');
      output.appendChild(card);
    } else {
      const c = document.createElement('div'); 
      c.className='card'; 
      c.innerHTML = `<p class="meta">Sem informação de janta.</p>`; 
      output.appendChild(c);
    }
  }

  setTimeout(() => {
    output.firstElementChild?.scrollIntoView({behavior:'smooth',block:'start'});
  }, 50);
});

// initialize on load
document.addEventListener('DOMContentLoaded', init);
