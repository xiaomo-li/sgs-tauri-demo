"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LianZhou = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let LianZhou = class LianZhou extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return event.playerId === owner.Id && event.toStage === 3 /* PrepareStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.getPlayerById(event.fromId).ChainLocked || (await room.chainedOn(event.fromId));
        const targets = room.AlivePlayers.filter(player => player.Hp === room.getPlayerById(event.fromId).Hp && !player.ChainLocked).map(player => player.Id);
        if (targets.length > 0) {
            const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: targets,
                toId: event.fromId,
                requiredAmount: [1, targets.length],
                conversation: 'lianzhou: do you want to choose targets to chain on?',
                triggeredBySkills: [this.Name],
            }, event.fromId);
            if (response.selectedPlayers && response.selectedPlayers.length > 0) {
                for (const player of response.selectedPlayers) {
                    room.getPlayerById(player).ChainLocked || (await room.chainedOn(player));
                }
            }
        }
        return true;
    }
};
LianZhou = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'lianzhou', description: 'lianzhou_description' })
], LianZhou);
exports.LianZhou = LianZhou;
