"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiLinGongSkillTrigger = void 0;
const engine_1 = require("core/game/engine");
const trigger_skill_trigger_1 = require("../base/trigger_skill_trigger");
class QiLinGongSkillTrigger extends trigger_skill_trigger_1.TriggerSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill) => ({
            fromId: ai.Id,
            invoke: skill.Name,
        });
    }
    onAskForChoosingCardEvent(content, room) {
        const { cardIds, toId } = content;
        const cardId = cardIds.find(card => engine_1.Sanguosha.getCardById(card).is(5 /* DefenseRide */)) ||
            cardIds[0];
        return {
            fromId: toId,
            selectedCards: [cardId],
        };
    }
}
exports.QiLinGongSkillTrigger = QiLinGongSkillTrigger;
