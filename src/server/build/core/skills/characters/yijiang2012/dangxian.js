"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DangXian = void 0;
const tslib_1 = require("tslib");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DangXian = class DangXian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, content) {
        return content.to === 0 /* PhaseBegin */ && content.toPlayer === owner.Id;
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, started an extra {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name, functional_1.Functional.getPlayerPhaseRawText(4 /* PlayCardStage */)).extract();
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const card = room.getCardsByNameFromStack('slash', 'drop', 1)[0];
        if (card) {
            await room.moveCards({
                moveReason: 1 /* ActivePrey */,
                movedByReason: this.Name,
                toArea: 0 /* HandArea */,
                toId: skillUseEvent.fromId,
                movingCards: [{ card, fromArea: 4 /* DropStack */ }],
            });
        }
        room.insertPlayerPhase(skillUseEvent.fromId, 4 /* PlayCardStage */);
        return true;
    }
};
DangXian = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'dangxian', description: 'dangxian_description' })
], DangXian);
exports.DangXian = DangXian;
