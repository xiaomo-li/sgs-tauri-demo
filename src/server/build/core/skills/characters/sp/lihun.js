"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LihunShadow = exports.Lihun = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let Lihun = class Lihun extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getPlayerCards().length > 0;
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    isAvailableTarget(owner, room, target, selectedCards) {
        return room.getPlayerById(target).Gender === 0 /* Male */ && target !== owner;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { cardIds, toIds, fromId } = event;
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        await room.turnOver(fromId);
        const handcards = room.getPlayerById(toIds[0]).getCardIds(0 /* HandArea */);
        await room.moveCards({
            movingCards: handcards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId: toIds[0],
            toId: fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            movedByReason: this.Name,
        });
        room.setFlag(fromId, this.Name, toIds[0], translation_json_tool_1.TranslationPack.translationJsonPatcher('lihun target: {0}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toIds[0]))).toString());
        return true;
    }
};
Lihun = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'lihun', description: 'lihun_description' })
], Lihun);
exports.Lihun = Lihun;
let LihunShadow = class LihunShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    async whenDead(room, player) {
        if (player.getFlag(this.GeneralName)) {
            room.removeFlag(player.Id, this.GeneralName);
        }
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 15 /* PlayCardStageEnd */ &&
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const toId = room.getPlayerById(fromId).getFlag(this.GeneralName);
        if (room.getPlayerById(toId).Dead) {
            room.removeFlag(fromId, this.GeneralName);
            return true;
        }
        const hp = room.getPlayerById(toId).Hp;
        const from = room.getPlayerById(fromId);
        let cards = from.getPlayerCards();
        if (cards.length > hp) {
            const resp = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                cardAmount: hp,
                toId: fromId,
                reason: this.Name,
                conversation: 'lihun: please give the targets some cards',
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }, fromId, true);
            cards = resp.selectedCards;
        }
        await room.moveCards({
            movingCards: cards.map(card => ({ card, fromArea: room.getPlayerById(fromId).cardFrom(card) })),
            fromId,
            toId,
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
        });
        room.removeFlag(fromId, this.GeneralName);
        return true;
    }
};
LihunShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_1.CommonSkill({ name: Lihun.Name, description: Lihun.Description })
], LihunShadow);
exports.LihunShadow = LihunShadow;
