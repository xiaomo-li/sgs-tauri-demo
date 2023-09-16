"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeiShui = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const lvli_1 = require("./lvli");
let BeiShui = class BeiShui extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['qingjiao'];
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 3 /* PrepareStageStart */ &&
            room.enableToAwaken(this.Name, owner));
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} activated awakening skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        await room.changeMaxHp(event.fromId, -1);
        await room.obtainSkill(event.fromId, this.RelatedSkills[0], true);
        const from = room.getPlayerById(event.fromId);
        from.hasSkill(lvli_1.LvLi.Name) && (await room.updateSkill(event.fromId, lvli_1.LvLi.Name, lvli_1.LvLiII.Name));
        from.hasSkill(lvli_1.LvLiI.Name) && (await room.updateSkill(event.fromId, lvli_1.LvLiI.Name, lvli_1.LvLiEX.Name));
        return true;
    }
};
BeiShui = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'beishui', description: 'beishui_description' })
], BeiShui);
exports.BeiShui = BeiShui;
