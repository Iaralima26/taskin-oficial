// ---------- Navegação entre telas + helpers ----------
document.addEventListener('click', e => {
  const t = e.target.closest('[data-target]');
  if (t) {
    e.preventDefault();
    const target = t.dataset.target;
    showScreen(target);
    highlightTab(target);
  }
});

// Mostra tela por id
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  if (el) el.scrollTop = 0;

  // limpa dados de profissional ao abrir perfil
  if (id === 'tela-perfil') clearProData();
}

function highlightTab(id) {
  document.querySelectorAll('.bottom-bar .tab').forEach(b => b.classList.remove('active'));
  const tab = Array.from(document.querySelectorAll('.bottom-bar .tab')).find(x => x.dataset.target === id);
  if (tab) tab.classList.add('active');
}

// inicial
showScreen('tela-login');

// ---------- Dados simulados ----------
const CATEGORIES = [
  { id: 'c1', name: 'Reformas', img: 'assets/images/tela04.png' },
  { id: 'c2', name: 'Limpeza', img: 'assets/images/tela05.png' },
  { id: 'c3', name: 'Beleza', img: 'assets/images/tela06.png' },
  { id: 'c4', name: 'Serviços', img: 'assets/images/tela07.png' }
];

const PROFESSIONALS = [
  { id: 'p1', name: 'Thiago Almeida', desc: 'Eletricista com 10 anos de experiência', avatar: 'assets/images/tela03.png', cidade: 'Tianguá' },
  { id: 'p2', name: 'João Souza', desc: 'Encanador experiente', avatar: 'assets/images/tela08.png', cidade: 'Ubajara' }
];

// ---------- Elementos ----------
const catRow = document.getElementById('cat-row');
const proList = document.getElementById('pro-list');
const categoriesGrid = document.getElementById('categories-grid');

// ---------- Renderização ----------
function renderCategories() {
  catRow.innerHTML = '';
  categoriesGrid.innerHTML = '';
  CATEGORIES.forEach(c => {
    const cc = document.createElement('div');
    cc.className = 'cat-card';
    cc.innerHTML = `<img src="${c.img}" alt="${c.name}"><h4>${c.name}</h4>`;
    cc.addEventListener('click', () => showScreen('tela-categorias'));
    catRow.appendChild(cc);

    const li = document.createElement('div');
    li.className = 'card';
    li.innerHTML = `<img src="${c.img}" style="width:100%;height:110px;object-fit:cover;border-radius:10px"><h4>${c.name}</h4>`;
    categoriesGrid.appendChild(li);
  });
}

function renderProfessionals(cidade = '', query = '') {
  proList.innerHTML = '';
  let list = PROFESSIONALS;

  if (cidade) list = list.filter(p => p.cidade === cidade);
  if (query) list = list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  list.forEach(p => {
    const div = document.createElement('div');
    div.className = 'pro-item';
    div.innerHTML = `
      <img src="${p.avatar}" class="avatar" alt="${p.name}">
      <div class="info">
        <strong>${p.name}</strong>
        <p class="muted">${p.desc}</p>
        <p class="muted small">📍 ${p.cidade}</p>
      </div>
      <div style="margin-left:auto">
        <button class="btn btn-outline btn-view-pro" data-id="${p.id}">
          <span class="material-icons">visibility</span> Ver
        </button>
      </div>`;
    proList.appendChild(div);
  });
}

renderCategories();
renderProfessionals();

// ---------- Ação ao clicar em "Reformas" dentro da tela de Categorias ----------
document.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card) return;

  const nomeCategoria = card.querySelector('h4')?.innerText || '';

  if (nomeCategoria === 'Reformas') {
    const profissional = PROFESSIONALS.find(p => p.name === 'Thiago Almeida');
    if (profissional) openProfessional(profissional.id);
  }
});

