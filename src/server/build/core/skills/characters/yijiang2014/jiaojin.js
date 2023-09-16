"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiaoJin = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiaoJin = class JiaoJin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.byCardId);
        return (content.fromId !== owner.Id &&
            content.toId === owner.Id &&
            room.getPlayerById(content.fromId).Gender === 0 /* Male */ &&
            (card.GeneralName === 'slash' || card.isCommonTrick()) &&
            owner
                .getPlayerCards()
                .find(id => engine_1.Sanguosha.getCardById(id).is(1 /* Equip */) && room.canDropCard(owner.Id, id)) !== undefined);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).is(1 /* Equip */) && room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner, content) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}：do you want to discard a equip card to let {1} nullify to you and you gain it?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(content.byCardId)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        const aimEvent = event.triggeredOnEvent;
        aimEvent.nullifiedTargets.push(fromId);
        if (room.isCardOnProcessing(aimEvent.byCardId)) {
            await room.moveCards({
                movingCards: [{ card: aimEvent.byCardId, fromArea: 6 /* ProcessingArea */ }],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
JiaoJin = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jiaojin', description: 'jiaojin_description' })
], JiaoJin);
exports.JiaoJin = JiaoJin;
