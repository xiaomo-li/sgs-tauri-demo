"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const trust_ai_1 = require("core/ai/trust_ai");
const card_1 = require("core/cards/card");
const equip_card_1 = require("core/cards/equip_card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const algorithm_1 = require("core/shares/libs/algorithm");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const skill_rule_1 = require("core/skills/skill_rule");
class Player {
    constructor(playerCards, playerCharacterId, ai = trust_ai_1.TrustAI.Instance) {
        this.playerCharacterId = playerCharacterId;
        this.ai = ai;
        this.dying = false;
        this.chainLocked = false;
        this.turnedOver = false;
        this.playerSkills = [];
        this.hookedSkills = [];
        this.equipSectionsStatus = {
            ["weapon section" /* Weapon */]: 'enabled',
            ["shield section" /* Shield */]: 'enabled',
            ["defense ride section" /* DefenseRide */]: 'enabled',
            ["offense ride section" /* OffenseRide */]: 'enabled',
            ["precious" /* Precious */]: 'enabled',
        };
        this.judgeAreaStatus = 'enabled';
        this.drunk = 0;
        this.ready = false;
        this.playerRole = 0 /* Unknown */;
        this.cardUseHistory = [];
        this.skillUsedHistory = [];
        this.switchSkillState = [];
        this.playerOutsideCharactersAreaNames = [];
        this.visiblePlayerTags = {};
        this.visiblePlayers = {};
        this.flags = {};
        this.marks = {};
        this.cardTags = {};
        if (playerCards) {
            this.playerCards = {
                [0 /* HandArea */]: playerCards[0 /* HandArea */],
                [2 /* JudgeArea */]: playerCards[2 /* JudgeArea */],
                [1 /* EquipArea */]: playerCards[1 /* EquipArea */],
            };
            this.playerOutsideCards = playerCards[3 /* OutsideArea */];
        }
        else {
            this.playerCards = {
                [0 /* HandArea */]: [],
                [2 /* JudgeArea */]: [],
                [1 /* EquipArea */]: [],
            };
            this.playerOutsideCards = {};
        }
        if (this.playerCharacterId != null) {
            this.playerCharacter = engine_1.Sanguosha.getCharacterById(this.playerCharacterId);
            if (this.hp == null) {
                this.hp = this.playerCharacter.MaxHp;
            }
            if (this.maxHp == null) {
                this.maxHp = this.playerCharacter.MaxHp;
            }
            if (this.nationality == null) {
                this.nationality = this.playerCharacter.Nationality;
            }
            if (this.gender == null) {
                this.gender = this.playerCharacter.Gender;
            }
            if (this.Armor == null) {
                this.Armor = this.playerCharacter.Armor;
            }
        }
        this.dead = false;
        // GameCommonRules.initPlayerCommonRules(this);
    }
    syncUpPlayer(playerInfo) {
        const { chainLocked, turnedOver, drunk, dead, equipSectionsStatus, judgeAreaStatus, playerCards, playerOutsideCards, playerOutsideCharactersAreaNames, } = playerInfo;
        this.chainLocked = chainLocked;
        this.turnedOver = turnedOver;
        this.drunk = drunk;
        this.dead = dead;
        this.equipSectionsStatus = equipSectionsStatus;
        this.judgeAreaStatus = judgeAreaStatus;
        this.playerCards = playerCards;
        this.playerOutsideCards = playerOutsideCards;
        this.playerOutsideCharactersAreaNames = playerOutsideCharactersAreaNames;
    }
    clearFlags() {
        this.visiblePlayerTags = {};
        this.flags = {};
    }
    removeFlag(name) {
        delete this.visiblePlayerTags[name];
        delete this.visiblePlayers[name];
        delete this.flags[name];
    }
    setFlag(name, value, tagName, visiblePlayers) {
        if (tagName && this.visiblePlayerTags[name] !== tagName) {
            this.visiblePlayerTags[name] = tagName;
            if (visiblePlayers && visiblePlayers.length > 0) {
                this.visiblePlayers[name] = visiblePlayers;
            }
        }
        else if (!tagName && this.visiblePlayerTags[name] !== undefined) {
            delete this.visiblePlayerTags[name];
        }
        if (!this.visiblePlayerTags[name]) {
            delete this.visiblePlayers[name];
        }
        else if (visiblePlayers && visiblePlayers.length > 0) {
            this.visiblePlayers[name] = visiblePlayers;
        }
        return (this.flags[name] = value);
    }
    getFlag(name) {
        return this.flags[name];
    }
    get Flags() {
        return this.flags;
    }
    clearMarks() {
        this.marks = {};
    }
    removeMark(name) {
        delete this.marks[name];
    }
    setMark(name, value) {
        return (this.marks[name] = value);
    }
    addMark(name, value) {
        if (this.marks[name] === undefined) {
            this.marks[name] = value;
        }
        else {
            this.marks[name] += value;
        }
        return this.marks[name];
    }
    getMark(name) {
        return this.marks[name] || 0;
    }
    get Marks() {
        return this.marks;
    }
    addInvisibleMark(name, value) {
        return this.addMark('!' + name, value);
    }
    getInvisibleMark(name) {
        return this.getMark('!' + name);
    }
    removeInvisibleMark(name) {
        this.removeMark('!' + name);
    }
    removeCardTag(cardTag) {
        delete this.cardTags[cardTag];
    }
    setCardTag(cardTag, cardIds) {
        this.cardTags[cardTag] = cardIds;
    }
    getCardTag(cardTag) {
        return this.cardTags[cardTag];
    }
    getAllCardTags() {
        return this.cardTags;
    }
    clearCardTags() {
        this.cardTags = {};
    }
    canUseCard(room, cardId, onResponse) {
        const card = cardId instanceof card_matcher_1.CardMatcher ? cardId : engine_1.Sanguosha.getCardById(cardId);
        const ruleCardUse = room.CommonRules.canUseCard(room, this, card);
        for (const skill of this.getSkills('filter')) {
            if (!skill.canUseCard(cardId, room, this.Id)) {
                return false;
            }
        }
        const canUseToSomeone = room.AlivePlayers.find(player => room.CommonRules.canUseCardTo(room, this, card, player));
        if (card instanceof card_1.Card) {
            if (canUseToSomeone) {
                return card.is(1 /* Equip */)
                    ? true
                    : onResponse
                        ? onResponse.match(card)
                        : card.Skill.canUse(room, this, cardId);
            }
        }
        else {
            if (canUseToSomeone) {
                return onResponse ? onResponse.match(card) : true;
            }
        }
        return ruleCardUse;
    }
    resetCardUseHistory(cardName) {
        if (cardName !== undefined) {
            this.cardUseHistory = this.cardUseHistory.filter(card => engine_1.Sanguosha.getCardById(card).GeneralName !== cardName);
        }
        else {
            this.cardUseHistory = [];
        }
    }
    resetSkillUseHistory(skillName) {
        this.skillUsedHistory[skillName] = 0;
    }
    useCard(cardId) {
        this.cardUseHistory.push(cardId);
    }
    useSkill(skillName) {
        if (this.skillUsedHistory[skillName] !== undefined) {
            this.skillUsedHistory[skillName]++;
        }
        else {
            this.skillUsedHistory[skillName] = 1;
        }
        const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
        if (skill.isSwitchSkill() && skill.isSwitchable()) {
            const generalName = skill.GeneralName;
            if (this.switchSkillState.includes(generalName)) {
                const index = this.switchSkillState.findIndex(name => name === generalName);
                this.switchSkillState.splice(index, 1);
            }
            else {
                this.switchSkillState.push(generalName);
            }
        }
    }
    setupCards(area, cards) {
        this.playerCards[area] = cards;
    }
    getCardIds(area, outsideAreaName) {
        if (area === undefined) {
            const [handCards, judgeCards, equipCards] = Object.values(this.playerCards);
            return [...handCards, ...judgeCards, ...equipCards];
        }
        if (area !== 3 /* OutsideArea */) {
            return this.playerCards[area];
        }
        else {
            outsideAreaName = precondition_1.Precondition.exists(outsideAreaName, `Unable to get ${outsideAreaName} area cards`);
            this.playerOutsideCards[outsideAreaName] = this.playerOutsideCards[outsideAreaName] || [];
            return this.playerOutsideCards[outsideAreaName];
        }
    }
    getAllGameCards() {
        const allCards = this.getCardIds();
        for (const [areaName, outside] of Object.entries(this.playerOutsideCards)) {
            if (this.playerOutsideCharactersAreaNames.includes(areaName)) {
                continue;
            }
            allCards.push(...outside);
        }
        return allCards;
    }
    setCharacterOutsideAreaCards(areaName, characterIds) {
        if (!this.playerOutsideCharactersAreaNames.includes(areaName)) {
            this.playerOutsideCharactersAreaNames.push(areaName);
        }
        this.playerOutsideCards[areaName] = characterIds;
    }
    isCharacterOutsideArea(areaName) {
        return this.playerOutsideCharactersAreaNames.includes(areaName);
    }
    getOutsideAreaNameOf(cardId) {
        for (const [areaName, cards] of Object.entries(this.playerOutsideCards)) {
            if (cards.includes(cardId)) {
                return areaName;
            }
        }
    }
    getOutsideAreaCards() {
        return this.playerOutsideCards;
    }
    getPlayerCards() {
        return [...this.playerCards[1 /* EquipArea */], ...this.playerCards[0 /* HandArea */]];
    }
    getWeaponCardId() {
        return this.playerCards[1 /* EquipArea */].find(card => engine_1.Sanguosha.getCardById(card).is(2 /* Weapon */));
    }
    getCardId(cardId) {
        for (const card of Object.values(this.getCardIds())) {
            if (card === cardId) {
                return cardId;
            }
        }
    }
    cardFrom(cardId) {
        const realCardId = card_1.VirtualCard.getActualCards([cardId]);
        if (realCardId.length > 1) {
            return;
        }
        else {
            cardId = realCardId[0];
        }
        for (const [area, cards] of Object.entries(this.playerCards)) {
            const realCards = card_1.VirtualCard.getActualCards(cards);
            if (realCards.find(card => card === cardId)) {
                return parseInt(area, 10);
            }
        }
        for (const [, cards] of Object.entries(this.getOutsideAreaCards())) {
            const realCards = card_1.VirtualCard.getActualCards(cards);
            if (realCards.find(card => card === cardId)) {
                return 3 /* OutsideArea */;
            }
        }
    }
    obtainCardIds(...cards) {
        const handCards = this.getCardIds(0 /* HandArea */);
        for (const card of card_1.VirtualCard.getActualCards(cards)) {
            handCards.push(card);
        }
    }
    hasCardOrSubCardsInCards(sectionCards, cardId) {
        const index = sectionCards.findIndex(sectionCardId => sectionCardId === cardId);
        if (index >= 0) {
            return true;
        }
        if (card_1.Card.isVirtualCardId(cardId)) {
            const targetCardRealCards = card_1.VirtualCard.getActualCards([cardId]);
            return (algorithm_1.Algorithm.intersection(card_1.VirtualCard.getActualCards(sectionCards), targetCardRealCards).length ===
                targetCardRealCards.length);
        }
        return false;
    }
    dropCards(...cards) {
        const areaCardsList = [
            this.playerCards[0 /* HandArea */],
            this.playerCards[1 /* EquipArea */],
            this.playerCards[2 /* JudgeArea */],
            ...Object.entries(this.playerOutsideCards)
                .filter(([areaName]) => !this.isCharacterOutsideArea(areaName))
                .map(([, cards]) => cards),
        ];
        for (const card of cards) {
            if (card_1.VirtualCard.getActualCards([card]).length === 0) {
                continue;
            }
            const droppedCards = [];
            const realCards = card_1.VirtualCard.getActualCards([card]);
            for (const areaCards of areaCardsList) {
                for (const card of realCards) {
                    const index = areaCards.findIndex(areaCard => areaCard === card || card_1.VirtualCard.getActualCards([areaCard]).includes(card));
                    if (index >= 0) {
                        areaCards.splice(index, 1);
                        droppedCards.push(card);
                    }
                }
            }
            if (droppedCards.length !== realCards.length) {
                throw new Error(`Unexpected card drop from player ${this.Name}`);
            }
        }
        return cards;
    }
    canEquip(equipCard) {
        if (equipCard.is(2 /* Weapon */)) {
            return this.equipSectionsStatus["weapon section" /* Weapon */] === 'enabled';
        }
        if (equipCard.is(3 /* Shield */)) {
            return this.equipSectionsStatus["shield section" /* Shield */] === 'enabled';
        }
        if (equipCard.is(5 /* DefenseRide */)) {
            return this.equipSectionsStatus["defense ride section" /* DefenseRide */] === 'enabled';
        }
        if (equipCard.is(4 /* OffenseRide */)) {
            return this.equipSectionsStatus["offense ride section" /* OffenseRide */] === 'enabled';
        }
        if (equipCard.is(6 /* Precious */)) {
            return this.equipSectionsStatus["precious" /* Precious */] === 'enabled';
        }
        return false;
    }
    canEquipTo(section) {
        return this.equipSectionsStatus[section] === 'enabled';
    }
    getEmptyEquipSections() {
        let allEquipTypes = [
            2 /* Weapon */,
            3 /* Shield */,
            5 /* DefenseRide */,
            4 /* OffenseRide */,
            6 /* Precious */,
        ];
        if (this.playerCards[1 /* EquipArea */].length > 0) {
            allEquipTypes = allEquipTypes.filter(type => !this.playerCards[1 /* EquipArea */].find(id => engine_1.Sanguosha.getCardById(id).is(type)));
        }
        const cardTypeMapper = {
            [2 /* Weapon */]: "weapon section" /* Weapon */,
            [3 /* Shield */]: "shield section" /* Shield */,
            [5 /* DefenseRide */]: "defense ride section" /* DefenseRide */,
            [4 /* OffenseRide */]: "offense ride section" /* OffenseRide */,
            [6 /* Precious */]: "precious" /* Precious */,
        };
        return allEquipTypes.filter(type => this.equipSectionsStatus[cardTypeMapper[type]] === 'enabled');
    }
    equip(equipCard) {
        precondition_1.Precondition.assert(!this.playerCards[1 /* EquipArea */].find(card => engine_1.Sanguosha.getCardById(card).is(equipCard.EquipType)), 'Unexpected existing equip card in equip area');
        precondition_1.Precondition.assert(!this.playerCards[0 /* HandArea */].find(cardId => equipCard.Id === cardId), 'Unexpected existing equip card in hand area');
        this.playerCards[1 /* EquipArea */].push(equipCard.Id);
        return equipCard.Id;
    }
    isInjured() {
        return this.Hp < this.MaxHp;
    }
    getDrunk() {
        this.drunk++;
    }
    hasDrunk() {
        return this.drunk;
    }
    clearHeaded() {
        this.drunk = 0;
    }
    canUseCardTo(room, cardId, target, unlimited) {
        const player = room.getPlayerById(target);
        for (const skillOwner of room.getAlivePlayersFrom()) {
            for (const skill of skillOwner.getSkills('globalFilter')) {
                if (!skill.canUseCardTo(cardId, room, skillOwner, this, room.getPlayerById(target))) {
                    return false;
                }
            }
        }
        for (const skill of player.getSkills('filter')) {
            if (!skill.canBeUsedCard(cardId, room, target, this.Id)) {
                return false;
            }
        }
        for (const skill of this.getSkills('filter')) {
            if (!skill.canUseCard(cardId, room, this.Id)) {
                return false;
            }
        }
        const card = cardId instanceof card_matcher_1.CardMatcher ? undefined : engine_1.Sanguosha.getCardById(cardId);
        if (card) {
            if ((card.is(1 /* Equip */) && !player.canEquip(card)) ||
                (card.is(8 /* DelayedTrick */) &&
                    (player.judgeAreaDisabled() ||
                        player
                            .getCardIds(2 /* JudgeArea */)
                            .find(id => engine_1.Sanguosha.getCardById(id).GeneralName === card.GeneralName) !== undefined))) {
                return false;
            }
        }
        return (unlimited ||
            room.CommonRules.canUseCardTo(room, this, cardId instanceof card_matcher_1.CardMatcher ? cardId : engine_1.Sanguosha.getCardById(cardId), room.getPlayerById(target)));
    }
    getEquipment(cardType) {
        return this.playerCards[1 /* EquipArea */].find(cardId => engine_1.Sanguosha.getCardById(cardId).is(cardType));
    }
    getShield() {
        const cardId = this.playerCards[1 /* EquipArea */].find(cardId => engine_1.Sanguosha.getCardById(cardId).is(3 /* Shield */));
        if (cardId === undefined) {
            return;
        }
        return engine_1.Sanguosha.getCardById(cardId);
    }
    getWeapon() {
        const cardId = this.playerCards[1 /* EquipArea */].find(cardId => engine_1.Sanguosha.getCardById(cardId).is(2 /* Weapon */));
        if (cardId === undefined) {
            return;
        }
        return engine_1.Sanguosha.getCardById(cardId);
    }
    hasCard(room, cardMatcherOrId, areas, outsideName) {
        if (cardMatcherOrId instanceof card_matcher_1.CardMatcher) {
            const findCard = this.getCardIds(areas, outsideName).find(cardId => {
                const card = engine_1.Sanguosha.getCardById(cardId);
                return cardMatcherOrId.match(card);
            });
            if (findCard) {
                return true;
            }
            const skill = this.getSkills('viewAs').find(skill => {
                const viewAsCards = skill.canViewAs(room, this, undefined, cardMatcherOrId);
                return (skill.canUse(room, this) && card_matcher_1.CardMatcher.match(card_matcher_1.CardMatcher.addTag({ name: viewAsCards }), cardMatcherOrId));
            });
            return !!skill;
        }
        else {
            if (this.getCardId(cardMatcherOrId) !== undefined) {
                return true;
            }
            const card = engine_1.Sanguosha.getCardById(cardMatcherOrId);
            const skill = this.getSkills('viewAs').find(skill => skill.canViewAs(room, this).includes(card.GeneralName));
            return !!skill;
        }
    }
    hasUsed(cardName) {
        return this.cardUseHistory.find(cardId => engine_1.Sanguosha.getCardById(cardId).Name === cardName) !== undefined;
    }
    cardUsedTimes(cardSkillName) {
        const trendToUse = cardSkillName instanceof card_matcher_1.CardMatcher ? cardSkillName : engine_1.Sanguosha.getCardById(cardSkillName);
        return this.cardUseHistory.filter(cardId => {
            const card = engine_1.Sanguosha.getCardById(cardId);
            return trendToUse instanceof card_matcher_1.CardMatcher ? trendToUse.match(card) : card.GeneralName === trendToUse.GeneralName;
        }).length;
    }
    hasUsedSkill(skillName) {
        return !!this.skillUsedHistory[skillName] && this.skillUsedHistory[skillName] > 0;
    }
    hasUsedSkillTimes(skillName) {
        return this.skillUsedHistory[skillName] === undefined ? 0 : this.skillUsedHistory[skillName];
    }
    getSwitchSkillState(skillName, beforeUse = false) {
        const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
        precondition_1.Precondition.assert(skill.isSwitchSkill(), `${skillName} isn't switch skill`);
        if (skill.isShadowSkill()) {
            skillName = skill.GeneralName;
        }
        const judge = beforeUse ? this.switchSkillState.includes(skillName) : !this.switchSkillState.includes(skillName);
        return judge ? 1 /* Yin */ : 0 /* Yang */;
    }
    refreshOnceSkill(skillName) {
        const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
        precondition_1.Precondition.assert(skill.SkillType === 3 /* Limit */ || skill.SkillType === 2 /* Awaken */, `${skillName} isn't once skill`);
        if (this.skillUsedHistory[skillName] > 0) {
            this.skillUsedHistory[skillName] = 0;
            return true;
        }
        return false;
    }
    getAttackRange(room, except) {
        let attackDistance = 1;
        for (const cardId of this.getCardIds(1 /* EquipArea */)) {
            const card = card_1.Card.isVirtualCardId(cardId)
                ? engine_1.Sanguosha.getCardById(cardId).ViewAsCard
                : engine_1.Sanguosha.getCardById(cardId);
            if (card instanceof equip_card_1.WeaponCard && !(except === null || except === void 0 ? void 0 : except.includes(card.Id))) {
                attackDistance = card.AttackDistance;
            }
        }
        let additionalAttackRange = 0;
        for (const skill of this.getSkills('breaker')) {
            additionalAttackRange += skill.breakAdditionalAttackRange(room, this);
        }
        additionalAttackRange += room.CommonRules.getAdditionalAttackDistance(this);
        let finalAttackRange = -1;
        for (const skill of this.getSkills('breaker')) {
            const newFinalAttackRange = skill.breakFinalAttackRange(room, this);
            if (newFinalAttackRange > finalAttackRange) {
                finalAttackRange = newFinalAttackRange;
            }
        }
        return Math.max(finalAttackRange >= 0 ? finalAttackRange : attackDistance + additionalAttackRange, 0);
    }
    getMaxCardHold(room) {
        const maxCardHold = room.CommonRules.getBaseHoldCardNumber(room, this) + room.CommonRules.getAdditionalHoldCardNumber(room, this);
        return Math.max(maxCardHold, 0);
    }
    getOffenseDistance(room) {
        return room.CommonRules.getAdditionalOffenseDistance(room, this);
    }
    getDefenseDistance(room) {
        return room.CommonRules.getAdditionalDefenseDistance(room, this);
    }
    getCardUsableDistance(room, cardId, target) {
        const card = cardId ? engine_1.Sanguosha.getCardById(cardId) : undefined;
        return ((card ? card.EffectUseDistance : 0) + room.CommonRules.getCardAdditionalUsableDistance(room, this, card, target));
    }
    getCardAdditionalUsableNumberOfTargets(room, cardId) {
        const card = cardId instanceof card_matcher_1.CardMatcher ? cardId : engine_1.Sanguosha.getCardById(cardId);
        return room.CommonRules.getCardAdditionalNumberOfTargets(room, this, card);
    }
    getEquipSkills(skillType) {
        const equipCards = this.playerCards[1 /* EquipArea */].map(card => engine_1.Sanguosha.getCardById(card));
        const skills = equipCards.reduce((skills, card) => skills.concat([card.Skill, ...card.ShadowSkills]), []);
        if (skillType === undefined) {
            return skills;
        }
        switch (skillType) {
            case 'filter':
                return skills.filter(skill => skill instanceof skill_1.FilterSkill);
            case 'globalFilter':
                return skills.filter(skill => skill instanceof skill_1.GlobalFilterSkill);
            case 'active':
                return skills.filter(skill => skill instanceof skill_1.ActiveSkill);
            case 'viewAs':
                return skills.filter(skill => skill instanceof skill_1.ViewAsSkill);
            case 'trigger':
                return skills.filter(skill => skill instanceof skill_1.TriggerSkill);
            case 'breaker':
                return skills.filter(skill => skill instanceof skill_1.RulesBreakerSkill);
            case 'globalBreaker':
                return skills.filter(skill => skill instanceof skill_1.GlobalRulesBreakerSkill);
            case 'compulsory':
                return skills.filter(skill => skill.SkillType === 1 /* Compulsory */);
            case 'awaken':
                return skills.filter(skill => skill.SkillType === 2 /* Awaken */);
            case 'limit':
                return skills.filter(skill => skill.SkillType === 3 /* Limit */);
            case 'common':
                return skills.filter(skill => skill.SkillType === 0 /* Common */);
            case 'transform':
                return skills.filter(skill => skill instanceof skill_1.TransformSkill);
            case 'switch':
                return skills.filter(skill => skill.isSwitchSkill());
            case 'skillProhibited':
                return skills.filter(skill => skill instanceof skill_1.SkillProhibitedSkill);
            case 'quest':
                return skills.filter(skill => skill.SkillType === 4 /* Quest */);
            default:
                throw precondition_1.Precondition.UnreachableError(skillType);
        }
    }
    getPlayerSkills(skillType, includeDisabled) {
        precondition_1.Precondition.assert(this.playerCharacter !== undefined, `Player ${this.playerName} has not been initialized with a character yet`);
        const skills = [...this.playerSkills, ...this.hookedSkills].filter(skill => (includeDisabled || !skill_rule_1.UniqueSkillRule.isProhibited(skill, this)) && !skill.isSideEffectSkill());
        if (skillType === undefined) {
            return skills;
        }
        switch (skillType) {
            case 'filter':
                return skills.filter(skill => skill instanceof skill_1.FilterSkill);
            case 'globalFilter':
                return skills.filter(skill => skill instanceof skill_1.GlobalFilterSkill);
            case 'viewAs':
                return skills.filter(skill => skill instanceof skill_1.ViewAsSkill);
            case 'active':
                return skills.filter(skill => skill instanceof skill_1.ActiveSkill);
            case 'trigger':
                return skills.filter(skill => skill instanceof skill_1.TriggerSkill);
            case 'breaker':
                return skills.filter(skill => skill instanceof skill_1.RulesBreakerSkill);
            case 'globalBreaker':
                return skills.filter(skill => skill instanceof skill_1.GlobalRulesBreakerSkill);
            case 'transform':
                return skills.filter(skill => skill instanceof skill_1.TransformSkill);
            case 'compulsory':
                return skills.filter(skill => skill.SkillType === 1 /* Compulsory */);
            case 'awaken':
                return skills.filter(skill => skill.SkillType === 2 /* Awaken */);
            case 'limit':
                return skills.filter(skill => skill.SkillType === 3 /* Limit */);
            case 'common':
                return skills.filter(skill => skill.SkillType === 0 /* Common */);
            case 'switch':
                return skills.filter(skill => skill.isSwitchSkill());
            case 'skillProhibited':
                return skills.filter(skill => skill instanceof skill_1.SkillProhibitedSkill);
            case 'quest':
                return skills.filter(skill => skill.SkillType === 4 /* Quest */);
            default:
                throw precondition_1.Precondition.UnreachableError(skillType);
        }
    }
    getSkills(skillType) {
        return [...this.getEquipSkills(skillType), ...this.getPlayerSkills(skillType)];
    }
    loseSkill(skillName) {
        const lostSkill = [];
        const existSkill = [];
        for (const skill of this.playerSkills) {
            if (skill.isStubbornSkill()) {
                existSkill.push(skill);
                continue;
            }
            if (typeof skillName === 'string') {
                if (skill.Name.endsWith(skillName)) {
                    lostSkill.push(skill);
                    if (skill_1.SkillLifeCycle.isHookedAfterLosingSkill(skill)) {
                        this.hookedSkills.push(skill);
                    }
                }
                else {
                    existSkill.push(skill);
                }
            }
            else {
                if (skillName.find(name => skill.Name.endsWith(name))) {
                    lostSkill.push(skill);
                    if (skill_1.SkillLifeCycle.isHookedAfterLosingSkill(skill)) {
                        this.hookedSkills.push(skill);
                    }
                }
                else {
                    existSkill.push(skill);
                }
            }
        }
        this.playerSkills = existSkill;
        return lostSkill;
    }
    obtainSkill(skillName, insertIndex) {
        const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
        if (this.playerSkills.includes(skill)) {
            return;
        }
        this.hookedSkills = this.hookedSkills.filter(hookedSkill => hookedSkill !== skill);
        if (insertIndex !== undefined) {
            this.playerSkills.splice(insertIndex, 0, skill);
        }
        else {
            this.playerSkills.push(skill);
        }
        for (const shadowSkill of engine_1.Sanguosha.getShadowSkillsBySkillName(skillName)) {
            this.hookedSkills = this.hookedSkills.filter(hookedSkill => hookedSkill !== shadowSkill);
            this.playerSkills.push(shadowSkill);
        }
    }
    addSkill(skill) {
        this.playerSkills.push(skill);
    }
    removeSkill(skill) {
        this.playerSkills = this.playerSkills.filter(existSkill => existSkill !== skill);
    }
    hookUpSkills(skills) {
        this.hookedSkills.push(...skills.filter(skill => !this.hookedSkills.includes(skill)));
    }
    removeHookedSkills(skills) {
        this.hookedSkills = this.hookedSkills.filter(skill => !skills.includes(skill));
    }
    hasSkill(skillName) {
        return (this.playerSkills.find(skill => skill.Name === skillName) !== undefined ||
            this.hookedSkills.find(skill => skill.Name === skillName) !== undefined);
    }
    hasShadowSkill(skillName) {
        return this.playerSkills.find(skill => skill.Name.startsWith('#') && skill.Name.endsWith(skillName)) !== undefined;
    }
    getSkillProhibitedSkills(negative) {
        return this.playerSkills.filter(skill => negative ? !(skill instanceof skill_1.SkillProhibitedSkill) : skill instanceof skill_1.SkillProhibitedSkill);
    }
    turnOver() {
        this.turnedOver = !this.turnedOver;
    }
    isFaceUp() {
        return !this.turnedOver;
    }
    changeHp(amount) {
        this.hp += amount;
    }
    changeArmor(amount) {
        this.armor += amount;
    }
    get Hp() {
        return this.hp;
    }
    set Hp(hp) {
        this.hp = hp;
    }
    get Armor() {
        return this.armor;
    }
    set Armor(armor) {
        this.armor = Math.min(armor, game_props_1.UPPER_LIMIT_OF_ARMOR);
    }
    get Gender() {
        return this.gender;
    }
    set Gender(gender) {
        this.gender = gender;
    }
    get ChainLocked() {
        return this.chainLocked;
    }
    set ChainLocked(locked) {
        this.chainLocked = locked;
    }
    get Nationality() {
        return precondition_1.Precondition.exists(this.nationality, 'Uninitialized nationality');
    }
    set Nationality(nationality) {
        this.nationality = nationality;
    }
    get MaxHp() {
        return this.maxHp;
    }
    set MaxHp(maxHp) {
        this.maxHp = maxHp;
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        }
    }
    get LostHp() {
        return this.maxHp - Math.max(this.hp, 0);
    }
    get Role() {
        return this.playerRole;
    }
    set Role(role) {
        this.playerRole = role;
    }
    set CharacterId(characterId) {
        if (characterId === undefined) {
            return;
        }
        const hasCharacterId = this.playerCharacterId;
        this.playerCharacterId = characterId;
        this.playerCharacter = engine_1.Sanguosha.getCharacterById(this.playerCharacterId);
        hasCharacterId ||
            (this.playerSkills = this.playerCharacter.Skills.filter(skill => skill.isLordSkill() ? this.playerRole === 1 /* Lord */ : true));
        this.Armor = this.playerCharacter.Armor;
        this.hp = this.playerCharacter.Hp;
        this.maxHp = this.playerCharacter.MaxHp;
        this.nationality = this.playerCharacter.Nationality;
        this.gender = this.playerCharacter.Gender;
    }
    get CharacterId() {
        return this.playerCharacterId;
    }
    get Character() {
        return precondition_1.Precondition.alarm(this.playerCharacter, 'Uninitialized player character');
    }
    get Id() {
        return this.playerId;
    }
    get Name() {
        return this.playerName;
    }
    get Position() {
        return this.playerPosition;
    }
    set Position(position) {
        this.playerPosition = position;
    }
    get HookedSkills() {
        return this.hookedSkills;
    }
    get CardUseHistory() {
        return this.cardUseHistory;
    }
    get SkillUsedHistory() {
        return this.skillUsedHistory;
    }
    get Dead() {
        return this.dead;
    }
    set Dying(dying) {
        this.dying = dying;
    }
    get Dying() {
        return this.dying;
    }
    bury() {
        this.turnedOver = false;
        this.chainLocked = false;
        this.huashenInfo = undefined;
        this.clearHeaded();
        this.dead = true;
    }
    revive() {
        precondition_1.Precondition.assert(this.Hp > 0, 'Revive can only use for player who dead and Hp > 0');
        this.dead = false;
    }
    getPlayerInfo() {
        const flags = {};
        for (const [key, value] of Object.entries(this.flags)) {
            flags[key] = {
                value,
                visiblePlayers: this.visiblePlayers[key],
            };
        }
        return {
            Id: this.playerId,
            Name: this.playerName,
            Position: this.playerPosition,
            Nationality: this.playerCharacterId != null ? this.Nationality : undefined,
            CharacterId: this.playerCharacterId,
            Role: this.playerRole,
            Hp: this.hp,
            MaxHp: this.maxHp,
            Status: this.status,
            Flags: flags,
            Marks: this.marks,
            Armor: this.armor,
        };
    }
    getPlayerShortcutInfo() {
        const flags = {};
        for (const [key, value] of Object.entries(this.flags)) {
            flags[key] = {
                value,
                visiblePlayers: this.visiblePlayers[key],
            };
        }
        return {
            Id: this.playerId,
            Name: this.playerName,
            Position: this.playerPosition,
            Nationality: this.playerCharacterId != null ? this.Nationality : undefined,
            CharacterId: this.playerCharacterId,
            Role: this.playerRole,
            Hp: this.hp,
            MaxHp: this.maxHp,
            Status: this.status,
            Flags: flags,
            Marks: this.marks,
            Armor: this.armor,
            chainLocked: this.chainLocked,
            drunk: this.drunk,
            turnedOver: this.turnedOver,
            equipSectionsStatus: this.equipSectionsStatus,
            judgeAreaStatus: this.judgeAreaStatus,
            playerOutsideCharactersAreaNames: this.playerOutsideCharactersAreaNames,
            playerCards: this.playerCards,
            playerOutsideCards: this.playerOutsideCards,
            dead: this.dead,
        };
    }
    get DisabledEquipSections() {
        return Object.keys(this.equipSectionsStatus).filter(section => this.equipSectionsStatus[section] === 'disabled');
    }
    get AvailableEquipSections() {
        return Object.keys(this.equipSectionsStatus).filter(section => this.equipSectionsStatus[section] === 'enabled');
    }
    abortEquipSections(...abortSections) {
        for (const section of abortSections) {
            this.equipSectionsStatus[section] = 'disabled';
        }
    }
    resumeEquipSections(...abortSections) {
        for (const section of abortSections) {
            this.equipSectionsStatus[section] = 'enabled';
        }
    }
    judgeAreaDisabled() {
        return this.judgeAreaStatus === 'disabled';
    }
    abortJudgeArea() {
        this.judgeAreaStatus = 'disabled';
    }
    resumeJudgeArea() {
        this.judgeAreaStatus = 'enabled';
    }
    setHuaShenInfo(info) {
        this.huashenInfo = info;
    }
    getHuaShenInfo() {
        return this.huashenInfo;
    }
    setOffline(quit) {
        this.status = quit ? "quit" /* Quit */ : "offline" /* Offline */;
    }
    setOnline() {
        this.status = "online" /* Online */;
    }
    isOnline() {
        return this.status === "online" /* Online */ || this.status === "trusted" /* Trusted */;
    }
    get AI() {
        return this.ai;
    }
    isSmartAI() {
        return this.status === "smart-ai" /* SmartAI */;
    }
    delegateOnSmartAI() {
        this.status = "smart-ai" /* SmartAI */;
    }
    delegateOnTrusted(trusted) {
        this.status = trusted ? "trusted" /* Trusted */ : "online" /* Online */;
    }
    isTrusted() {
        return this.status === "trusted" /* Trusted */;
    }
    get Status() {
        return this.status;
    }
    getReady() {
        this.ready = true;
    }
    isReady() {
        return this.ready;
    }
}
exports.Player = Player;
