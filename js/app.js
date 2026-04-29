// ============================================================
// 家計簿アプリ - メインロジック
// ============================================================

// カテゴリ定義
const EXPENSE_CATEGORIES = [
  { id: 'food', name: '食費', icon: '🍙' },
  { id: 'daily', name: '日用品', icon: '🧴' },
  { id: 'transport', name: '交通費', icon: '🚃' },
  { id: 'utility', name: '光熱費', icon: '💡' },
  { id: 'telecom', name: '通信費', icon: '📱' },
  { id: 'medical', name: '医療費', icon: '🏥' },
  { id: 'clothing', name: '衣服', icon: '👕' },
  { id: 'beauty', name: '美容', icon: '💇' },
  { id: 'hobby', name: '趣味', icon: '🎮' },
  { id: 'education', name: '教育', icon: '📚' },
  { id: 'social', name: '交際費', icon: '🍻' },
  { id: 'housing', name: '住居費', icon: '🏠' },
  { id: 'insurance', name: '保険', icon: '🛡️' },
  { id: 'tax', name: '税金', icon: '🏛️' },
  { id: 'eating_out', name: '外食', icon: '🍽️' },
  { id: 'child_food', name: '子ども食費', icon: '🍼' },
  { id: 'child_clothes', name: '子ども服', icon: '🧒' },
  { id: 'child_goods', name: 'おむつ等', icon: '🧷' },
  { id: 'other', name: 'その他', icon: '📦' },
];

const INCOME_CATEGORIES = [
  { id: 'salary', name: '給与', icon: '💰' },
  { id: 'bonus', name: '賞与', icon: '🎉' },
  { id: 'sidejob', name: '副業', icon: '💻' },
  { id: 'investment', name: '投資', icon: '📈' },
  { id: 'other_income', name: 'その他', icon: '💵' },
];

const CATEGORY_COLORS = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c',
  '#3498db', '#9b59b6', '#e84393', '#fd79a8', '#00cec9',
  '#6c5ce7', '#fdcb6e', '#a29bfe', '#fab1a0', '#55efc4', '#b2bec3',
];

// ---- 状態 ----
let entries = [];
let currentMonth = new Date();
let currentType = 'expense';
let selectedCategory = '';
let selectedPayment = 'cash';
let categoryChart = null;
let paymentChart = null;
let shopChart = null;
let dailyChart = null;
let monthlyChart = null;

// ---- 初期化 ----
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderCategoryGrid();
  setDefaultDate();
  updateView();
});

// ---- データ管理 (localStorage) ----
function loadData() {
  const saved = localStorage.getItem('kakeibo_entries');
  entries = saved ? JSON.parse(saved) : [];
}

function saveData() {
  localStorage.setItem('kakeibo_entries', JSON.stringify(entries));
}

// ---- ページ切替 ----
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  if (page === 'chart') renderCharts();
  if (page === 'history') renderHistory();
  if (page === 'home') renderRecent();
}

// ---- 月切替 ----
function changeMonth(delta) {
  currentMonth.setMonth(currentMonth.getMonth() + delta);
  updateView();
}

function updateView() {
  const y = currentMonth.getFullYear();
  const m = currentMonth.getMonth() + 1;
  document.getElementById('month-label').textContent = `${y}年${m}月`;
  updateSummary();
  renderRecent();
}

// ---- サマリー更新 ----
function updateSummary() {
  const monthly = getMonthlyEntries();
  const income = monthly.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const expense = monthly.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  document.getElementById('sum-income').textContent = formatMoney(income);
  document.getElementById('sum-expense').textContent = formatMoney(expense);
  document.getElementById('sum-balance').textContent = formatMoney(income - expense);
}

function getMonthlyEntries() {
  const y = currentMonth.getFullYear();
  const m = currentMonth.getMonth();
  return entries.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === y && d.getMonth() === m;
  });
}

function formatMoney(n) {
  const prefix = n < 0 ? '-' : '';
  return prefix + '¥' + Math.abs(n).toLocaleString();
}

// ---- カテゴリグリッド ----
function renderCategoryGrid() {
  const grid = document.getElementById('cat-grid');
  grid.innerHTML = EXPENSE_CATEGORIES.map(c =>
    `<button class="cat-btn" data-id="${c.id}" onclick="selectCategory('${c.id}')">
      <span class="icon">${c.icon}</span>${c.name}
    </button>`
  ).join('');

  const incGrid = document.getElementById('income-cat-grid');
  incGrid.innerHTML = INCOME_CATEGORIES.map(c =>
    `<button class="cat-btn" data-id="${c.id}" onclick="selectCategory('${c.id}')">
      <span class="icon">${c.icon}</span>${c.name}
    </button>`
  ).join('');
}

function selectCategory(id) {
  selectedCategory = id;
  document.querySelectorAll('.cat-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.id === id);
  });
}

