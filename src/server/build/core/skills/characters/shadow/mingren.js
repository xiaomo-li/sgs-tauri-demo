"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MingRenShadow = exports.MingRen = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MingRen = class MingRen extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterGameBegan" /* AfterGameBegan */;
    }
    canUse(room, owner, content) {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        await room.drawCards(2, fromId, 'top', fromId, this.Name);
        const hands = room.getPlayerById(fromId).getCardIds(0 /* HandArea */);
        if (hands.length === 0) {
            return false;
        }
        const response = await room.doAskForCommonly(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent({
            cardAmount: 1,
            toId: fromId,
            reason: this.Name,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please put a hand card on your general card as ‘Ren’', this.Name).extract(),
            fromArea: [0 /* HandArea */],
            triggeredBySkills: [this.Name],
        }), fromId);
        response.selectedCards = response.selectedCards || hands[0];
        await room.moveCards({
            movingCards: [{ card: response.selectedCards[0], fromArea: 0 /* HandArea */ }],
            fromId,
            toId: fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: this.Name,
            isOutsideAreaInPublic: true,
            proposer: fromId,
            movedByReason: this.Name,
        });
        return true;
    }
};
MingRen = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'mingren', description: 'mingren_description' })
], MingRen);
exports.MingRen = MingRen;
let MingRenShadow = class MingRenShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.getCardIds(0 /* HandArea */).length > 0 &&
            owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to exchange a hand card with a ‘Ren’?', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        const ren = room.getPlayerById(fromId).getCardIds(3 /* OutsideArea */, this.GeneralName);
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: 0 /* HandArea */ }],
            fromId,
            toId: fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: this.GeneralName,
            isOutsideAreaInPublic: true,
            proposer: fromId,
            movedByReason: this.GeneralName,
        });
        await room.moveCards({
            movingCards: [{ card: ren[0], fromArea: 3 /* OutsideArea */ }],
            fromId,
            toId: fromId,
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            movedByReason: this.GeneralName,
        });
        return true;
    }
};
MingRenShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: MingRen.Name, description: MingRen.Description })
], MingRenShadow);
exports.MingRenShadow = MingRenShadow;
