"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoShi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let PoShi = class PoShi extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['huairou'];
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
        const from = room.getPlayerById(fromId);
        await room.changeMaxHp(fromId, -1);
        const n = from.MaxHp - from.getCardIds(0 /* HandArea */).length;
        if (n > 0) {
            await room.drawCards(n, fromId, 'top', fromId, this.Name);
        }
        if (from.hasSkill('jueyan')) {
            await room.loseSkill(fromId, 'jueyan', true);
        }
        await room.obtainSkill(fromId, 'huairou', true);
        return true;
    }
};
PoShi = tslib_1.__decorate([
    skill_1.AwakeningSkill({ name: 'poshi', description: 'poshi_description' })
], PoShi);
exports.PoShi = PoShi;
