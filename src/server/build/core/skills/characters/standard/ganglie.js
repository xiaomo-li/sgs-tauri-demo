"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GangLie = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let GangLie = class GangLie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId;
    }
    triggerableTimes(event) {
        return event.damage;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const judge = await room.judge(skillUseEvent.fromId, undefined, this.Name);
        const { triggeredOnEvent } = skillUseEvent;
        const { fromId } = triggeredOnEvent;
        const damageFrom = fromId && room.getPlayerById(fromId);
        if (!damageFrom || damageFrom.Dead) {
            return false;
        }
        if (engine_1.Sanguosha.getCardById(judge.judgeCardId).isBlack()) {
            if (damageFrom.getPlayerCards().length === 0) {
                return false;
            }
            const options = {
                [1 /* EquipArea */]: damageFrom.getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: damageFrom.getCardIds(0 /* HandArea */).length,
            };
            const chooseCardEvent = {
                fromId: skillUseEvent.fromId,
                toId: damageFrom.Id,
                options,
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForChoosingPlayerCard(chooseCardEvent, chooseCardEvent.fromId, true, true);
            if (!response) {
                return false;
            }
            await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], chooseCardEvent.toId, skillUseEvent.fromId, this.Name);
        }
        else if (engine_1.Sanguosha.getCardById(judge.judgeCardId).isRed()) {
            await room.damage({
                fromId: skillUseEvent.fromId,
                damage: 1,
                damageType: "normal_property" /* Normal */,
                toId: damageFrom.Id,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
GangLie = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'ganglie', description: 'ganglie_description' })
], GangLie);
exports.GangLie = GangLie;
