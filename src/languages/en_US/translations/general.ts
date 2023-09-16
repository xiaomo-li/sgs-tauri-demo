import { Word } from "../..";

export const markDictionary: Word[] = [
  { source: "nightmare", target: "梦魇" },
  { source: "ren", target: "忍" },
  { source: "lie", target: "烈" },
  { source: "nu", target: "暴怒" },
  { source: "ying", target: "营" },
];

export const generalDictionary: Word[] = [
  { source: "cheat", target: "Cheat" },
  { source: "cheat_description", target: "Get any card (for debugging only)" },
  { source: "standard", target: "Standard" },
  { source: "legion_fight", target: "Legion Fight" },
  { source: "wind", target: "Wind" },
  { source: "forest", target: "Forest" },
  { source: "fire", target: "Fire" },
  { source: "mountain", target: "Mountain" },
  { source: "wei", target: "Wei" },
  { source: "shu", target: "Shu" },
  { source: "wu", target: "Wu" },
  { source: "qun", target: "Neutral" },
  { source: "god", target: "God" },
  { source: "unknown", target: "Unknown" },
  { source: "lord", target: "Lord" },
  { source: "loyalist", target: "Loyalist" },
  { source: "rebel", target: "Rebel" },
  { source: "renegade", target: "Renegade" },
  { source: "seat 0", target: "Seat 1" },
  { source: "seat 1", target: "Seat 2" },
  { source: "seat 2", target: "Seat 3" },
  { source: "seat 3", target: "Seat 4" },
  { source: "seat 4", target: "Seat 5" },
  { source: "seat 5", target: "Seat 6" },
  { source: "seat 6", target: "Seat 7" },
  { source: "seat 7", target: "Seat 8" },
  { source: "you", target: "You" },
  { source: "heart", target: "Heart" },
  { source: "spade", target: "Spade" },
  { source: "club", target: "Club" },
  { source: "diamond", target: "Diamond" },
  { source: "attack range:", target: "Attack range:" },

  { source: "draw stack", target: "draw pile" },
  { source: "drop stack", target: "discard pile" },
  // { source: 'hand area', target: 'hand area' },
  // { source: 'equip area', target: 'equip area' },
  { source: "judge area", target: "judgement area" },
  // { source: 'outside area', target: 'outside area' },

  // { source: 'prepare stage', target: '准备阶段' },
  // { source: 'judge stage', target: '判定阶段' },
  // { source: 'draw stage', target: '摸牌阶段' },
  // { source: 'play stage', target: '出牌阶段' },
  // { source: 'drop stage', target: '弃牌阶段' },
  // { source: 'finish stage', target: '结束阶段' },

  // { source: 'basic card', target: '基本牌' },
  // { source: 'equip card', target: '装备牌' },
  // { source: 'trick card', target: '锦囊牌' },
  // { source: 'delayed trick card', target: '延时锦囊牌' },
  // { source: 'armor card', target: '防具牌' },
  // { source: 'weapon card', target: '武器牌' },
  // { source: 'defense ride card', target: '防御马' },
  // { source: 'offense ride card', target: '进攻马' },
  { source: "precious card", target: "treasure card" },

  { source: "abbr:basic", target: "Bsc" },
  { source: "abbr:trick", target: "Trk" },
  { source: "abbr:equip", target: "Equ" },

  // { source: 'red', target: '红色' },
  // { source: 'black', target: '黑色' },

  // { source: 'weapon section', target: '武器栏' },
  // { source: 'shield section', target: '防具栏' },
  // { source: 'ride section', target: '坐骑栏' },
  // { source: 'defense ride section', target: '防御坐骑栏' },
  // { source: 'offense ride section', target: '进攻坐骑栏' },
  { source: "precious", target: "treasure section" },
];

