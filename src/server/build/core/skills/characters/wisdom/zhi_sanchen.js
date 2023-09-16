"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiSanChen = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhiSanChen = class ZhiSanChen extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['miewu'];
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            room.enableToAwaken(this.Name, owner));
    }
    async onTrigger(room, event) {
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} activated awakening skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        await room.changeMaxHp(fromId, 1);
        await room.recover({
            toId: fromId,
            recoveredHp: 1,
            recoverBy: fromId,
        });
        await room.obtainSkill(fromId, 'miewu', true);
        return true;
    }
};
ZhiSanChen = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'zhi_sanchen', description: 'zhi_sanchen_description' })
], ZhiSanChen);
exports.ZhiSanChen = ZhiSanChen;
