"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FengLiang = void 0;
const tslib_1 = require("tslib");
const skills_1 = require("core/skills");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const kunfen_1 = require("./kunfen");
let FengLiang = class FengLiang extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['tiaoxin'];
    }
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, content) {
        return content.dying === owner.Id && owner.Hp < 1;
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} activated awakening skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        await room.changeMaxHp(fromId, -1);
        await room.recover({
            toId: fromId,
            recoveredHp: 2 - room.getPlayerById(fromId).Hp,
            recoverBy: fromId,
        });
        await room.obtainSkill(fromId, skills_1.TiaoXin.Name, true);
        await room.updateSkill(fromId, kunfen_1.KunFen.Name, kunfen_1.KunFenEX.Name);
        return true;
    }
};
FengLiang = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'fengliang', description: 'fengliang_description' })
], FengLiang);
exports.FengLiang = FengLiang;