// ---------- Abrir profissional ----------
document.addEventListener('click', e => {
  if (e.target.closest('.btn-view-pro')) {
    const id = e.target.closest('.btn-view-pro').dataset.id;
    openProfessional(id);
  }
});

function openProfessional(id) {
  const p = PROFESSIONALS.find(x => x.id === id);
  if (!p) return;
  document.getElementById('pro-avatar').src = p.avatar;
  document.getElementById('pro-name').innerText = p.name;
  document.getElementById('pro-desc').innerText = p.desc;
  document.getElementById('pro-location-text').innerText = "📍 " + p.cidade + " - CE";
  sessionStorage.setItem('currentPro', id);
  showScreen('tela-profissional');
}

function clearProData() {
  document.getElementById('pro-avatar').src = "assets/images/tela03.png";
  document.getElementById('pro-name').innerText = "Nome do Profissional";
  document.getElementById('pro-desc').innerText = "Categoria";
}

// ---------- Login e Cadastro ----------
const elLoginEmail = document.getElementById('login-email');
const elLoginPass = document.getElementById('login-password');
const elCadName = document.getElementById('cad-name');
const elCadEmail = document.getElementById('cad-email');
const elCadPass = document.getElementById('cad-password');

function validEmail(e) { return /\S+@\S+\.\S+/.test(e); }

document.getElementById('btn-login').addEventListener('click', () => {
  const email = elLoginEmail.value.trim();
  const pass = elLoginPass.value.trim();
  if (!email || !validEmail(email)) { alert('Informe um e-mail válido'); elLoginEmail.focus(); return; }
  if (!pass) { alert('Informe sua senha'); elLoginPass.focus(); return; }

  localStorage.setItem('userEmail', email);
  localStorage.setItem('userName', localStorage.getItem('userName') || 'Usuário');
  document.getElementById('profile-email').value = email;
  document.getElementById('profile-name').value = localStorage.getItem('userName') || '';
  showScreen('tela-principal');
});

document.getElementById('btn-cad').addEventListener('click', () => {
  const name = elCadName.value.trim();
  const email = elCadEmail.value.trim();
  const pass = elCadPass.value.trim();
  if (!name) { alert('Preencha seu nome'); return; }
  if (!email || !validEmail(email)) { alert('E-mail inválido'); return; }
  if (pass.length < 6) { alert('Senha deve ter no mínimo 6 caracteres'); return; }

  localStorage.setItem('userEmail', email);
  localStorage.setItem('userName', name);
  document.getElementById('profile-email').value = email;
  document.getElementById('profile-name').value = name;
  showScreen('tela-principal');
});

// ---------- Toggle senha ----------
document.getElementById('toggle-login-pass').addEventListener('click', () => {
  togglePasswordField(elLoginPass, document.getElementById('toggle-login-pass'));
});
document.getElementById('toggle-cad-pass').addEventListener('click', () => {
  togglePasswordField(elCadPass, document.getElementById('toggle-cad-pass'));
});
function togglePasswordField(input, btn) {
  if (input.type === 'password') { input.type = 'text'; btn.querySelector('.material-icons').innerText = 'visibility_off'; }
  else { input.type = 'password'; btn.querySelector('.material-icons').innerText = 'visibility'; }
}

// ---------- Salvar perfil ----------
document.getElementById('save-profile').addEventListener('click', () => {
  localStorage.setItem('userName', document.getElementById('profile-name').value);
  localStorage.setItem('userPhone', document.getElementById('profile-phone').value);
  alert('Perfil salvo');
});

// ---------- Pagamento ----------
document.getElementById('payment-form').addEventListener('submit', e => {
  e.preventDefault();
  alert('Pagamento simulado efetuado');
  showScreen('tela-principal');
});

