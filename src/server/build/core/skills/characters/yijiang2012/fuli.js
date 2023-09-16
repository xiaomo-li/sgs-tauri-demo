"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuLi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let FuLi = class FuLi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "RequestRescue" /* RequestRescue */;
    }
    canUse(room, owner, content) {
        return content.rescuer === owner.Id && content.dying === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const from = room.getPlayerById(skillUseEvent.fromId);
        const nations = room.AlivePlayers.reduce((allNations, player) => {
            if (!allNations.includes(player.Nationality)) {
                allNations.push(player.Nationality);
            }
            return allNations;
        }, []);
        const recoverAmount = nations.length - from.Hp;
        if (recoverAmount > 0) {
            await room.recover({
                recoveredHp: recoverAmount,
                recoverBy: from.Id,
                triggeredBySkills: [this.Name],
                toId: from.Id,
            });
        }
        const strongest = room.getOtherPlayers(from.Id).find(player => player.Hp >= from.Hp);
        if (strongest === undefined) {
            await room.turnOver(from.Id);
        }
        return true;
    }
};
FuLi = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'fuli', description: 'fuli_description' })
], FuLi);
exports.FuLi = FuLi;
