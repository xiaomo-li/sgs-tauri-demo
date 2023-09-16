"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveClassicTianLiang = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let PveClassicTianLiang = class PveClassicTianLiang extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.fromId && owner.hasUsedSkillTimes(this.Name) < owner.MaxHp;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const drawCardEvent = triggeredOnEvent;
        drawCardEvent.drawAmount += 1;
        return true;
    }
};
PveClassicTianLiang = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'pve_classic_tianliang', description: 'pve_classic_tianliang_description' })
], PveClassicTianLiang);
exports.PveClassicTianLiang = PveClassicTianLiang;
