"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveClassicTianTong = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let PveClassicTianTong = class PveClassicTianTong extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 3 /* PrepareStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.changeMaxHp(event.fromId, 3);
        await room.recover({
            toId: event.fromId,
            recoveredHp: 3,
            recoverBy: event.fromId,
        });
        return true;
    }
};
PveClassicTianTong = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'pve_classic_tiantong', description: 'pve_classic_tiantong_description' })
], PveClassicTianTong);
exports.PveClassicTianTong = PveClassicTianTong;