// ---- モーダル ----
function openModal() {
  editingId = null;
  document.getElementById('add-modal').classList.add('active');
  switchType('expense');
  setDefaultDate();
  document.getElementById('input-amount').value = '';
  document.getElementById('input-memo').value = '';
  document.getElementById('input-shop').value = '';
  selectedCategory = '';
  selectPayment('cash');
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  clearReceiptPreview();
  renderShopHistory();
  document.getElementById('modal-title').textContent = '記録を追加';
  document.getElementById('save-btn').textContent = '支出を記録';
}

function closeModal() {
  document.getElementById('add-modal').classList.remove('active');
}

function switchType(type) {
  currentType = type;
  const expTab = document.getElementById('tab-expense');
  const incTab = document.getElementById('tab-income');
  const saveBtn = document.getElementById('save-btn');

  expTab.className = 'type-tab' + (type === 'expense' ? ' active-expense' : '');
  incTab.className = 'type-tab' + (type === 'income' ? ' active-income' : '');

  document.getElementById('expense-categories').style.display = type === 'expense' ? 'block' : 'none';
  document.getElementById('income-categories').style.display = type === 'income' ? 'block' : 'none';
  document.getElementById('receipt-section').style.display = type === 'expense' ? 'block' : 'none';
  document.getElementById('payment-section').style.display = type === 'expense' ? 'block' : 'none';
  document.getElementById('shop-section').style.display = type === 'expense' ? 'block' : 'none';

  saveBtn.className = 'btn ' + (type === 'expense' ? 'btn-expense' : 'btn-income');
  saveBtn.textContent = type === 'expense' ? '支出を記録' : '収入を記録';

  selectedCategory = '';
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
}

function setDefaultDate() {
  document.getElementById('input-date').value = new Date().toISOString().split('T')[0];
}

// ---- 支払方法 ----
function selectPayment(method) {
  selectedPayment = method;
  document.getElementById('pay-cash').className = 'type-tab' + (method === 'cash' ? ' active-expense' : '');
  document.getElementById('pay-credit').className = 'type-tab' + (method === 'credit' ? ' active-expense' : '');
}

// ---- 購入場所 ----
function getShopHistory() {
  const shops = {};
  entries.forEach(e => {
    if (e.shop && e.shop.trim()) shops[e.shop.trim()] = (shops[e.shop.trim()] || 0) + 1;
  });
  return Object.entries(shops).sort((a, b) => b[1] - a[1]).map(s => s[0]);
}

function renderShopHistory() {
  const shops = getShopHistory().slice(0, 12);
  const container = document.getElementById('shop-history');
  const datalist = document.getElementById('shop-list');

  datalist.innerHTML = shops.map(s => `<option value="${s}">`).join('');

  if (shops.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = shops.map(s =>
    `<span class="shop-tag" onclick="pickShop(this, '${s.replace(/'/g, "\\'")}')">${s}</span>`
  ).join('');
}

function pickShop(el, name) {
  document.getElementById('input-shop').value = name;
  document.querySelectorAll('.shop-tag').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// ---- 保存 ----
function saveEntry() {
  const amount = parseInt(document.getElementById('input-amount').value);
  if (!amount || amount <= 0) { alert('金額を入力してください'); return; }
  if (!selectedCategory) { alert('カテゴリを選択してください'); return; }

  if (editingId) {
    // 既存エントリを更新
    const idx = entries.findIndex(e => e.id === editingId);
    if (idx !== -1) {
      entries[idx].type = currentType;
      entries[idx].amount = amount;
      entries[idx].category = selectedCategory;
      entries[idx].payment = currentType === 'expense' ? selectedPayment : null;
      entries[idx].shop = currentType === 'expense' ? document.getElementById('input-shop').value.trim() : '';
      entries[idx].date = document.getElementById('input-date').value;
      entries[idx].memo = document.getElementById('input-memo').value;
    }
    editingId = null;
  } else {
    // 新規エントリ
    const entry = {
      id: Date.now(),
      type: currentType,
      amount: amount,
      category: selectedCategory,
      payment: currentType === 'expense' ? selectedPayment : null,
      shop: currentType === 'expense' ? document.getElementById('input-shop').value.trim() : '',
      date: document.getElementById('input-date').value,
      memo: document.getElementById('input-memo').value,
      created: new Date().toISOString(),
    };
    entries.push(entry);
  }
  saveData();
  closeModal();
  updateView();
  autoSync();

  // 5件ごとにバックアップを促す
  const count = entries.length;
  if (count > 0 && count % 5 === 0) {
    if (confirm(`${count}件の記録があります。\nExcelにバックアップしますか？`)) {
      exportCSV();
    }
  }
}

// ---- 編集 ----
let editingId = null;

function editEntry(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;

  editingId = id;
  document.getElementById('add-modal').classList.add('active');
  switchType(entry.type);

  document.getElementById('input-amount').value = entry.amount;
  document.getElementById('input-date').value = entry.date;
  document.getElementById('input-memo').value = entry.memo || '';

  if (entry.type === 'expense') {
    document.getElementById('input-shop').value = entry.shop || '';
    selectPayment(entry.payment || 'cash');
    renderShopHistory();
  }

  selectCategory(entry.category);

  document.getElementById('modal-title').textContent = '記録を編集';
  document.getElementById('save-btn').textContent = '更新する';
}

// ---- 削除 ----
function deleteEntry(id) {
  if (!confirm('この記録を削除しますか？')) return;
  entries = entries.filter(e => e.id !== id);
  saveData();
  updateView();
  renderHistory();
  autoSync();
}

// ---- 最近の記録 ----
function renderRecent() {
  const monthly = getMonthlyEntries();
  monthly.sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id);
  const recent = monthly.slice(0, 15);
  const list = document.getElementById('recent-list');

  if (recent.length === 0) {
    list.innerHTML = '<li class="empty-state"><div class="icon">📝</div><p>この月の記録はありません</p></li>';
    return;
  }

  list.innerHTML = recent.map(e => renderTxItem(e)).join('');
}

// ---- 履歴 ----
function renderHistory() {
  const monthly = getMonthlyEntries();
  monthly.sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id);
  const list = document.getElementById('history-list');

  if (monthly.length === 0) {
    list.innerHTML = '<li class="empty-state"><div class="icon">📋</div><p>この月の記録はありません</p></li>';
    return;
  }

  let html = '';
  let lastDate = '';
  monthly.forEach(e => {
    if (e.date !== lastDate) {
      const d = new Date(e.date);
      const weekday = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
      html += `<li class="date-header">${e.date.replace(/-/g, '/')} (${weekday})</li>`;
      lastDate = e.date;
    }
    html += renderTxItem(e);
  });

  list.innerHTML = html;
}

