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
  saveData();
  closeModal();
  updateView();
}

// ---- 削除 ----
function deleteEntry(id) {
  if (!confirm('この記録を削除しますか？')) return;
  entries = entries.filter(e => e.id !== id);
  saveData();
  updateView();
  renderHistory();
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
      <button class="tx-delete" onclick="deleteEntry(${e.id})">×</button>
    </li>
  `;
}

// ---- グラフ ----
function renderCharts() {
  renderCategoryChart();
  renderMonthlyChart();
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
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ¥${ctx.parsed.toLocaleString()}`
          }
        }
      },
    },
  });
}

function renderMonthlyChart() {
  const labels = [];
  const incomeData = [];
  const expenseData = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - i);
    const y = d.getFullYear();
    const m = d.getMonth();
    labels.push(`${m + 1}月`);

    const me = entries.filter(e => {
      const ed = new Date(e.date);
      return ed.getFullYear() === y && ed.getMonth() === m;
    });

    incomeData.push(me.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0));
    expenseData.push(me.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0));
  }

  const ctx = document.getElementById('monthly-chart');
  if (monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: '収入', data: incomeData, backgroundColor: '#00b894' },
        { label: '支出', data: expenseData, backgroundColor: '#d63031' },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ¥${ctx.parsed.y.toLocaleString()}`
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: (v) => '¥' + (v / 1000) + 'k'
          }
        }
      },
    },
  });
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

async function cloudSync() {
  const url = document.getElementById('gas-url').value.trim();
  if (!url) { alert('Google Apps ScriptのURLを入力してください'); return; }

  updateCloudStatus('同期中...');

  try {
    // 1. クラウドからデータ取得
    updateCloudStatus('クラウドからデータ取得中...');
    const readResp = await fetch(url + '?action=read');
    const readData = await readResp.json();

    if (readData.error) throw new Error(readData.error);

    // 2. クラウドのデータをローカルにマージ
    const cloudEntries = readData.entries || [];
    const localIds = new Set(entries.map(e => String(e.id)));
    let addedFromCloud = 0;

    cloudEntries.forEach(ce => {
      if (!localIds.has(String(ce.id))) {
        entries.push(ce);
        addedFromCloud++;
      }
    });

    // 3. ローカルのデータをクラウドに送信
    updateCloudStatus('クラウドにデータ送信中...');
    const writeResp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'write', entries: entries }),
    });
    const writeData = await writeResp.json();

    if (writeData.error) throw new Error(writeData.error);

    // 4. ローカル保存 & 画面更新
    saveData();
    updateView();

    const msg = `同期完了！ クラウドから${addedFromCloud}件取得、${writeData.added || 0}件送信 (合計${writeData.total || entries.length}件)`;
    updateCloudStatus(msg);
  } catch (err) {
    updateCloudStatus('同期エラー: ' + err.message, true);
  }
}

// 設定ページ表示時にURL読み込み
const origShowPage = showPage;
showPage = function(page) {
  origShowPage(page);
  if (page === 'settings') loadGasUrl();
};
