"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangQing = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MangQing = class MangQing extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['yuyun'];
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
        await room.changeMaxHp(event.fromId, 3);
        await room.recover({
            toId: event.fromId,
            recoveredHp: 3,
            recoverBy: event.fromId,
        });
        await room.loseSkill(event.fromId, 'zhukou', true);
        await room.obtainSkill(event.fromId, 'yuyun', true);
        return true;
    }
};
MangQing = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'mangqing', description: 'mangqing_description' })
], MangQing);
exports.MangQing = MangQing;
