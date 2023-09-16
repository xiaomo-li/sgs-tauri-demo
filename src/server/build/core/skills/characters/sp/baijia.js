"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaiJia = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const guju_1 = require("./guju");
let BaiJia = class BaiJia extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['sp_canshi'];
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
        const { fromId } = event;
        await room.changeMaxHp(fromId, 1);
        await room.recover({
            toId: fromId,
            recoveredHp: 1,
            recoverBy: fromId,
        });
        for (const other of room.getOtherPlayers(fromId)) {
            other.getMark("kui" /* Kui */) === 0 && room.addMark(other.Id, "kui" /* Kui */, 1);
        }
        await room.loseSkill(fromId, guju_1.GuJu.Name);
        await room.obtainSkill(fromId, this.RelatedSkills[0]);
        return true;
    }
};
BaiJia = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'baijia', description: 'baijia_description' })
], BaiJia);
exports.BaiJia = BaiJia;
