"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiSuan = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YiSuan = class YiSuan extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 4 /* PlayCardStage */;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            room.CurrentPhasePlayer === owner &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            !owner.hasUsedSkill(this.Name) &&
            engine_1.Sanguosha.getCardById(content.cardId).isCommonTrick() &&
            room.isCardOnProcessing(content.cardId));
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to lose a max hp to gain {1}?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.changeMaxHp(event.fromId, -1);
        await room.moveCards({
            movingCards: [
                {
                    card: event.triggeredOnEvent.cardId,
                    fromArea: 6 /* ProcessingArea */,
                },
            ],
            toId: event.fromId,
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: event.fromId,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
YiSuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yisuan', description: 'yisuan_description' })
], YiSuan);
exports.YiSuan = YiSuan;
