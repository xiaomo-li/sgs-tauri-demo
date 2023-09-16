"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XianTuShadow = exports.XianTu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XianTu = class XianTu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 13 /* PlayCardStageStart */;
    }
    canUse(room, owner, content) {
        return owner.Id !== content.playerId;
    }
    getSkillLog(room, owner, content) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw 2 cards, then give 2 cards to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.playerId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        await room.drawCards(2, fromId, 'top', fromId, this.Name);
        const current = room.CurrentPhasePlayer;
        const cards = from.getPlayerCards();
        if (cards.length > 1) {
            const response = await room.doAskForCommonly(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                cardAmount: 2,
                toId: fromId,
                reason: this.Name,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you need to give 2 handcards to {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(current)).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }), fromId, true);
            response.selectedCards = response.selectedCards || cards.slice(0, 2);
            await room.moveCards({
                movingCards: response.selectedCards.map(card => ({ card, fromArea: from.cardFrom(card) })),
                fromId,
                toId: current.Id,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            });
            from.setFlag(this.Name, current.Id);
        }
        return true;
    }
};
XianTu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xiantu', description: 'xiantu_description' })
], XianTu);
exports.XianTu = XianTu;
let XianTuShadow = class XianTuShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        const current = owner.getFlag(this.GeneralName);
        current && owner.removeFlag(this.GeneralName);
        return (content.fromPlayer === current &&
            content.from === 4 /* PlayCardStage */ &&
            room.Analytics.getRecordEvents(event => event.killedBy === current, current, 'phase', undefined, 1).length === 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.loseHp(event.fromId, 1);
        return true;
    }
};
XianTuShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XianTu.Name, description: XianTu.Description })
], XianTuShadow);
exports.XianTuShadow = XianTuShadow;