function renderTxItem(e) {
  const cats = e.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const cat = cats.find(c => c.id === e.category) || { icon: '?', name: e.category };
  const sign = e.type === 'expense' ? '-' : '+';

  const payIcon = e.payment === 'credit' ? '💳' : (e.payment === 'cash' ? '💴' : '');
  const shopText = e.shop ? `@ ${e.shop}` : '';
  const subText = [payIcon, shopText, e.memo].filter(Boolean).join(' ');

  return `
    <li class="tx-item">
      <div class="tx-icon">${cat.icon}</div>
      <div class="tx-info">
        <div class="tx-cat">${cat.name}</div>
        <div class="tx-memo">${subText}</div>
      </div>
      <div>
        <div class="tx-amount ${e.type}">${sign}¥${e.amount.toLocaleString()}</div>
        <div class="tx-date">${e.date.slice(5).replace('-', '/')}</div>
      </div>
      <button class="tx-delete" onclick="editEntry(${e.id})" style="color:var(--accent)">✏️</button>
      <button class="tx-delete" onclick="deleteEntry(${e.id})">×</button>
    </li>
  `;
}

// ---- グラフ ----
function renderCharts() {
  renderCategoryChart();
  renderPaymentChart();
  renderShopChart();
  renderDailyChart();
  renderMonthlyChart();
  document.getElementById('category-detail').innerHTML = '';
}

