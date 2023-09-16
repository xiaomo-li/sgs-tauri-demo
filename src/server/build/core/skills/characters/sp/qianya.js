"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QianYa = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QianYa = class QianYa extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "OnAimmed" /* OnAimmed */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            engine_1.Sanguosha.getCardById(content.byCardId).is(7 /* Trick */) &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableCard() {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to give at lease one hand card to another player?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: event.cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId: event.fromId,
            toId: event.toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: event.fromId,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
QianYa = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'qianya', description: 'qianya_description' })
], QianYa);
exports.QianYa = QianYa;
