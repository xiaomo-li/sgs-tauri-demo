"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiYue = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let BiYue = class BiYue extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && 19 /* FinishStageStart */ === content.toStage;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.drawCards(room.getPlayerById(skillUseEvent.fromId).getCardIds(0 /* HandArea */).length === 0 ? 2 : 1, skillUseEvent.fromId, undefined, skillUseEvent.fromId, this.Name);
        return true;
    }
};
BiYue = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'biyue', description: 'biyue_description' })
], BiYue);
exports.BiYue = BiYue;