function renderCategoryChart() {
  const monthly = getMonthlyEntries().filter(e => e.type === 'expense');
  const catTotals = {};
  monthly.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });

  const labels = [];
  const data = [];
  const colors = [];

  EXPENSE_CATEGORIES.forEach((c, i) => {
    if (catTotals[c.id]) {
      labels.push(c.name);
      data.push(catTotals[c.id]);
      colors.push(CATEGORY_COLORS[i % CATEGORY_COLORS.length]);
    }
  });

  const ctx = document.getElementById('category-chart');
  if (categoryChart) categoryChart.destroy();

  if (data.length === 0) {
    ctx.style.display = 'none';
    return;
  }
  ctx.style.display = 'block';

  // カテゴリIDを保持（クリック用）
  const catIds = [];
  EXPENSE_CATEGORIES.forEach(c => {
    if (catTotals[c.id]) catIds.push(c.id);
  });

  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff',
      }],
    },
    options: {
      responsive: true,
      onClick: (e, elements) => {
        if (elements.length > 0) {
          const idx = elements[0].index;
          showCategoryDetail(catIds[idx], monthly);
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 11 } },
          onClick: (e, item, legend) => {
            const idx = item.index;
            showCategoryDetail(catIds[idx], monthly);
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ¥${ctx.parsed.toLocaleString()}`
          }
        }
      },
    },
  });
}

// ---- カテゴリ詳細表示 ----
function showCategoryDetail(catId, monthlyEntries) {
  const cat = EXPENSE_CATEGORIES.find(c => c.id === catId);
  if (!cat) return;

  const items = monthlyEntries.filter(e => e.category === catId);
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = items.reduce((s, e) => s + e.amount, 0);

  const container = document.getElementById('category-detail');
  container.innerHTML = `
    <div class="cat-detail">
      <div class="cat-detail-header">
        <span>${cat.icon} ${cat.name}の内訳</span>
        <span style="color:var(--expense)">合計 ¥${total.toLocaleString()}</span>
      </div>
      ${items.length === 0 ? '<p style="color:var(--text-sub);font-size:0.85rem">データなし</p>' :
        items.map(e => {
          const payIcon = e.payment === 'credit' ? '💳' : '💴';
          const shopText = e.shop ? `@ ${e.shop}` : '';
          return `
            <div class="cat-detail-item">
              <div class="detail-left">
                <span>${e.date.slice(5).replace('-', '/')} ${payIcon} ${shopText}</span>
                <span class="detail-memo">${e.memo || ''}</span>
              </div>
              <span class="detail-amount">¥${e.amount.toLocaleString()}</span>
            </div>
          `;
        }).join('')
      }
    </div>
  `;

  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---- 支払方法別グラフ ----
function renderPaymentChart() {
  const monthly = getMonthlyEntries().filter(e => e.type === 'expense');
  const cashTotal = monthly.filter(e => e.payment !== 'credit').reduce((s, e) => s + e.amount, 0);
  const creditTotal = monthly.filter(e => e.payment === 'credit').reduce((s, e) => s + e.amount, 0);

  // サマリー更新
  document.querySelector('#payment-summary-cash div:last-child').textContent = '¥' + cashTotal.toLocaleString();
  document.querySelector('#payment-summary-credit div:last-child').textContent = '¥' + creditTotal.toLocaleString();

  const ctx = document.getElementById('payment-chart');
  if (paymentChart) paymentChart.destroy();

  if (cashTotal === 0 && creditTotal === 0) {
    ctx.style.display = 'none';
    return;
  }
  ctx.style.display = 'block';

  paymentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['現金', 'クレジット'],
      datasets: [{
        data: [cashTotal, creditTotal],
        backgroundColor: ['#fdcb6e', '#6c5ce7'],
        borderWidth: 2,
        borderColor: '#fff',
      }],
    },
    options: {
      responsive: true,
      onClick: (e, elements) => {
        if (elements.length > 0) {
          const idx = elements[0].index;
          showPaymentDetail(idx === 0 ? 'cash' : 'credit');
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 11 } },
          onClick: (e, item) => {
            showPaymentDetail(item.index === 0 ? 'cash' : 'credit');
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const total = cashTotal + creditTotal;
              const pct = total > 0 ? Math.round(ctx.parsed / total * 100) : 0;
              return `${ctx.label}: ¥${ctx.parsed.toLocaleString()} (${pct}%)`;
            }
          }
        }
      },
    },
  });
}

// ---- 支払方法別詳細 ----
function showPaymentDetail(method) {
  const monthly = getMonthlyEntries().filter(e => e.type === 'expense');
  const items = method === 'credit'
    ? monthly.filter(e => e.payment === 'credit')
    : monthly.filter(e => e.payment !== 'credit');
  items.sort((a, b) => new Date(b.date) - new Date(a.date));
  const total = items.reduce((s, e) => s + e.amount, 0);
  const label = method === 'credit' ? '💳 クレジット' : '💴 現金';

  const container = document.getElementById('payment-detail');
  container.innerHTML = `
    <div class="cat-detail">
      <div class="cat-detail-header">
        <span>${label}の内訳</span>
        <span style="color:var(--expense)">合計 ¥${total.toLocaleString()}</span>
      </div>
      ${items.length === 0 ? '<p style="color:var(--text-sub);font-size:0.85rem">データなし</p>' :
        items.map(e => {
          const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category);
          return `
            <div class="cat-detail-item">
              <div class="detail-left">
                <span>${e.date.slice(5).replace('-','/')} ${cat ? cat.icon+cat.name : ''} ${e.shop ? '@ '+e.shop : ''}</span>
                <span class="detail-memo">${e.memo || ''}</span>
              </div>
              <span class="detail-amount">¥${e.amount.toLocaleString()}</span>
            </div>
          `;
        }).join('')
      }
    </div>
  `;
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---- 購入場所別グラフ ----
function renderShopChart() {
  const monthly = getMonthlyEntries().filter(e => e.type === 'expense' && e.shop);
  const shopTotals = {};
  monthly.forEach(e => {
    shopTotals[e.shop] = (shopTotals[e.shop] || 0) + e.amount;
  });

  // 金額順でソート、上位10件
  const sorted = Object.entries(shopTotals).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 10);

  const labels = top.map(s => s[0]);
  const data = top.map(s => s[1]);
  const shopColors = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#e67e22', '#e84393', '#00cec9', '#6c5ce7',
  ];

  const ctx = document.getElementById('shop-chart');
  if (shopChart) shopChart.destroy();

  if (data.length === 0) {
    ctx.style.display = 'none';
    document.getElementById('shop-detail').innerHTML = '<p style="color:var(--text-sub);font-size:0.85rem;text-align:center;padding:8px">購入場所の記録がありません</p>';
    return;
  }
  ctx.style.display = 'block';

  shopChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: shopColors,
        borderRadius: 6,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      onClick: (e, elements) => {
        if (elements.length > 0) {
          const idx = elements[0].index;
          showShopDetail(labels[idx]);
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `¥${ctx.parsed.x.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          ticks: { callback: (v) => v >= 1000 ? (v / 1000) + 'k' : v }
        },
        y: {
          ticks: { font: { size: 11 } }
        }
      },
    },
  });
}

