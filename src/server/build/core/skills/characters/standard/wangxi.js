"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WangXi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let WangXi = class WangXi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */ || stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content, stage) {
        if (content.fromId === undefined || content.fromId === content.toId) {
            return false;
        }
        return ((stage === "AfterDamageEffect" /* AfterDamageEffect */ &&
            content.fromId === owner.Id &&
            !room.getPlayerById(content.toId).Dead) ||
            (stage === "AfterDamagedEffect" /* AfterDamagedEffect */ &&
                content.toId === owner.Id &&
                !room.getPlayerById(content.fromId).Dead));
    }
    triggerableTimes(event) {
        return event.damage;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const { fromId, toId } = triggeredOnEvent;
        const players = [fromId, toId];
        room.sortPlayersByPosition(players);
        for (const playerId of players) {
            await room.drawCards(1, playerId, 'top', skillUseEvent.fromId, this.Name);
        }
        return true;
    }
};
WangXi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'wangxi', description: 'wangxi_description' })
], WangXi);
exports.WangXi = WangXi;