export const eventDictionary: Word[] = [
  { source: "dead", target: "Dead" },
  { source: "alive", target: "Alive" },
  { source: "winners", target: "Winners" },
  { source: "losers", target: "Losers" },
  { source: "save replay", target: "Save replay" },
  { source: "game over, winner is {0}", target: "Game over, winner is {0}" },
  // { source: 'turn overed', target: '翻面' },
  { source: "option-one", target: "Option 1" },
  { source: "option-two", target: "Option 2" },
  { source: "standard-game", target: "Standard Game" },
  // { source: '1v2', target: '斗地主' },
  { source: "hegemony-game", target: "Hegemony Game" },
  { source: "back to lobby", target: "Back to lobby" },
  {
    source: "updating core version to {0}, downloading...",
    target: "Updating core version to {0}, downloading...",
  },
  { source: "downloading file {0}/{1}", target: "Downloading file {0}/{1}" },
  // { source: 'Update complete, please restart client to complete update', target: '升级完成，请重启客户端完成更新' },

  { source: "yes", target: "Yes" },
  { source: "no", target: "No" },
  // { source: '{0} chose {1}', target: '{0} 选择了 {1}' },
  // { source: '({0})', target: '({0})' },
  // { source: '[{0}]', target: '[{0}]' },
  { source: "nosuit", target: "Nosuit" },
  // { source: '[', target: '【' },
  // { source: ']', target: '】' },
  { source: "{0} round start", target: "====== {0}'s round start ======" },
  { source: "normal_property", target: "Normal" },
  { source: "fire_property", target: "Fire" },
  { source: "thunder_property", target: "Thunder" },
  // { source: 'obtained', target: '获得' },
  // { source: 'lost', target: '失去' },
  { source: "please select a game mode", target: "Please select a game mode" },
  {
    source: "please select character extensions",
    target: "Please select character extensions",
  },
  { source: "{0} {1} {2} {3} marks", target: "{0} {1} {2} {3} mark(s)" },
  { source: "please choose a skill", target: "Please choose a skill" },
  // { source: '{0} select nationaliy {1}', target: '{0} 选择了 {1} 势力' },
  { source: "move to drop stack", target: "move to the discard pile" },
  { source: "{0} aborted {1} equip section", target: "{0} aborted {1}" },
  { source: "{0} resumed {1} equip section", target: "{0} resumed {1}" },
  // { source: '{0} aborted judge area', target: '{0} 废除了判定区' },
  // { source: '{0} resumed judge area', target: '{0} 恢复了判定区' },
  // { source: '{0} select nationality {1}', target: '{0} 选择了国籍 {1}' },
  {
    source: "do you want to trigger skill {0} ?",
    target: "Do you want to use skill {0}?",
  },
  {
    source: "do you want to trigger skill {0} from {1} ?",
    target: "Do you want to use skill {0} from {1} ?",
  },
  {
    source: "do you want to trigger skill {0} to {1} ?",
    target: "Do you want to use skill {0} to {1} ?",
  },
  {
    source: "{0} draws {1} cards",
    target: "{0} draws {1} card(s)",
  },
  {
    source: "{0} is {1}, waiting for selecting a character",
    target: "{0} is {1}, waiting for him selecting a character",
  },
  {
    source: "your role is {0}, please choose a lord",
    target: "Your role is {0}, please choose a character",
  },
  {
    source: "lord is {0}, your role is {1}, please choose a character",
    target: "The lord is {0}, your role is {1}, please choose a character",
  },
  {
    source: "please choose a character",
    target: "Please choose a character",
  },
  {
    source: "please choose a skin",
    target: "Please choose a skin",
  },
  {
    source: "please choose a nationality",
    target: "Please choose a nationality",
  },
  {
    source: "please choose a card",
    target: "Please choose a card",
  },
  // { source: "{0}'s judge card", target: '{0} 的判定牌' },
  // {
  //   source: '{0} got judged card {2} on {1}',
  //   target: '{0} 的 {1} 判定结果为 {2}',
  // },
  {
    source: "{0} recovered {2} hp for {1}",
    target: "{0} healed {2} HP for {1}",
  },
  {
    source: "{0} recovered {1} hp",
    target: "{0} healed {1} HP",
  },
  {
    source: "{0} lost {1} hp",
    target: "{0} lost {1} HP",
  },
  { source: "{0} lost {1} max hp", target: "{0} lost {1} max HP" },
  { source: "{0} obtained {1} max hp", target: "{0} obtained {1} max HP" },
  // { source: '{0} lost {1} armor', target: '{0} 失去了 {1} 点护甲' },
  // { source: '{0} obtained {1} armor', target: '{0} 获得了 {1} 点护甲' },
  {
    source: "{0} used {1} to you, please use a {2} card",
    target: "{0} used {1} to you, please use a {2} to response",
  },
  {
    source: "please use a {0} card to response {1}",
    target: "Please use a {0} to response {1}",
  },
  {
    source: "please response a {0} card to response {1}",
    target: "Please play a {0} to response {1}",
  },
  // {
  //   source: '{0} obtained skill {1}',
  //   target: '{0} 获得了技能 【{1}】',
  // },
  // {
  //   source: '{0} lost skill {1}',
  //   target: '{0} 失去了技能 【{1}】',
  // },
  {
    source: "please select to use a {0}",
    target: "Please select to use a {0}",
  },
  {
    source: "please use a {0} to player {1} to response {2}",
    target: "Please use a {0} to player {1} to response {2}",
  },
  // { source: '{0} activated awakening skill {1}', target: '{0} 的觉醒技 【{1}】 技能被触发' },
  // { source: '{0} used skill {1}', target: '{0} 使用了技能【{1}】' },
  // { source: '{0} used skill {1} to {2}', target: '{0} 使用了技能【{1}】, 目标是 {2}' },
  {
    source: "{0} hits {1} {2} hp of damage type {3}",
    target: "{0} deals {2} {3} damage to {1}",
  },
  // {
  //   source: '{0} turned over the charactor card, who is {1} right now',
  //   target: '{0} 将武将牌翻面，现在是 {1}',
  // },
  // { source: 'facing up', target: '正面朝上' },
  // { source: 'turning over', target: '背面朝上' },
  {
    source: "{0} got hurt for {1} hp with {2} property",
    target: "{0} took {1} {2} damage",
  },
  // Note: shown above
  // { source: 'please choose a card', target: '请选择一张卡牌' },
  { source: "{0} obtains cards {1}", target: "{0} obtains {1}" },
  // {
  //   source: '{0} obtains cards {1} from {2}',
  //   target: '{0} 获得了 {2} 的一张 {1} ',
  // },
  // {
  //   source: '{0} obtains {1} cards from {2}',
  //   target: '{0} 获得了 {2} 的 {1} 张牌',
  // },
  {
    source: "please assign others no more than 2 handcards",
    target: "Please assign others no more than 2 handcards",
  },
  // { source: '{0} obtains {1} cards', target: '{0} 获得了 {1} 张牌' },
  { source: "please drop {0} cards", target: "Please discard {0} card(s)" },
  {
    source: "please drop {1} to {2} cards",
    target: "Please discard {1} ~ {2} cards",
  },
  { source: "{0} drops cards {1}", target: "{0} discards {1}" },
  { source: "{0} drops cards {1} by {2}", target: "{2} discards {1} from {0}" },
  {
    source: "{0} has been placed into drop stack",
    target: "{0} has been placed into discard pile",
  },
  {
    source: "{0} has been placed on the top of draw stack",
    target: "{0} has been placed on the top of draw pile",
  },
  {
    source: "{0} has been placed on the bottom of draw stack",
    target: "{0} has been placed on the bottom of draw pile",
  },
  {
    source: "{0} has been placed into drop stack from {1}",
    target: "{0} has been placed into discard pile from {1}",
  },
  {
    source: "{0} has been placed on the top of draw stack from {1}",
    target: "{0} has been placed on the top of draw pile from {1}",
  },
  {
    source: "{0} has been placed on the bottom of draw stack from {1}",
    target: "{0} has been placed on the bottom of draw pile from {1}",
  },
  // { source: '{0} lost card {1}', target: '{0} 失去了 {1}' },
  // { source: '{0} lost {1} cards', target: '{0} 失去了 {1} 张牌' },
  // { source: '{0} used card {1}', target: '{0} 使用了一张 {1}' },
  // { source: '{0} used card', target: '{0} 使用' },
  {
    source: "{0} used skill {1}, response card {2}",
    target: "{0} used skill {1}, play card {2}",
  },
  // { source: '{0} used skill {1}, use card {2}', target: '{0} 使用了技能 【{1}】，使用了一张 {2}' },
  // { source: '{0} used skill {1}, use card {2} to {3}', target: '{0} 使用了技能 【{1}】，使用了一张 {2}，目标是 {3}' },
  {
    source: "Please choose your slash target",
    target: "Please choose your Slash target",
  },
  { source: "draw stack top", target: "top of draw pile" },
  { source: "draw stack bottom", target: "bottom of draw pile" },
  // { source: '{0} used skill {1} to you, please choose', target: '{0} 对你使用了技能 【{1}】，请选择' },
  { source: "lose a hp", target: "Lose 1 HP" },
  { source: "drop all {0} cards", target: "Discard all {0} cards" },
  { source: "{0} displayed cards {1}", target: "{0} showed card {1}" },
  {
    source: "{0} displayed {1} cards to {2}",
    target: "{0} showed card {1} to {2}",
  },
  { source: "cards displayed to you", target: "Cards showed to you" },
  {
    source: "{0} display handcards to you",
    target: "{0} showed handcards to you",
  },
  { source: "{0} displayed guhuo cards {1}", target: "{0} 展示了蛊惑牌 {1}" },
  {
    source: "{0} displayed cards {1} from top of draw stack",
    target: "{0} showed cards {1} from top of draw pile",
  },
  {
    source: "please choose another player or click cancel",
    target: "Please choose another player or click cancel",
  },
  { source: "{0} reforged card {1}", target: "{0} recasted {1}" },
  // { source: '{0} {1} character card', target: '{0} {1} 了武将牌' },
  // { source: 'rotate', target: '横置' },
  // { source: 'reset', target: '重置' },
  {
    source:
      "{0} proposed a pindian event, please choose a hand card to pindian",
    target:
      "{0} proposed a point fight to you, please choose a hand card to respond",
  },
  {
    source: "{0} used {1} to respond pindian",
    target: "{0} showed point fight card {1}",
  },
  { source: "pindian result:{0} win", target: "Point fight result: {0} win" },
  { source: "pindian result:draw", target: "Point fight result: draw" },
  {
    source: "please drop a {0} card, otherwise you can't do response of slash",
    target: "Please drop a {0} card, otherwise you can't do response of slash",
  },
  {
    source: "please response a card to replace judge card {0} from {1}",
    target: "Please play a card to replace judge card {0} from {1}",
  },
  {
    source: "{0} responsed card {1} to replace judge card {2}",
    target: "{0} played card {1} to replace judge card {2}",
  },
  {
    source: "{0} starts a judge of {1}, judge card is {2}",
    target: "{0} starts a judgement of {1}, judge card is {2}",
  },
  {
    source:
      "guanxing finished, {0} cards placed on the top and {1} cards placed at the bottom",
    target:
      "Stargaze finished, {0} cards placed on the top and {1} cards placed at the bottom",
  },
  {
    source: "{0} used skill {1}, transformed {2} as {3} card to response",
    target: "{0} used skill {1}, played {2} as {3}",
  },
  {
    source: "{0} used skill {1}, transformed {2} as {3} card to use",
    target: "{0} used skill {1}, used {2} as {3}",
  },
  {
    source: "{0} used skill {1}, transformed {2} as {3} card used to {4}",
    target: "{0} used skill {1}, used {2} as {3} to {4}",
  },
  // {
  //   source: '{0} used card {1} to {2}',
  //   target: '{0} 使用了一张 {1}，目标是 {2}',
  // },
  // {
  //   source: '{0} used card to {1}',
  //   target: '{0} 对 {1} 使用',
  // },
  // { source: '{0} equipped {1}', target: '{0} 装备了 {1}' },
  {
    source: "{0} is placed into drop stack",
    target: "{0} is placed into discard pile",
  },
  { source: "{0} responses card {1}", target: "{0} played {1}" },
  { source: "{0} responded card", target: "{0} played" },
  { source: "please drop {0} cards", target: "Please discard {0} cards" },
  // { source: '{0} skipped draw stage', target: '{0} 跳过了摸牌阶段' },
  // { source: '{0} skipped play stage', target: '{0} 跳过了出牌阶段' },
  // { source: '{0} is dying', target: '{0} 进入了濒死阶段' },
  {
    source: "{0} asks for {1} peach",
    target: "{0} is dying, use {1} peach(es) to rescue him?",
  },
  // { source: '{0} was killed', target: '{0} 已阵亡，死于天灾' },
  // { source: '{0} was killed by {1}', target: '{0} 已阵亡，凶手是 {1}' },
  { source: "the role of {0} is {1}", target: "The role of {0} is {1}" },
  { source: "{0} recovers {1} hp", target: "{0} healed {1} HP" },
  {
    source: "{0} got hits from {1} by {2} {3} hp",
    target: "{0} took {2} {3} damage from {1}",
  },
  // { source: '{0} moved all hand cards out of the game', target: '{0} 将所有手牌移出了游戏' },
  {
    source: "{0} use skill {1}, bring {2} to hell",
    target: "{0} used skill {1}, killed {2}",
  },
  {
    source: "do you wanna use {0} for {1} from {2}",
    target: "Do you wanna use {0} for {1} from {2}?",
  },
  {
    source: "do you wanna use {0} for {1} from {2} to {3}",
    target: "Do you wanna use {0} for {1} from {2} to {3}?",
  },
  {
    source: "do you wanna use {0} for {1}",
    target: "Do you wanna use {0} for {1}?",
  },
  {
    source: "do you wanna use {0} for {1} to {2}",
    target: "Do you wanna use {0} for {1} to {2}?",
  },
  {
    source: "{0} used {1} to you, please response a {2} card",
    target: "{0} used {1} to you, please play a {2} to response",
  },
  { source: "please response a {0} card", target: "Please play a {0}" },
  {
    source: "{0} used skill {1} to you, please response a {2} card",
    target: "{0} used {1} to you, please play a {2} to response",
  },
  {
    source: "do you wanna response a {0} card for skill {1} from {2}",
    target: "Do you wanna play a {0} in response to {1} from {2}?",
  },
  {
    source: "{0} display hand card {1} from {2}",
    target: "{0} showed card {1} from {2}",
  },
  { source: "{0} display hand card {1}", target: "{0} showed card {1}" },
  { source: "{0} displayed card", target: "{0} showed" },
  // { source: '{0} lost {1} hand card', target: '{0} 失去了 {1} 张手牌' },
  { source: "please choose", target: "Please choose" },
  // { source: '{0}: please choose', target: '{0}：请选择一项' },
  { source: "please choose a player", target: "Please choose a player" },
  // { source: '{0} place card {1} from {2} on the top of draw stack', target: '{0} 将 {2} 的 {1} 置于了牌堆顶' },
  // { source: '{0} place card {1} from {2} into equip area of {3}', target: '{0} 将 {2} 的 {1} 置于了 {3} 的装备区' },
  // { source: 'recover {0} hp for {1}', target: 'Heal {0} HP for {1}?' },
  // { source: '{0} used skill {1}, damage increases to {2}', target: '{0} 使用了技能 【{1}】，伤害增加至 {2} 点' },
  // { source: '{0} triggered skill {1}, damage reduces to {2}', target: '{0} 触发了技能 【{1}】，伤害减少至 {2} 点' },
  {
    source: "{0} used skill {1} to you, please present a hand card",
    target: "{0} used skill {1} to you, please show a hand card",
  },
  {
    source: "{0} used {1} to you, please present a hand card",
    target: "{0} used {1} to you, please show a hand card",
  },
  // { source: '{0} move cards {1} onto the top of {2} character card', target: '{0} 将 {1} 置于了 {2} 的武将牌上' },
  // { source: '{0} move {1} cards onto the top of {2} character card', target: '{0} 将 {1} 张牌置于了 {2} 的武将牌上' },
  {
    source: "{0}: please present a hand card",
    target: "{0}: please show a hand card",
  },
  {
    source: "{0} used skill {1}, transfrom {2} into {3}",
    target: "{0} used skill {1}, use {2} as {3}",
  },
  {
    source: "{0}: please choose a player to obtain {1}",
    target: "{0}: you can give {1} to a player",
  },
  {
    source: "{0}: please choose a player to drop",
    target:
      "{0}: please choose a player who has you within his attack range to discard his card",
  },
  {
    source: "{0}: do you want to transfrom {1} into fire slash?",
    target: "{0}: do you want to use {1} as Fire Slash?",
  },
  // {
  //   source: '{0}: do you want to draw {1} card(s)?',
  //   target: '{0}：你可以摸 {1} 张牌',
  // },
  {
    source: "{0}: do you want to draw {1} card(s) additionally?",
    target: "{0}: do you want to draw {1} extra card(s)?",
  },
  // {
  //   source: '{0} triggered skill {1}',
  //   target: '{0} 触发了技能 【{1}】',
  // },
  // {
  //   source: '{0} triggered skill {1}, nullify {2}',
  //   target: '{0} 触发了技能 【{1}】，使 {2} 对其无效',
  // },
  // { source: '{0} triggered skill {1}, obtained card {2}', target: '{0} 触发了技能 【{1}】，获得了 {2}' },
  // {
  //   source: '{0} triggered skill {1}, become the source of damage dealed by {2}',
  //   target: '{0} 触发了技能 【{1}】，成为了 {2} 造成的伤害的伤害来源',
  // },
  // {
  //   source: '{0} triggered skill {1}, prevent the damage',
  //   target: '{0} 触发了【{1}】的效果，防止了此伤害',
  // },
  // {
  //   source: '{0}: please choose a card type or color',
  //   target: '{0}：请选择以下一种选项，系统将会亮出牌堆中符合条件的第一张牌，然后你将之交给一名男性角色',
  // },
  {
    source: "jianyan:Please choose a target to obtain the card you show",
    target:
      "Introduction: Please choose a target to obtain the card you revealed",
  },
  {
    source: "{0}: do you want to use a slash to {1}?",
    target: "{0}: do you want to use a slash to {1}? (no distance limit)",
  },
  {
    source: "{0}: do you agree to pindian with {1}",
    target: "{0}: do you agree to point fight with {1}?",
  },
  {
    source: "{0}: do you want to obtain pindian cards: {1}",
    target: "{0}: do you want to obtain point fight cards: {1}?",
  },
  {
    source: "please drop a {0} hand card to hit {1} 1 hp of damage type fire",
    target: "Please discard a {0} hand card to deal 1 fire damage to {1}",
  },
  {
    source: "please choose a player to get a damage from {0}",
    target: "Please choose a player to take 1 damage from {0}",
  },
  {
    source: "Obtain Basic Card, Equip Card and Duel in display cards?",
    target: "Obtain basic card, weapon and Duel in revealed cards?",
  },
  {
    source: "{0} used skill {1}, display cards: {2}",
    target: "{0} used skill {1}, reveal cards: {2}",
  },
  {
    source: "jijie:Please choose a target to obtain the card you show",
    target: "Agile: Please choose a target to obtain the card you show",
  },
  {
    source: "wushuang: please use extral jink",
    target: "Without Equal: please use an extra Jink",
  },
  {
    source: "wushuang: please use extral slash",
    target: "Without Equal: please play an extra Slash",
  },
  {
    source: "liyu: please choose a player, as target of {0} duel",
    target: "Bribery: please choose a player, as target of {0}'s Duel",
  },
  {
    source: "please choose jiangchi options",
    target:
      "Please choose: 1. draw 2 cards, and you can't use/play Slash in this phase; 2. draw 1 card; 3. discard 1 card, and in this phase: you can use 1 extra Slash, your Slash have no distance limitation.",
  },
  {
    source: "zhijian: do you wanna use draw 1 card",
    target: "直谏：你可以发动【直谏】摸一张牌",
  },
  {
    source: "guzheng: do you wanna obtain the rest of cards?",
    target: "固政：是否获得剩余的牌？",
  },
  {
    source: "tiaoxin: you are provoked by {0}, do you wanna use slash to {0}?",
    target: "{0} 对你发动了“挑衅”，是否对包括其在内的角色使用一张【杀】？",
  },
  {
    source:
      "fangquan: choose 1 card and 1 player to whom you ask play one round",
    target:
      "放权：你可以弃置一张手牌并选择一名其他角色，该角色将于回合结束后进行一个额外回合",
  },
  {
    source:
      "xiangle: please drop 1 basic card else this Slash will be of no effect to {0}",
    target: "享乐：请弃置一张基本牌，否则此【杀】将对 {0} 无效",
  },
  {
    source: "{0} sishu effect, lebusishu result will reverse",
    target: "{0} 的“思蜀”效果被触发，其将要进行的【乐不思蜀】判定效果反转",
  },
  {
    source:
      "please choose: 1. show a character from huashen area and announce a skill to obtain. 2. remove no more than two unshown characters of huashen and get equal number of that.",
    target:
      "请选择：1.从化身牌中亮出一张武将牌并声明一个技能（锁定技、主公技、限定技除外）获得之；2.移去一至二张未亮出的化身牌并获得等量的化身牌",
  },
  {
    source: "huashen: please announce a skill to obtain",
    target: "化身：请声明一个技能获得之",
  },
  {
    source: "wuhun:Please choose a target to die with you",
    target:
      "请选择一名角色进行【武魂】的判定，若结果不为【桃】或【桃园结义】，其立即死亡",
  },
  {
    source: "qinyin: loseHp",
    target: "Lose HP",
  },
  {
    source: "qinyin: recoverHp",
    target: "Heal HP",
  },
  {
    source:
      "qinyin: please choose a choice to make everyone lose hp or recover hp",
    target: "Please choose to make everyone lose HP or heal HP",
  },
  {
    source: "yeyan: 1 point",
    target: "1",
  },
  {
    source: "yeyan: 2 point",
    target: "2",
  },
  {
    source: "yeyan: 3 point",
    target: "3",
  },
  {
    source: "yeyan: cancel",
    target: "Cancel",
  },
  {
    source: "please assign damage for {0}",
    target: "Please assign damage for {0}",
  },
  {
    source: "please assign damage for {0}, {1}",
    target: "Please assign damage for {0}, {1}",
  },
  {
    source: "please assign damage for {0}, {1}, {2}",
    target: "Please assign damage for {0}, {1}, {2}",
  },
  {
    source: "please assign x damage for {0}, and {1} will get (3 - x) damage",
    target: "Please assign X damage for {0}, and {1} will take (3 - X) damage",
  },
  {
    source: "please choose {0} handcards and give them to a target",
    target: "Please choose {0} handcards and give them to another player",
  },
  {
    source: "{0} used skill {1}, swapped {2} handcards from qixing cards pile",
    target: "{0} 使用了技能 【{1}】，从七星堆交换了 {2} 张牌",
  },
  {
    source: "dawu: card to drop",
    target: "Card to discard",
  },
  {
    source: "Please choose {0} player to set {1} mark",
    target: "Please choose {0} player(s) to set {1} mark to them",
  },
  {
    source: "{0} used skill {1}, nullified damage event",
    target: "{0} used skill {1}, this damage is prevented",
  },
  {
    source: "cuike: do you wanna to throw {0} marks to do special skill",
    target: "摧克：你可以弃 {0} 枚“军略”对其他角色各造成1点伤害",
  },
  {
    source: "zhanhuo: please choose a target to whom you cause 1 fire damage",
    target: "绽火：请选择一名角色对其造成1点火焰伤害",
  },
  {
    source: "wumou: loseHp",
    target: "Lose HP",
  },
  {
    source: "wumou: loseMark",
    target: "Lose mark",
  },
  {
    source: "wumou: please choose the cost for your Normal Trick",
    target: "Please choose the cost for using normal trick",
  },
  {
    source: "shenfen: please select 4 cards to drop",
    target: "神愤：请弃置 4 张手牌",
  },
  { source: "{0} obtained character cards {1}", target: "{0} 获得了武将 {1}" },
  {
    source: "{0} swapped {1} character cards",
    target: "{0} 交换了 {1} 张武将牌",
  },
  { source: "huashen skill:{0}", target: "化身: {0}" },

  { source: "cixiongjian:drop-card", target: "Discard 1 card" },
  { source: "cixiongjian:draw-card", target: "Opponent draws 1 card" },
  { source: "jizhi:discard", target: "Discard" },
  { source: "jizhi:keep", target: "Keep" },
  {
    source: "do you wanna discard {0}",
    target:
      "Do you wanna discard {0} to increase your max card num by +1 in this turn?",
  },
  {
    source: "please choose a basic card to use",
    target: "Please choose a basic card to use",
  },
  { source: "jieyin:drop", target: "Discard" },
  { source: "jieyin:move", target: "Move to his equip area" },
  { source: "gongxin:putcard", target: "Put to the top of draw pile" },
  { source: "gongxin:dropcard", target: "Discard" },
  { source: "yijue:recover", target: "Heal 1 HP for target" },
  { source: "yijue:cancel", target: "Cancel" },
  { source: "yaowu:recover", target: "Heal 1 HP" },
  { source: "yaowu:draw", target: "Draw 1 card" },
  { source: "luoyi:obtain", target: "Obtain" },
  { source: "luoyi:cancel", target: "Cancel" },
  { source: "jiangchi:draw", target: "Draw 1 card" },
  { source: "jiangchi:drop", target: "Discard 1 card" },
  { source: "kuanggu:draw", target: "Draw 1 card" },
  { source: "kuanggu:recover", target: "Heal 1 HP" },
  { source: "guhuo:doubt", target: "Doubt" },
  { source: "guhuo:no-doubt", target: "Don't doubt" },
  {
    source: "do you doubt the pre-use of {0} from {1}",
    target: "Do you doubt the pre-use of {0} from {1}",
  },
  { source: "{0} selected {1}", target: "{0} chose {1}" },
  { source: "guhuo:lose-hp", target: "Lose 1 HP" },
  { source: "guhuo:drop-card", target: "Discard 1 card" },
  { source: "jianyan:red", target: "Red" },
  { source: "jianyan:black", target: "Black" },
  { source: "zhiji:drawcards", target: "Draw 2 cards" },
  { source: "zhiji:recover", target: "Heal 1 HP" },
  { source: "1v2:recover", target: "Heal 1 HP" },
  { source: "1v2:draw", target: "Draw 2 cards" },
  {
    source: "please choose the amount of hp to lose",
    target: "请选择要失去的体力值",
  },
  { source: "please choose your zhiheng cards", target: "请选择要制衡的牌" },
  {
    source: "please choose tianxiang options",
    target:
      "Please choose: 1. Target take 1 damage, then draw X card(s) (X is the count of his lost HP); 2. Target lose 1 HP, then obtain the card you discarded.",
  },
  {
    source: "do you wanna transfer the card {0} target to {1}",
    target: "Do you wanna transfer the card {0} to {1}",
  },
  {
    source: "please choose fangzhu options:{0}",
    target:
      "Please choose: 1. Draw {0} card(s), then turn over; 2.Discard {0} card(s) and lose 1 HP",
  },
  {
    source: "please choose yinghun options:{0}:{1}",
    target:
      "Please choose: 1.{0} draw 1 card, then discard {1} card(s); 2.{0} draw {1} cards(s), then discard 1 card",
  },
  {
    source: "player {0} join in the room",
    target: "Player {0} join in the room",
  },
  {
    source: "player {0} has left the room",
    target: "Player {0} has left the room",
  },
  {
    source: "player {0} has disconnected from the room",
    target: "Player {0} has disconnected from the room",
  },
  {
    source: "player {0} re-enter in the room",
    target: "Player {0} re-entered the room",
  },
  {
    source: "game will start within 3 seconds",
    target: "Game will start within 3 seconds",
  },
];

