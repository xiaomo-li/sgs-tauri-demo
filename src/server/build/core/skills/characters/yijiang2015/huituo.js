"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuiTuo = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HuiTuo = class HuiTuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget() {
        return true;
    }
    getSkillLog(room, owner, content) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to judge? if the result is red, he recover, otherwise he draw {1} cards', this.Name, content.damage).extract();
    }
    getAnimationSteps(event) {
        return event.toIds ? [{ from: event.fromId, tos: event.toIds }] : [];
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        if (!toIds) {
            return false;
        }
        const judgeEvent = await room.judge(toIds[0], undefined, this.Name);
        if (engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId).isRed()) {
            await room.recover({
                toId: toIds[0],
                recoveredHp: 1,
                recoverBy: toIds[0],
            });
        }
        else if (engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId).isBlack()) {
            await room.drawCards(event.triggeredOnEvent.damage, toIds[0], 'top', toIds[0], this.Name);
        }
        return true;
    }
};
HuiTuo = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'huituo', description: 'huituo_description' })
], HuiTuo);
exports.HuiTuo = HuiTuo;