function showShopDetail(shopName) {
  const monthly = getMonthlyEntries().filter(e => e.type === 'expense' && e.shop === shopName);
  monthly.sort((a, b) => new Date(b.date) - new Date(a.date));
  const total = monthly.reduce((s, e) => s + e.amount, 0);

  const container = document.getElementById('shop-detail');
  container.innerHTML = `
    <div class="cat-detail">
      <div class="cat-detail-header">
        <span>📍 ${shopName}</span>
        <span style="color:var(--expense)">合計 ¥${total.toLocaleString()}</span>
      </div>
      ${monthly.map(e => {
        const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category);
        const payIcon = e.payment === 'credit' ? '💳' : '💴';
        return `
          <div class="cat-detail-item">
            <div class="detail-left">
              <span>${e.date.slice(5).replace('-', '/')} ${payIcon} ${cat ? cat.icon + cat.name : ''}</span>
              <span class="detail-memo">${e.memo || ''}</span>
            </div>
            <span class="detail-amount">¥${e.amount.toLocaleString()}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---- 日別支出グラフ ----
function renderDailyChart() {
  const monthly = getMonthlyEntries().filter(e => e.type === 'expense');
  const y = currentMonth.getFullYear();
  const m = currentMonth.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const labels = [];
  for (let i = 1; i <= daysInMonth; i++) labels.push(i + '日');

  // カテゴリ別の日別データを作成（積み上げ用）
  const usedCats = [...new Set(monthly.map(e => e.category))];
  const datasets = usedCats.map((catId, ci) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === catId);
    const data = new Array(daysInMonth).fill(0);
    monthly.filter(e => e.category === catId).forEach(e => {
      const day = new Date(e.date).getDate();
      if (day >= 1 && day <= daysInMonth) data[day - 1] += e.amount;
    });
    return {
      label: cat ? cat.name : catId,
      data: data,
      backgroundColor: CATEGORY_COLORS[EXPENSE_CATEGORIES.findIndex(c => c.id === catId) % CATEGORY_COLORS.length],
      borderRadius: 2,
    };
  });

  const ctx = document.getElementById('daily-chart');
  if (dailyChart) dailyChart.destroy();

  dailyChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      onClick: (e, elements) => {
        if (elements.length > 0) {
          showDailyDetail(elements[0].index + 1, y, m);
        }
      },
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 9 }, boxWidth: 12 } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ¥${ctx.parsed.y.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { font: { size: 9 }, maxRotation: 0, callback: (val, i) => (i + 1) % 5 === 1 ? labels[i] : '' }
        },
        y: {
          stacked: true,
          ticks: { callback: (v) => v >= 1000 ? (v / 1000) + 'k' : v }
        }
      },
    },
  });
}