// ---------- Contratar / Contatar ----------
document.getElementById('btn-contact').addEventListener('click', () => showScreen('tela-contato'));
document.getElementById('btn-hire').addEventListener('click', () => {
  const current = sessionStorage.getItem('currentPro') || PROFESSIONALS[0].id;
  const hires = JSON.parse(localStorage.getItem('hires') || '[]');
  hires.push({ proId: current, when: Date.now(), client: localStorage.getItem('userEmail') || 'anon' });
  localStorage.setItem('hires', JSON.stringify(hires));
  alert('Profissional contratado (simulado)');
});

// ---------- Enviar proposta ----------
document.getElementById('send-hire').addEventListener('click', () => {
  const txt = document.getElementById('hire-message').value.trim();
  if (!txt) { alert('Escreva uma mensagem'); return; }
  const proId = sessionStorage.getItem('currentPro') || PROFESSIONALS[0].id;
  const chats = JSON.parse(localStorage.getItem('chats') || '{}');
  if (!chats[proId]) chats[proId] = [];
  chats[proId].push({ from: 'cliente', text: txt, at: Date.now() });
  localStorage.setItem('chats', JSON.stringify(chats));
  document.getElementById('hire-message').value = '';
  showScreen('tela-chat');
  populateChat();
  setTimeout(() => simulateProReply(proId), 900);
});

// ---------- Chat ----------
const chatMessages = document.getElementById('chat-messages');
const chatText = document.getElementById('chat-text');
const chatSend = document.getElementById('chat-send');

chatSend.addEventListener('click', sendChatMessage);
chatText.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });

function sendChatMessage() {
  const txt = chatText.value.trim();
  if (!txt) return;
  const proId = sessionStorage.getItem('currentPro') || PROFESSIONALS[0].id;
  const chats = JSON.parse(localStorage.getItem('chats') || '{}');
  if (!chats[proId]) chats[proId] = [];
  chats[proId].push({ from: 'cliente', text: txt, at: Date.now() });
  localStorage.setItem('chats', JSON.stringify(chats));
  chatText.value = '';
  populateChat();
  setTimeout(() => simulateProReply(proId), 900 + Math.random() * 700);
}

function populateChat() {
  const proId = sessionStorage.getItem('currentPro') || PROFESSIONALS[0].id;
  const chats = JSON.parse(localStorage.getItem('chats') || '{}');
  const msgs = chats[proId] || [];
  chatMessages.innerHTML = '';
  msgs.forEach(m => {
    const li = document.createElement('li');
    li.className = m.from === 'cliente' ? 'me' : 'them';
    const txt = document.createElement('div');
    txt.innerText = m.text;
    li.appendChild(txt);
    chatMessages.appendChild(li);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

const PRO_AUTO_REPLIES = [
  "Obrigado! Recebi sua mensagem, vou verificar e retorno em instantes.",
  "Posso atender amanhã de manhã, tudo bem?",
  "O serviço custa R$150,00 com garantia de 30 dias.",
  "Certo! Já agendei e entrarei em contato."
];

function simulateProReply(proId) {
  if (Math.random() < 0.8) {
    const reply = PRO_AUTO_REPLIES[Math.floor(Math.random() * PRO_AUTO_REPLIES.length)];
    const chats = JSON.parse(localStorage.getItem('chats') || '{}');
    if (!chats[proId]) chats[proId] = [];
    chats[proId].push({ from: 'pro', text: reply, at: Date.now() });
    localStorage.setItem('chats', JSON.stringify(chats));
    if (document.querySelector('#tela-chat').classList.contains('active')) populateChat();
  }
}

// ---------- Filtro por região ----------
document.getElementById('filter-location')?.addEventListener('change', e => {
  const cidade = e.target.value;
  renderProfessionals(cidade);
});

// ---------- Ao carregar ----------
window.addEventListener('load', () => {
  const email = localStorage.getItem('userEmail');
  if (email) document.getElementById('profile-email').value = email;
  const name = localStorage.getItem('userName');
  if (name) document.getElementById('profile-name').value = name;
  populateChat();
});