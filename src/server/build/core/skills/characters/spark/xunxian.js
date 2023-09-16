"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XunXian = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XunXian = class XunXian extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (room.CurrentPlayer !== owner &&
            !owner.hasUsedSkill(this.Name) &&
            content.infos.find(info => (info.moveReason === 8 /* CardUse */ || info.moveReason === 9 /* CardResponse */) &&
                info.proposer === owner.Id &&
                info.toArea === 4 /* DropStack */ &&
                info.movingCards.find(card => room.isCardInDropStack(card.card)) !== undefined) !== undefined &&
            room
                .getOtherPlayers(owner.Id)
                .find(player => player.getCardIds(0 /* HandArea */).length > owner.getCardIds(0 /* HandArea */).length) !== undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        return (room.getPlayerById(targetId).getCardIds(0 /* HandArea */).length >
            room.getPlayerById(owner).getCardIds(0 /* HandArea */).length);
    }
    getSkillLog(room, owner, event) {
        const cardIds = [];
        if (event.infos.length === 1) {
            cardIds.push(...event.infos[0].movingCards.filter(card => room.isCardInDropStack(card.card)).map(card => card.card));
        }
        else {
            const infos = event.infos.filter(info => (info.moveReason === 8 /* CardUse */ || info.moveReason === 9 /* CardResponse */) &&
                info.proposer === owner.Id &&
                info.toArea === 4 /* DropStack */ &&
                info.movingCards.find(card => room.isCardInDropStack(card.card)) !== undefined);
            for (const info of infos) {
                cardIds.push(...info.movingCards.filter(card => room.isCardInDropStack(card.card)).map(card => card.card));
            }
        }
        const promptCardIds = cardIds.length > 1 ? cardIds.slice(0, 2) : [cardIds[0]];
        return translation_json_tool_1.TranslationPack.translationJsonPatcher(cardIds.length > 1
            ? '{0}: do you want to give {1} to another player with the number of hand cards more than you?'
            : '{0}: do you want to give {1} cards to another player with the number of hand cards more than you?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(...promptCardIds)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const moveCardEvent = event.triggeredOnEvent;
        const cardIds = [];
        if (moveCardEvent.infos.length === 1) {
            cardIds.push(...moveCardEvent.infos[0].movingCards.filter(card => room.isCardInDropStack(card.card)).map(card => card.card));
        }
        else {
            const infos = moveCardEvent.infos.filter(info => (info.moveReason === 8 /* CardUse */ || info.moveReason === 9 /* CardResponse */) &&
                info.proposer === fromId &&
                info.toArea === 4 /* DropStack */ &&
                info.movingCards.find(card => room.isCardInDropStack(card.card)) !== undefined);
            for (const info of infos) {
                cardIds.push(...info.movingCards.filter(card => room.isCardInDropStack(card.card)).map(card => card.card));
            }
        }
        if (cardIds.length > 0) {
            await room.moveCards({
                movingCards: cardIds.map(card => ({ card, fromArea: 4 /* DropStack */ })),
                toId: toIds[0],
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
XunXian = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'xunxian', description: 'xunxian_description' })
], XunXian);
exports.XunXian = XunXian;
