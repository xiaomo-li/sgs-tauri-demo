"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhanHuo = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let ZhanHuo = class ZhanHuo extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.getMark("junlve" /* JunLve */) > 0;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    numberOfTargets() {
        return [];
    }
    targetFilter(room, owner, targets) {
        return targets.length <= owner.getMark("junlve" /* JunLve */) && targets.length > 0;
    }
    isAvailableTarget(owner, room, target) {
        return room.getPlayerById(target).ChainLocked === true;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds } = skillUseEvent;
        const from = room.getPlayerById(fromId);
        room.addMark(fromId, "junlve" /* JunLve */, -from.getMark("junlve" /* JunLve */));
        for (const targetId of toIds) {
            const target = room.getPlayerById(targetId);
            const equips = target.getCardIds(1 /* EquipArea */).filter(id => room.canDropCard(targetId, id));
            if (equips.length > 0) {
                await room.dropCards(4 /* SelfDrop */, equips, targetId, targetId, this.Name);
            }
        }
        const askForPlayerChoose = {
            toId: fromId,
            players: toIds,
            requiredAmount: 1,
            conversation: 'zhanhuo: please choose a target to whom you cause 1 fire damage',
            triggeredBySkills: [this.Name],
        };
        room.notify(167 /* AskForChoosingPlayerEvent */, askForPlayerChoose, fromId);
        const response = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, fromId);
        const starter = response.selectedPlayers === undefined ? toIds[0] : response.selectedPlayers[0];
        await room.damage({
            fromId,
            toId: starter,
            damage: 1,
            damageType: "fire_property" /* Fire */,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
ZhanHuo = tslib_1.__decorate([
    skill_1.LimitSkill({ name: 'zhanhuo', description: 'zhanhuo_description' })
], ZhanHuo);
exports.ZhanHuo = ZhanHuo;
