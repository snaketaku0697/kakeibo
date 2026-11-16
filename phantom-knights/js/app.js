/* ============================================================
   幻影騎士団 展開ガイド - 画面の動作
   ============================================================ */
(function () {
  'use strict';
  var D = window.PK_DATA;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 小道具 ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function baseId(id) { return id.split('#')[0]; }
  function cardOf(id) { return D.cards[baseId(id)] || D.pseudo[baseId(id)]; }
  function copyNo(id) { return id.indexOf('#') > -1 ? '（' + id.split('#')[1] + '枚目）' : ''; }
  function shortName(id) { return cardOf(id).short + copyNo(id); }
  function fullName(id) { return cardOf(id).name + copyNo(id); }
  function isRealCard(id) { return !!D.cards[baseId(id)]; }
  function fmtTime(sec) { return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2); }
  function videoUrl(sec) { return 'https://youtu.be/' + D.videoId + '?t=' + sec; }
  function store(key, val) {
    try {
      if (val === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, val);
    } catch (e) { /* 保存できなくても動作は続ける */ }
    return null;
  }

  /* {c:id} {t:id} を押せるボタンに変える（htmlは信頼できる自前の文字列） */
  var REF = /\{([ct]):([a-z0-9#]+)(?:\|([^}]*))?\}/gi;
  function refs(html) {
    return html.replace(REF, function (_, kind, id, label) {
      if (kind === 'c') {
        if (!isRealCard(id)) return esc(label || shortName(id));
        return '<button type="button" class="ref ref-c" data-card="' + baseId(id) + '">' + esc(label || shortName(id)) + '</button>';
      }
      var t = D.terms[id];
      return '<button type="button" class="ref ref-t" data-term="' + id + '">' + esc(label || t.name) + '</button>';
    });
  }
  function rich(text) { return refs(esc(text)); }
  function cardBtn(id, cls, label) {
    if (!isRealCard(id)) return '<span>' + esc(label || fullName(id)) + '</span>';
    return '<button type="button" class="' + cls + '" data-card="' + baseId(id) + '">' + esc(label || fullName(id)) + '</button>';
  }

  /* ---------- 説明シート ---------- */
  var sheetStack = [];
  var lastFocus = null;
  var KIND = { main: 'モンスター（メインデッキ）', trap: '罠カード', spell: '魔法カード', xyz: 'エクシーズモンスター（EXデッキ）', link: 'リンクモンスター（EXデッキ）' };

  var ARROW = { '↖': [0, '左上'], '⬆': [1, '上'], '↗': [2, '右上'], '⬅': [3, '左'], '➡': [5, '右'], '↙': [6, '左下'], '⬇': [7, '下'], '↘': [8, '右下'] };
  var ARROW_CHAR = ['↖', '↑', '↗', '←', '', '→', '↙', '↓', '↘'];
  function arrowGrid(arrows) {
    var on = {};
    var names = arrows.map(function (a) { on[ARROW[a][0]] = true; return ARROW[a][1]; });
    var cells = '';
    for (var i = 0; i < 9; i++) {
      cells += i === 4 ? '<span class="ag-card">カード</span>' : '<span class="' + (on[i] ? 'ag-on' : 'ag-off') + '">' + (on[i] ? ARROW_CHAR[i] : '') + '</span>';
    }
    return '<div class="arrowfig"><div class="arrowgrid" role="img" aria-label="リンクマーカーは' + names.join('・') + '">' + cells + '</div><p>' + names.join('・') + 'を指します。</p></div>';
  }

  function sheetHtml(item) {
    if (item.type === 'term') {
      var t = D.terms[item.id];
      return '<p class="sheet-kind">用語</p>' +
        '<h2 class="sheet-title" id="sheet-title">' + esc(t.name) + '</h2>' +
        (t.read ? '<p class="sheet-read">読み：' + esc(t.read) + '</p>' : '') +
        '<p>' + rich(t.body) + '</p>';
    }
    var c = D.cards[item.id];
    var url = c.cid ? D.dbCard + c.cid : D.dbSearch + encodeURIComponent(c.name);
    var h = '<p class="sheet-kind">' + KIND[c.kind] + '</p>' +
      '<h2 class="sheet-title" id="sheet-title">' + esc(c.name) + '</h2>' +
      (c.read ? '<p class="sheet-read">読み：' + esc(c.read) + '</p>' : '') +
      '<p class="sheet-spec">' + esc(c.spec) + '</p>' +
      (c.alias ? '<p class="sheet-alias">' + c.alias.map(esc).join('／') + '</p>' : '') +
      '<h3>このデッキでの役割</h3><p>' + rich(c.role) + '</p>' +
      '<h3>効果（要約）</h3><ul class="sheet-list">' + c.effects.map(function (e) { return '<li>' + rich(e) + '</li>'; }).join('') + '</ul>';
    if (c.arrows) h += '<h3>リンクマーカー（リンク先の向き）</h3>' + arrowGrid(c.arrows);
    if (c.tips) h += '<h3>覚えておくこと</h3><p>' + rich(c.tips) + '</p>';
    h += '<p class="sheet-src">効果は要約です。' +
      (c.checked === 'yy-en' ? 'カードデータベース（yaml-yugi）に日本語テキストが未登録のため、英語テキストと照合しています。' : 'カードデータベース（yaml-yugi）の日本語テキストと照合しています。') +
      '正確な文章は公式カードデータベースかゲーム内で確認してください。' +
      ' <a href="' + esc(url) + '" target="_blank" rel="noopener">公式カードデータベースで見る</a></p>';
    return h;
  }
  function renderSheet() {
    var item = sheetStack[sheetStack.length - 1];
    $('sheet-body').innerHTML = sheetHtml(item);
    $('sheet-body').scrollTop = 0;
    $('sheet-prev').hidden = sheetStack.length < 2;
  }
  function openSheet(item, fromSheet) {
    if (!fromSheet) { sheetStack = []; lastFocus = document.activeElement; }
    sheetStack.push(item);
    renderSheet();
    $('sheet-back').hidden = false;
    document.body.style.overflow = 'hidden';
    $('sheet').focus();
  }
  function closeSheet() {
    $('sheet-back').hidden = true;
    document.body.style.overflow = '';
    sheetStack = [];
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-card],[data-term]') : null;
    if (el) {
      e.preventDefault();
      var inSheet = !!el.closest('#sheet');
      openSheet(el.dataset.card ? { type: 'card', id: el.dataset.card } : { type: 'term', id: el.dataset.term }, inSheet);
      return;
    }
    if (e.target === $('sheet-back')) closeSheet();
  });
  $('sheet-close').addEventListener('click', closeSheet);
  $('sheet-prev').addEventListener('click', function () { sheetStack.pop(); renderSheet(); $('sheet').focus(); });
  $('sheet').addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = $('sheet').querySelectorAll('button:not([hidden]), a[href]');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === $('sheet'))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- 展開ルート：状態の計算 ---------- */
  var ZONE = {
    hand: { label: '手札', cls: 'z-hand' },
    deck: { label: 'デッキ', cls: 'z-deck' },
    ex: { label: 'EXデッキ', cls: 'z-ex' },
    field: { label: '場', cls: 'z-field' },
    st: { label: '場（魔法・罠）', cls: 'z-st' },
    gy: { label: '墓地', cls: 'z-gy' },
    ban: { label: '除外', cls: 'z-ban' }
  };
  function zoneBadge(z) {
    if (!z) z = 'gy'; /* 出どころのカードが未確認の蘇生（墓地から） */
    if (z.indexOf('mat:') === 0) return '<span class="zb z-mat">' + esc(shortName(z.slice(4))) + 'の素材</span>';
    return '<span class="zb ' + ZONE[z].cls + '">' + ZONE[z].label + '</span>';
  }
  /* n 手目まで進めたあとの状態を返す */
  function stateAt(route, n) {
    var z = { hand: route.hand.slice(), field: [], st: [], gy: [], ban: [] };
    var tags = {};
    var fresh = {};
    for (var i = 0; i < n; i++) {
      var s = route.steps[i];
      fresh = {};
      s.moves.forEach(function (m) {
        var card = m[0], from = m[1], to = m[2];
        if (from && z[from]) { var k = z[from].indexOf(card); if (k > -1) z[from].splice(k, 1); }
        (z[to] || (z[to] = [])).push(card);
        delete tags[card];
        fresh[card] = true;
      });
      Object.keys(s.tags || {}).forEach(function (k) { tags[k] = s.tags[k]; fresh[k] = true; });
    }
    return { z: z, tags: tags, fresh: fresh };
  }

  function stateHtml(route, n) {
    var st = stateAt(route, n);
    function item(id, extra) {
      var tag = st.tags[id];
      return '<li' + (st.fresh[id] ? ' class="new"' : '') + '>' + (st.fresh[id] ? '<span aria-hidden="true">● </span>' : '') +
        cardBtn(id, 'ref ref-c', shortName(id)) +
        (tag ? '<small>' + esc(tag) + '</small>' : '') + (extra || '') + '</li>';
    }
    function list(ids, mapper) {
      return ids.length ? '<ul>' + ids.map(mapper || function (id) { return item(id); }).join('') + '</ul>' : '<ul><li class="none">なし</li></ul>';
    }
    var fieldList = list(st.z.field, function (id) {
      var mats = st.z['mat:' + id] || [];
      var extra = mats.length ? '<small>素材' + mats.length + 'つ：' + mats.map(function (m) { return esc(shortName(m)); }).join('・') + '</small>' : '';
      return item(id, extra);
    });
    return '<div class="state">' +
      '<div class="sz z-hand"><h4><span class="zb z-hand">手</span>手札</h4>' + list(st.z.hand) + '</div>' +
      '<div class="sz z-field"><h4><span class="zb z-field">場</span>場のモンスター</h4>' + fieldList + '</div>' +
      '<div class="sz z-st"><h4><span class="zb z-st">場</span>場の魔法・罠</h4>' + list(st.z.st) + '</div>' +
      '<div class="sz z-gy"><h4><span class="zb z-gy">墓</span>墓地</h4>' + list(st.z.gy) + '</div>' +
      '<div class="sz z-ban"><h4><span class="zb z-ban">除</span>除外</h4>' + list(st.z.ban) + '</div>' +
      '<p class="state-legend">● は、この操作で動いたカードです。エクシーズモンスターの下にあるカードは「素材」として表示しています。</p>' +
      '</div>';
  }

  /* ---------- 展開ルート：表示 ---------- */
  var cur = { route: null, idx: 0 };

  function stepHtml(route, idx) {
    var total = route.steps.length;
    if (idx >= total) {
      return '<span class="done-mark">完成</span>' +
        '<h2 class="step-title">最終盤面ができました</h2>' +
        '<p class="step-do">' + rich(route.done.text) + '</p>' +
        '<a class="vjump" href="' + videoUrl(route.done.t) + '" target="_blank" rel="noopener">動画の ' + fmtTime(route.done.t) + ' で確認する</a>' +
        '<div class="cta-row"><a class="btn btn-primary" href="#defense">相手ターンの止め方を見る</a><a class="btn" href="#practice">クイズで練習する</a><a class="btn" href="#notes">間違えやすい点を見直す</a></div>';
    }
    var s = route.steps[idx];
    var h = '<h2 class="step-title">' + esc(s.title) + '</h2>';
    h += '<div class="step-sec"><p class="step-k">使うカード</p><ul class="chips">' +
      s.use.map(function (u) { return '<li>' + cardBtn(u, 'chip') + '</li>'; }).join('') + '</ul></div>';
    h += '<div class="step-sec"><p class="step-k">操作</p><p class="step-do">' + rich(s.do) + '</p></div>';
    h += '<div class="step-sec"><p class="step-k">理由</p><p>' + rich(s.why) + '</p></div>';

    var lines = s.moves.map(function (m) {
      return '<li>' + zoneBadge(m[1]) + '<span class="arrow" aria-label="から">→</span>' + zoneBadge(m[2]) +
        '<span class="mv-card">' + esc(shortName(m[0])) + '</span></li>';
    });
    Object.keys(s.tags || {}).forEach(function (k) {
      var moved = s.moves.some(function (m) { return m[0] === k; });
      lines.push('<li><span class="zb z-field">' + (moved ? '状態' : '場のまま') + '</span><span class="mv-card">' + esc(shortName(k)) + '</span>：' + esc(s.tags[k]) + '</li>');
    });
    h += '<div class="step-sec"><p class="step-k">操作後の変化</p><ul class="moves">' + lines.join('') + '</ul></div>';

    if (s.pit) h += '<div class="callout c-warn"><strong>間違えやすい点</strong>' + rich(s.pit) + '</div>';
    if (s.note) h += '<div class="callout c-note">' + rich(s.note) + '</div>';
    if (s.verify) h += '<div class="callout c-verify"><strong>要確認（文字起こしだけでは確定できない点）</strong>' + rich(s.verify) + '</div>';
    h += '<a class="vjump" href="' + videoUrl(s.t) + '" target="_blank" rel="noopener">動画の ' + fmtTime(s.t) + ' で確認する</a>';
    return h;
  }

  function stepListHtml(route, idx) {
    var h = '', phase = -1;
    route.steps.forEach(function (s, i) {
      if (s.phase !== phase) {
        if (phase > -1) h += '</ol>';
        phase = s.phase;
        h += '<p class="sl-phase">' + esc(route.phases[phase]) + '</p><ol class="sl">';
      }
      h += '<li><button type="button" data-goto="' + i + '"' + (i === idx ? ' aria-current="step"' : '') + '><span class="n">' + (i + 1) + '</span><span>' + esc(s.title) + (s.verify ? ' <span class="tag-verify">要確認</span>' : '') + '</span></button></li>';
    });
    h += '</ol><ol class="sl"><li><button type="button" data-goto="' + route.steps.length + '"' + (idx === route.steps.length ? ' aria-current="step"' : '') + '><span class="n">完</span><span>最終盤面</span></button></li></ol>';
    return h;
  }

  function renderRoute(focusStep) {
    var r = cur.route, idx = cur.idx, total = r.steps.length;
    var done = idx >= total;
    $('route-title').textContent = r.name + ' から始める';
    $('progress-count').textContent = done ? '完成（全 ' + total + ' ステップ）' : 'ステップ ' + (idx + 1) + ' / ' + total;
    $('progress-phase').textContent = done ? '' : r.phases[r.steps[idx].phase];
    $('progress-fill').style.width = Math.round((done ? total : idx + 1) / total * 100) + '%';
    $('progress-bar').setAttribute('aria-valuemax', total);
    $('progress-bar').setAttribute('aria-valuenow', done ? total : idx + 1);
    $('progress-bar').setAttribute('aria-label', '進行状況');
    $('step').innerHTML = stepHtml(r, idx);
    $('state').innerHTML = stateHtml(r, done ? total : idx + 1);
    $('steplist').innerHTML = stepListHtml(r, idx);
    $('btn-prev').disabled = idx === 0;
    $('btn-reset').disabled = idx === 0;
    $('btn-next').disabled = done;
    $('btn-next').textContent = done ? '完成' : (idx === total - 1 ? '次へ（完成）' : '次へ');
    store('pk_step_' + r.id, String(idx));
    if (focusStep) {
      var top = $('progress').getBoundingClientRect().top + window.pageYOffset - 76;
      window.scrollTo(0, Math.max(0, top));
      $('step').focus({ preventScroll: true });
    }
  }
  function go(idx) {
    var total = cur.route.steps.length;
    cur.idx = Math.max(0, Math.min(total, idx));
    renderRoute(true);
  }
  $('btn-prev').addEventListener('click', function () { go(cur.idx - 1); });
  $('btn-next').addEventListener('click', function () { go(cur.idx + 1); });
  $('btn-reset').addEventListener('click', function () { go(0); });
  $('steplist').addEventListener('click', function (e) {
    var b = e.target.closest('[data-goto]');
    if (b) { $('list-fold').open = false; go(parseInt(b.dataset.goto, 10)); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$('sheet-back').hidden) { closeSheet(); return; }
    if (!$('sheet-back').hidden || !cur.route || $('view-route').hidden) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight') go(cur.idx + 1);
    if (e.key === 'ArrowLeft') go(cur.idx - 1);
  });

  /* ---------- ルート選択 ---------- */
  function renderRouteList() {
    $('route-list').innerHTML = D.routes.map(function (r, i) {
      var saved = parseInt(store('pk_step_' + r.id), 10);
      var resume = saved > 0 && saved <= r.steps.length
        ? (saved >= r.steps.length ? '前回は完成まで進みました' : '前回の続き：ステップ ' + (saved + 1))
        : '';
      return '<a class="route-card" href="#' + r.hash + '">' +
        '<span class="route-card-k">ルート' + (i + 1) + '　' + esc(r.lead) + '</span>' +
        '<span class="route-card-n">' + esc(r.name) + '</span>' +
        '<span class="route-card-s">' + esc(r.summary) + '</span>' +
        '<span class="route-card-m"><span>全 ' + r.steps.length + ' ステップ</span><span>動画 ' + fmtTime(r.videoStart) + '〜</span>' +
        (resume ? '<span>' + resume + '</span>' : '') + '<span class="route-card-go">始める</span></span></a>';
    }).join('');
  }

  /* ---------- はじめに：覚えるカード ---------- */
  var KEYCARDS = [
    ['decay', '最初の1枚（初動）', '出すと仲間をサーチ。ルート1の始まり。'],
    ['solleret', '最初の1枚（初動）', '出すとアンブレイジベイルをセット。ルート2の始まり。'],
    ['scales', '最初の1枚（初動）', '手札を1枚捨てて、デッキのカードを墓地へ。ルート3の始まり。'],
    ['boots', 'つなぎ役', '手札から出せる2体目。墓地から幻影霧剣をサーチ。'],
    ['fog', 'つなぎ役＋妨害', '墓地から仲間を戻す。最後は場に伏せて相手を止める。'],
    ['scythe', '展開の中心', 'デッキから仲間を呼び、RUMもサーチする。'],
    ['requiem', '妨害の主役', '相手のモンスター効果を3回まで無効にして破壊。'],
    ['bardiche', '仕上げ役', '罠をセットし、相手ターンにはカードを破壊する。']
  ];
  function renderKeycards() {
    $('keycards').innerHTML = KEYCARDS.map(function (k) {
      return '<button type="button" class="keycard" data-card="' + k[0] + '">' +
        '<span class="keycard-k">' + esc(k[1]) + '</span>' +
        '<span class="keycard-n">' + esc(D.cards[k[0]].name) + '</span>' +
        '<span class="keycard-r">' + esc(k[2]) + '</span></button>';
    }).join('');
  }

  /* ---------- 用語とカードの一覧 ---------- */
  function strip(s) { return s.replace(REF, function (_, k, id, label) { return label || (k === 'c' ? cardOf(id).short : D.terms[id].name); }); }
  function norm(s) { return s.toLowerCase().replace(/[\s　・－-]/g, ''); }
  function renderGloss() {
    var q = norm($('q').value || '');
    var hit = 0;
    $('term-list').innerHTML = Object.keys(D.terms).filter(function (id) {
      var t = D.terms[id];
      return !q || norm(t.name + t.read + t.body).indexOf(q) > -1;
    }).map(function (id) {
      hit++;
      var t = D.terms[id];
      return '<button type="button" class="gloss-item" data-term="' + id + '"><b>' + esc(t.name) + '</b>' + (t.read ? '<small>' + esc(t.read) + '</small>' : '') + '</button>';
    }).join('');
    $('card-list').innerHTML = Object.keys(D.cards).filter(function (id) {
      var c = D.cards[id];
      return !q || norm(c.name + c.read + c.short + (c.alias || []).join('') + strip(c.role)).indexOf(q) > -1;
    }).map(function (id) {
      hit++;
      var c = D.cards[id];
      return '<button type="button" class="gloss-item" data-card="' + id + '"><b>' + esc(c.name) + '</b><small>' + esc(KIND[c.kind]) + '</small></button>';
    }).join('');
    $('no-hit').hidden = hit > 0;
  }
  $('q').addEventListener('input', renderGloss);

  /* ---------- 練習：クイズ「次の一手は？」 ---------- */
  var quiz = null; /* { route, i, score, miss, opts, picked } */

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  /* 正解の手順と、近くの手順から選んだ別の3つを混ぜる */
  function quizOptions(route, i) {
    var right = route.steps[i].title;
    var seen = {}; seen[right] = true;
    var pool = [];
    route.steps.map(function (s, j) { return j; })
      .sort(function (a, b) { return Math.abs(a - i) - Math.abs(b - i); })
      .forEach(function (j) {
        var t = route.steps[j].title;
        if (j !== i && !seen[t] && pool.length < 8) { seen[t] = true; pool.push(t); }
      });
    return shuffle(shuffle(pool).slice(0, 3).concat([right]));
  }
  function quizStart(routeId) {
    var r = null;
    D.routes.forEach(function (x) { if (x.id === routeId) r = x; });
    quiz = { route: r, i: 0, score: 0, miss: [], opts: quizOptions(r, 0), picked: null };
    renderQuiz(true);
  }
  function quizSetupHtml() {
    return '<p>手札を選ぶと、状況だけを見て「次の一手」を4つの中から選ぶ問題が、最初の操作から順番に出ます。答えるたびに理由を確認できます。</p>' +
      '<div class="routes">' + D.routes.map(function (r, n) {
        var best = store('pk_quiz_' + r.id);
        return '<button type="button" class="route-card" data-quiz="' + r.id + '">' +
          '<span class="route-card-k">ルート' + (n + 1) + '</span>' +
          '<span class="route-card-n">' + esc(r.name) + '</span>' +
          '<span class="route-card-m"><span>全 ' + r.steps.length + ' 問</span>' + (best ? '<span>前回の結果：' + esc(best) + '</span>' : '') +
          '<span class="route-card-go">クイズを始める</span></span></button>';
      }).join('') + '</div>';
  }
  function quizQuestionHtml() {
    var r = quiz.route, i = quiz.i, total = r.steps.length, s = r.steps[i];
    var answered = quiz.picked !== null;
    var before = i === 0
      ? 'あなたのターンの始めです。手札は「' + r.hand.map(fullName).join('」と「') + '」です。'
      : '直前の操作：' + r.steps[i - 1].title;
    var h = '<div class="quiz-head"><b>' + esc(r.name) + '</b><span>第 ' + (i + 1) + ' 問 / ' + total + '　正解 ' + quiz.score + '</span></div>' +
      '<div class="progress-bar" role="progressbar" aria-label="クイズの進み具合" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + (i + 1) + '"><span style="width:' + Math.round((i + 1) / total * 100) + '%"></span></div>' +
      '<p class="quiz-before">' + esc(before) + '</p>' +
      '<details class="fold" open><summary>今の場・墓地・除外</summary><div class="fold-body">' + stateHtml(r, i) + '</div></details>' +
      '<p class="quiz-q" id="quiz-q" tabindex="-1">動画の手順では、次の一手はどれ？</p><div class="quiz-opts">';
    quiz.opts.forEach(function (t, k) {
      var cls = 'quiz-opt', mark = '';
      if (answered) {
        if (t === s.title) { cls += ' is-right'; mark = '<span class="quiz-mark">正解</span>'; }
        else if (k === quiz.picked) { cls += ' is-wrong'; mark = '<span class="quiz-mark">不正解</span>'; }
      }
      h += '<button type="button" class="' + cls + '" data-opt="' + k + '"' + (answered ? ' disabled' : '') + '>' + mark + '<span>' + esc(t) + '</span></button>';
    });
    h += '</div>';
    if (answered) {
      var ok = quiz.opts[quiz.picked] === s.title;
      h += '<div class="quiz-fb" id="quiz-fb" tabindex="-1"><p class="quiz-result ' + (ok ? 'is-right' : 'is-wrong') + '">' + (ok ? '正解です' : '不正解です。動画の手順では「' + esc(s.title) + '」') + '</p>' +
        '<div class="step-sec"><p class="step-k">操作</p><p>' + rich(s.do) + '</p></div>' +
        '<div class="step-sec"><p class="step-k">理由</p><p>' + rich(s.why) + '</p></div>' +
        (s.pit ? '<div class="callout c-warn"><strong>間違えやすい点</strong>' + rich(s.pit) + '</div>' : '') +
        (s.verify ? '<div class="callout c-verify"><strong>要確認（文字起こしだけでは確定できない点）</strong>' + rich(s.verify) + '</div>' : '') +
        '</div>';
    }
    h += '<div class="quiz-nav' + (answered ? '' : ' is-static') + '"><button type="button" class="btn btn-ghost" data-quiz-quit>やめる</button>' +
      (answered ? '<button type="button" class="btn btn-primary" data-quiz-next>' + (i === total - 1 ? '結果を見る' : '次の問題へ') + '</button>' : '') + '</div>';
    return h;
  }
  function quizResultHtml() {
    var r = quiz.route, total = r.steps.length;
    var h = '<div class="quiz-head"><b>' + esc(r.name) + '</b><span>結果</span></div>' +
      '<p class="quiz-score" id="quiz-q" tabindex="-1">' + total + ' 問中 ' + quiz.score + ' 問正解</p>';
    if (quiz.miss.length) {
      h += '<p>間違えた手順です。押すと、展開ガイドのそのステップを開きます。</p><ol class="sl">' + quiz.miss.map(function (j) {
        return '<li><button type="button" data-review="' + j + '"><span class="n">' + (j + 1) + '</span><span>' + esc(r.steps[j].title) + '</span></button></li>';
      }).join('') + '</ol>';
    } else {
      h += '<p>全問正解です。この手順は覚えられています。</p>';
    }
    h += '<div class="quiz-nav"><button type="button" class="btn" data-quiz-quit>手札を選び直す</button><button type="button" class="btn btn-primary" data-quiz="' + r.id + '">もう一度</button></div>';
    return h;
  }
  function renderQuiz(focus) {
    var el = $('quiz');
    el.innerHTML = !quiz ? quizSetupHtml() : (quiz.i >= quiz.route.steps.length ? quizResultHtml() : quizQuestionHtml());
    if (focus) {
      var top = el.getBoundingClientRect().top + window.pageYOffset - 130;
      var target = $('quiz-fb') || $('quiz-q');
      if (quiz && quiz.picked === null) window.scrollTo(0, Math.max(0, top));
      if (target) target.focus({ preventScroll: quiz && quiz.picked === null });
    }
  }
  $('quiz').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.quiz) { quizStart(b.dataset.quiz); return; }
    if (b.hasAttribute('data-quiz-quit')) { quiz = null; renderQuiz(true); return; }
    if (!quiz) return;
    if (b.dataset.opt !== undefined && quiz.picked === null) {
      quiz.picked = parseInt(b.dataset.opt, 10);
      if (quiz.opts[quiz.picked] === quiz.route.steps[quiz.i].title) quiz.score++; else quiz.miss.push(quiz.i);
      renderQuiz(true);
      return;
    }
    if (b.hasAttribute('data-quiz-next')) {
      quiz.i++;
      quiz.picked = null;
      if (quiz.i < quiz.route.steps.length) quiz.opts = quizOptions(quiz.route, quiz.i);
      else store('pk_quiz_' + quiz.route.id, quiz.route.steps.length + ' 問中 ' + quiz.score + ' 問正解');
      renderQuiz(true);
      return;
    }
    if (b.dataset.review !== undefined) {
      store('pk_step_' + quiz.route.id, b.dataset.review);
      window.location.hash = '#' + quiz.route.hash;
    }
  });

  /* ---------- 練習：初動が来る確率 ---------- */
  /* デッキ deck 枚のうち当たりが hit 枚あるとき、draw 枚引いて1枚以上当たる確率 */
  function atLeastOne(deck, hit, draw) {
    if (hit <= 0) return 0;
    var miss = 1;
    for (var i = 0; i < draw; i++) miss *= Math.max(0, deck - hit - i) / (deck - i);
    return 1 - miss;
  }
  function pct(x) { return (Math.round(x * 1000) / 10).toFixed(1) + '%'; }
  var PROB_FIELDS = [['p-decay', 'ディケイクローク'], ['p-solleret', 'ドゥームソルレット'], ['p-scales', 'ティアースケイル'], ['p-other', 'その他の初動']];
  function renderProb() {
    function val(id) {
      var el = $(id), v = parseInt(el.value, 10);
      if (isNaN(v)) return null;
      return Math.max(parseInt(el.min, 10), Math.min(parseInt(el.max, 10), v));
    }
    var deck = val('p-deck');
    var counts = PROB_FIELDS.map(function (f) { return val(f[0]); });
    var out = $('prob-out');
    if (deck === null || counts.indexOf(null) > -1) {
      out.innerHTML = '<p class="callout c-warn">枚数が空のところがあります。数字を入れてください。</p>';
      return;
    }
    var main = counts[0] + counts[1] + counts[2];
    var all = main + counts[3];
    if (all > deck) {
      out.innerHTML = '<p class="callout c-warn">初動の合計（' + all + '枚）がデッキの枚数（' + deck + '枚）を超えています。数字を直してください。</p>';
      return;
    }
    var first = atLeastOne(deck, all, 5), second = atLeastOne(deck, all, 6);
    var rows = PROB_FIELDS.map(function (f, k) {
      return counts[k] > 0 ? '<tr><td>' + f[1] + '（' + counts[k] + '枚）</td><td>' + pct(atLeastOne(deck, counts[k], 5)) + '</td><td>' + pct(atLeastOne(deck, counts[k], 6)) + '</td></tr>' : '';
    }).join('');
    var missOdds = first < 1 ? Math.round(1 / (1 - first)) : 0;
    out.innerHTML =
      '<div class="prob-big"><div><span class="prob-k">先攻（最初の手札5枚）</span><b>' + pct(first) + '</b></div>' +
      '<div><span class="prob-k">後攻（最初のドローを含めて6枚）</span><b>' + pct(second) + '</b></div></div>' +
      '<p>' + deck + '枚のデッキに初動が合計' + all + '枚入っているとき、どれか1枚以上が来る確率です。' +
      (all === 0 ? '' : (missOdds >= 2 ? '先攻では、およそ' + missOdds + '回に1回は初動が1枚も来ません。' : '')) + '</p>' +
      (rows ? '<div class="tablebox"><table><thead><tr><th>カードごとの確率</th><th>先攻（5枚）</th><th>後攻（6枚）</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '');
  }
  $('prob-form').addEventListener('input', renderProb);
  $('prob-form').addEventListener('submit', function (e) { e.preventDefault(); });
  $('prob-form').addEventListener('click', function (e) {
    var b = e.target.closest('[data-step]');
    if (!b) return;
    var el = $(b.dataset.for);
    var v = parseInt(el.value, 10);
    if (isNaN(v)) v = parseInt(el.min, 10);
    el.value = Math.max(parseInt(el.min, 10), Math.min(parseInt(el.max, 10), v + parseInt(b.dataset.step, 10)));
    renderProb();
  });
  $('prob-form').addEventListener('change', function (e) {
    var el = e.target;
    if (el.tagName !== 'INPUT') return;
    var v = parseInt(el.value, 10);
    if (!isNaN(v)) el.value = Math.max(parseInt(el.min, 10), Math.min(parseInt(el.max, 10), v));
    renderProb();
  });

  /* ---------- 画面の切り替え ---------- */
  var VIEWS = ['start', 'guide', 'defense', 'notes', 'practice', 'glossary'];
  function show() {
    var name = (window.location.hash || '#start').slice(1);
    var route = null;
    D.routes.forEach(function (r) { if (r.hash === name) route = r; });
    var view = route ? 'route' : (VIEWS.indexOf(name) > -1 ? name : 'start');
    if (!$('sheet-back').hidden) closeSheet();
    document.querySelectorAll('.view').forEach(function (v) { v.hidden = v.dataset.view !== view; });
    var tab = view === 'route' ? 'guide' : view;
    document.querySelectorAll('.tabs a').forEach(function (a) {
      if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (view === 'guide') renderRouteList();
    if (view === 'practice') { quiz = null; renderQuiz(); renderProb(); }
    if (route) {
      var saved = parseInt(store('pk_step_' + route.id), 10);
      cur.route = route;
      cur.idx = saved >= 0 && saved <= route.steps.length ? saved : 0;
      renderRoute(false);
    }
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', show);

  /* ---------- 初期化 ---------- */
  document.querySelectorAll('.rich').forEach(function (el) { el.innerHTML = refs(el.innerHTML); });
  document.querySelectorAll('a.vlink').forEach(function (a) {
    a.href = videoUrl(parseInt(a.dataset.t, 10));
    a.target = '_blank';
    a.rel = 'noopener';
  });
  renderKeycards();
  renderGloss();
  show();
})();
