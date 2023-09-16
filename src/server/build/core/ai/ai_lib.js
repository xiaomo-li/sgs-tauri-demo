"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiLibrary = void 0;
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const view_as_skill_trigger_1 = require("./skills/base/view_as_skill_trigger");
class AiLibrary {
    static getCardValueofCard(cardId) {
        return (AiLibrary.standardCardValue.find(cardValue => cardValue.cardName === engine_1.Sanguosha.getCardById(cardId).Name) || {
            value: 50,
            wane: 0.5,
            priority: 50,
        });
    }
    static sortCardsValuePriority(cardIds) {
        return cardIds.sort((a, b) => AiLibrary.getCardValueofCard(a).value - AiLibrary.getCardValueofCard(b).value);
    }
    static sortCardsUsePriority(room, player) {
        const cards = AiLibrary.findAvailableCardsToUse(room, player);
        return cards.sort((a, b) => AiLibrary.getCardValueofPlayer(room, player, b).priority -
            AiLibrary.getCardValueofPlayer(room, player, a).priority);
    }
    static sortByJudgeCardsThreatenValue(judgeCards) {
        const judgeThreanValues = judgeCards.map(card => [
            card,
            AiLibrary.judgeCardsThreatenValue[engine_1.Sanguosha.getCardById(card).Name],
        ]);
        return judgeThreanValues
            .sort((cardValueA, cardValueB) => cardValueB[1] - cardValueA[1])
            .map(cardValue => cardValue[0]);
    }
    static sortTargetEquipsInDefense(room, ai, to) {
        const equipValues = to
            .getCardIds(1 /* EquipArea */)
            .map(equip => [equip, AiLibrary.equipStaticDefenseValue[engine_1.Sanguosha.getCardById(equip).Name]]);
        equipValues.sort((a, b) => b[1] - a[1]);
        return equipValues.map(equipValue => equipValue[0]);
    }
    static getCardValueofPlayer(room, ai, cardId) {
        const cardValue = AiLibrary.getCardValueofCard(cardId);
        const targetCard = engine_1.Sanguosha.getCardById(cardId);
        if (targetCard.BaseType === 1 /* Equip */) {
            cardValue.priority =
                ai.getEquipment(targetCard.EquipType) === undefined
                    ? cardValue.priority
                    : Math.max(0, cardValue.priority - 60);
        }
        return cardValue;
    }
    static sortCardAndSkillUsePriority(room, ai, skills, cards) {
        var _a, _b;
        let actionItems = [...skills, ...cards];
        for (const skill of skills) {
            actionItems =
                ((_a = skill
                    .tryToCallAiTrigger()) === null || _a === void 0 ? void 0 : _a.dynamicallyAdjustSkillUsePriority(room, ai, skill, actionItems)) || actionItems;
        }
        for (const cardId of cards) {
            const skill = engine_1.Sanguosha.getCardById(cardId).Skill;
            if (!(skill instanceof skill_1.ActiveSkill)) {
                continue;
            }
            actionItems =
                ((_b = skill
                    .tryToCallAiTrigger()) === null || _b === void 0 ? void 0 : _b.dynamicallyAdjustSkillUsePriority(room, ai, skill, actionItems)) || actionItems;
        }
        return actionItems;
    }
    static shouldUseWuXieKeJi(room, player, availableCards, byCardId, cardUseFrom) {
        const askedByCard = engine_1.Sanguosha.getCardById(byCardId);
        // todo: improve from multi target trick
        if (askedByCard.Name === 'wanjianqifa') {
            if (cardUseFrom && room.CurrentPhasePlayer.Id === cardUseFrom && !room.CurrentPhasePlayer.hasUsed('slash')) {
                return AiLibrary.findCardsByMatcher(room, player, new card_matcher_1.CardMatcher({ name: ['jink'] })).length <= 1;
            }
        }
        // improve with cheat
        // if cardUsefrom is teammate, should not use wuxie
        // if cardUsefrom is enemy, should use wuxie
        return (cardUseFrom !== undefined && !this.areTheyFriendly(room.getPlayerById(cardUseFrom), player, room.Info.gameMode));
    }
    static shouldUseJink(room, player, availableCards, byCardId, cardUseFrom) {
        const isAiRound = room.CurrentPhasePlayer.Id === player.Id;
        const askedByCard = byCardId && engine_1.Sanguosha.getCardById(byCardId);
        if (isAiRound) {
            return player.Id !== cardUseFrom;
        }
        if (askedByCard) {
            if (player.Hp === 1) {
                return true;
            }
            if (askedByCard.Name === 'wanjianqifa') {
                return availableCards.length > 1;
            }
            if (askedByCard.GeneralName === 'slash') {
                const useFrom = cardUseFrom ? room.getPlayerById(cardUseFrom) : undefined;
                if (useFrom === null || useFrom === void 0 ? void 0 : useFrom.hasDrunk()) {
                    return true;
                }
                if (useFrom && useFrom.getCardIds(0 /* HandArea */).length > 3) {
                    return availableCards.length >= 1;
                }
                return true;
            }
        }
        else {
            return false;
        }
    }
    static getUsableSlashesTo(room, ai, to) {
        return AiLibrary.findAvailableCardsToUse(room, ai, new card_matcher_1.CardMatcher({ generalName: ['slash'] })).filter(cardId => room.canAttack(ai, to, cardId) && room.canUseCardTo(cardId, ai, to));
    }
    static getAttackWillEffectSlashesTo(room, ai, to, slashes) {
        const shieldId = to.getEquipment(3 /* Shield */);
        const shield = shieldId !== undefined ? engine_1.Sanguosha.getCardById(shieldId) : undefined;
        slashes = slashes || AiLibrary.getUsableSlashesTo(room, ai, to);
        const weaponId = ai.getEquipment(2 /* Weapon */);
        const weapon = weaponId !== undefined ? engine_1.Sanguosha.getCardById(weaponId) : undefined;
        if (weapon && weapon.Name === 'qinggang') {
            return slashes;
        }
        if (shield) {
            if (shield.Name === 'tengjia') {
                slashes = slashes.filter(slash => engine_1.Sanguosha.getCardById(slash).Name !== 'slash');
            }
            else if (shield.Name === 'renwangdun') {
                slashes = slashes.filter(slash => engine_1.Sanguosha.getCardById(slash).Color !== 1 /* Black */);
            }
        }
        return slashes;
    }
    static askAiUseCard(room, aiId, availableCards, cardMatcher, byCardId, cardUseFrom) {
        var _a, _b;
        const aiPlayer = room.getPlayerById(aiId);
        if (availableCards.length === 0) {
            return availableCards;
        }
        if (byCardId !== undefined) {
            if ((_a = cardMatcher.name) === null || _a === void 0 ? void 0 : _a.includes('wuxiekeji')) {
                return AiLibrary.shouldUseWuXieKeJi(room, aiPlayer, availableCards, byCardId, cardUseFrom)
                    ? availableCards
                    : [];
            }
            else if ((_b = cardMatcher.name) === null || _b === void 0 ? void 0 : _b.includes('jink')) {
                return AiLibrary.shouldUseJink(room, aiPlayer, availableCards, byCardId, cardUseFrom) ? availableCards : [];
            }
        }
        return availableCards;
    }
    static askAiChooseCardFromPlayer(room, aiId, toId, options) {
        const equipTypePriority = [
            5 /* DefenseRide */,
            3 /* Shield */,
            4 /* OffenseRide */,
            2 /* Weapon */,
            6 /* Precious */,
        ];
        let selectedCard;
        let fromArea;
        let selectedCardIndex;
        const areas = Object.keys(options).map(area => Number(area));
        if (areas.includes(1 /* EquipArea */)) {
            const cardIds = options[1 /* EquipArea */];
            if (cardIds instanceof Array && cardIds.length > 0) {
                selectedCard = cardIds.find(cardId => engine_1.Sanguosha.getCardById(cardId).is(equipTypePriority.find(equipType => cardIds.filter(c => engine_1.Sanguosha.getCardById(c).is(equipType)).length > 0)));
            }
        }
        if (selectedCard === undefined) {
            fromArea = areas.find(area => room.getPlayerById(toId).getCardIds(area).length > 0);
            if (fromArea === undefined) {
                const chooseCard = { fromId: aiId };
                return chooseCard;
            }
            const cards = options[fromArea];
            selectedCard = cards instanceof Array ? cards[0] : undefined;
            selectedCardIndex = typeof cards === 'number' ? 0 : undefined;
        }
        const chooseCard = {
            fromId: aiId,
            selectedCard,
            fromArea,
            selectedCardIndex,
        };
        return chooseCard;
    }
    static sortCardbyValue(cards, descend = true) {
        const cardIds = cards.reduce((allCardsValue, cardId) => {
            const cardValue = AiLibrary.getCardValueofCard(cardId);
            const value = cardValue.value *
                cardValue.wane **
                    allCardsValue.filter(s => engine_1.Sanguosha.getCardById(s.cardId).Name === engine_1.Sanguosha.getCardById(cardId).Name).length;
            allCardsValue.push({ cardId, value });
            allCardsValue.sort((a, b) => (descend ? b.value - a.value : a.value - b.value));
            return allCardsValue;
        }, []);
        const result = cardIds.map(cardsValue => cardsValue.cardId);
        return result;
    }
    static findCardsByMatcher(room, player, cardMatcher, fromAreas = [0 /* HandArea */], outsideAreaName) {
        const cards = fromAreas.reduce((savedCards, area) => {
            const areaCards = player
                .getCardIds(area, outsideAreaName)
                .filter(card => (cardMatcher ? cardMatcher.match(engine_1.Sanguosha.getCardById(card)) : true));
            savedCards.push(...areaCards);
            return savedCards;
        }, []);
        return cards;
    }
    static findAvailableCardsToUse(room, player, cardMatcher) {
        let cards = AiLibrary.findCardsByMatcher(room, player, cardMatcher).filter(cardId => player.canUseCard(room, cardId, cardMatcher));
        if (!cardMatcher) {
            cards = cards.filter(card => !(engine_1.Sanguosha.getCardById(card).Skill instanceof skill_1.ResponsiveSkill));
        }
        for (const skill of player.getSkills('filter')) {
            cards = cards.filter(cardId => skill.canUseCard(cardId, room, player.Id));
        }
        const viewAsSkills = player.getSkills('viewAs');
        for (const skill of viewAsSkills) {
            const availableCards = [];
            for (const area of skill.availableCardAreas()) {
                availableCards.push(...player.getCardIds(area, skill.GeneralName));
            }
            const avaiableViewAs = view_as_skill_trigger_1.ViewAsSkillTriggerClass.createViewAsPossibilties(room, player, availableCards, skill, cardMatcher, []);
            if (avaiableViewAs) {
                const canViewAs = skill.canViewAs(room, player, avaiableViewAs, cardMatcher);
                for (const viewAs of canViewAs) {
                    const viewAsCardId = skill.viewAs(avaiableViewAs, player, viewAs).Id;
                    if (player.canUseCard(room, viewAsCardId, cardMatcher)) {
                        cards.push(viewAsCardId);
                    }
                }
            }
        }
        return cards;
    }
    static findAvailableCardsToResponse(room, player, onResponse, cardMatcher) {
        let cards = AiLibrary.findCardsByMatcher(room, player, cardMatcher);
        for (const skill of player.getSkills('filter')) {
            cards = cards.filter(cardId => skill.canUseCard(cardId, room, player.Id, onResponse));
        }
        const viewAsSkills = player.getSkills('viewAs');
        for (const skill of viewAsSkills) {
            const availableCards = [];
            for (const area of skill.availableCardAreas()) {
                availableCards.push(...player.getCardIds(area, skill.GeneralName));
            }
            const avaiableViewAs = view_as_skill_trigger_1.ViewAsSkillTriggerClass.createViewAsPossibilties(room, player, availableCards, skill, cardMatcher, []);
            if (avaiableViewAs) {
                const canViewAs = skill.canViewAs(room, player, avaiableViewAs, cardMatcher);
                for (const viewAs of canViewAs) {
                    const viewAsCardId = skill.viewAs(avaiableViewAs, player, viewAs).Id;
                    if (player.canUseCard(room, viewAsCardId, cardMatcher)) {
                        cards.push(viewAsCardId);
                    }
                }
            }
        }
        return cards;
    }
    static getPlayerAbsoluteDefenseValue(player) {
        let defenseValue = 0;
        const equips = player.getCardIds(1 /* EquipArea */);
        if (equips.find(card => engine_1.Sanguosha.getCardById(card).is(3 /* Shield */)) || player.hasSkill('bazhen')) {
            defenseValue += 5;
        }
        if (equips.find(card => engine_1.Sanguosha.getCardById(card).is(5 /* DefenseRide */))) {
            defenseValue += 2;
        }
        if (player.hasSkill('feiying')) {
            defenseValue += 2;
        }
        if (player.hasSkill('leiji')) {
            defenseValue += player.getCardIds(0 /* HandArea */).length / 1.5;
        }
        return defenseValue;
    }
    static getPlayerRelativeDefenseValue(from, to) {
        let targetDefenseValue = AiLibrary.getPlayerAbsoluteDefenseValue(to);
        const equips = from.getCardIds(1 /* EquipArea */);
        if (equips.find(card => engine_1.Sanguosha.getCardById(card).is(4 /* OffenseRide */))) {
            targetDefenseValue -= 2;
        }
        if (from.hasSkill('mashu')) {
            targetDefenseValue -= 1;
        }
        if (equips.find(card => engine_1.Sanguosha.getCardById(card).is(2 /* Weapon */))) {
            targetDefenseValue -= 2;
        }
        if (equips.find(card => engine_1.Sanguosha.getCardById(card).Name === 'qinggang')) {
            targetDefenseValue -= 3;
        }
        return targetDefenseValue;
    }
    static sortEnemiesByRole(room, from) {
        let enemies = room.getOtherPlayers(from.Id).filter(other => !this.areTheyFriendly(other, from, room.Info.gameMode));
        if (room.Info.gameMode === "standard-game" /* Standard */ && from.Role === 4 /* Renegade */) {
            enemies = enemies.filter(enemy => enemy.Role === 1 /* Lord */);
        }
        return enemies.sort((enemyA, enemyB) => {
            const defenseValueA = AiLibrary.getPlayerRelativeDefenseValue(from, enemyA);
            const defenseValueB = AiLibrary.getPlayerRelativeDefenseValue(from, enemyB);
            return defenseValueA - defenseValueB;
        });
    }
    static sortFriendsFromWeakToStrong(room, from) {
        const friends = room
            .getOtherPlayers(from.Id)
            .filter(other => this.areTheyFriendly(other, from, room.Info.gameMode));
        return friends.sort((enemyA, enemyB) => {
            const defenseValueA = AiLibrary.getPlayerRelativeDefenseValue(from, enemyA);
            const defenseValueB = AiLibrary.getPlayerRelativeDefenseValue(from, enemyB);
            return defenseValueA - defenseValueB;
        });
    }
    static areTheyFriendly(playerA, playerB, mode) {
        if (mode !== "hegemony-game" /* Hegemony */ && playerA.Role === playerB.Role) {
            return true;
        }
        switch (mode) {
            case "pve" /* Pve */:
            case "pve-classic" /* PveClassic */:
            case "2v2" /* TwoVersusTwo */: {
                return playerA.Role === playerB.Role;
            }
            case "1v2" /* OneVersusTwo */: {
                if (playerA.Role === 1 /* Lord */ || playerB.Role === 1 /* Lord */) {
                    return false;
                }
                return true;
            }
            case "standard-game" /* Standard */: {
                if (playerA.Role === 1 /* Lord */ || playerA.Role === 2 /* Loyalist */) {
                    return playerB.Role === 1 /* Lord */ || playerB.Role === 2 /* Loyalist */;
                }
                else if (playerA.Role === 3 /* Rebel */ || playerA.Role === 4 /* Renegade */) {
                    return playerB.Role === 3 /* Rebel */ || playerB.Role === 4 /* Renegade */;
                }
                break;
            }
            case "hegemony-game" /* Hegemony */: {
                return playerA.Nationality === playerB.Nationality;
            }
            default:
                return false;
        }
        return false;
    }
}
exports.AiLibrary = AiLibrary;
AiLibrary.judgeCardsThreatenValue = {
    lebusishu: 80,
    bingliangcunduan: 75,
    lightning: 65,
};
AiLibrary.equipStaticDefenseValue = {
    baguazhen: 50,
    renwangdun: 58,
    tengjia: 55,
    baiyinshizi: 45,
    muniuliuma: 57,
    hanbingjian: 50,
    cixiongjian: 45,
    fangtianhuaji: 15,
    gudingdao: 18,
    guanshifu: 55,
    zhangbashemao: 40,
    zhugeliannu: 60,
    zhuqueyushan: 19,
    qingnang: 51,
    qilingong: 20,
    zhuahuangfeidian: 70,
    dilu: 70,
    jueying: 70,
    hualiu: 70,
    chitu: 20,
    dayuan: 20,
    zixing: 20,
};
AiLibrary.standardCardValue = [
    // {Card,value, wane, priority}
    // Equipment
    { cardName: 'baguazhen', value: 40, wane: 0, priority: 95 },
    { cardName: 'chitu', value: 35, wane: 0, priority: 95 },
    { cardName: 'cixiongjian', value: 35, wane: 0, priority: 95 },
    { cardName: 'dayuan', value: 35, wane: 0, priority: 95 },
    { cardName: 'dilu', value: 35, wane: 0, priority: 95 },
    { cardName: 'fangtianhuaji', value: 23, wane: 0, priority: 95 },
    { cardName: 'guanshifu', value: 36, wane: 0, priority: 95 },
    { cardName: 'jueying', value: 35, wane: 0, priority: 95 },
    { cardName: 'hanbingjian', value: 35, wane: 0, priority: 95 },
    { cardName: 'qilingong', value: 35, wane: 0, priority: 95 },
    { cardName: 'qinggang', value: 45, wane: 0, priority: 95 },
    { cardName: 'qinglongyanyuedao', value: 35, wane: 0, priority: 95 },
    { cardName: 'renwangdun', value: 45, wane: 0, priority: 95 },
    { cardName: 'zhangbashemao', value: 30, wane: 0, priority: 95 },
    { cardName: 'zhuahuangfeidian', value: 35, wane: 0, priority: 95 },
    { cardName: 'zhugeliannu', value: 45, wane: 0, priority: 80 },
    { cardName: 'zixing', value: 35, wane: 0, priority: 95 },
    { cardName: 'baiyinshizi', value: 60, wane: 0, priority: 95 },
    { cardName: 'gudingdao', value: 30, wane: 0, priority: 95 },
    { cardName: 'hualiu', value: 35, wane: 0, priority: 95 },
    { cardName: 'muniuliuma', value: 60, wane: 0, priority: 95 },
    { cardName: 'tengjia', value: 35, wane: 0, priority: 95 },
    { cardName: 'zhuqueyushan', value: 25, wane: 0, priority: 95 },
    // Trick
    { cardName: 'wuzhongshengyou', value: 58, wane: 0.9, priority: 84 },
    { cardName: 'shunshouqianyang', value: 57, wane: 0.9, priority: 83 },
    { cardName: 'guohechaiqiao', value: 59, wane: 0.9, priority: 85 },
    { cardName: 'lebusishu', value: 56, wane: 0.9, priority: 82 },
    { cardName: 'bingliangcunduan', value: 55, wane: 0.9, priority: 81 },
    { cardName: 'duel', value: 50, wane: 0.8, priority: 80 },
    { cardName: 'fire_attack', value: 51, wane: 0.8, priority: 81 },
    { cardName: 'nanmanruqing', value: 45, wane: 0, priority: 85 },
    { cardName: 'wanjianqifa', value: 45, wane: 0, priority: 85 },
    { cardName: 'taoyuanjieyi', value: 25, wane: 0, priority: 0 },
    { cardName: 'wuxiekeji', value: 25, wane: 0, priority: 85 },
    { cardName: 'wugufengdeng', value: 25, wane: 0, priority: 85 },
    { cardName: 'jiedaosharen', value: 25, wane: 0, priority: 0 },
    { cardName: 'tiesuolianhuan', value: 22, wane: 0, priority: 85 },
    { cardName: 'lightning', value: 25, wane: 0, priority: 85 },
    // Basic
    { cardName: 'peach', value: 70, wane: 0.5, priority: 50 },
    { cardName: 'jink', value: 65, wane: 0.5, priority: 0 },
    { cardName: 'fire_slash', value: 60, wane: 0.3, priority: 45 },
    { cardName: 'thunder_slash', value: 55, wane: 0.3, priority: 43 },
    { cardName: 'alcohol', value: 52, wane: 0.4, priority: 49 },
    { cardName: 'slash', value: 50, wane: 0.3, priority: 35 },
];