export const UiDictionary: Word[] = [
  // { source: 'No rooms at the moment', target: '还没有玩家创建房间' },
  // { source: 'Create a room', target: '创建房间' },
  { source: "waiting", target: "Waiting" },
  { source: "playing", target: "Playing" },
  // { source: "{0}'s room", target: '{0} 的房间' },
  { source: "incorrect passcode", target: "Incorrect passcode" },
  { source: "please enter your room name", target: "Room name" },
  { source: "please enter your room passcode", target: "Passcode" },
  {
    source: "please choose number of players",
    target: "Please choose number of players",
  },
  // { source: '{0} players', target: '{0} 个玩家' },
  { source: "one player", target: "One player" },
  { source: "two players", target: "Two players" },
  { source: "pve classic one players", target: "PvE classic one player" },
  { source: "pve classic two players", target: "PvE classic two players" },
  { source: "please enter your username", target: "Username" },
  // {
  //   source: 'Unmatched core version, please update your application',
  //   target: '内核版本不匹配，请升级你的客户端版本',
  // },
  // { source: 'Refresh room list', target: '刷新房间' },
  {
    source: "please input your username here",
    target: "Rlease input your username here first",
  },
  // { source: 'Change username', target: '更改玩家名' },
  // { source: '@/core version: {0}', target: '内核版本 {0}' },
  // { source: 'Join', target: '加入' },
  { source: "lobby", target: "Lobby" },
  { source: "room", target: "Room" },
  { source: "room id", target: "Room Id" },
  { source: "circle {0}", target: "Round {0}" },
  // { source: '{0} draw cards left', target: '剩余 {0} 牌' },
  { source: "please enter your text here", target: "Enter your text here" },
  { source: "send", target: "Send" },
  { source: "{0} {1} says: {2}", target: "{0} {1} :{2}" },
  { source: "player name", target: "Player" },
  { source: "character name", target: "Character" },
  { source: "role", target: "Role" },
  { source: "status", target: "Status" },
  { source: "handcards", target: "Handcards" },
  { source: "check", target: "Check" },
  { source: "offline", target: "Offline" },
  { source: "quit", target: "Quit" },
  { source: "smart-ai", target: "AI" },
  { source: "trusted", target: "Trust" },
  { source: "cancel trusted", target: "Cancel trust" },
  { source: "in trusted", target: "Trusted···" },
  { source: "adjust handcards", target: "Sort handcards" },
  { source: "reverse select", target: "Reverse select" },
  { source: "select tips", target: "Select tips" },
  {
    source: "New QSanguosha",
    target: "DSanguosha",
  },
  {
    source: "confirm",
    target: "Confirm",
  },
  {
    source: "reforge",
    target: "recast",
  },
  {
    source: "cancel",
    target: "Cancel",
  },
  {
    source: "finish",
    target: "Finish",
  },
  { source: "main volume", target: "Music volume" },
  { source: "game volume", target: "Game volume" },
  { source: "open sideboard", target: "Open sidebar" },
  { source: "close sideboard", target: "Hide sidebar" },
  { source: "settings", target: "Settings" },
  { source: "death audio", target: "Death audio" },
  { source: "related skill", target: "Related skill(s)" },
  {
    source: "related skill (click to hide)",
    target: "Related skill(s) (click to hide)",
  },
  {
    source: "related skill (click to show)",
    target: "Related skill(s) (click to show)",
  },
  { source: "game language", target: "Game language" },
  { source: "zh-CN", target: "简体中文" },
  { source: "zh-TW", target: "繁體中文" },
  { source: "zh-HK", target: "繁體中文（香港）" },
  { source: "en-US", target: "English" },

  { source: "quickChat:0", target: "能不能快点啊，兵贵神速啊！" },
  { source: "quickChat:1", target: "主公别开枪，自己人。" },
  { source: "quickChat:2", target: "小内再不跳，后面还怎么玩啊？" },
  { source: "quickChat:3", target: "你们忍心就这么让我酱油了？" },
  { source: "quickChat:4", target: "我……我惹你们了吗？" },
  { source: "quickChat:5", target: "姑娘，你真是条汉子。" },
  { source: "quickChat:6", target: "三十六计走为上，容我去去便回。" },
  { source: "quickChat:7", target: "人心散了，队伍不好带了啊。" },
  { source: "quickChat:7", target: "人心散了，队伍不好带啊。" },
  { source: "quickChat:8", target: "昏君！昏君啊！" },
  { source: "quickChat:9", target: "风吹鸡蛋壳，牌去人安乐。" },
  { source: "quickChat:10", target: "小内啊，您老悠着点。" },
  { source: "quickChat:11", target: "呃，不好意思，刚才卡了。" },
  { source: "quickChat:12", target: "你可以打得再烂一点吗。" },
  { source: "quickChat:13", target: "哥们，给力点行吗。" },
  { source: "quickChat:14", target: "哥哥，交个朋友吧。" },
  { source: "quickChat:15", target: "妹子，交个朋友吧。" },
  { source: "quickChat:16", target: "我从未见过如此厚颜无耻之人！" },
  { source: "quickChat:17", target: "这波不亏。" },
  { source: "quickChat:18", target: "请收下我的膝盖。" },
  { source: "quickChat:19", target: "你咋不上天呢！" },
  { source: "quickChat:20", target: "放开我的队友！冲我来。" },
  { source: "quickChat:21", target: "你随便杀，闪不了算我输。" },
  { source: "quickChat:22", target: "见证奇迹的时刻到了。" },

  { source: "system notification", target: "System notification" },
  { source: "ready", target: "Ready" },
  { source: "cancel ready", target: "Cancel ready" },
  { source: "get ready", target: "Get ready" },
  { source: "enable observer", target: "Enable observer" },
  // { source: '{0} time limit', target: '{0}操作时间' },
  { source: "game mode", target: "Game mode" },
  {
    source: "character package settings",
    target: "Character package settings",
  },
  { source: "start game", target: "Start game" },
  { source: "second", target: "seconds" },
  { source: "save settings", target: "Save settings" },
  { source: "campaign", target: "Campaign" },
  { source: "multi online", target: "Multi-online" },
  {
    source: "room host has been changed to {0}",
    target: "Room host has been changed to {0}",
  },
  { source: "pve mode selection", target: "PvE mode selection" },
  { source: "back to waiting room", target: "Back to waiting room" },
  { source: "give host", target: "Give host" },
  { source: "forbidden characters", target: "Forbidden characters" },
  { source: "search character by name", target: "Search character by name" },
  {
    source: "observer {0} join in the room",
    target: "Observer {0} join in the room",
  },
  // { source: 'Observe', target: '旁观' },
  // {
  //   source: 'Room running with exceptions, please re-create your room',
  //   target: '房间出现错误，请退出房间重新创建游戏',
  // },
  {
    source: "do you wanna change your handcards?",
    target: "Do you wanna change your handcards?",
  },
  {
    source: "fortune card exchange limit",
    target: "Fortune card exchange limit",
  },
  // { source: 'times', target: '次' },
  { source: "free to choose characters", target: "Free to choose characters" },
];
