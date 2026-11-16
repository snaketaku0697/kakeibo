/* ============================================================
   幻影騎士団レンタルデッキ 学習ガイド - データ
   元動画: https://youtu.be/JQ--WmlgkL8
   本文中の {c:ID} はカード、{t:ID} は用語への参照（押すと説明が開く）。
   {c:ID|表示名} のように表示名を変えられる。
   ============================================================ */
(function (global) {
  'use strict';

  var VIDEO_ID = 'JQ--WmlgkL8';
  var DB_CARD = 'https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&request_locale=ja&cid=';
  var DB_SEARCH = 'https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&stype=1&request_locale=ja&keyword=';

  /* ---------- カード ----------
     kind: main(メインデッキのモンスター) / trap / spell / xyz / link
     pw / cid: カードのパスワードと公式カードデータベースのID
     checked: 'yy'    = カードデータベース yaml-yugi の日本語テキストと照合済み
              'yy-en' = yaml-yugi に日本語テキストがなく、英語テキストと照合
     名前・レベル・攻守などは tools/check-cards.js で機械的に照合できる
  */
  var cards = {
    decay: {
      name: '幻影騎士団ディケイクローク', read: 'ファントム・ナイツ ディケイクローク', short: 'ディケイクローク',
      kind: 'main', spec: 'レベル3／闇属性／戦士族／攻1000・守300', pw: 46072770, cid: 22967, checked: 'yy',
      alias: ['文字起こしでは「ディケイクロック」'],
      role: '{t:shodo}の1枚。出したときに仲間を{t:search}し、後半は{t:gy}から「エクシーズモンスターを素材にできるようにする」効果を使います。',
      effects: [
        '① 手札の他の「幻影騎士団」カードを相手に見せて、手札から{t:ss}できる。',
        '② {t:ns|召喚}・{t:ss}した場合、デッキから「幻影騎士団」モンスター1体を手札に加える。',
        '③ {t:gy}のこのカードを{t:banish}し、自分の場のエクシーズモンスター1体を{t:target}に発動。このターン、そのモンスターをランクと同じ数値のレベルとして{t:xyz}の{t:material}にできる。',
        '①②③はそれぞれ{t:opt}。'
      ],
      tips: '③は墓地にいないと使えません。ルートごとに「どのタイミングで墓地に置くか」が決まっています。'
    },
    solleret: {
      name: '幻影騎士団ドゥームソルレット', read: 'ファントム・ナイツ ドゥームソルレット', short: 'ドゥームソルレット',
      kind: 'main', spec: 'レベル3／闇属性／戦士族／攻400・守1400', pw: 83566725, cid: 22968, checked: 'yy',
      alias: ['文字起こしでは「ドゥームソレット」「ソウルレット」'],
      role: '{t:shodo}の1枚。出すとデッキから「幻影騎士団」の魔法・罠を{t:set}でき、後半は{t:gy}からレベルを上げる効果を使います。',
      effects: [
        '① 自分の場にモンスターがいない場合、手札から{t:ss}できる（1ターンに1度）。',
        '② {t:ns|召喚}・{t:ss}した場合、デッキから「幻影騎士団」魔法・罠カード1枚を自分の場に{t:set}する。',
        '③ {t:gy}のこのカードを{t:banish}し、自分の場のレベル3・ランク3の闇属性モンスターを2体まで{t:target}に発動。その{t:level|レベル・ランク}を1つ上げる。',
        '②③はそれぞれ{t:opt}。'
      ],
      tips: '②でセットするのは基本的に{c:veil}。ルート3だけは{c:rum}をセットします。'
    },
    scales: {
      name: '幻影騎士団ティアースケイル', read: 'ファントム・ナイツ ティアースケイル', short: 'ティアースケイル',
      kind: 'main', spec: 'レベル3／闇属性／戦士族／攻600・守1600', pw: 25538345, cid: 15482, checked: 'yy',
      alias: ['動画での呼び方「ティアスケ」', '文字起こしでは「ティアスケール」'],
      role: '手札を1枚捨ててデッキのカードを{t:gy}へ送る係。墓地にいるときは、仲間が墓地から{t:banish}されると自分で場に戻ってきます。',
      effects: [
        '① 手札を1枚捨てて発動。デッキから「ティアースケイル」以外の「幻影騎士団」モンスター1体か「ファントム」魔法・罠カード1枚を{t:gy}へ送る。',
        '② このカードが{t:gy}にあり、自分の墓地から他の「幻影騎士団」モンスターか「ファントム」魔法・罠カードが{t:banish}された場合に発動できる。このカードを{t:ss}する（この方法で出たあと場を離れると除外される）。',
        '①②はそれぞれ{t:opt}。'
      ],
      tips: '②は「墓地にいるとき」だけ。場にいるときに仲間が除外されても戻る効果は使えません。'
    },
    boots: {
      name: '幻影騎士団サイレントブーツ', read: 'ファントム・ナイツ サイレントブーツ', short: 'サイレントブーツ',
      kind: 'main', spec: 'レベル3／闇属性／戦士族／攻200・守1200', pw: 36426778, cid: 12199, checked: 'yy',
      alias: ['動画での呼び方「ブーツ」'],
      role: '2体目のレベル3として手札から出せるカード。{t:gy}に行ったあとは{c:fog}を{t:search}します。',
      effects: [
        '① 自分の場に「幻影騎士団」モンスターがいる場合、手札から{t:ss}できる（この方法は1ターンに1度）。',
        '② {t:gy}のこのカードを{t:banish}して発動。デッキから「ファントム」魔法・罠カード1枚を手札に加える。'
      ],
      tips: '②を使うには墓地にいる必要があります。エクシーズの{t:material}にしたときは、このカードを取り除いて墓地へ送るのが基本です。'
    },
    robe: {
      name: '幻影騎士団ダスティローブ', read: 'ファントム・ナイツ ダスティローブ', short: 'ダスティローブ',
      kind: 'main', spec: 'レベル3／闇属性／戦士族／攻800・守1000', pw: 90432163, cid: 12198, checked: 'yy',
      alias: ['動画での呼び方「ローブ」'],
      role: '{t:gy}から「幻影騎士団」カードを{t:search}する係。最後は場で{c:bardiche}の攻撃力を上げます。',
      effects: [
        '① このカードが攻撃表示で場にいる場合、場の闇属性モンスター1体を{t:target}に発動。このカードを守備表示にし、対象のモンスターの攻撃力・守備力を相手ターンの終わりまで800上げる。',
        '② {t:gy}のこのカードを{t:banish}して発動。デッキから「ダスティローブ」以外の「幻影騎士団」カード1枚を手札に加える。',
        '①②はそれぞれ{t:opt}。'
      ],
      tips: '①を使うには「攻撃表示で場にいる」ことと「効果が{t:negate|無効}になっていない」ことが必要です。{c:rum}で出した直後は無効なので使えません。'
    },
    greaves: {
      name: '幻影騎士団ステンドグリーブ', read: 'ファントム・ナイツ ステンドグリーブ', short: 'ステンドグリーブ',
      kind: 'main', spec: 'レベル3／闇属性／戦士族／攻1200・守600', pw: 88544390, cid: 15481, checked: 'yy',
      alias: ['文字起こしでは「ステンドグレイブ」「ステンのグリーブ」'],
      role: '仲間が{t:ss}されたときに手札から追加で出てくるカード。{t:gy}からは手札の仲間を場に出せます。',
      effects: [
        '① 自分の場に「幻影騎士団」モンスターが{t:ss}された場合に発動。このカードを手札から特殊召喚する。その後、このカードのレベルを1つ上げることができる。',
        '② {t:gy}のこのカードを{t:banish}して発動。手札から「ステンドグリーブ」以外の「幻影騎士団」モンスター1体を特殊召喚する。その後、そのレベルを1つ上げることができる。',
        '①②はそれぞれ{t:opt}。'
      ],
      tips: '動画ではどちらの効果でも「レベルは上げない」よう案内されています。レベル3のまま使うためです。'
    },
    gloves: {
      name: '幻影騎士団ラギッドグローブ', read: 'ファントム・ナイツ ラギッドグローブ', short: 'ラギッドグローブ',
      kind: 'main', spec: 'レベル3／闇属性／戦士族／攻1000・守500', pw: 63821877, cid: 12200, checked: 'yy',
      alias: ['文字起こしでは「ラギットグローブ」'],
      role: '{t:gy}から自分を{t:banish}して、デッキのカードを墓地へ送る係。ルート3で{c:fog}を墓地に置くために使います。',
      effects: [
        '① このカードを{t:material}にして{t:xyz}した闇属性モンスターは、攻撃力が1000上がる効果を得る。',
        '② {t:gy}のこのカードを{t:banish}して発動。デッキから「幻影騎士団」カードか「ファントム」魔法・罠カード1枚を墓地へ送る。',
        '①②はそれぞれ{t:opt}。'
      ]
    },
    veil: {
      name: '幻影騎士団アンブレイジベイル', read: 'ファントム・ナイツ アンブレイジベイル', short: 'アンブレイジベイル',
      kind: 'trap', spec: '通常罠', pw: 85257384, cid: 23022, checked: 'yy',
      alias: ['文字起こしでは「アンブレージベイル」「アンブレージベル」'],
      role: '発動するとレベル3のモンスターになる罠（{t:trapmonster}）。{t:gy}に行ったあとは、相手ターンに{c:shiten}を出す役目があります。',
      effects: [
        '自分の場か{t:gy}に「幻影騎士団」モンスターがいる場合、{t:set}したターンでも発動できる。',
        '① このカードを通常モンスター（戦士族・闇属性・レベル3・攻0／守300）として守備表示で{t:ss}する（罠カードとしては扱わない）。その後、相手の攻撃表示モンスター1体を守備表示にできる。',
        '② {t:gy}のこのカードを{t:banish}して発動。闇属性エクシーズモンスター1体の{t:xyz}を行う。',
        '①②はそれぞれ{t:opt}。'
      ],
      tips: '②は相手ターンにも使えます（動画の実演より）。そのために、自分のターンのうちに墓地へ送っておきます。'
    },
    fog: {
      name: '幻影霧剣', read: 'ファントム・フォッグ・ブレード', short: '幻影霧剣',
      kind: 'trap', spec: '永続罠', pw: 25542642, cid: 12205, checked: 'yy',
      alias: ['動画での呼び方「霧剣（きりけん）」', '文字起こしでは「ファントムコックブレード」「キリケン」「切り札」「切り剣」'],
      role: '相手モンスター1体の効果と攻撃を止める{t:bogai}の罠。{t:gy}に行くと、墓地の「幻影騎士団」モンスターを場に戻す効果も使えます。',
      effects: [
        '① 場の効果モンスター1体を{t:target}に発動。そのモンスターは攻撃できず、効果は{t:negate|無効}になり、お互いにそのモンスターを攻撃対象に選べない（そのモンスターが場を離れるとこのカードは破壊される）。',
        '② {t:gy}のこのカードを{t:banish}し、自分の墓地の「幻影騎士団」モンスター1体を{t:target}に発動。そのモンスターを{t:ss}する（場を離れると除外される）。②は{t:opt}。'
      ],
      tips: '展開中は「捨てて→墓地から除外して仲間を戻す」道具として使い、最後に別の1枚を場に{t:set}して妨害にします。'
    },
    wing: {
      name: '幻影翼', read: 'ファントム・ウィング', short: '幻影翼',
      kind: 'trap', spec: '通常罠', pw: 98431356, cid: 12207, checked: 'yy',
      alias: ['動画での呼び方「ウィング」「翼」'],
      role: 'モンスターに少し耐性を付ける罠。動画では「付けることもできるが、妨害を作ったほうがよい」として{c:fog}を優先しています。',
      effects: [
        '① 場の表側表示モンスター1体を{t:target}に発動。そのモンスターの攻撃力を500上げ、このターンに1度だけ戦闘・効果では破壊されなくする。',
        '② {t:gy}のこのカードを{t:banish}し、自分の墓地の「幻影騎士団」モンスター1体を{t:target}に発動。そのモンスターを{t:ss}する（場を離れると除外される）。②は{t:opt}。'
      ]
    },
    rum: {
      name: 'RUM－幻影騎士団レクイエム', read: 'ランクアップマジック ファントム・ナイツ レクイエム', short: 'RUM－幻影騎士団レクイエム',
      kind: 'spell', spec: '通常魔法', pw: 62104532, cid: 23006, checked: 'yy',
      alias: ['動画では「ラウンチ」と呼ばれています'],
      role: '{t:banish}されている仲間を1体場に戻し、そのまま{c:rebellion}の上に{c:requiem}を重ねる（{t:rankup}）魔法。',
      effects: [
        '① 自分の{t:gy}・除外状態の「幻影騎士団」モンスターか「エクシーズ・ドラゴン」モンスター1体を{t:target}に発動。そのモンスターを効果を{t:negate|無効}にして{t:ss}する。',
        'その後、自分の場の闇属性エクシーズモンスター1体を選び、それよりランクが1つ高い「幻影騎士団」か「エクシーズ・ドラゴン」のエクシーズモンスターを、EXデッキからその上に重ねてエクシーズ召喚扱いで特殊召喚する。',
        'このカードは1ターンに1枚しか発動できない。'
      ],
      tips: '動画では「ラウンチ」と呼ばれていますが、説明されている動き（除外ゾーンから特殊召喚して、そのままランクアップ）は「RUM－幻影騎士団レクイエム」の効果と一致します。名前が似た「RUM－幻影騎士団ラウンチ」は、素材を持たないエクシーズモンスターにしか使えない別のカードで、除外ゾーンから特殊召喚する効果もありません。ゲーム内のカード名で確認してください。'
    },
    cherubini: {
      name: '彼岸の黒天使 ケルビーニ', read: 'ひがんのくろてんし ケルビーニ', short: 'ケルビーニ',
      kind: 'link', spec: 'リンク2／闇属性／天使族／攻500　素材：レベル3モンスター2体', pw: 58699500, cid: 13506, checked: 'yy',
      role: '最初に出すリンクモンスター。デッキからレベル3を1体{t:gy}へ送って、展開のきっかけを作ります。',
      effects: [
        '① このカードの{t:linkzone}のモンスターは効果では破壊されない。',
        '② 場のこのカードが戦闘か相手の効果で破壊される場合、代わりに自分の場のカード1枚を{t:gy}へ送ることができる。',
        '③ デッキからレベル3モンスター1体を{t:gy}へ送り、場の「彼岸」モンスター1体（このカード自身）を{t:target}に発動。攻撃力・守備力を、送ったモンスターの数値分だけターンの終わりまで上げる（{t:opt}）。'
      ],
      arrows: ['↙', '↘'],
      tips: '「幻影騎士団」ではありませんが、動画では「実質、幻影騎士団のカード」と紹介されています。攻撃力が上がるのはおまけで、目的は墓地へ送ることです。'
    },
    scythe: {
      name: '幻影騎士団マレヴォレンスサイス', read: 'ファントム・ナイツ マレヴォレンスサイス', short: 'マレヴォレンスサイス',
      kind: 'xyz', spec: 'ランク3／闇属性／戦士族／攻1900・守0　素材：レベル3の闇属性モンスター2体', pw: 78449284, cid: 22986, checked: 'yy',
      alias: ['動画での呼び方「サイス」', '文字起こしでは「マレボレンスサイレス」'],
      role: 'デッキから仲間を1体呼び、あとで{c:rum}も{t:search}する、展開の中心になるエクシーズモンスター。',
      effects: [
        '① {t:material}を1つ取り除いて発動。デッキから「幻影騎士団」モンスター1体を{t:ss}する。',
        '② このカードが場にいる状態で、自分が「エクシーズ・ドラゴン」モンスターを{t:xyz}した場合に発動。デッキから「RUM」魔法カード1枚を手札に加える。',
        '③ このカードが破壊された場合に発動。エクシーズモンスター以外の、自分の除外状態の「幻影騎士団」カード1枚を手札に加える。',
        '①②③はそれぞれ{t:opt}。'
      ],
      tips: '①でどの素材を取り除くかがルートごとに違います。「注意点」の画面にまとめています。'
    },
    shamanite: {
      name: '魔解騎士シャーマナイト', read: 'まかいきし シャーマナイト', short: 'シャーマナイト',
      kind: 'xyz', spec: 'ランク3／闇属性／戦士族／攻1700・守2400　素材：レベル3モンスター2体以上', pw: 16237004, cid: 23301, checked: 'yy-en',
      alias: ['文字起こしでは「シャカナイト」「シャーマナイト」'],
      role: '{t:banish}されたカードを呼び戻すエクシーズモンスター。除外された{c:fog}を自分の{t:material}にして、素材3つと引き換えにレベル3を1体戻します。',
      effects: [
        '① このカードを{t:xyz}した場合、または自分の罠カードが{t:banish}された場合に発動。除外状態の自分の罠カード1枚をこのカードの{t:material}にする。',
        '② 素材を好きな数だけ取り除いて発動。その数と同じレベルの、自分の{t:gy}・除外状態の闇属性モンスター1体を{t:ss}する。',
        '①②はそれぞれ{t:opt}。'
      ],
      tips: 'レベル3を呼ぶには素材が3つ必要です。最初の素材2つ＋①で入れる{c:fog}でちょうど3つになります。'
    },
    rebellion: {
      name: 'ダーク・リベリオン・エクシーズ・ドラゴン', read: '', short: 'ダーク・リベリオン',
      kind: 'xyz', spec: 'ランク4／闇属性／ドラゴン族／攻2500・守2000　素材：レベル4モンスター2体', pw: 16195942, cid: 11385, checked: 'yy',
      alias: ['動画での呼び方「ダリベ」'],
      role: '{c:requiem}を出すための土台。出した瞬間に{c:scythe}の②が使えるようになります。',
      effects: [
        '① {t:material}を2つ取り除き、相手の表側表示モンスター1体を{t:target}に発動。その攻撃力を半分にし、その数値分このカードの攻撃力を上げる。',
        'このガイドではこの効果は使いません。すぐに{c:rum}で{c:requiem}の素材にします。'
      ],
      tips: '相手ターンに出す{c:shiten}とは別のカードです。'
    },
    requiem: {
      name: 'ダーク・レクイエム・エクシーズ・ドラゴン', read: '', short: 'ダーク・レクイエム',
      kind: 'xyz', spec: 'ランク5／闇属性／ドラゴン族／攻3000・守2500　素材：レベル5モンスター3体', pw: 1621413, cid: 12639, checked: 'yy',
      alias: ['動画での呼び方「レクイエム」'],
      role: 'このデッキの{t:bogai}の主役。相手のモンスター効果を{t:negate|無効}にして破壊します。{t:material}の数だけ使えます。',
      effects: [
        '「ダーク・リベリオン・エクシーズ・ドラゴン」を{t:material}にしている場合、次の効果を得る。',
        '● 相手がモンスターの効果を発動した時、素材を1つ取り除いて発動できる。その発動を{t:negate|無効}にして破壊する。その後、自分の{t:gy}のエクシーズモンスター1体を{t:ss}できる。',
        '● 1ターンに1度、素材を1つ取り除き、相手の表側表示モンスター1体を{t:target}に発動。その攻撃力を0にし、元々の攻撃力分このカードの攻撃力を上げる。'
      ],
      tips: '止められるのは「モンスターの効果」だけ。魔法・罠は止められません。'
    },
    bardiche: {
      name: '幻影騎士団ラスティ・バルディッシュ', read: 'ファントム・ナイツ ラスティ・バルディッシュ', short: 'ラスティ・バルディッシュ',
      kind: 'link', spec: 'リンク3／闇属性／戦士族／攻2100　素材：闇属性モンスター2体以上', pw: 26692769, cid: 14054, checked: 'yy',
      alias: ['動画での呼び方「バルディッシュ」'],
      role: 'デッキから罠を{t:set}し、さらに「自分の{t:linkzone}に闇属性エクシーズが出たとき、カードを1枚破壊できる」効果を持つリンクモンスター。',
      effects: [
        'このカードはリンク素材にできない。',
        '① 自分のメインフェイズに発動。デッキから「幻影騎士団」モンスター1体を{t:gy}へ送る。その後、デッキから「ファントム」魔法・罠カード1枚を自分の場に{t:set}する。',
        '② このカードが場にいる状態で、このカードの{t:linkzone}に闇属性エクシーズモンスターが{t:ss}された場合、場のカード1枚を{t:target}に発動できる。そのカードを破壊する。',
        '①②はそれぞれ{t:opt}。'
      ],
      arrows: ['↙', '↘', '➡'],
      tips: '②の破壊は1ターンに1度で、使うかどうかを選べます。自分のカードも破壊できるので、自分のターンは{c:breaksword}を破壊して利用し、相手ターンは相手のカードを破壊します。'
    },
    breaksword: {
      name: '幻影騎士団ブレイクソード', read: 'ファントム・ナイツ ブレイクソード', short: 'ブレイクソード',
      kind: 'xyz', spec: 'ランク3／闇属性／戦士族／攻2000・守1000　素材：レベル3モンスター2体', pw: 62709239, cid: 12203, checked: 'yy',
      role: '展開の最後に「わざと破壊される」ためのエクシーズモンスター。破壊されると{t:gy}の仲間2体をレベル4にして場に戻します。',
      effects: [
        '① 1ターンに1度、{t:material}を1つ取り除き、自分の場のカード1枚と相手の場のカード1枚を{t:target}に発動。そのカードを破壊する。',
        '② {t:xyz}されたこのカードが破壊された場合、自分の{t:gy}の同じレベルの「幻影騎士団」モンスター2体を{t:target}に発動。そのモンスターを{t:ss}し、レベルを1つ上げる。この効果を使ったあと、ターンの終わりまで自分は闇属性モンスターしか特殊召喚できない。'
      ],
      tips: '戻した2体はレベル4になります。この2体が、相手ターンに出す{c:shiten}の素材になります。'
    },
    shiten: {
      name: '四天の龍 ダーク・リベリオン・エクシーズ・ドラゴン', read: 'してんのりゅう ダーク・リベリオン・エクシーズ・ドラゴン', short: '四天の龍 ダーク・リベリオン',
      kind: 'xyz', spec: 'ランク4／闇属性／ドラゴン族／攻2500・守2000　素材：闇属性レベル4モンスター2体', pw: 90091224, cid: 22730, checked: 'yy',
      alias: ['動画での呼び方「四天ダリベ」', '文字起こしでは「視点ダリベ」「始点ダリベ」'],
      role: '相手ターンに{c:veil}の効果で出すエクシーズモンスター。出たときにカードを破壊し、そのあと{c:ophion}か{c:karmael}に変身できます。',
      effects: [
        'このカードはルール上「幻影騎士団」カードとしても扱う。',
        '① このカードが{t:ss}した場合、自分と相手の場のカードをそれぞれ同じ数だけ{t:target}に発動できる。そのカードを破壊する。',
        '② 相手が効果を発動した時、このカードの{t:material}を1つ取り除いて発動できる。闇属性・ランク4のエクシーズモンスター1体を、このカードの上に重ねてエクシーズ召喚扱いでEXデッキから特殊召喚する。',
        '①②はそれぞれ{t:opt}。'
      ],
      tips: '①は自分のカードも同じ数だけ破壊する必要があります。'
    },
    ophion: {
      name: 'ヴェルズ・オピオン', read: '', short: 'ヴェルズ・オピオン',
      kind: 'xyz', spec: 'ランク4／闇属性／ドラゴン族／攻2550・守1650　素材：レベル4「ヴェルズ」モンスター2体', pw: 91279700, cid: 10006, checked: 'yy',
      alias: ['文字起こしでは「ベルズオピオン」'],
      role: '{c:shiten}から出す選択肢その1。レベル5以上のモンスターの{t:ss}を封じます。',
      effects: [
        '① {t:material}を持ったこのカードが場にいる限り、お互いにレベル5以上のモンスターを{t:ss}できない。',
        '② 1ターンに1度、素材を1つ取り除いて発動。デッキから「侵略の」魔法・罠カード1枚を手札に加える。'
      ],
      tips: '「お互いに」なので自分にもかかります。素材がなくなると封じる効果もなくなります。'
    },
    karmael: {
      name: 'エクソシスター・カルマエル', read: '', short: 'エクソシスター・カルマエル',
      kind: 'xyz', spec: 'ランク4／闇属性／天使族／攻2600・守1800　素材：レベル4「エクソシスター」モンスター2体', pw: 77675029, cid: 22147, checked: 'yy',
      alias: ['文字起こしでは「カルマイル」「カルマル」「カルマレ」'],
      role: '{c:shiten}から出す選択肢その2。相手のモンスター効果・通常魔法・通常罠の内容を書き換えて、実質的に止めます。',
      effects: [
        '① {t:xyz}した場合に発動。このターンの終わりに「エクソシスター」魔法・罠カード1枚を自分の場に{t:set}する（このデッキでは使いません）。',
        '② 相手がモンスターの効果・通常魔法・通常罠カードを発動した時に発動できる。このカードの{t:material}を全て取り除き、その効果を「相手の墓地からカード1枚を相手の手札に加える」に変える（{t:opt}）。',
        '書き換え後の文は発動した相手側から読むため、結果として「こちらの{t:gy}のカード1枚がこちらの手札に戻る」形になります。'
      ],
      tips: '動画では「実質的な万能無効」と紹介されています。魔法も止められるのが{c:requiem}との違いです。使えるのは1回です。'
    },
    droplet: {
      name: '禁じられた一滴', read: 'きんじられたひとしずく', short: '禁じられた一滴',
      kind: 'spell', spec: '速攻魔法', pw: 24299458, cid: 15299, checked: 'yy',
      alias: ['文字起こしでは「禁じられた一雫」'],
      role: '相手のモンスターの効果を{t:negate|無効}にする魔法。動画では「先攻でも後攻でも強く使える」「{t:gote}に向く」と紹介されています。展開ガイドの手順には出てきません。',
      effects: [
        '自分の手札・場から他のカードを好きな数だけ{t:gy}へ送って発動。その数だけ相手の場の効果モンスターを選ぶ。そのモンスターはターンの終わりまで、攻撃力が半分になり、効果は{t:negate|無効}になる。',
        '発動のために墓地へ送ったカードと同じ種類（モンスター・魔法・罠）のカードの効果を、相手はこのカードに対して発動できない。',
        'このカードは1ターンに1枚しか発動できない。'
      ],
      tips: '幻影騎士団は墓地へ送ったカードがそのまま役に立つので、このカードの{t:cost}が損になりにくいデッキです。'
    }
  };

  /* ---------- 用語 ---------- */
  var terms = {
    shodo: { name: '初動', read: 'しょどう', body: '展開を始めるための最初のカード（または組み合わせ）のこと。「1枚初動」は、そのカード1枚が手札にあれば最終盤面まで進められるという意味です。' },
    tenkai: { name: '展開', read: 'てんかい', body: 'カードの効果を次々につないで、モンスターを並べていくこと。このガイドの「展開ガイド」は、その手順を一手ずつ示したものです。' },
    search: { name: 'サーチ', read: '', body: 'デッキの中から特定のカードを選んで手札に加えること。引くのを待たずに、必要なカードを持ってこられます。' },
    gy: { name: '墓地', read: 'ぼち', body: '使い終わったカード、素材にしたモンスター、破壊されたカードが置かれる場所。幻影騎士団は「墓地にいるときに使える効果」が多く、墓地は第二の手札のように働きます。' },
    banish: { name: '除外', read: 'じょがい', body: 'カードを墓地とは別の場所（除外ゾーン）に置くこと。ふつうは戻ってきませんが、このデッキは除外したカードをシャーマナイトやRUMで呼び戻して使います。' },
    material: { name: '素材（X素材）', read: 'そざい', body: 'エクシーズモンスターの下に重ねてあるカードのこと。効果を使うときに「取り除く」と墓地へ行きます。どの素材を取り除くかは自分で選べるので、墓地に置きたいカードを選ぶのが大事です。リンク召喚で墓地へ送るモンスターは「リンク素材」と呼びます。' },
    linkzone: { name: 'リンク先', read: 'りんくさき', body: 'リンクモンスターのカード枠にある赤い矢印（リンクマーカー）が指しているゾーンのこと。このデッキのケルビーニとラスティ・バルディッシュは、どちらも左下と右下を指します。矢印の向きは各カードの説明で確認できます。' },
    bogai: { name: '妨害', read: 'ぼうがい', body: '相手のターンに、相手の効果を無効にしたりカードを破壊したりして、相手の動きを止めること。' },
    ns: { name: '通常召喚（召喚権）', read: 'つうじょうしょうかん', body: '手札のモンスターを効果を使わずに場に出すこと。1ターンに1回だけできます。この1回の権利を「召喚権」と呼びます。' },
    ss: { name: '特殊召喚', read: 'とくしゅしょうかん', body: 'カードの効果や、エクシーズ召喚・リンク召喚などでモンスターを出すこと。通常召喚と違って1ターンに何度でもできます（カードごとの回数制限は別にあります）。' },
    xyz: { name: 'エクシーズ召喚（X召喚）', read: '', body: '同じレベルのモンスターを2体以上重ねて、EXデッキからエクシーズモンスターを出すこと。重ねたモンスターは墓地へ行かず、素材として下に残ります。' },
    link: { name: 'リンク召喚', read: '', body: '場のモンスターを墓地へ送って、EXデッキからリンクモンスターを出すこと。必要な数はカードの「リンク2」「リンク3」の数字で決まります。リンクモンスター自身は、その数字の分として数えられます。' },
    level: { name: 'レベルとランク', read: '', body: 'レベルはふつうのモンスターが持つ星の数。ランクはエクシーズモンスターが持つ数字です。エクシーズモンスターはレベルを持たないので、ふつうは別のエクシーズ召喚の素材にできません。ディケイクロークの墓地効果は、これをできるようにします。' },
    ex: { name: 'EXデッキ', read: 'エクストラデッキ', body: 'エクシーズモンスターやリンクモンスターを入れておく、メインデッキとは別のデッキ。条件を満たせばいつでもここから出せます。' },
    set: { name: 'セット', read: '', body: 'カードを裏向きで場に置くこと。罠カードはふつうセットした次のターンから発動できます（アンブレイジベイルは条件付きでそのターンに発動できます）。' },
    cost: { name: 'コスト', read: '', body: '効果を使うために先に支払うもの。「手札を1枚捨てる」「素材を取り除く」「墓地の自分を除外する」など。このデッキは、コストで動いたカードがさらに効果を使えるように組まれています。' },
    target: { name: '対象', read: 'たいしょう', body: '効果をかける相手として選ぶカードのこと。' },
    negate: { name: '無効', read: 'むこう', body: '効果をなかったことにすること。「発動を無効にして破壊」は、効果を止めたうえでそのカードを破壊します。「効果が無効になっている」モンスターは自分の効果を使えません。' },
    revive: { name: '蘇生', read: 'そせい', body: '墓地のモンスターを場に特殊召喚すること。' },
    opt: { name: '1ターンに1度', read: '', body: '同じ名前のカードのその効果は、1ターンに1回しか使えないという制限。2枚目を出しても同じターンにはもう使えません。' },
    rankup: { name: 'ランクアップ（RUM）', read: '', body: 'エクシーズモンスターの上に、ランクが高いエクシーズモンスターを重ねて出すこと。元のモンスターと、その素材は、新しいモンスターの素材になります。RUMは「ランクアップマジック」の略です。' },
    position: { name: '表示形式', read: 'ひょうじけいしき', body: 'モンスターの向きのこと。縦向きが攻撃表示、横向きが守備表示です。特殊召喚するときにどちらで出すか選べます。' },
    atk: { name: '打点', read: 'だてん', body: '攻撃力のこと。対戦者がよく使う言い方です。' },
    handtrap: { name: '手札誘発', read: 'てふだゆうはつ', body: '相手のターンに手札から使える妨害カードのこと。動画では「灰流うらら」「エフェクト・ヴェーラー」「無限泡影」の名前が挙がっています。' },
    kantsu: { name: '貫通', read: 'かんつう', body: '相手に妨害されても、別の手段で展開を続けること。' },
    resource: { name: 'リソース', read: '', body: '次のターン以降にも使えるカードや効果の蓄えのこと。' },
    chain: { name: '効果に合わせて発動する', read: '', body: '相手が効果を発動したとき、それが処理される前にこちらが効果を発動すること（チェーン）。ゲーム内では、使える効果があると確認の表示が出ます。' },
    trapmonster: { name: '罠モンスター', read: 'わなモンスター', body: '発動するとモンスターとして場に出る罠カードのこと。出たあとはモンスターとして、エクシーズ召喚やリンク召喚の素材にできます。' },
    rental: { name: 'レンタルデッキ', read: '', body: 'イベントで借りて使える、あらかじめ組まれたデッキのこと。自分でカードを集めなくても参加できます。' },
    gote: { name: '後手まくり', read: 'ごてまくり', body: '後攻のとき、相手が先に作った盤面を崩して逆転すること。動画では「禁じられた一滴」がそのためのカードとして紹介されています。' }
  };

  /* ---------- 展開ルート ----------
     moves: [カードID, 元の場所, 移動先]
       場所: hand(手札) deck(デッキ) ex(EXデッキ) field(場・モンスター) st(場・魔法罠) gy(墓地) ban(除外)
             mat:カードID (そのエクシーズモンスターの素材)
     tags : 場のカードに付ける補足（表示形式・レベルなど）
     verify: 文字起こしだけでは確定できない点
     note : カードテキストにもとづく補足（動画の口頭説明にはない）
  */
  var routes = [
    {
      id: 'decay',
      hash: 'route-decay',
      name: 'ディケイクローク1枚',
      lead: '手札に「幻影騎士団ディケイクローク」があるとき',
      starter: ['decay'],
      hand: ['decay'],
      videoStart: 149,
      summary: '通常召喚からサーチでつなぐ、いちばん基本のルート。動画でも最初に、妨害の使い方とセットで解説されています。',
      phases: ['レベル3を2体並べてケルビーニ', '墓地と除外を回してマレヴォレンスサイス', 'シャーマナイトで除外から呼び戻す', 'ランク4からダーク・レクイエム', 'バルディッシュと仕上げ'],
      steps: [
        { phase: 0, t: 158, title: 'ディケイクロークを通常召喚する', use: ['decay'],
          do: '手札の{c:decay}を{t:ns}します。',
          why: '場に出たときの効果で仲間を{t:search}でき、ここからすべてが始まります。',
          moves: [['decay', 'hand', 'field']],
          pit: '使わない手札は場に{t:set}するか、そのまま持っておきます。動画では1枚だけで動けることを見せるため、他のカードは使っていません。' },
        { phase: 0, t: 161, title: 'ディケイクロークの効果でサイレントブーツをサーチ', use: ['decay', 'boots'],
          do: '{c:decay}の効果を発動し、デッキから{c:boots}を手札に加えます。',
          why: '{c:boots}は場に幻影騎士団がいれば手札から出せるので、すぐ2体目のレベル3になります。',
          moves: [['boots', 'deck', 'hand']] },
        { phase: 0, t: 164, title: 'サイレントブーツを手札から特殊召喚', use: ['boots'],
          do: '手札の{c:boots}を自身の効果で{t:ss}します。',
          why: 'レベル3が2体並び、{c:cherubini}を出せるようになります。',
          moves: [['boots', 'hand', 'field']] },
        { phase: 0, t: 168, title: 'レベル3の2体でケルビーニをリンク召喚', use: ['cherubini', 'decay', 'boots'],
          do: '{c:decay}と{c:boots}を素材に、EXデッキから{c:cherubini}を{t:link}します。',
          why: '素材にした2体が{t:gy}へ行きます。幻影騎士団は墓地で使える効果を持っているので、墓地に置くことが次の準備になります。',
          moves: [['cherubini', 'ex', 'field'], ['decay', 'field', 'gy'], ['boots', 'field', 'gy']] },
        { phase: 0, t: 176, title: 'ケルビーニの効果でティアースケイルを墓地へ送る', use: ['cherubini', 'scales'],
          do: '{c:cherubini}の効果を発動し、デッキから{c:scales}を{t:gy}へ送ります。',
          why: '{c:scales}は墓地にいるとき、仲間が墓地から{t:banish}されると自分で場に戻れます。次の手順でそれを使います。',
          moves: [['scales', 'deck', 'gy']],
          pit: '{c:cherubini}の攻撃力が少し上がりますが、目的は墓地へ送ることです。' },

        { phase: 1, t: 188, title: 'サイレントブーツの墓地効果で幻影霧剣をサーチ', use: ['boots', 'fog'],
          do: '{t:gy}の{c:boots}を{t:banish}して、デッキから{c:fog}を手札に加えます。',
          why: '{c:fog}は次の手札コストに使います。同時に「墓地から幻影騎士団が除外された」ことで{c:scales}が戻る条件も満たします。',
          moves: [['boots', 'gy', 'ban'], ['fog', 'deck', 'hand']] },
        { phase: 1, t: 200, title: 'ティアースケイルが墓地から戻ってくる', use: ['scales'],
          do: '{c:scales}の効果を発動し、{t:gy}から{t:ss}します。',
          why: '直前に{c:boots}が墓地から除外されたので、{c:scales}の「場に戻る」効果が使えます。',
          moves: [['scales', 'gy', 'field']],
          pit: '確認の表示が出たら見逃さないようにします。このタイミングでしか使えません。' },
        { phase: 1, t: 206, title: 'ティアースケイルの効果：霧剣を捨ててダスティローブを墓地へ', use: ['scales', 'fog', 'robe'],
          do: '{c:scales}の効果を発動します。{t:cost}として手札の{c:fog}を捨て、デッキから{c:robe}を{t:gy}へ送ります。',
          why: '捨てた{c:fog}も、送った{c:robe}も、墓地で効果を使えます。コストがそのまま次の手になります。',
          moves: [['fog', 'hand', 'gy'], ['robe', 'deck', 'gy']] },
        { phase: 1, t: 216, title: 'ダスティローブの墓地効果でステンドグリーブをサーチ', use: ['robe', 'greaves'],
          do: '{t:gy}の{c:robe}を{t:banish}して、デッキから{c:greaves}を手札に加えます。',
          why: '{c:greaves}は展開の終盤で手札から出します。{c:robe}は除外されますが、あとで{c:rum}で呼び戻します。',
          moves: [['robe', 'gy', 'ban'], ['greaves', 'deck', 'hand']] },
        { phase: 1, t: 221, title: '幻影霧剣の墓地効果でディケイクロークを蘇生', use: ['fog', 'decay'],
          do: '{t:gy}の{c:fog}を{t:banish}して、墓地の{c:decay}を{t:ss}します。',
          why: '場にレベル3が2体（{c:scales}と{c:decay}）並び、エクシーズ召喚ができます。',
          moves: [['fog', 'gy', 'ban'], ['decay', 'gy', 'field']] },
        { phase: 1, t: 231, title: 'レベル3の2体でマレヴォレンスサイスをエクシーズ召喚', use: ['scythe', 'scales', 'decay'],
          do: '{c:scales}と{c:decay}を重ねて、EXデッキから{c:scythe}を{t:xyz}します。',
          why: '{c:scythe}はデッキから仲間を呼べる、展開の中心です。',
          moves: [['scythe', 'ex', 'field'], ['scales', 'field', 'mat:scythe'], ['decay', 'field', 'mat:scythe']],
          pit: '動画では他のルートで「{c:cherubini}の{t:linkzone}に出す」よう案内されています（リンク先のモンスターは効果で破壊されないため）。' },
        { phase: 1, t: 244, title: 'サイスの効果：ディケイクロークを取り除いてドゥームソルレットを呼ぶ', use: ['scythe', 'decay', 'solleret'],
          do: '{c:scythe}の効果を発動します。{t:material}は{c:decay}を取り除き、デッキから{c:solleret}を{t:ss}します。',
          why: '{c:decay}を{t:gy}に置いておくと、あとで「エクシーズモンスターを素材にできるようにする」効果が使えます。',
          moves: [['decay', 'mat:scythe', 'gy'], ['solleret', 'deck', 'field']],
          pit: '取り除く素材を選ぶ画面で、{c:scales}ではなく{c:decay}を選びます。' },

        { phase: 2, t: 252, title: 'ドゥームソルレットの効果でアンブレイジベイルをセット', use: ['solleret', 'veil'],
          do: '{c:solleret}が特殊召喚されたときの効果を発動し、デッキから{c:veil}を場に{t:set}します。',
          why: '{c:veil}はセットしたターンでも発動でき、レベル3のモンスターになります。',
          moves: [['veil', 'deck', 'st']], tags: { veil: 'セット（裏向き）' } },
        { phase: 2, t: 260, title: 'アンブレイジベイルを発動してモンスターとして出す', use: ['veil'],
          do: 'セットした{c:veil}を発動し、自身をモンスターとして{t:ss}します。',
          why: 'これで場にレベル3が2体（{c:solleret}と{c:veil}）並びます。',
          moves: [['veil', 'st', 'field']], tags: { veil: '罠モンスター・レベル3' } },
        { phase: 2, t: 268, title: 'レベル3の2体でシャーマナイトをエクシーズ召喚', use: ['shamanite', 'solleret', 'veil'],
          do: '{c:solleret}と{c:veil}を重ねて、EXデッキから{c:shamanite}を{t:xyz}します。',
          why: '{c:shamanite}は、除外されたカードを場に呼び戻せます。',
          moves: [['shamanite', 'ex', 'field'], ['solleret', 'field', 'mat:shamanite'], ['veil', 'field', 'mat:shamanite']] },
        { phase: 2, t: 274, title: 'シャーマナイトの効果：除外されている幻影霧剣を素材に入れる', use: ['shamanite', 'fog'],
          do: '{c:shamanite}の効果を発動し、{t:banish}されている{c:fog}を自身の{t:material}にします。',
          why: '素材が2つから3つに増えます。レベル3を呼び戻すには素材が3つ必要です。',
          moves: [['fog', 'ban', 'mat:shamanite']] },
        { phase: 2, t: 285, title: 'シャーマナイトの効果：素材3つでサイレントブーツを除外から戻す', use: ['shamanite', 'boots'],
          do: '{c:shamanite}のもう1つの効果を発動します。{t:material}を3つ全部取り除き、除外されている{c:boots}を{t:ss}します。',
          why: '取り除いた{c:solleret}と{c:veil}が{t:gy}に行き、どちらも墓地で役目があります。動画では{c:boots}を「次のターン以降の{t:resource}になる」として選んでいます。',
          moves: [['solleret', 'mat:shamanite', 'gy'], ['veil', 'mat:shamanite', 'gy'], ['fog', 'mat:shamanite', 'gy'], ['boots', 'ban', 'field']] },

        { phase: 3, t: 300, title: 'ディケイクロークの墓地効果をシャーマナイトに使う', use: ['decay', 'shamanite'],
          do: '{t:gy}の{c:decay}を{t:banish}し、{c:shamanite}を対象に効果を発動します。',
          why: 'エクシーズモンスターはふつう別のエクシーズの素材にできません。この効果で{c:shamanite}をレベル3のモンスターとして素材に使えるようになります。',
          moves: [['decay', 'gy', 'ban']], tags: { shamanite: 'レベル3として素材にできる' },
          pit: '必ずこの効果を先に使い、次に{c:solleret}の効果を使います。動画でこの順番が指定されています（理由の説明はありません）。' },
        { phase: 3, t: 306, title: 'ドゥームソルレットの墓地効果で2体をレベル4にする', use: ['solleret', 'shamanite', 'boots'],
          do: '{t:gy}の{c:solleret}を{t:banish}し、{c:shamanite}と{c:boots}を対象に効果を発動します。',
          why: '2体ともレベル4として扱えるようになり、ランク4のエクシーズモンスターを出せます。',
          moves: [['solleret', 'gy', 'ban']], tags: { shamanite: 'レベル4として素材にできる', boots: 'レベル4' } },
        { phase: 3, t: 326, title: 'ダーク・リベリオンをエクシーズ召喚', use: ['rebellion', 'shamanite', 'boots'],
          do: '{c:shamanite}と{c:boots}を重ねて、EXデッキから{c:rebellion}を{t:xyz}します。',
          why: '{c:requiem}を出すための土台です。「エクシーズ・ドラゴン」を出したことで{c:scythe}の効果も使えます。',
          moves: [['rebellion', 'ex', 'field'], ['shamanite', 'field', 'mat:rebellion'], ['boots', 'field', 'mat:rebellion']],
          pit: 'EXデッキには名前が似た{c:shiten}もあります。ここで出すのは「四天の龍」が付かないほうです。' },
        { phase: 3, t: 329, title: 'サイスの効果でRUMをサーチ', use: ['scythe', 'rum'],
          do: '{c:scythe}の効果を発動し、デッキから{c:rum}を手札に加えます。',
          why: '{c:rebellion}を{c:requiem}にするための魔法カードです。',
          moves: [['rum', 'deck', 'hand']],
          verify: '動画ではこのカードを「ラウンチ」と呼んでいます。説明されている動きは「RUM－幻影騎士団レクイエム」の効果と一致しますが、ゲーム内のカード名で確認してください。' },
        { phase: 3, t: 337, title: 'RUMを発動：ダスティローブを戻してダーク・レクイエムを重ねる', use: ['rum', 'robe', 'requiem'],
          do: '手札の{c:rum}を発動します。除外されている{c:robe}を{t:ss}し、続けて{c:rebellion}の上に{c:requiem}を重ねます。',
          why: '{c:requiem}は{t:bogai}の主役です。{c:rebellion}とその素材2つを引き継ぐので、素材は3つになります。',
          moves: [['rum', 'hand', 'gy'], ['robe', 'ban', 'field'], ['requiem', 'ex', 'field'], ['rebellion', 'field', 'mat:requiem'], ['shamanite', 'mat:rebellion', 'mat:requiem'], ['boots', 'mat:rebellion', 'mat:requiem']],
          tags: { robe: '効果は無効' },
          pit: 'この方法で出した{c:robe}は効果が{t:negate|無効}です。攻撃力を上げる効果はまだ使えません。' },

        { phase: 4, t: 357, title: 'ステンドグリーブを手札から特殊召喚', use: ['greaves'],
          do: '手札の{c:greaves}の効果を発動して{t:ss}します。レベルは上げません。',
          why: '直前に{c:robe}が特殊召喚されたので条件を満たします。{c:breaksword}の素材になります。',
          moves: [['greaves', 'hand', 'field']],
          pit: '「レベルを1つ上げますか」と聞かれたら「上げない」を選びます。レベル3が2体必要だからです。' },
        { phase: 4, t: 372, title: 'ケルビーニとサイスでラスティ・バルディッシュをリンク召喚', use: ['bardiche', 'cherubini', 'scythe'],
          do: '{c:cherubini}と{c:scythe}を素材に、EXデッキから{c:bardiche}を{t:link}します。',
          why: '{c:scythe}は効果を使い切ったので素材にします。{c:scythe}の下に残っていた{c:scales}も{t:gy}へ行きます。',
          moves: [['bardiche', 'ex', 'field'], ['cherubini', 'field', 'gy'], ['scythe', 'field', 'gy'], ['scales', 'mat:scythe', 'gy']] },
        { phase: 4, t: 387, title: 'バルディッシュの効果：ドゥームソルレットを墓地へ、幻影霧剣をセット', use: ['bardiche', 'solleret', 'fog'],
          do: '{c:bardiche}の効果を発動します。デッキから{c:solleret}（2枚目）を{t:gy}へ送り、デッキから{c:fog}を場に{t:set}します。',
          why: 'セットした{c:fog}は相手ターンの{t:bogai}になります。墓地へ送るカードは、動画では「次のターンのため」に{c:solleret}を選んでいます。',
          moves: [['solleret#2', 'deck', 'gy'], ['fog#2', 'deck', 'st']], tags: { 'fog#2': 'セット（裏向き）' },
          pit: '動画では{c:wing}をセットする選択肢にも触れたうえで、妨害になる{c:fog}を選んでいます。' },
        { phase: 4, t: 410, title: 'ブレイクソードをバルディッシュのリンク先にエクシーズ召喚', use: ['breaksword', 'greaves', 'robe'],
          do: '{c:greaves}と{c:robe}を重ねて、EXデッキから{c:breaksword}を{t:xyz}します。置く場所は{c:bardiche}の{t:linkzone}にします。',
          why: 'リンク先に闇属性エクシーズモンスターが出ると、{c:bardiche}の破壊効果を使えます。',
          moves: [['breaksword', 'ex', 'field'], ['greaves', 'field', 'mat:breaksword'], ['robe', 'field', 'mat:breaksword']],
          pit: 'リンク先以外に置くと、{c:bardiche}の効果を使えず、次の手順に進めません。' },
        { phase: 4, t: 417, title: 'バルディッシュの効果でブレイクソードを自分で破壊する', use: ['bardiche', 'breaksword'],
          do: '{c:bardiche}の効果で、出したばかりの{c:breaksword}を選んで破壊します。',
          why: '{c:breaksword}は破壊されると{t:gy}の仲間2体を場に戻せます。損ではなく、そのために破壊します。',
          moves: [['breaksword', 'field', 'gy'], ['greaves', 'mat:breaksword', 'gy'], ['robe', 'mat:breaksword', 'gy']] },
        { phase: 4, t: 422, title: 'ブレイクソードの効果でダスティローブとティアースケイルを蘇生', use: ['breaksword', 'robe', 'scales'],
          do: '{c:breaksword}の効果を発動し、{t:gy}の{c:robe}と{c:scales}を{t:ss}します。{c:robe}は攻撃表示で出します。',
          why: '2体はレベル4になり、相手ターンに{c:shiten}の素材になります。動画では「必ず{c:robe}を含める」と案内されています。',
          moves: [['robe', 'gy', 'field'], ['scales', 'gy', 'field']], tags: { robe: '攻撃表示・レベル4', scales: 'レベル4' },
          pit: '{c:robe}を守備表示で出すと、次の効果が使えません。' },
        { phase: 4, t: 434, title: 'ダスティローブの効果でバルディッシュの攻撃力を上げる', use: ['robe', 'bardiche'],
          do: '{c:robe}の効果を発動します。{c:robe}を守備表示にして、{c:bardiche}の攻撃力を800上げます。',
          why: '{c:bardiche}の攻撃力が2900になり、戦闘で破壊されにくくなります。',
          moves: [], tags: { robe: '守備表示・レベル4', bardiche: '攻撃力2900' },
          pit: '今度の{c:robe}は{c:breaksword}の効果で出したので、効果は無効になっていません。ここで使います。' }
      ],
      done: { t: 446, text: '盤面の完成です。{c:requiem}でモンスター効果を3回まで止められ、{c:fog}でさらに1体を止められます。{t:gy}の{c:veil}は相手ターンに使います。' }
    },

    {
      id: 'solleret',
      hash: 'route-solleret',
      name: 'ドゥームソルレット1枚',
      lead: '手札に「幻影騎士団ドゥームソルレット」があるとき',
      starter: ['solleret'],
      hand: ['solleret'],
      videoStart: 648,
      summary: '召喚権を使わずに始められるルート。最終盤面はディケイクロークのルートと同じです。',
      phases: ['ソルレットとベイルでケルビーニ', 'ディケイクロークからマレヴォレンスサイス', 'シャーマナイトで除外から呼び戻す', 'ランク4からダーク・レクイエム', 'バルディッシュと仕上げ'],
      steps: [
        { phase: 0, t: 656, title: 'ドゥームソルレットを手札から特殊召喚', use: ['solleret'],
          do: '場にモンスターがいない状態で、手札の{c:solleret}を自身の効果で{t:ss}します。',
          why: '{t:ns|召喚権}を使わずに出せるので、あとで{c:decay}を通常召喚できます。',
          moves: [['solleret', 'hand', 'field']],
          verify: '動画では出し方を口頭で説明していません。あとで「まだ召喚権を使っていない」と話しているので、通常召喚ではなく特殊召喚です。' },
        { phase: 0, t: 656, title: 'ドゥームソルレットの効果でアンブレイジベイルをセット', use: ['solleret', 'veil'],
          do: '{c:solleret}の効果を発動し、デッキから{c:veil}を場に{t:set}します。',
          why: '{c:veil}をモンスターとして出せば、レベル3が2体になります。',
          moves: [['veil', 'deck', 'st']], tags: { veil: 'セット（裏向き）' } },
        { phase: 0, t: 666, title: 'アンブレイジベイルを発動してモンスターとして出す', use: ['veil'],
          do: 'セットした{c:veil}を発動し、自身をモンスターとして{t:ss}します。',
          why: '場にレベル3が2体並びます。',
          moves: [['veil', 'st', 'field']], tags: { veil: '罠モンスター・レベル3' } },
        { phase: 0, t: 667, title: 'レベル3の2体でケルビーニをリンク召喚', use: ['cherubini', 'solleret', 'veil'],
          do: '{c:solleret}と{c:veil}を素材に、EXデッキから{c:cherubini}を{t:link}します。',
          why: '{c:solleret}と{c:veil}が{t:gy}に行きます。どちらも墓地で使う効果があります。',
          moves: [['cherubini', 'ex', 'field'], ['solleret', 'field', 'gy'], ['veil', 'field', 'gy']] },
        { phase: 0, t: 670, title: 'ケルビーニの効果でダスティローブを墓地へ送る', use: ['cherubini', 'robe'],
          do: '{c:cherubini}の効果を発動し、デッキから{c:robe}を{t:gy}へ送ります。',
          why: '{c:robe}の墓地効果で{c:decay}を{t:search}するためです。',
          moves: [['robe', 'deck', 'gy']],
          pit: 'ルート1では{c:scales}を送りましたが、このルートでは{c:robe}です。' },

        { phase: 1, t: 682, title: 'ダスティローブの墓地効果でディケイクロークをサーチ', use: ['robe', 'decay'],
          do: '{t:gy}の{c:robe}を{t:banish}して、デッキから{c:decay}を手札に加えます。',
          why: 'まだ{t:ns|召喚権}が残っているので、{c:decay}を通常召喚できます。',
          moves: [['robe', 'gy', 'ban'], ['decay', 'deck', 'hand']] },
        { phase: 1, t: 688, title: 'ディケイクロークを通常召喚する', use: ['decay'],
          do: '手札の{c:decay}を{t:ns}します。置く場所は{c:cherubini}の{t:linkzone}にします。',
          why: '{c:cherubini}のリンク先にいるモンスターは効果で破壊されません。動画では「やらない理由がないので、できるだけリンク先で動く」と案内されています。',
          moves: [['decay', 'hand', 'field']],
          verify: '動画ではリンク先に置く利点として具体的なカード名を挙げていますが、文字起こしでは聞き取れていません。' },
        { phase: 1, t: 708, title: 'ディケイクロークの効果でサイレントブーツをサーチ', use: ['decay', 'boots'],
          do: '{c:decay}の効果を発動し、デッキから{c:boots}を手札に加えます。',
          why: 'すぐに手札から出せる2体目のレベル3です。',
          moves: [['boots', 'deck', 'hand']] },
        { phase: 1, t: 708, title: 'サイレントブーツを手札から特殊召喚', use: ['boots'],
          do: '手札の{c:boots}を自身の効果で{t:ss}します。',
          why: 'レベル3が2体（{c:decay}と{c:boots}）並びます。',
          moves: [['boots', 'hand', 'field']] },
        { phase: 1, t: 710, title: 'レベル3の2体でマレヴォレンスサイスをエクシーズ召喚', use: ['scythe', 'decay', 'boots'],
          do: '{c:decay}と{c:boots}を重ねて、EXデッキから{c:scythe}を{t:xyz}します。',
          why: 'デッキから仲間を呼べる、展開の中心です。',
          moves: [['scythe', 'ex', 'field'], ['decay', 'field', 'mat:scythe'], ['boots', 'field', 'mat:scythe']] },
        { phase: 1, t: 712, title: 'サイスの効果：サイレントブーツを取り除いてティアースケイルを呼ぶ', use: ['scythe', 'boots', 'scales'],
          do: '{c:scythe}の効果を発動します。{t:material}は必ず{c:boots}を取り除き、デッキから{c:scales}を{t:ss}します。',
          why: '{c:boots}を{t:gy}に置けば、墓地効果で{c:fog}を{t:search}できます。',
          moves: [['boots', 'mat:scythe', 'gy'], ['scales', 'deck', 'field']],
          pit: 'ルート1では{c:decay}を取り除きましたが、このルートでは{c:boots}です。{c:decay}は{c:scythe}の下に残ります。' },
        { phase: 1, t: 718, title: 'サイレントブーツの墓地効果で幻影霧剣をサーチ', use: ['boots', 'fog'],
          do: '{t:gy}の{c:boots}を{t:banish}して、デッキから{c:fog}を手札に加えます。',
          why: '次の手札{t:cost}に使います。',
          moves: [['boots', 'gy', 'ban'], ['fog', 'deck', 'hand']] },
        { phase: 1, t: 729, title: 'ティアースケイルの効果：霧剣を捨ててディケイクローク（2枚目）を墓地へ', use: ['scales', 'fog', 'decay'],
          do: '{c:scales}の効果を発動します。{t:cost}として手札の{c:fog}を捨て、デッキから2枚目の{c:decay}を{t:gy}へ送ります。',
          why: '1枚目の{c:decay}は{c:scythe}の下に残っていて墓地効果を使えません。そのため2枚目を墓地に用意します。',
          moves: [['fog', 'hand', 'gy'], ['decay#2', 'deck', 'gy']],
          verify: 'この場面は文字起こしが途切れています。直後の「今ティアースケイルで送っておいたディケイクロークを特殊召喚」と、13:00ごろの説明から読み取っています。' },

        { phase: 2, t: 738, title: '幻影霧剣の墓地効果でディケイクローク（2枚目）を蘇生', use: ['fog', 'decay'],
          do: '{t:gy}の{c:fog}を{t:banish}して、墓地の{c:decay}（2枚目）を{t:ss}します。',
          why: '場にレベル3が2体（{c:scales}と{c:decay}）並びます。',
          moves: [['fog', 'gy', 'ban'], ['decay#2', 'gy', 'field']] },
        { phase: 2, t: 746, title: 'シャーマナイトをケルビーニのリンク先にエクシーズ召喚', use: ['shamanite', 'scales', 'decay'],
          do: '{c:scales}と{c:decay}（2枚目）を重ねて、EXデッキから{c:shamanite}を{t:xyz}します。置く場所は{c:cherubini}の{t:linkzone}にします。',
          why: '{c:shamanite}は除外されたカードを呼び戻せます。',
          moves: [['shamanite', 'ex', 'field'], ['scales', 'field', 'mat:shamanite'], ['decay#2', 'field', 'mat:shamanite']] },
        { phase: 2, t: 753, title: 'シャーマナイトの効果：除外されている幻影霧剣を素材に入れる', use: ['shamanite', 'fog'],
          do: '{c:shamanite}の効果を発動し、{t:banish}されている{c:fog}を自身の{t:material}にします。',
          why: '素材が3つになり、レベル3を呼び戻せるようになります。',
          moves: [['fog', 'ban', 'mat:shamanite']],
          pit: 'ここまでの手順どおりなら{c:fog}は必ず除外されています。' },
        { phase: 2, t: 761, title: 'シャーマナイトの効果：素材3つでサイレントブーツを除外から戻す', use: ['shamanite', 'boots'],
          do: '{c:shamanite}の効果を発動します。{t:material}を3つ取り除き、除外されている{c:boots}を{t:ss}します。',
          why: '動画では「次のターンの動きも安定する」として{c:boots}を選んでいます。取り除いた{c:scales}と{c:decay}は{t:gy}で次の役目があります。',
          moves: [['scales', 'mat:shamanite', 'gy'], ['decay#2', 'mat:shamanite', 'gy'], ['fog', 'mat:shamanite', 'gy'], ['boots', 'ban', 'field']] },

        { phase: 3, t: 774, title: 'ディケイクローク（2枚目）の墓地効果をシャーマナイトに使う', use: ['decay', 'shamanite'],
          do: '{t:gy}の{c:decay}を{t:banish}し、{c:shamanite}を対象に効果を発動します。',
          why: '{c:shamanite}をエクシーズ召喚の素材に使えるようにします。',
          moves: [['decay#2', 'gy', 'ban']], tags: { shamanite: 'レベル3として素材にできる' },
          pit: '必ず{c:solleret}の効果より先に使います。動画でこの順番が指定されています。' },
        { phase: 3, t: 783, title: 'ティアースケイルが墓地から戻ってくる', use: ['scales'],
          do: '{c:scales}の効果を発動し、{t:gy}から{t:ss}します。',
          why: '直前に{c:decay}が墓地から除外されたので条件を満たします。素材がもう1体増えます。',
          moves: [['scales', 'gy', 'field']] },
        { phase: 3, t: 789, title: 'ドゥームソルレットの墓地効果で2体をレベル4にする', use: ['solleret', 'scales', 'shamanite'],
          do: '{t:gy}の{c:solleret}を{t:banish}し、{c:scales}と{c:shamanite}を対象に効果を発動します。',
          why: '2体をレベル4として扱い、ランク4のエクシーズ召喚に使います。動画では、対象は{c:boots}でもよいと話しています。',
          moves: [['solleret', 'gy', 'ban']], tags: { shamanite: 'レベル4として素材にできる', scales: 'レベル4' } },
        { phase: 3, t: 805, title: 'ダーク・リベリオンをエクシーズ召喚', use: ['rebellion', 'scales', 'shamanite'],
          do: '{c:scales}と{c:shamanite}を重ねて、EXデッキから{c:rebellion}を{t:xyz}します。',
          why: '{c:requiem}の土台です。{c:scythe}の効果を使う条件にもなります。',
          moves: [['rebellion', 'ex', 'field'], ['shamanite', 'field', 'mat:rebellion'], ['scales', 'field', 'mat:rebellion']],
          pit: '出すのは「四天の龍」が付かないほうの{c:rebellion}です。' },
        { phase: 3, t: 815, title: 'サイスの効果でRUMをサーチ', use: ['scythe', 'rum'],
          do: '{c:scythe}の効果を発動し、デッキから{c:rum}を手札に加えます。',
          why: '{c:rebellion}を{c:requiem}にするためです。',
          moves: [['rum', 'deck', 'hand']] },
        { phase: 3, t: 821, title: 'RUMを発動：ダスティローブを戻してダーク・レクイエムを重ねる', use: ['rum', 'robe', 'requiem'],
          do: '手札の{c:rum}を発動します。除外されている{c:robe}を{t:ss}し、続けて{c:rebellion}の上に{c:requiem}を重ねます。動画では{c:requiem}を守備表示にしています。',
          why: '{t:bogai}の主役を出します。素材は{c:rebellion}と、その素材2つの合計3つです。',
          moves: [['rum', 'hand', 'gy'], ['robe', 'ban', 'field'], ['requiem', 'ex', 'field'], ['rebellion', 'field', 'mat:requiem'], ['shamanite', 'mat:rebellion', 'mat:requiem'], ['scales', 'mat:rebellion', 'mat:requiem']],
          tags: { robe: '効果は無効', requiem: '守備表示' },
          pit: 'この方法で出した{c:robe}は効果が{t:negate|無効}です。',
          verify: '守備表示にする理由は、文字起こしでは「ライストケア」とだけ話しています（魔法カード「ライトニング・ストーム」への備えと思われますが未確認です）。' },

        { phase: 4, t: 835, title: 'ケルビーニとサイスでラスティ・バルディッシュをリンク召喚', use: ['bardiche', 'cherubini', 'scythe'],
          do: '{c:cherubini}と{c:scythe}を素材に、EXデッキから{c:bardiche}を{t:link}します。',
          why: '{c:scythe}の効果は使い切りました。下に残っていた1枚目の{c:decay}も{t:gy}へ行きます。',
          moves: [['bardiche', 'ex', 'field'], ['cherubini', 'field', 'gy'], ['scythe', 'field', 'gy'], ['decay', 'mat:scythe', 'gy']] },
        { phase: 4, t: 851, title: 'バルディッシュの効果：ドゥームソルレットを墓地へ、幻影霧剣をセット', use: ['bardiche', 'solleret', 'fog'],
          do: '{c:bardiche}の効果を発動します。デッキから{c:solleret}（2枚目）を{t:gy}へ送り、デッキから{c:fog}を場に{t:set}します。',
          why: '{c:fog}は相手ターンの{t:bogai}です。墓地へ送るカードは「どちらでもよいが、次のターンにつなげやすい」として{c:solleret}を選んでいます。',
          moves: [['solleret#2', 'deck', 'gy'], ['fog#2', 'deck', 'st']], tags: { 'fog#2': 'セット（裏向き）' } },
        { phase: 4, t: 865, title: 'ブレイクソードをバルディッシュのリンク先にエクシーズ召喚', use: ['breaksword', 'boots', 'robe'],
          do: '場のレベル3の2体（{c:boots}と{c:robe}）を重ねて、EXデッキから{c:breaksword}を{t:xyz}します。置く場所は必ず{c:bardiche}の{t:linkzone}にします。',
          why: 'リンク先に出すことで{c:bardiche}の破壊効果を使えます。',
          moves: [['breaksword', 'ex', 'field'], ['boots', 'field', 'mat:breaksword'], ['robe', 'field', 'mat:breaksword']],
          pit: 'リンク先以外に置くと、次の手順に進めません。' },
        { phase: 4, t: 872, title: 'バルディッシュの効果でブレイクソードを自分で破壊する', use: ['bardiche', 'breaksword'],
          do: '{c:bardiche}の効果で、{c:breaksword}を選んで破壊します。',
          why: '破壊された{c:breaksword}の効果で、{t:gy}の仲間を2体戻すためです。',
          moves: [['breaksword', 'field', 'gy'], ['boots', 'mat:breaksword', 'gy'], ['robe', 'mat:breaksword', 'gy']] },
        { phase: 4, t: 884, title: 'ブレイクソードの効果で墓地の2体を蘇生（ダスティローブは攻撃表示）', use: ['breaksword', 'robe'],
          do: '{c:breaksword}の効果を発動し、{t:gy}の{c:robe}ともう1体を{t:ss}します。{c:robe}は攻撃表示で出します。',
          why: '戻した2体はレベル4になり、相手ターンに{c:shiten}の素材になります。',
          moves: [['robe', 'gy', 'field'], ['second', null, 'field']], tags: { robe: '攻撃表示・レベル4', second: 'レベル4' },
          pit: '動画ではここで{c:robe}の出し方を間違えたと話し、正しい手順を説明し直しています。',
          verify: 'もう1体をどのカードにするかは、このルートでは口頭で説明されていません。動画の画面で確認してください。' },
        { phase: 4, t: 889, title: 'ダスティローブの効果でバルディッシュの攻撃力を上げる', use: ['robe', 'bardiche'],
          do: '{c:robe}の効果を発動します。{c:robe}を守備表示にして、{c:bardiche}の攻撃力を800上げます。',
          why: '{c:bardiche}の攻撃力が2900になります。動画では「使えるものは必ず使ったほうがよい」と案内されています。',
          moves: [], tags: { robe: '守備表示・レベル4', bardiche: '攻撃力2900' } }
      ],
      done: { t: 913, text: '盤面の完成です。動画では「基本盤面はルート1とまったく同じ」と説明されています。相手ターンの動きは妨害ガイドを見てください。' }
    },

    {
      id: 'scales',
      hash: 'route-scales',
      name: 'ティアースケイル＋捨てる手札1枚',
      lead: '手札に「幻影騎士団ティアースケイル」と、捨ててよいカードが1枚あるとき',
      starter: ['scales'],
      hand: ['scales', 'cost'],
      videoStart: 920,
      summary: 'バルディッシュを先に出す、順番が少し違うルート。動画の口頭説明が少ない箇所があり、そのステップには「要確認」を付けています。',
      phases: ['ティアースケイルからケルビーニ', 'ラギッドグローブと霧剣でマレヴォレンスサイス', 'バルディッシュを先に出す', 'シャーマナイトからダーク・レクイエム', '仕上げ'],
      steps: [
        { phase: 0, t: 932, title: 'ティアースケイルを通常召喚する', use: ['scales'],
          do: '手札の{c:scales}を{t:ns}します。',
          why: '{c:scales}の「手札を捨ててデッキから墓地へ送る」効果は、場にいるときに使う効果です。',
          moves: [['scales', 'hand', 'field']],
          verify: '動画ではこの操作を口頭で説明していません。効果を使うために必要な操作として記載しています。' },
        { phase: 0, t: 934, title: 'ティアースケイルの効果：手札を1枚捨ててダスティローブを墓地へ', use: ['scales', 'robe'],
          do: '{c:scales}の効果を発動します。{t:cost}として手札を1枚捨て、デッキから{c:robe}を{t:gy}へ送ります。',
          why: '{c:robe}の墓地効果で{c:boots}を{t:search}するためです。',
          moves: [['cost', 'hand', 'gy'], ['robe', 'deck', 'gy']],
          pit: '手札に最初から{c:boots}があるなら、捨てなくてもレベル3を2体並べられます。動画では「その分、相手に妨害されても続けやすい」と説明されています。' },
        { phase: 0, t: 940, title: 'ダスティローブの墓地効果でサイレントブーツをサーチ', use: ['robe', 'boots'],
          do: '{t:gy}の{c:robe}を{t:banish}して、デッキから{c:boots}を手札に加えます。',
          why: '手札から出せる2体目のレベル3を用意します。',
          moves: [['robe', 'gy', 'ban'], ['boots', 'deck', 'hand']] },
        { phase: 0, t: 944, title: 'サイレントブーツを手札から特殊召喚', use: ['boots'],
          do: '手札の{c:boots}を自身の効果で{t:ss}します。',
          why: 'レベル3が2体（{c:scales}と{c:boots}）並びます。',
          moves: [['boots', 'hand', 'field']] },
        { phase: 0, t: 946, title: 'レベル3の2体でケルビーニをリンク召喚', use: ['cherubini', 'scales', 'boots'],
          do: '{c:scales}と{c:boots}を素材に、EXデッキから{c:cherubini}を{t:link}します。',
          why: '{c:scales}と{c:boots}を{t:gy}に置きます。どちらもこのあと墓地から場に戻ってきます。',
          moves: [['cherubini', 'ex', 'field'], ['scales', 'field', 'gy'], ['boots', 'field', 'gy']],
          verify: 'ここまでの流れは、動画では「{c:robe}を落として{c:boots}を持ってきて、{c:cherubini}に行ける」と短くまとめて説明されています。細かい操作は画面で確認してください。' },

        { phase: 1, t: 966, title: 'ケルビーニの効果でラギッドグローブを墓地へ送る', use: ['cherubini', 'gloves'],
          do: '{c:cherubini}の効果を発動し、デッキから{c:gloves}を{t:gy}へ送ります。',
          why: '{c:gloves}は墓地から自分を除外して、デッキのカードを墓地へ送れます。',
          moves: [['gloves', 'deck', 'gy']],
          verify: '動画は「このルートでは違うカードを使う。ラギッドグローブ」と話していますが、どの効果で墓地へ送るかは口頭で明言していません。{c:cherubini}の効果で送っていると読み取れますが、画面で確認してください。' },
        { phase: 1, t: 974, title: 'ラギッドグローブの墓地効果で幻影霧剣を墓地へ送る', use: ['gloves', 'fog'],
          do: '{t:gy}の{c:gloves}を{t:banish}して、デッキから{c:fog}を墓地へ送ります。',
          why: '{c:fog}を墓地に置くと、墓地の仲間を場に戻す効果が使えます。',
          moves: [['gloves', 'gy', 'ban'], ['fog', 'deck', 'gy']] },
        { phase: 1, t: 981, title: 'ティアースケイルが墓地から戻ってくる', use: ['scales'],
          do: '{c:scales}の効果を発動し、{t:gy}から{t:ss}します。',
          why: '直前に{c:gloves}が墓地から除外されたので条件を満たします。',
          moves: [['scales', 'gy', 'field']] },
        { phase: 1, t: 989, title: '幻影霧剣の墓地効果でサイレントブーツを蘇生', use: ['fog', 'boots'],
          do: '{t:gy}の{c:fog}を{t:banish}して、墓地の{c:boots}を{t:ss}します。',
          why: '場にレベル3が2体（{c:scales}と{c:boots}）並びます。',
          moves: [['fog', 'gy', 'ban'], ['boots', 'gy', 'field']] },
        { phase: 1, t: 994, title: 'マレヴォレンスサイスをケルビーニのリンク先にエクシーズ召喚', use: ['scythe', 'scales', 'boots'],
          do: '{c:scales}と{c:boots}を重ねて、EXデッキから{c:scythe}を{t:xyz}します。置く場所は{c:cherubini}の{t:linkzone}にします。',
          why: '{c:cherubini}のリンク先にいるモンスターは効果で破壊されません。',
          moves: [['scythe', 'ex', 'field'], ['scales', 'field', 'mat:scythe'], ['boots', 'field', 'mat:scythe']] },
        { phase: 1, t: 1008, title: 'サイスの効果：サイレントブーツを取り除いてディケイクロークを呼ぶ', use: ['scythe', 'boots', 'decay'],
          do: '{c:scythe}の効果を発動します。{t:material}は{c:boots}を取り除き、デッキから{c:decay}を{t:ss}します。',
          why: '{c:boots}の墓地効果をあとで必ず使いたいので、{c:boots}を{t:gy}に置きます。',
          moves: [['boots', 'mat:scythe', 'gy'], ['decay', 'deck', 'field']],
          pit: '{c:scales}ではなく{c:boots}を取り除きます。動画で特に念を押されている点です。' },
        { phase: 1, t: 1023, title: 'ディケイクロークの効果でドゥームソルレットをサーチ', use: ['decay', 'solleret'],
          do: '{c:decay}が特殊召喚されたときの効果を発動し、デッキから{c:solleret}を手札に加えます。',
          why: '{c:solleret}はあとで手札から出して、{c:rum}を場に{t:set}するのに使います。',
          moves: [['solleret', 'deck', 'hand']] },

        { phase: 2, t: 1028, title: 'サイスとケルビーニでラスティ・バルディッシュをリンク召喚', use: ['bardiche', 'scythe', 'cherubini'],
          do: '{c:scythe}と{c:cherubini}を素材に、EXデッキから{c:bardiche}を{t:link}します。',
          why: 'このルートでは{c:rum}を{c:solleret}の効果で用意するので、{c:scythe}を残す必要がありません。そのため{c:bardiche}を先に出します。',
          moves: [['bardiche', 'ex', 'field'], ['scythe', 'field', 'gy'], ['cherubini', 'field', 'gy'], ['scales', 'mat:scythe', 'gy']],
          pit: '他の2ルートと順番が違います。動画では「展開が少しだけ小さくなるが仕方ない」と説明されています。' },
        { phase: 2, t: 1045, title: 'バルディッシュの効果：ステンドグリーブを墓地へ、アンブレイジベイルをセット', use: ['bardiche', 'greaves', 'veil'],
          do: '{c:bardiche}の効果を発動します。デッキから{c:greaves}を{t:gy}へ送り、デッキから{c:veil}を場に{t:set}します。',
          why: '{c:greaves}の墓地効果で手札の{c:solleret}を出します。{c:veil}は最後に{c:breaksword}の素材にします。',
          moves: [['greaves', 'deck', 'gy'], ['veil', 'deck', 'st']], tags: { veil: 'セット（裏向き）' },
          pit: '他のルートでは{c:fog}をセットしましたが、このルートでは{c:veil}です。' },
        { phase: 2, t: 1053, title: 'ステンドグリーブの墓地効果でドゥームソルレットを手札から出す', use: ['greaves', 'solleret'],
          do: '{t:gy}の{c:greaves}を{t:banish}して、手札の{c:solleret}を{t:ss}します。レベルは上げません。',
          why: '{c:solleret}が場に出たときの効果を使うためです。',
          moves: [['greaves', 'gy', 'ban'], ['solleret', 'hand', 'field']],
          pit: '「レベルを1つ上げますか」と聞かれたら「上げない」を選びます。' },
        { phase: 2, t: 1065, title: 'ドゥームソルレットの効果でRUMをセット', use: ['solleret', 'rum'],
          do: '{c:solleret}の効果を発動し、デッキから{c:rum}を場に{t:set}します。',
          why: '他のルートでは{c:scythe}で{t:search}していた{c:rum}を、ここでは{c:solleret}で用意します。',
          moves: [['rum', 'deck', 'st']], tags: { rum: 'セット（裏向き）' } },

        { phase: 3, t: 1078, title: 'レベル3の2体でシャーマナイトをエクシーズ召喚', use: ['shamanite', 'decay', 'solleret'],
          do: '場のレベル3の2体（{c:decay}と{c:solleret}）を重ねて、EXデッキから{c:shamanite}を{t:xyz}します。',
          why: '除外されたカードを呼び戻すためです。',
          moves: [['shamanite', 'ex', 'field'], ['decay', 'field', 'mat:shamanite'], ['solleret', 'field', 'mat:shamanite']],
          note: 'カードテキストにもとづく補足：{c:bardiche}の破壊効果は1ターンに1度です。このルートでは{c:bardiche}が先に場にいますが、破壊効果は{c:breaksword}を出すときまで使わずに取っておきます（動画の口頭説明にはありません）。' },
        { phase: 3, t: 1082, title: 'シャーマナイトの効果：除外されている幻影霧剣を素材に入れる', use: ['shamanite', 'fog'],
          do: '{c:shamanite}の効果を発動し、{t:banish}されている{c:fog}を自身の{t:material}にします。',
          why: '素材が3つになります。',
          moves: [['fog', 'ban', 'mat:shamanite']] },
        { phase: 3, t: 1089, title: 'シャーマナイトの効果：素材3つでステンドグリーブを除外から戻す', use: ['shamanite', 'greaves'],
          do: '{c:shamanite}の効果を発動します。{t:material}を3つ取り除き、除外されている{c:greaves}を{t:ss}します。',
          why: '取り除いた{c:decay}と{c:solleret}が{t:gy}に行き、次の2手で使えます。',
          moves: [['decay', 'mat:shamanite', 'gy'], ['solleret', 'mat:shamanite', 'gy'], ['fog', 'mat:shamanite', 'gy'], ['greaves', 'ban', 'field']] },
        { phase: 3, t: 1103, title: 'ディケイクロークの墓地効果をシャーマナイトに使う', use: ['decay', 'shamanite'],
          do: '{t:gy}の{c:decay}を{t:banish}し、{c:shamanite}を対象に効果を発動します。',
          why: '{c:shamanite}をエクシーズ召喚の素材に使えるようにします。',
          moves: [['decay', 'gy', 'ban']], tags: { shamanite: 'レベル3として素材にできる' },
          pit: '{c:solleret}の効果より先に使います。' },
        { phase: 3, t: 1117, title: 'ドゥームソルレットの墓地効果で2体をレベル4にする', use: ['solleret', 'greaves', 'shamanite'],
          do: '{t:gy}の{c:solleret}を{t:banish}し、{c:greaves}と{c:shamanite}を対象に効果を発動します。',
          why: '2体をレベル4として扱い、ランク4のエクシーズ召喚に使います。',
          moves: [['solleret', 'gy', 'ban']], tags: { shamanite: 'レベル4として素材にできる', greaves: 'レベル4' } },
        { phase: 3, t: 1125, title: 'ダーク・リベリオンをエクシーズ召喚', use: ['rebellion', 'greaves', 'shamanite'],
          do: '{c:greaves}と{c:shamanite}を重ねて、EXデッキから{c:rebellion}を{t:xyz}します。',
          why: '{c:requiem}の土台です。',
          moves: [['rebellion', 'ex', 'field'], ['greaves', 'field', 'mat:rebellion'], ['shamanite', 'field', 'mat:rebellion']] },
        { phase: 3, t: 1137, title: 'セットしたRUMを発動：ダスティローブを戻してダーク・レクイエムを重ねる', use: ['rum', 'robe', 'requiem'],
          do: '場にセットした{c:rum}を発動します。除外されている{c:robe}を{t:ss}し、続けて{c:rebellion}の上に{c:requiem}を重ねます。',
          why: '{c:requiem}の素材は3つになります。動画では{c:robe}を「次のターンの{t:resource}になる」として選んでいます。',
          moves: [['rum', 'st', 'gy'], ['robe', 'ban', 'field'], ['requiem', 'ex', 'field'], ['rebellion', 'field', 'mat:requiem'], ['greaves', 'mat:rebellion', 'mat:requiem'], ['shamanite', 'mat:rebellion', 'mat:requiem']],
          tags: { robe: '効果は無効' },
          pit: 'この{c:robe}は効果が{t:negate|無効}です。攻撃力を上げる効果はここでは使いません。動画の投稿者もここで間違えて使ったと話しています。' },

        { phase: 4, t: 1165, title: 'アンブレイジベイルを発動してモンスターとして出す', use: ['veil'],
          do: 'セットしてある{c:veil}を発動し、自身をモンスターとして{t:ss}します。',
          why: '{c:robe}と合わせてレベル3が2体になり、{c:breaksword}を出せます。',
          moves: [['veil', 'st', 'field']], tags: { veil: '罠モンスター・レベル3' } },
        { phase: 4, t: 1165, title: 'ブレイクソードをバルディッシュのリンク先にエクシーズ召喚', use: ['breaksword', 'robe', 'veil'],
          do: '{c:robe}と{c:veil}を重ねて、EXデッキから{c:breaksword}を{t:xyz}します。置く場所は{c:bardiche}の{t:linkzone}にします。',
          why: '{c:bardiche}の破壊効果を使うためです。',
          moves: [['breaksword', 'ex', 'field'], ['robe', 'field', 'mat:breaksword'], ['veil', 'field', 'mat:breaksword']],
          verify: 'このルートでは口頭の説明が省略されています。ルート1・2と同じ手順として記載しています。' },
        { phase: 4, t: 1165, title: 'バルディッシュの効果でブレイクソードを自分で破壊する', use: ['bardiche', 'breaksword'],
          do: '{c:bardiche}の効果で、{c:breaksword}を選んで破壊します。',
          why: '{c:breaksword}の効果で{t:gy}の仲間を戻すためです。素材だった{c:veil}も墓地へ行き、相手ターンに使えるようになります。',
          moves: [['breaksword', 'field', 'gy'], ['robe', 'mat:breaksword', 'gy'], ['veil', 'mat:breaksword', 'gy']],
          verify: 'このルートでは口頭の説明が省略されています。ルート1・2と同じ手順として記載しています。' },
        { phase: 4, t: 1198, title: 'ブレイクソードの効果で墓地の2体を蘇生（ダスティローブは攻撃表示）', use: ['breaksword', 'robe', 'scales'],
          do: '{c:breaksword}の効果を発動し、{t:gy}の{c:robe}ともう1体を{t:ss}します。{c:robe}は攻撃表示で出します。',
          why: '戻した2体はレベル4になり、相手ターンに{c:shiten}の素材になります。',
          moves: [['robe', 'gy', 'field'], ['scales', 'gy', 'field']], tags: { robe: '攻撃表示・レベル4', scales: 'レベル4（要確認）' },
          verify: 'もう1体のカード名は口頭で説明されていません。{c:boots}はこのあと墓地効果を使うので墓地に残す必要があり、残る候補として{c:scales}を表示しています。動画の画面で確認してください。' },
        { phase: 4, t: 1198, title: 'ダスティローブの効果でバルディッシュの攻撃力を上げる', use: ['robe', 'bardiche'],
          do: '{c:robe}の効果を発動します。{c:robe}を守備表示にして、{c:bardiche}の攻撃力を800上げます。',
          why: '{c:bardiche}の攻撃力が2900になります。',
          moves: [], tags: { robe: '守備表示・レベル4', bardiche: '攻撃力2900' },
          pit: '{c:breaksword}の効果で出したあとの{c:robe}は、効果が無効になっていません。使うのはこのタイミングです。' },
        { phase: 4, t: 1209, title: 'サイレントブーツの墓地効果で幻影霧剣をサーチ', use: ['boots', 'fog'],
          do: '最後に、{t:gy}の{c:boots}を{t:banish}して、デッキから{c:fog}を手札に加えます。',
          why: 'このルートでは{c:bardiche}で{c:fog}をセットしていないので、ここで用意します。',
          moves: [['boots', 'gy', 'ban'], ['fog#2', 'deck', 'hand']] },
        { phase: 4, t: 1220, title: '幻影霧剣を場にセットする', use: ['fog'],
          do: '手札の{c:fog}を場に{t:set}します。',
          why: '相手ターンの{t:bogai}になります。',
          moves: [['fog#2', 'hand', 'st']], tags: { 'fog#2': 'セット（裏向き）' } }
      ],
      done: { t: 1222, text: '盤面の完成です。{c:requiem}の素材3つ、セットした{c:fog}、{t:gy}の{c:veil}がそろいました。相手ターンの動きは妨害ガイドを見てください。' }
    }
  ];

  /* ステップ中だけで使う仮のカード */
  var pseudo = {
    cost: { name: '捨てた手札1枚', short: '捨てた手札1枚' },
    second: { name: '墓地から戻す「幻影騎士団」モンスターもう1体（カード名は要確認）', short: '墓地から戻すもう1体（要確認）' }
  };

  global.PK_DATA = {
    videoId: VIDEO_ID,
    dbCard: DB_CARD,
    dbSearch: DB_SEARCH,
    cards: cards,
    terms: terms,
    routes: routes,
    pseudo: pseudo
  };
})(typeof window !== 'undefined' ? window : globalThis);
