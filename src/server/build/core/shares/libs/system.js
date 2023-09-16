"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const skills_1 = require("core/skills");
const zuoxing_1 = require("core/skills/characters/god/zuoxing");
const zhanyuan_1 = require("core/skills/characters/limited/zhanyuan");
const jibing_1 = require("core/skills/characters/mobile/jibing");
const zhanyi_1 = require("core/skills/characters/mobile/zhanyi");
const mouli_1 = require("core/skills/characters/sincerity/mouli");
const guju_1 = require("core/skills/characters/sp/guju");
const liangzhu_1 = require("core/skills/characters/sp/liangzhu");
const precondition_1 = require("./precondition/precondition");
var System;
(function (System) {
    System.MainThread = {
        sleep: async (milliseconds) => new Promise(r => setTimeout(r, milliseconds)),
    };
    const differentCardSuitFilterFunction = (allCards, selected, currentCard) => {
        const card = engine_1.Sanguosha.getCardById(currentCard);
        return (selected.includes(currentCard) ||
            selected.find(cardId => engine_1.Sanguosha.getCardById(cardId).Suit === card.Suit) === undefined);
    };
    const differentCardNumberFilterFunction = (allCards, selected, currentCard) => {
        const card = engine_1.Sanguosha.getCardById(currentCard);
        return (selected.includes(currentCard) ||
            selected.find(cardId => engine_1.Sanguosha.getCardById(cardId).CardNumber === card.CardNumber) === undefined);
    };
    const differentCardAreaFilterFunction = (allCards, selected, currentCard, involvedTargets) => {
        const from = precondition_1.Precondition.exists(involvedTargets, 'unknown involvedTargets')[0];
        const currentArea = from.cardFrom(currentCard);
        return (selected.includes(currentCard) || selected.find(cardId => from.cardFrom(cardId) === currentArea) === undefined);
    };
    const thirteenPointFilterFunction = (allCards, selected, currentCard) => {
        if (selected.includes(currentCard)) {
            return true;
        }
        const totalPoint = selected.reduce((total, card) => total + engine_1.Sanguosha.getCardById(card).CardNumber, 0);
        const card = engine_1.Sanguosha.getCardById(currentCard);
        return totalPoint + card.CardNumber <= 13;
    };
    System.AskForChoosingCardEventFilters = {
        [1 /* PoXi */]: differentCardSuitFilterFunction,
        [0 /* SheLie */]: differentCardSuitFilterFunction,
        [2 /* JieYue */]: differentCardAreaFilterFunction,
        [3 /* ChengXiang */]: thirteenPointFilterFunction,
        [4 /* JiuFa */]: differentCardNumberFilterFunction,
    };
    System.SideEffectSkillAppliers = {
        [0 /* ZhiBa */]: (player, room, sourceId) => player.Nationality === 2 /* Wu */ && player.Id !== sourceId,
        [1 /* HuangTian */]: (player, room, sourceId) => player.Nationality === 3 /* Qun */ && player.Id !== sourceId,
        [2 /* XianSi */]: (player, room, sourceId) => player.Id !== sourceId,
        [3 /* MouLi */]: (player, room) => player.getFlag(mouli_1.MouLi.MouLiLi),
        [4 /* ZuoXing */]: (player, room) => player.getFlag(zuoxing_1.ZuoXing.Name),
        [5 /* WenGua */]: (player, room, sourceId) => player.Id !== sourceId,
        [6 /* ZhanYi */]: (player, room) => player.getFlag(zhanyi_1.ZhanYi.Name) !== undefined,
        [7 /* PveLongShenQiFu */]: (player, _, sourceId) => player.Id !== sourceId,
    };
    System.AwakeningSkillApplier = {
        ["baiyin" /* BaiYin */]: (room, player) => player.getMark("ren" /* Ren */) > 3,
        ["hunzi" /* HunZi */]: (room, player) => player.Hp <= 2,
        ["ruoyu" /* RuoYu */]: (room, player) => room.getOtherPlayers(player.Id).find(p => p.Hp < player.Hp) === undefined,
        ["zaoxian" /* ZaoXian */]: (room, player) => player.getCardIds(3 /* OutsideArea */, skills_1.TunTian.Name).length > 2,
        ["zhiji" /* ZhiJi */]: (room, player) => player.getCardIds(0 /* HandArea */).length <= 0,
        ["qianxin" /* QianXin */]: (room, player) => player.LostHp > 0,
        ["qinxue" /* QinXue */]: (room, player) => player.getCardIds(0 /* HandArea */).length - player.Hp >= 2,
        ["hongju" /* HongJu */]: (room, player) => player.getCardIds(3 /* OutsideArea */, skills_1.ZhengRong.Name).length > 2,
        ["poshi" /* PoShi */]: (room, player) => player.Hp === 1 || player.AvailableEquipSections.length === 0,
        ["zhi_sanchen" /* ZhiSanChen */]: (room, player) => player.getFlag(skills_1.WuKu.Name) >= 3,
        ["chengzhang" /* ChengZhang */]: (room, player) => room.Analytics.getDamage(player.Id) + room.Analytics.getDamaged(player.Id) >= 7,
        ["zili" /* Zili */]: (room, player) => player.getCardIds(3 /* OutsideArea */, skills_1.QuanJi.Name).length > 2,
        ["god_tianyi" /* GodTianYi */]: (room, player) => room
            .getAlivePlayersFrom()
            .find(player => room.Analytics.getDamagedRecord(player.Id, undefined, undefined, 1).length === 0) === undefined,
        ["fanxiang" /* FanXiang */]: (room, player) => {
            const players = player.getFlag(liangzhu_1.LiangZhu.Name);
            return players && players.find(p => room.getPlayerById(p).LostHp > 0) !== undefined;
        },
        ["juyi" /* JuYi */]: (room, player) => player.MaxHp > room.AlivePlayers.length,
        ["baijia" /* BaiJia */]: (room, player) => player.getFlag(guju_1.GuJu.Name) >= 7,
        ["shanli" /* ShanLi */]: (room, player) => player.hasUsedSkill(skills_1.BaiYi.Name) && (player.getFlag(skills_1.JingLve.Name) || []).length >= 2,
        ["mangqing" /* MangQing */]: (room, player) => room.AlivePlayers.filter(player => player.LostHp > 0).length > player.Hp,
        ["choujue" /* ChouJue */]: (room, player) => Math.abs(player.Hp - player.getCardIds(0 /* HandArea */).length) >= 3,
        ["beishui" /* BeiShui */]: (room, player) => player.Hp < 2 || player.getCardIds(0 /* HandArea */).length < 2,
        ["pve_classic_guyong" /* PveClassicGuYong */]: (room, player) => ["pve_tanlang" /* PveTanLang */, "pve_wenqu" /* PveWenQu */, "pve_wuqu" /* PveWuQu */, "pve_pojun" /* PvePoJun */].every(mark => player.getMark(mark) > 0),
        ["moucuan" /* MouCuan */]: (room, player) => player.getCardIds(3 /* OutsideArea */, jibing_1.JiBing.Name).length >=
            room.AlivePlayers.reduce((allNations, p) => {
                if (!allNations.includes(p.Nationality)) {
                    allNations.push(p.Nationality);
                }
                return allNations;
            }, []).length,
        ["zhuangrong" /* ZhuangRong */]: (room, player) => player.Hp === 1 || player.getCardIds(0 /* HandArea */).length === 1,
        ["wuji" /* WuJi */]: (room, player) => room.Analytics.getDamage(player.Id, 'round') > 2,
        ["dujiang" /* DuJiang */]: (room, player) => player.Armor > 2,
        ["zhanyuan" /* ZhanYuan */]: (room, player) => player.getFlag(zhanyuan_1.ZhanYuan.Name) > 7,
        ["pve_classic_guyong" /* PveClassicGuYong */]: (room, player) => ["pve_tanlang" /* PveTanLang */, "pve_wenqu" /* PveWenQu */, "pve_wuqu" /* PveWuQu */, "pve_pojun" /* PvePoJun */].every(mark => player.getMark(mark) > 0),
    };
    System.SkillTagsTransformer = {
        ["dinghan" /* DingHan */]: (cardNames) => cardNames.map(cardName => card_1.VirtualCard.create({ cardName, bySkill: "dinghan" /* DingHan */ })),
        ["jiufa" /* JiuFa */]: (cardNames) => cardNames.map(cardName => card_1.VirtualCard.create({ cardName, bySkill: "jiufa" /* JiuFa */ })),
    };
})(System = exports.System || (exports.System = {}));
