"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiShen = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let TiShen = class TiShen extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId && 3 /* PrepareStageStart */ === content.toStage && owner.Hp < owner.MaxHp);
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        const from = room.getPlayerById(fromId);
        const recover = from.MaxHp - from.Hp;
        await room.recover({
            recoveredHp: recover,
            recoverBy: fromId,
            toId: fromId,
        });
        await room.drawCards(recover, fromId, 'top', fromId, this.Name);
        return true;
    }
};
TiShen = tslib_1.__decorate([
    skill_1.LimitSkill({ name: 'tishen', description: 'tishen_description' })
], TiShen);
exports.TiShen = TiShen;
