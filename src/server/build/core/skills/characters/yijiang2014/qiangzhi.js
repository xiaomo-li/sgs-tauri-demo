"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiangZhiShadow = exports.QiangZhi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QiangZhi = class QiangZhi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 13 /* PlayCardStageStart */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            room.getOtherPlayers(owner.Id).find(player => player.getCardIds(0 /* HandArea */).length > 0) !==
                undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to display a hand card from another player?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const response = await room.askForChoosingPlayerCard({
            options: {
                [0 /* HandArea */]: room.getPlayerById(toIds[0]).getCardIds(0 /* HandArea */).length,
            },
            fromId,
            toId: toIds[0],
            triggeredBySkills: [this.Name],
        }, fromId, false, true);
        if (!response) {
            return false;
        }
        const displayEvent = {
            fromId: toIds[0],
            displayCards: [response.selectedCard],
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1} from {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(response.selectedCard), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toIds[0]))).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, displayEvent);
        room.setFlag(fromId, this.Name, engine_1.Sanguosha.getCardById(response.selectedCard).BaseType, translation_json_tool_1.TranslationPack.translationJsonPatcher('qiangzhi type: {0}', functional_1.Functional.getCardBaseTypeAbbrRawText(engine_1.Sanguosha.getCardById(response.selectedCard).BaseType)).toString());
        return true;
    }
};
QiangZhi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'qiangzhi', description: 'qiangzhi_description' })
], QiangZhi);
exports.QiangZhi = QiangZhi;
let QiangZhiShadow = class QiangZhiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger(room, owner, event) {
        return event !== undefined && event_packer_1.EventPacker.getIdentifier(event) === 104 /* PhaseChangeEvent */;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        const type = owner.getFlag(this.GeneralName);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            return (type !== undefined &&
                cardUseEvent.fromId === owner.Id &&
                engine_1.Sanguosha.getCardById(cardUseEvent.cardId).BaseType === type);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return (phaseChangeEvent.fromPlayer === owner.Id &&
                phaseChangeEvent.from === 4 /* PlayCardStage */ &&
                type !== undefined);
        }
        return false;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent);
        if (identifier === 124 /* CardUseEvent */) {
            await room.drawCards(1, event.fromId, 'top', event.fromId, this.GeneralName);
        }
        else {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
QiangZhiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: QiangZhi.Name, description: QiangZhi.Description })
], QiangZhiShadow);
exports.QiangZhiShadow = QiangZhiShadow;
