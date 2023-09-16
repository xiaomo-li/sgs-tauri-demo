"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChengLveBuff = exports.ChengLveShadow = exports.ChengLve = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ChengLve = class ChengLve extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard(owner, room, cardId, selectedCards) {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const skillState = from.getSwitchSkillState(this.Name) === 0 /* Yang */;
        await room.drawCards(skillState ? 1 : 2, fromId, 'top', fromId, this.Name);
        const dropNum = skillState ? 2 : 1;
        const response = await room.askForCardDrop(fromId, dropNum, [0 /* HandArea */], true, undefined, this.Name);
        if (response.droppedCards.length === 0) {
            return false;
        }
        const toDrop = response.droppedCards;
        const suits = toDrop.reduce((allSuit, cardId) => {
            const suit = engine_1.Sanguosha.getCardById(cardId).Suit;
            allSuit.includes(suit) || allSuit.push(suit);
            return allSuit;
        }, []);
        await room.dropCards(4 /* SelfDrop */, toDrop, fromId, fromId, this.Name);
        room.setFlag(fromId, this.Name, suits, translation_json_tool_1.TranslationPack.translationJsonPatcher('chenglve suits: {0}', suits.reduce((suitString, suit) => suitString + functional_1.Functional.getCardSuitCharText(suit), '')).toString());
        return true;
    }
};
ChengLve = tslib_1.__decorate([
    skill_wrappers_1.SwitchSkill(),
    skill_wrappers_1.CommonSkill({ name: 'chenglve', description: 'chenglve_description' })
], ChengLve);
exports.ChengLve = ChengLve;
let ChengLveShadow = class ChengLveShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.fromPlayer &&
            event.from === 4 /* PlayCardStage */ &&
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
ChengLveShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ChengLve.Name, description: ChengLve.Description })
], ChengLveShadow);
exports.ChengLveShadow = ChengLveShadow;
let ChengLveBuff = class ChengLveBuff extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableDistance(cardId, room, owner) {
        const suits = owner.getFlag(this.GeneralName);
        if (!suits || suits.length === 0) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ suit: suits }));
        }
        else {
            match = suits.includes(engine_1.Sanguosha.getCardById(cardId).Suit);
        }
        if (match) {
            return game_props_1.INFINITE_DISTANCE;
        }
        else {
            return 0;
        }
    }
    breakCardUsableTimes(cardId, room, owner) {
        const suits = owner.getFlag(this.GeneralName);
        if (!suits || suits.length === 0) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ suit: suits }));
        }
        else {
            match = suits.includes(engine_1.Sanguosha.getCardById(cardId).Suit);
        }
        if (match) {
            return game_props_1.INFINITE_TRIGGERING_TIMES;
        }
        else {
            return 0;
        }
    }
};
ChengLveBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ChengLveShadow.Name, description: ChengLveShadow.Description })
], ChengLveBuff);
exports.ChengLveBuff = ChengLveBuff;
