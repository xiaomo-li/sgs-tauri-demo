"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShenFen = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ShenFen = class ShenFen extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return room.getMark(owner.Id, "nu" /* Wrath */) >= 6 && !owner.hasUsedSkill(this.GeneralName);
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    isAvailableTarget() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onAngry(room, fromId, effect) {
        const targets = room.getOtherPlayers(fromId);
        for (const target of targets) {
            if (target.Dead) {
                continue;
            }
            await effect(fromId, target);
        }
    }
    async onEffect(room, skillEffectEvent) {
        room.addMark(skillEffectEvent.fromId, "nu" /* Wrath */, -6);
        await this.onAngry(room, skillEffectEvent.fromId, async (fromId, to) => {
            await room.damage({
                fromId,
                toId: to.Id,
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.GeneralName],
            });
        });
        await this.onAngry(room, skillEffectEvent.fromId, async (fromId, to) => {
            const equipCardIds = to.getCardIds(1 /* EquipArea */);
            await room.dropCards(4 /* SelfDrop */, equipCardIds, to.Id, to.Id, this.GeneralName);
        });
        await this.onAngry(room, skillEffectEvent.fromId, async (fromId, to) => {
            const handCardIds = to.getCardIds(0 /* HandArea */);
            if (handCardIds.length <= 4) {
                await room.dropCards(4 /* SelfDrop */, handCardIds, to.Id, to.Id, this.GeneralName);
            }
            else {
                const response = await room.askForCardDrop(to.Id, 4, [0 /* HandArea */], true, undefined, this.Name);
                response.droppedCards.length > 0 &&
                    (await room.dropCards(4 /* SelfDrop */, response.droppedCards, to.Id, to.Id, this.GeneralName));
            }
        });
        await room.turnOver(skillEffectEvent.fromId);
        return true;
    }
};
ShenFen = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'shenfen', description: 'shenfen_description' })
], ShenFen);
exports.ShenFen = ShenFen;
