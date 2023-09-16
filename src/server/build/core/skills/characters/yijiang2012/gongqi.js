"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GongQiClear = exports.GongQiBuff = exports.GongQi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GongQi = class GongQi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        const suit = engine_1.Sanguosha.getCardById(cardIds[0]).Suit;
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        const suits = room.getFlag(fromId, this.Name) || [];
        suits.push(suit);
        room.setFlag(fromId, this.Name, suits, translation_json_tool_1.TranslationPack.translationJsonPatcher('gongqi suits: {0}', suits.reduce((suitString, suit) => suitString + functional_1.Functional.getCardSuitCharText(suit), '')).toString());
        if (engine_1.Sanguosha.getCardById(cardIds[0]).is(1 /* Equip */)) {
            const targets = room
                .getOtherPlayers(fromId)
                .filter(player => player.getPlayerCards().length > 0)
                .map(player => player.Id);
            if (targets.length > 0) {
                const { selectedPlayers } = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                    players: targets,
                    toId: fromId,
                    requiredAmount: 1,
                    conversation: 'gongqi: do you want to drop one card of another player?',
                    triggeredBySkills: [this.Name],
                }, fromId);
                if (selectedPlayers && selectedPlayers.length === 1) {
                    const toId = selectedPlayers[0];
                    const to = room.getPlayerById(toId);
                    const options = {
                        [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                        [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
                    };
                    const response = await room.doAskForCommonly(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                        fromId,
                        toId,
                        options,
                        triggeredBySkills: [this.Name],
                    }), fromId);
                    if (response.selectedCardIndex !== undefined) {
                        const cardIds = to.getCardIds(0 /* HandArea */);
                        response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
                    }
                    else if (response.selectedCard === undefined) {
                        const cardIds = to.getPlayerCards();
                        response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
                    }
                    await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], toId, fromId, this.Name);
                }
            }
        }
        return true;
    }
};
GongQi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'gongqi', description: 'gongqi_description' })
], GongQi);
exports.GongQi = GongQi;
let GongQiBuff = class GongQiBuff extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakFinalAttackRange(room, owner) {
        return owner.getFlag(this.GeneralName) ? game_props_1.INFINITE_ATTACK_RANGE : -1;
    }
    breakCardUsableTimes(cardId, room, owner) {
        const suits = owner.getFlag(this.GeneralName);
        if (!suits || suits.length === 0) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'], suit: suits }));
        }
        else {
            match =
                suits.includes(engine_1.Sanguosha.getCardById(cardId).Suit) && engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        if (match) {
            return game_props_1.INFINITE_TRIGGERING_TIMES;
        }
        else {
            return 0;
        }
    }
};
GongQiBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_1.CommonSkill({ name: GongQi.Name, description: GongQi.Description })
], GongQiBuff);
exports.GongQiBuff = GongQiBuff;
let GongQiClear = class GongQiClear extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
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
            event.from === 7 /* PhaseFinish */ &&
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
GongQiClear = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_1.CommonSkill({ name: GongQiBuff.Name, description: GongQiBuff.Description })
], GongQiClear);
exports.GongQiClear = GongQiClear;
