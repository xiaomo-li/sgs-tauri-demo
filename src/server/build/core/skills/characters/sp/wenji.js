"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WenJiShadow = exports.WenJi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WenJi = class WenJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 13 /* PlayCardStageStart */ &&
            room.getOtherPlayers(owner.Id).find(player => player.getPlayerCards().length > 0) !== undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        return targetId !== owner && room.getPlayerById(targetId).getPlayerCards().length > 0;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you can let anothor player give you a card', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        const toId = precondition_1.Precondition.exists(toIds, 'Unable to get wenji target')[0];
        const to = room.getPlayerById(toId);
        const wholeCards = to.getPlayerCards();
        if (wholeCards.length > 0) {
            const response = await room.doAskForCommonly(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                cardAmount: 1,
                toId,
                reason: this.Name,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you need to give a card to {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }), toId);
            response.selectedCards = response.selectedCards || wholeCards[Math.floor(Math.random() * wholeCards.length)];
            await room.moveCards({
                movingCards: [{ card: response.selectedCards[0], fromArea: to.cardFrom(response.selectedCards[0]) }],
                moveReason: 2 /* ActiveMove */,
                fromId: toId,
                toId: fromId,
                toArea: 0 /* HandArea */,
                proposer: fromId,
            });
            let card = engine_1.Sanguosha.getCardById(response.selectedCards[0]);
            while (card.isVirtualCard()) {
                const virtualCard = card;
                card = engine_1.Sanguosha.getCardById(virtualCard.ActualCardIds[0]);
            }
            const originalTypes = room.getFlag(fromId, this.Name) || [];
            if (!originalTypes.includes(card.BaseType)) {
                originalTypes.push(card.BaseType);
            }
            let originalText = '{0}：';
            for (let i = 1; i <= originalTypes.length; i++) {
                originalText = originalText + '[{' + i + '}]';
            }
            room.setFlag(fromId, this.Name, originalTypes, translation_json_tool_1.TranslationPack.translationJsonPatcher(originalText, this.Name, ...originalTypes.map(type => functional_1.Functional.getCardBaseTypeAbbrRawText(type))).toString());
        }
        return true;
    }
};
WenJi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'wenji', description: 'wenji_description' })
], WenJi);
exports.WenJi = WenJi;
let WenJiShadow = class WenJiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            const card = engine_1.Sanguosha.getCardById(cardUseEvent.cardId);
            const wenjiTypes = owner.getFlag(this.GeneralName);
            return (cardUseEvent.fromId === owner.Id &&
                !card.is(8 /* DelayedTrick */) &&
                !card.is(1 /* Equip */) &&
                (wenjiTypes === null || wenjiTypes === void 0 ? void 0 : wenjiTypes.includes(card.BaseType)));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return (owner.getFlag(this.GeneralName) !== undefined && phaseChangeEvent.from === 7 /* PhaseFinish */);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            const targets = room
                .getAllPlayersFrom()
                .map(player => player.Id)
                .filter(playerId => playerId !== fromId);
            cardUseEvent.disresponsiveList = targets;
        }
        else {
            room.removeFlag(fromId, this.GeneralName);
        }
        return true;
    }
};
WenJiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: WenJi.Name, description: WenJi.Description })
], WenJiShadow);
exports.WenJiShadow = WenJiShadow;
