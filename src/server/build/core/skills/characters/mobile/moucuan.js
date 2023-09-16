"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouCuan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const binghuo_1 = require("./binghuo");
let MouCuan = class MouCuan extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return [binghuo_1.BingHuo.Name];
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 3 /* PrepareStageStart */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && room.enableToAwaken(this.Name, owner);
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} activated awakening skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        await room.changeMaxHp(event.fromId, -1);
        await room.obtainSkill(event.fromId, this.RelatedSkills[0], true);
        return true;
    }
};
MouCuan = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'moucuan', description: 'moucuan_description' })
], MouCuan);
exports.MouCuan = MouCuan;
