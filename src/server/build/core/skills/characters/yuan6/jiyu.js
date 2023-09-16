"use strict";
var JiYu_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiYuBlocker = exports.JiYu = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiYu = JiYu_1 = class JiYu extends skill_1.ActiveSkill {
    whenRefresh(room, owner) {
        for (const flagName of [this.Name, JiYu_1.BannedSuits]) {
            owner.getFlag(flagName) && room.removeFlag(owner.Id, flagName);
        }
    }
    canUse(room, owner) {
        return !!owner.getCardIds(0 /* HandArea */).find(cardId => owner.canUseCard(room, cardId));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return (room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0 &&
            !(room.getPlayerById(owner).getFlag(this.Name) || []).includes(target));
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const response = await room.askForCardDrop(event.toIds[0], 1, [0 /* HandArea */], true, undefined, this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please discard a hand card, {1} will gain debuff according to this card', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract());
        if (response.droppedCards) {
            const bannedSuits = room.getFlag(event.fromId, JiYu_1.BannedSuits) || [];
            const suitDiscarded = engine_1.Sanguosha.getCardById(response.droppedCards[0]).Suit;
            if (!bannedSuits.includes(suitDiscarded)) {
                bannedSuits.push(suitDiscarded);
                room.setFlag(event.fromId, JiYu_1.BannedSuits, bannedSuits);
            }
            await room.dropCards(4 /* SelfDrop */, response.droppedCards, event.toIds[0], event.toIds[0], this.Name);
            const originalTargets = room.getFlag(event.fromId, this.Name) || [];
            originalTargets.push(event.toIds[0]);
            room.setFlag(event.fromId, this.Name, originalTargets);
            if (suitDiscarded === 1 /* Spade */) {
                await room.turnOver(event.fromId);
                await room.loseHp(event.toIds[0], 1);
            }
        }
        return true;
    }
};
JiYu.BannedSuits = 'jiyu_banned_suits';
JiYu = JiYu_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jiyu', description: 'jiyu_description' })
], JiYu);
exports.JiYu = JiYu;
let JiYuBlocker = class JiYuBlocker extends skill_1.FilterSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUseCard(cardId, room, owner, onResponse, isCardResponse) {
        return (cardId instanceof card_matcher_1.CardMatcher ||
            isCardResponse ||
            !((room.getFlag(owner, JiYu.BannedSuits) || []).includes(engine_1.Sanguosha.getCardById(cardId).Suit) &&
                room.getPlayerById(owner).cardFrom(cardId) === 0 /* HandArea */));
    }
};
JiYuBlocker = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: JiYu.Name, description: JiYu.Description })
], JiYuBlocker);
exports.JiYuBlocker = JiYuBlocker;
