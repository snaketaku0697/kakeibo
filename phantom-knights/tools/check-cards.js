#!/usr/bin/env node
/* カード情報の自動照合
   使い方:
     git clone --depth 1 https://github.com/DawnbrandBots/yaml-yugi
     node phantom-knights/tools/check-cards.js <yaml-yugi のパス> [--text]

   js/data.js の各カードについて、カードデータベース yaml-yugi の記録と
   名前・公式DBのID・種類・レベル/ランク/リンク・属性・種族・攻守・リンクマーカーを突き合わせる。
   効果の文章は要約なので機械では比べられない。--text を付けると日本語テキストを表示するので、
   要約を書き換えたときは目で読み比べる。 */
'use strict';
const fs = require('fs');
const path = require('path');
require(path.join(__dirname, '..', 'js', 'data.js'));
const D = globalThis.PK_DATA;

const repo = process.argv[2];
const showText = process.argv.includes('--text');
if (!repo || !fs.existsSync(path.join(repo, 'data', 'cards'))) {
  console.error('yaml-yugi のパスを指定してください: node check-cards.js <path> [--text]');
  process.exit(2);
}

const stripRuby = (s) => s.replace(/<ruby>(.*?)<rt>.*?<\/rt><\/ruby>/g, '$1');
const norm = (s) => s.normalize('NFKC').replace(/\s/g, '');
const RACE = { Warrior: '戦士族', Dragon: 'ドラゴン族', Fairy: '天使族' };
const PROP = { Normal: '通常', Continuous: '永続', 'Quick-Play': '速攻' };

let ng = 0;
for (const [id, c] of Object.entries(D.cards)) {
  const problems = [];
  const file = path.join(repo, 'data', 'cards', String(c.pw).padStart(8, '0') + '.json');
  if (!c.pw || !fs.existsSync(file)) {
    console.log(`NG  ${c.name}: パスワード ${c.pw} の記録が見つからない`);
    ng++;
    continue;
  }
  const y = JSON.parse(fs.readFileSync(file, 'utf8'));
  const ja = stripRuby(y.name.ja || '');
  if (norm(ja) !== norm(c.name)) problems.push(`名前: ${c.name} ≠ ${ja}`);
  if (y.konami_id !== c.cid) problems.push(`公式DBのID: ${c.cid} ≠ ${y.konami_id}`);

  const num = (re) => { const m = c.spec.match(re); return m ? Number(m[1]) : undefined; };
  if (y.card_type === 'Monster') {
    const line = y.monster_type_line || '';
    const kind = /Link/.test(line) ? 'link' : /Xyz/.test(line) ? 'xyz' : 'main';
    if (kind !== c.kind) problems.push(`種類: ${c.kind} ≠ ${kind}`);
    if (y.attribute === 'DARK' && !c.spec.includes('闇属性')) problems.push('属性: 闇属性の記載がない');
    const race = RACE[line.split(' / ')[0]];
    if (!race || !c.spec.includes(race)) problems.push(`種族: ${line.split(' / ')[0]} (${race || '未対応'}) の記載がない`);
    if (y.level !== undefined && num(/レベル(\d+)／/) !== y.level) problems.push(`レベル ≠ ${y.level}`);
    if (y.rank !== undefined && num(/ランク(\d+)／/) !== y.rank) problems.push(`ランク ≠ ${y.rank}`);
    if (y.link_arrows) {
      if (num(/リンク(\d+)／/) !== y.link_arrows.length) problems.push(`リンク ≠ ${y.link_arrows.length}`);
      if ((c.arrows || []).join('') !== y.link_arrows.join('')) problems.push(`リンクマーカー: ${(c.arrows || []).join('')} ≠ ${y.link_arrows.join('')}`);
    }
    if (num(/攻(\d+)/) !== y.atk) problems.push(`攻撃力 ≠ ${y.atk}`);
    if (y.def !== undefined && num(/守(\d+)/) !== y.def) problems.push(`守備力 ≠ ${y.def}`);
  } else {
    const kind = y.card_type === 'Trap' ? 'trap' : 'spell';
    if (kind !== c.kind) problems.push(`種類: ${c.kind} ≠ ${kind}`);
    const want = PROP[y.property] + (kind === 'trap' ? '罠' : '魔法');
    if (c.spec !== want) problems.push(`種類の表記: ${c.spec} ≠ ${want}`);
  }
  const hasJa = !!(y.text && y.text.ja);
  if (hasJa && c.checked !== 'yy') problems.push("checked は 'yy' のはず");
  if (!hasJa && c.checked !== 'yy-en') problems.push("日本語テキストがないので checked は 'yy-en' のはず");

  if (problems.length) { ng++; console.log(`NG  ${c.name}\n      ` + problems.join('\n      ')); }
  else console.log(`ok  ${c.name}`);
  if (showText) console.log('      ' + stripRuby((y.text && (y.text.ja || y.text.en)) || '').replace(/\n/g, '\n      ') + '\n');
}
console.log(ng ? `\n${ng} 枚に食い違いがあります` : `\nOK: ${Object.keys(D.cards).length} 枚すべて一致しました`);
process.exit(ng ? 1 : 0);
