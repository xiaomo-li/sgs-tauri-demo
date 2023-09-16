"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JueCe = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let JueCe = class JueCe extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        let canUse = owner.Id === content.playerId && 19 /* FinishStageStart */ === content.toStage;
        if (canUse) {
            canUse = false;
            for (const player of room.getOtherPlayers(owner.Id)) {
                if (player.getFlag(this.Name)) {
                    room.removeFlag(player.Id, this.Name);
                }
                if (room.Analytics.getCardLostRecord(player.Id, 'round', undefined, 1).length > 0) {
                    room.setFlag(player.Id, this.Name, true);
                    canUse = true;
                }
            }
        }
        return canUse;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getFlag(this.Name);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds } = skillUseEvent;
        await room.damage({
            fromId,
            toId: toIds[0],
            damage: 1,
            damageType: "normal_property" /* Normal */,
            triggeredBySkills: [this.Name],
        });
        for (const player of room.getOtherPlayers(skillUseEvent.fromId)) {
            player.removeFlag(this.GeneralName);
        }
        return true;
    }
};
JueCe = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'juece', description: 'juece_description' })
], JueCe);
exports.JueCe = JueCe;
