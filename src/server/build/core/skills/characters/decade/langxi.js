"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangXi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LangXi = class LangXi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 3 /* PrepareStageStart */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            room.getOtherPlayers(owner.Id).find(player => player.Hp <= owner.Hp) !== undefined);
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getPlayerById(target).Hp <= room.getPlayerById(owner).Hp;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target with hp less than your hp to deal 0-2 damage to him randomly?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const randomDamage = Math.floor(Math.random() * 3);
        randomDamage > 0 &&
            (await room.damage({
                fromId: event.fromId,
                toId: event.toIds[0],
                damage: randomDamage,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            }));
        return true;
    }
};
LangXi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'langxi', description: 'langxi_description' })
], LangXi);
exports.LangXi = LangXi;
