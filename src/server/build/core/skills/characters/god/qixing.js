"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiXingShadow = exports.QiXing = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QiXing = class QiXing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterGameBegan" /* AfterGameBegan */;
    }
    isAutoTrigger() {
        return true;
    }
    canUse() {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const fromId = skillUseEvent.fromId;
        const from = room.getPlayerById(fromId);
        let qixingCards = room.getCards(7, 'top');
        await room.moveCards({
            movingCards: qixingCards.map(card => ({ card })),
            toArea: 3 /* OutsideArea */,
            toId: fromId,
            moveReason: 2 /* ActiveMove */,
            movedByReason: this.Name,
            isOutsideAreaInPublic: false,
            toOutsideArea: this.Name,
            proposer: skillUseEvent.fromId,
            engagedPlayerIds: [skillUseEvent.fromId],
        });
        const handcards = from.getCardIds(0 /* HandArea */);
        qixingCards = from.getCardIds(3 /* OutsideArea */, this.Name);
        const askForChoosingCardsEvent = {
            amount: handcards.length,
            customCardFields: {
                [this.Name]: qixingCards,
                [0 /* HandArea */]: handcards,
            },
            toId: fromId,
            customTitle: 'qixing: please select cards to save',
            triggeredBySkills: [this.Name],
        };
        room.notify(165 /* AskForChoosingCardEvent */, askForChoosingCardsEvent, fromId);
        const { selectedCards } = await room.onReceivingAsyncResponseFrom(165 /* AskForChoosingCardEvent */, fromId);
        if (!selectedCards) {
            return false;
        }
        else {
            const fromHandcards = selectedCards.filter(card => !handcards.includes(card));
            await room.moveCards({
                fromId,
                movingCards: handcards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                toArea: 3 /* OutsideArea */,
                toId: fromId,
                toOutsideArea: this.Name,
                moveReason: 2 /* ActiveMove */,
                movedByReason: this.Name,
                proposer: fromId,
                engagedPlayerIds: [fromId],
            });
            await room.moveCards({
                fromId,
                movingCards: selectedCards.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                toArea: 0 /* HandArea */,
                toId: fromId,
                moveReason: 2 /* ActiveMove */,
                movedByReason: this.Name,
                proposer: fromId,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, swapped {2} handcards from qixing cards pile', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), this.Name, fromHandcards.length).extract(),
            });
        }
        return true;
    }
};
QiXing = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qixing', description: 'qixing_description' })
], QiXing);
exports.QiXing = QiXing;
let QiXingShadow = class QiXingShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.toStage === 12 /* DrawCardStageEnd */ &&
            content.playerId === owner.Id &&
            owner.getCardIds(3 /* OutsideArea */, QiXing.Name).length > 0 &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const from = room.getPlayerById(skillUseEvent.fromId);
        const handcards = from.getCardIds(0 /* HandArea */);
        const qixingCards = from.getCardIds(3 /* OutsideArea */, this.GeneralName);
        const askForChoosingCardsEvent = {
            amount: handcards.length,
            customCardFields: {
                [this.GeneralName]: qixingCards,
                [0 /* HandArea */]: handcards,
            },
            toId: from.Id,
            customTitle: 'qixing: please select cards to save',
            triggeredBySkills: [this.Name],
        };
        room.notify(165 /* AskForChoosingCardEvent */, askForChoosingCardsEvent, from.Id);
        const { selectedCards } = await room.onReceivingAsyncResponseFrom(165 /* AskForChoosingCardEvent */, from.Id);
        if (!selectedCards) {
            return false;
        }
        else {
            const fromHandcards = selectedCards.filter(card => !handcards.includes(card));
            await room.moveCards({
                fromId: from.Id,
                movingCards: handcards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                toArea: 3 /* OutsideArea */,
                toId: from.Id,
                toOutsideArea: this.GeneralName,
                moveReason: 2 /* ActiveMove */,
                movedByReason: this.Name,
                proposer: from.Id,
                engagedPlayerIds: [from.Id],
            });
            await room.moveCards({
                fromId: from.Id,
                movingCards: selectedCards.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                toArea: 0 /* HandArea */,
                toId: from.Id,
                moveReason: 2 /* ActiveMove */,
                movedByReason: this.Name,
                proposer: from.Id,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, swapped {2} handcards from qixing cards pile', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), this.Name, fromHandcards.length).extract(),
            });
        }
        return true;
    }
};
QiXingShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: QiXing.Name, description: QiXing.Description })
], QiXingShadow);
exports.QiXingShadow = QiXingShadow;
