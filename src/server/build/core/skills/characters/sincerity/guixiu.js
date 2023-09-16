"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuiXiu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let GuiXiu = class GuiXiu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return (event.playerId === owner.Id &&
            event.toStage === 19 /* FinishStageStart */ &&
            !(owner.Hp % 2 === 0 && owner.LostHp === 0));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (room.getPlayerById(event.fromId).Hp % 2 === 1) {
            await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        }
        else {
            await room.recover({
                toId: event.fromId,
                recoveredHp: 1,
                recoverBy: event.fromId,
            });
        }
        return true;
    }
};
GuiXiu = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'guixiu', description: 'guixiu_description' })
], GuiXiu);
exports.GuiXiu = GuiXiu;