// ---- 日別詳細（カテゴリ別→個別取引の2段階） ----
function showDailyDetail(day, year, month) {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const items = entries.filter(e => e.date === dateStr && e.type === 'expense');
  const total = items.reduce((s, e) => s + e.amount, 0);

  const d = new Date(dateStr);
  const weekday = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];

  // カテゴリ別集計
  const catTotals = {};
  items.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });

  const container = document.getElementById('daily-detail');
  if (items.length === 0) {
    container.innerHTML = `
      <div class="cat-detail">
        <div class="cat-detail-header"><span>${month + 1}/${day} (${weekday})</span></div>
        <p style="color:var(--text-sub);font-size:0.85rem">この日の支出はありません</p>
      </div>`;
    return;
  }

  const catRows = EXPENSE_CATEGORIES
    .filter(c => catTotals[c.id])
    .sort((a, b) => (catTotals[b.id] || 0) - (catTotals[a.id] || 0))
    .map(c => {
      const catItems = items.filter(e => e.category === c.id);
      return `
        <div class="cat-detail-item" style="cursor:pointer" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
          <div class="detail-left"><span>${c.icon} ${c.name} (${catItems.length}件)</span></div>
          <span class="detail-amount">¥${catTotals[c.id].toLocaleString()} ▼</span>
        </div>
        <div style="display:none;padding-left:16px;border-left:3px solid var(--border);margin-left:8px;margin-bottom:4px">
          ${catItems.map(e => {
            const payIcon = e.payment === 'credit' ? '💳' : '💴';
            return `
              <div class="cat-detail-item">
                <div class="detail-left">
                  <span>${payIcon} ${e.shop ? '@ '+e.shop : ''}</span>
                  <span class="detail-memo">${e.memo || ''}</span>
                </div>
                <span class="detail-amount">¥${e.amount.toLocaleString()}</span>
              </div>`;
          }).join('')}
        </div>`;
    }).join('');

  container.innerHTML = `
    <div class="cat-detail">
      <div class="cat-detail-header">
        <span>${month + 1}/${day} (${weekday})</span>
        <span style="color:var(--expense)">合計 ¥${total.toLocaleString()}</span>
      </div>
      ${catRows}
    </div>`;
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderMonthlyChart() {
  const labels = [];
  const monthInfos = [];

  // 月ごとのデータ収集
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - i);
    labels.push(`${d.getMonth() + 1}月`);
    monthInfos.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  // カテゴリ別積み上げデータ作成
  const allExpenses = entries.filter(e => e.type === 'expense');
  const usedCats = [...new Set(allExpenses.map(e => e.category))];

  const expenseDatasets = usedCats.map(catId => {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === catId);
    const data = monthInfos.map(info => {
      return allExpenses
        .filter(e => e.category === catId && new Date(e.date).getFullYear() === info.year && new Date(e.date).getMonth() === info.month)
        .reduce((s, e) => s + e.amount, 0);
    });
    return {
      label: cat ? cat.name : catId,
      data,
      backgroundColor: CATEGORY_COLORS[EXPENSE_CATEGORIES.findIndex(c => c.id === catId) % CATEGORY_COLORS.length],
      stack: 'expense',
    };
  });

  // 収入は単色1本
  const incomeData = monthInfos.map(info => {
    return entries
      .filter(e => e.type === 'income' && new Date(e.date).getFullYear() === info.year && new Date(e.date).getMonth() === info.month)
      .reduce((s, e) => s + e.amount, 0);
  });

  const datasets = [
    { label: '収入', data: incomeData, backgroundColor: '#00b894', stack: 'income' },
    ...expenseDatasets,
  ];

  const ctx = document.getElementById('monthly-chart');
  if (monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      onClick: (e, elements) => {
        if (elements.length > 0) {
          showMonthlyDetail(monthInfos[elements[0].index]);
        }
      },
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 9 }, boxWidth: 12 } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ¥${ctx.parsed.y.toLocaleString()}`
          }
        }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, ticks: { callback: (v) => '¥' + (v / 1000) + 'k' } }
      },
    },
  });
}

// ---- 月別詳細（カテゴリ別→個別取引の2段階） ----
function showMonthlyDetail(info) {
  const me = entries.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === info.year && d.getMonth() === info.month;
  });

  const expense = me.filter(e => e.type === 'expense');
  const incTotal = me.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const expTotal = expense.reduce((s, e) => s + e.amount, 0);

  // カテゴリ別集計
  const catTotals = {};
  expense.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });

  const catRows = EXPENSE_CATEGORIES
    .filter(c => catTotals[c.id])
    .sort((a, b) => (catTotals[b.id] || 0) - (catTotals[a.id] || 0))
    .map(c => {
      const catItems = expense.filter(e => e.category === c.id).sort((a, b) => new Date(b.date) - new Date(a.date));
      return `
        <div class="cat-detail-item" style="cursor:pointer" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
          <div class="detail-left"><span>${c.icon} ${c.name} (${catItems.length}件)</span></div>
          <span class="detail-amount">¥${catTotals[c.id].toLocaleString()} ▼</span>
        </div>
        <div style="display:none;padding-left:16px;border-left:3px solid var(--border);margin-left:8px;margin-bottom:4px">
          ${catItems.map(e => {
            const payIcon = e.payment === 'credit' ? '💳' : '💴';
            return `
              <div class="cat-detail-item">
                <div class="detail-left">
                  <span>${e.date.slice(5).replace('-','/')} ${payIcon} ${e.shop ? '@ '+e.shop : ''}</span>
                  <span class="detail-memo">${e.memo || ''}</span>
                </div>
                <span class="detail-amount">¥${e.amount.toLocaleString()}</span>
              </div>`;
          }).join('')}
        </div>`;
    }).join('');

  const container = document.getElementById('monthly-detail');
  container.innerHTML = `
    <div class="cat-detail">
      <div class="cat-detail-header"><span>${info.year}年${info.month + 1}月</span></div>
      <div style="display:flex;gap:12px;margin-bottom:8px">
        <div style="flex:1;text-align:center">
          <div style="font-size:0.75rem;color:var(--text-sub)">収入</div>
          <div style="font-weight:700;color:var(--income)">¥${incTotal.toLocaleString()}</div>
        </div>
        <div style="flex:1;text-align:center">
          <div style="font-size:0.75rem;color:var(--text-sub)">支出</div>
          <div style="font-weight:700;color:var(--expense)">¥${expTotal.toLocaleString()}</div>
        </div>
        <div style="flex:1;text-align:center">
          <div style="font-size:0.75rem;color:var(--text-sub)">収支</div>
          <div style="font-weight:700;color:var(--accent)">¥${(incTotal - expTotal).toLocaleString()}</div>
        </div>
      </div>
      ${catRows || '<p style="color:var(--text-sub);font-size:0.85rem">データなし</p>'}
    </div>
  `;
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---- レシート撮影 & OCR ----
function captureReceipt() {
  document.getElementById('receipt-input').click();
}

function clearReceiptPreview() {
  document.getElementById('receipt-placeholder').style.display = 'block';
  const img = document.querySelector('#receipt-area img');
  if (img) img.remove();
  document.getElementById('ocr-status').innerHTML = '';
}

async function onReceiptCaptured(event) {
  const file = event.target.files[0];
  if (!file) return;

  // プレビュー表示
  const reader = new FileReader();
  reader.onload = async (e) => {
    document.getElementById('receipt-placeholder').style.display = 'none';
    const existing = document.querySelector('#receipt-area img');
    if (existing) existing.remove();

    const img = document.createElement('img');
    img.src = e.target.result;
    document.getElementById('receipt-area').appendChild(img);

    // OCR実行
    await runOCR(e.target.result);
  };
  reader.readAsDataURL(file);
}

async function runOCR(imageDataUrl) {
  const statusEl = document.getElementById('ocr-status');
  statusEl.innerHTML = '<div class="ocr-loading"><div class="spinner"></div><p>レシートを読み取り中...</p></div>';

  try {
    // Tesseract.jsを動的ロード
    if (!window.Tesseract) {
      await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    }

    const result = await Tesseract.recognize(imageDataUrl, 'jpn+eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const pct = Math.round(m.progress * 100);
          statusEl.innerHTML = `<div class="ocr-loading"><div class="spinner"></div><p>読み取り中... ${pct}%</p></div>`;
        }
      }
    });

    const text = result.data.text;
    // 金額を抽出 (¥やカンマ付き数字を検出)
    const amounts = [];
    const patterns = [
      /[¥￥]\s*([\d,]+)/g,
      /合\s*計\s*[¥￥]?\s*([\d,]+)/g,
      /(\d{1,3}(?:,\d{3})+|\d{3,})\s*円/g,
    ];

    patterns.forEach(pat => {
      let match;
      while ((match = pat.exec(text)) !== null) {
        const num = parseInt(match[1].replace(/,/g, ''));
        if (num > 0 && num < 10000000) amounts.push(num);
      }
    });

    // 最大金額を合計と推測
    if (amounts.length > 0) {
      const maxAmount = Math.max(...amounts);
      document.getElementById('input-amount').value = maxAmount;
      statusEl.innerHTML = `
        <div class="ocr-result">
          <p style="font-weight:600;margin-bottom:4px">検出された金額:</p>
          ${amounts.map(a => `<span style="display:inline-block;background:var(--accent-light);padding:2px 8px;border-radius:4px;margin:2px;cursor:pointer" onclick="document.getElementById('input-amount').value=${a}">¥${a.toLocaleString()}</span>`).join('')}
          <p style="margin-top:8px;font-size:0.75rem;color:var(--text-sub)">金額をタップして選択できます</p>
        </div>
      `;
    } else {
      statusEl.innerHTML = `
        <div class="ocr-result">
          <p>金額を自動検出できませんでした。手入力してください。</p>
          <details style="margin-top:8px"><summary style="font-size:0.75rem;color:var(--text-sub)">読み取ったテキスト</summary><pre style="font-size:0.7rem;white-space:pre-wrap;margin-top:4px">${text}</pre></details>
        </div>
      `;
    }
  } catch (err) {
    statusEl.innerHTML = `<div class="ocr-result"><p>読み取りに失敗しました: ${err.message}</p><p>手入力してください。</p></div>`;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ---- データエクスポート/インポート ----
function exportData() {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kakeibo_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error('無効なデータ形式');
      if (confirm(`${imported.length}件のデータをインポートしますか？\n既存データに追加されます。`)) {
        entries = entries.concat(imported);
        saveData();
        updateView();
        alert('インポートが完了しました');
      }
    } catch (err) {
      alert('インポートに失敗しました: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function exportCSV() {
  const headers = '日付,種類,カテゴリ,金額,支払方法,購入場所,メモ\n';
  const rows = entries.map(e => {
    const cats = e.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const cat = cats.find(c => c.id === e.category);
    const pay = e.payment === 'credit' ? 'クレジット' : (e.payment === 'cash' ? '現金' : '');
    return `${e.date},${e.type === 'expense' ? '支出' : '収入'},${cat ? cat.name : e.category},${e.amount},${pay},"${(e.shop || '').replace(/"/g, '""')}","${(e.memo || '').replace(/"/g, '""')}"`;
  }).join('\n');

  const bom = '\uFEFF';
  const blob = new Blob([bom + headers + rows], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kakeibo_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function clearAllData() {
  if (!confirm('全てのデータを削除しますか？\nこの操作は取り消せません。')) return;
  if (!confirm('本当に削除しますか？')) return;
  entries = [];
  saveData();
  updateView();
  alert('全データを削除しました');
}

// ---- クラウド同期 (Google Sheets) ----
function saveGasUrl() {
  const url = document.getElementById('gas-url').value.trim();
  localStorage.setItem('kakeibo_gas_url', url);
  updateCloudStatus('URL保存済み');
}

function loadGasUrl() {
  const url = localStorage.getItem('kakeibo_gas_url') || '';
  document.getElementById('gas-url').value = url;
  return url;
}

function updateCloudStatus(msg, isError) {
  const el = document.getElementById('cloud-status');
  el.innerHTML = `<p style="font-size:0.85rem;color:${isError ? 'var(--expense)' : 'var(--income)'}">${msg}</p>`;
}

// JSONP風にGASからデータ取得（CORS回避）
function gasGet(url, action) {
  return new Promise((resolve, reject) => {
    const cbName = '_gasCallback_' + Date.now();
    const script = document.createElement('script');

    window[cbName] = (data) => {
      delete window[cbName];
      document.head.removeChild(script);
      resolve(data);
    };

    script.src = url + '?action=' + action + '&callback=' + cbName;
    script.onerror = () => {
      delete window[cbName];
      document.head.removeChild(script);
      reject(new Error('スクリプト読み込みに失敗'));
    };
    document.head.appendChild(script);
  });
}

// GASからデータ取得（リダイレクト対応）
function gasRead(url) {
  return new Promise((resolve, reject) => {
    const cbName = '_gasCb_' + Date.now();
    window[cbName] = (data) => {
      delete window[cbName];
      const s = document.getElementById(cbName);
      if (s) s.remove();
      resolve(data);
    };

    const script = document.createElement('script');
    script.id = cbName;
    script.src = url + '?action=read&callback=' + cbName;
    script.onerror = () => {
      delete window[cbName];
      script.remove();
      reject(new Error('読み取り失敗'));
    };
    document.head.appendChild(script);
  });
}

// デバッグ用
function debugData() {
  if (entries.length === 0) {
    alert('データが0件です');
    return;
  }
  const first = entries[0];
  const sample = 'データ数: ' + entries.length + '件\n\n'
    + '--- 1件目のデータ ---\n'
    + 'id: ' + first.id + '\n'
    + 'type: ' + first.type + '\n'
    + 'date: [' + first.date + '] (型: ' + typeof first.date + ')\n'
    + 'amount: ' + first.amount + '\n'
    + 'category: ' + first.category + '\n'
    + 'shop: ' + first.shop + '\n'
    + 'payment: ' + first.payment;
  alert(sample);
}

// スプレッドシートから取得したデータを正規化
function normalizeEntry(e) {
  // 日付の正規化（様々な形式に対応）
  if (e.date) {
    const d = new Date(e.date);
    if (!isNaN(d.getTime())) {
      e.date = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
    }
  }
  // 数値の正規化
  e.id = Number(e.id);
  e.amount = Number(e.amount);
  // 空文字をnullに
  e.payment = e.payment || null;
  e.shop = e.shop || '';
  e.memo = e.memo || '';
  e.type = e.type || 'expense';
  e.category = e.category || 'other';
  return e;
}

async function cloudSync() {
  const url = document.getElementById('gas-url').value.trim();
  if (!url) { alert('Google Apps ScriptのURLを入力してください'); return; }

  updateCloudStatus('同期中...');

  try {
    // 1. クラウドからデータ取得（JSONP方式）
    updateCloudStatus('クラウドからデータ取得中...');
    let readData;
    try {
      readData = await gasRead(url);
    } catch (e) {
      // JSONP失敗時はfetchで試す
      const readResp = await fetch(url + '?action=read');
      const text = await readResp.text();
      readData = JSON.parse(text);
    }

    if (readData.error) throw new Error(readData.error);

    // 2. クラウドのデータでローカルを完全に上書き
    const cloudEntries = (readData.entries || []).map(normalizeEntry);
    entries = cloudEntries;

    // 3. ローカル保存 & 全画面更新
    saveData();
    updateView();
    renderHistory();
    renderCharts();
    renderRecent();

    const msg = `同期完了！ (${entries.length}件)`;
    updateCloudStatus(msg);
  } catch (err) {
    updateCloudStatus('同期エラー: ' + err.message, true);
  }
}

// 裏で自動同期（UIをブロックしない）
function autoSync() {
  const url = localStorage.getItem('kakeibo_gas_url');
  if (!url) return;

  // 裏で全データ上書き送信（削除・編集も反映）
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'sync', entries: entries }),
  }).catch(() => {});
}

// 設定ページ表示時にURL読み込み
const origShowPage = showPage;
showPage = function(page) {
  origShowPage(page);
  if (page === 'settings') loadGasUrl();
};
