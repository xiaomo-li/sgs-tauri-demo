"use strict";
var QiangXi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiangXi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let QiangXi = QiangXi_1 = class QiangXi extends skill_1.ActiveSkill {
    async whenRefresh(room, owner) {
        room.removeFlag(owner.Id, QiangXi_1.exUse);
        for (const player of room.AlivePlayers) {
            room.removeFlag(player.Id, this.GeneralName);
        }
    }
    canUse(room, owner) {
        return owner.hasUsedSkillTimes(this.Name) < 2;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length <= 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getFlag(target, this.Name) !== true;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).is(2 /* Weapon */) && room.canDropCard(owner, cardId);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds, cardIds } = skillUseEvent;
        room.setFlag(fromId, QiangXi_1.exUse, true);
        room.setFlag(toIds[0], this.Name, true);
        if (cardIds && cardIds.length > 0) {
            await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        }
        else {
            await room.loseHp(fromId, 1);
        }
        await room.damage({
            fromId,
            toId: toIds[0],
            damage: 1,
            damageType: "normal_property" /* Normal */,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
QiangXi.exUse = 'QiangXi_ExUse';
QiangXi = QiangXi_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qiangxi', description: 'qiangxi_description' })
], QiangXi);
exports.QiangXi = QiangXi;
