"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiDiShadow = exports.ShiDi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ShiDi = class ShiDi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                ((phaseStageChangeEvent.toStage === 3 /* PrepareStageStart */ &&
                    owner.getSwitchSkillState(this.Name, true) === 1 /* Yin */) ||
                    (phaseStageChangeEvent.toStage === 19 /* FinishStageStart */ &&
                        owner.getSwitchSkillState(this.Name, true) === 0 /* Yang */)));
        }
        else if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            const card = engine_1.Sanguosha.getCardById(cardUseEvent.cardId);
            if (card.GeneralName !== 'slash') {
                return false;
            }
            if (owner.getSwitchSkillState(this.Name, true) === 0 /* Yang */ &&
                card.isBlack() &&
                cardUseEvent.fromId === owner.Id) {
                cardUseEvent.disresponsiveList = cardUseEvent.disresponsiveList
                    ? cardUseEvent.disresponsiveList.concat(...target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup))
                    : target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup);
            }
            else if (owner.getSwitchSkillState(this.Name, true) === 1 /* Yin */ &&
                card.isRed() &&
                cardUseEvent.fromId !== owner.Id &&
                target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).includes(owner.Id)) {
                cardUseEvent.disresponsiveList = cardUseEvent.disresponsiveList
                    ? [...cardUseEvent.disresponsiveList, owner.Id]
                    : [owner.Id];
            }
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        return true;
    }
};
ShiDi = tslib_1.__decorate([
    skill_wrappers_1.SwitchSkill(),
    skill_wrappers_1.CompulsorySkill({ name: 'shidi', description: 'shidi_description' })
], ShiDi);
exports.ShiDi = ShiDi;
let ShiDiShadow = class ShiDiShadow extends skill_1.RulesBreakerSkill {
    breakOffenseDistance(room, owner) {
        return owner.getSwitchSkillState(this.GeneralName, true) === 0 /* Yang */ ? 1 : 0;
    }
    breakDefenseDistance(room, owner) {
        return owner.getSwitchSkillState(this.GeneralName, true) === 1 /* Yin */ ? 1 : 0;
    }
};
ShiDiShadow = tslib_1.__decorate([
    skill_wrappers_1.SwitchSkill(),
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: ShiDi.Name, description: ShiDi.Description })
], ShiDiShadow);
exports.ShiDiShadow = ShiDiShadow;
