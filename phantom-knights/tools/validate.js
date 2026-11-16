#!/usr/bin/env node
/* 手順データの整合性チェック
   使い方: node phantom-knights/tools/validate.js
   - 各ステップのカード移動が、直前の状態と矛盾しないか
   - 本文の {c:..} {t:..} が実在するカード・用語を指しているか
   - index.html 内の参照も同様に確認 */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
require(path.join(root, 'js', 'data.js'));
const D = globalThis.PK_DATA;

let errors = 0;
const err = (m) => { errors++; console.error('NG  ' + m); };
const base = (id) => id.split('#')[0];
const known = (id) => D.cards[base(id)] || D.pseudo[base(id)];

function checkText(text, where) {
  const re = /\{([ct]):([a-z0-9#]+)(?:\|[^}]*)?\}/gi;
  let m;
  while ((m = re.exec(text))) {
    if (m[1] === 'c' && !known(m[2])) err(`${where}: 未定義のカード参照 {c:${m[2]}}`);
    if (m[1] === 't' && !D.terms[m[2]]) err(`${where}: 未定義の用語参照 {t:${m[2]}}`);
  }
  const stray = text.replace(re, '').match(/\{[ct]:[^}]*\}?/);
  if (stray) err(`${where}: 壊れた参照 ${stray[0]}`);
}

for (const [id, c] of Object.entries(D.cards)) {
  checkText([c.role, ...(c.effects || []), c.tips || ''].join('\n'), `card ${id}`);
}
for (const [id, t] of Object.entries(D.terms)) checkText(t.body, `term ${id}`);

for (const r of D.routes) {
  const zones = { hand: [...r.hand], field: [], st: [], gy: [], ban: [] };
  const zoneOf = (z) => (zones[z] || (zones[z] = []));
  let prevT = 0;
  r.steps.forEach((s, i) => {
    const where = `${r.id} step ${i + 1}「${s.title}」`;
    for (const k of ['title', 'do', 'why']) if (!s[k]) err(`${where}: ${k} がない`);
    checkText([s.do, s.why, s.pit || '', s.verify || '', s.note || ''].join('\n'), where);
    if (!(s.phase >= 0 && s.phase < r.phases.length)) err(`${where}: phase が不正`);
    if (s.t < prevT) err(`${where}: 動画の時刻が前のステップより前`);
    prevT = s.t;
    (s.use || []).forEach((u) => { if (!known(u)) err(`${where}: use に未定義カード ${u}`); });
    for (const [card, from, to] of s.moves) {
      if (!known(card)) err(`${where}: 未定義カード ${card}`);
      if (from && from !== 'deck' && from !== 'ex') {
        const z = zoneOf(from);
        const idx = z.indexOf(card);
        if (idx < 0) err(`${where}: ${card} が ${from} にない（現在: ${z.join(', ') || '空'}）`);
        else z.splice(idx, 1);
      }
      if (to.startsWith('mat:') && !zones.field.includes(to.slice(4))) err(`${where}: 素材の持ち主 ${to.slice(4)} が場にいない`);
      zoneOf(to).push(card);
    }
    // 場を離れたエクシーズモンスターに素材が残っていないか
    for (const z of Object.keys(zones)) {
      if (z.startsWith('mat:') && zones[z].length && !zones.field.includes(z.slice(4))) {
        err(`${where}: ${z.slice(4)} が場にいないのに素材が残っている (${zones[z].join(', ')})`);
      }
    }
    Object.keys(s.tags || {}).forEach((k) => {
      if (!zones.field.includes(k) && !zones.st.includes(k)) err(`${where}: tags の ${k} が場にない`);
    });
    if (zones.field.length > 6) err(`${where}: 場のモンスターが多すぎる (${zones.field.length})`);
  });
  const nm = (id) => (known(id).short || known(id).name) + (id.includes('#') ? '(2枚目)' : '');
  console.log(`\n== ${r.name}（${r.steps.length}ステップ）完成時の状態 ==`);
  console.log('場      : ' + zones.field.map((f) => nm(f) + (zones['mat:' + f] && zones['mat:' + f].length ? `［素材${zones['mat:' + f].length}: ${zones['mat:' + f].map(nm).join('・')}］` : '')).join(' / '));
  console.log('魔法・罠: ' + zones.st.map(nm).join(' / '));
  console.log('墓地    : ' + zones.gy.map(nm).join(' / '));
  console.log('除外    : ' + zones.ban.map(nm).join(' / '));
  console.log('手札    : ' + (zones.hand.map(nm).join(' / ') || 'なし'));
  // 完成盤面に必要なもの
  const need = [['field', 'bardiche'], ['field', 'requiem'], ['field', 'robe'], ['gy', 'veil'], ['st', 'fog#2']];
  for (const [z, c] of need) if (!zones[z].includes(c)) err(`${r.id}: 完成時に ${c} が ${z} にない`);
  if ((zones['mat:requiem'] || []).length !== 3) err(`${r.id}: ダーク・レクイエムの素材が3つではない`);
  if (!(zones['mat:requiem'] || []).includes('rebellion')) err(`${r.id}: ダーク・レクイエムがダーク・リベリオンを素材にしていない`);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
checkText(html.replace(/<script[\s\S]*?<\/script>/g, ''), 'index.html');

console.log(errors ? `\n${errors} 件の問題があります` : '\nOK: 問題は見つかりませんでした');
process.exit(errors ? 1 : 0);
