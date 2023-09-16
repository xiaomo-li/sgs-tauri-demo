"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuYing = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GuYing = class GuYing extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */ || stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 128 /* MoveCardEvent */) {
            return (!owner.hasUsedSkill(this.Name) &&
                room.CurrentPlayer !== owner &&
                room.CurrentPlayer !== undefined &&
                !room.CurrentPlayer.Dead &&
                !!event.infos.find(info => info.fromId === owner.Id &&
                    (info.moveReason === 8 /* CardUse */ ||
                        info.moveReason === 9 /* CardResponse */ ||
                        info.moveReason === 5 /* PassiveDrop */ ||
                        info.moveReason === 4 /* SelfDrop */) &&
                    info.movingCards.length === 1 &&
                    card_1.VirtualCard.getActualCards([info.movingCards[0].card]).length === 1 &&
                    (info.movingCards[0].fromArea === 0 /* HandArea */ ||
                        info.movingCards[0].fromArea === 1 /* EquipArea */)));
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = event;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 3 /* PrepareStageStart */ &&
                owner.getFlag(this.Name) !== undefined);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 128 /* MoveCardEvent */) {
            const originalTimes = room.getFlag(event.fromId, this.Name) || 0;
            room.setFlag(event.fromId, this.Name, originalTimes + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('guying: {0}', originalTimes + 1).toString());
            const moveCardInfo = unknownEvent.infos.find(info => info.fromId === event.fromId &&
                (info.moveReason === 8 /* CardUse */ ||
                    info.moveReason === 9 /* CardResponse */ ||
                    info.moveReason === 5 /* PassiveDrop */ ||
                    info.moveReason === 4 /* SelfDrop */) &&
                info.movingCards.length === 1 &&
                card_1.VirtualCard.getActualCards([info.movingCards[0].card]).length === 1 &&
                (info.movingCards[0].fromArea === 0 /* HandArea */ ||
                    info.movingCards[0].fromArea === 1 /* EquipArea */));
            if (!moveCardInfo) {
                return false;
            }
            const cardId = card_1.VirtualCard.getActualCards([moveCardInfo.movingCards[0].card])[0];
            let currentArea;
            if (moveCardInfo.moveReason === 8 /* CardUse */ ||
                moveCardInfo.moveReason === 9 /* CardResponse */) {
                room.isCardOnProcessing(cardId) && (currentArea = 6 /* ProcessingArea */);
            }
            else {
                room.isCardInDropStack(cardId) && (currentArea = 4 /* DropStack */);
            }
            const options = [];
            const currentPlayerCards = room.CurrentPlayer.getPlayerCards();
            currentPlayerCards.length > 0 && options.push('guying:giveRandomly');
            currentArea !== undefined && options.push('guying:gainCard');
            if (options.length > 0) {
                const currentPlayerId = room.CurrentPlayer.Id;
                const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                    options,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose guying options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract(),
                    toId: currentPlayerId,
                    triggeredBySkills: [this.Name],
                }, currentPlayerId, true);
                response.selectedOption = response.selectedOption || options[0];
                if (response.selectedOption === 'guying:giveRandomly') {
                    const randomCard = currentPlayerCards[Math.floor(Math.random() * currentPlayerCards.length)];
                    await room.moveCards({
                        movingCards: [{ card: randomCard, fromArea: room.CurrentPlayer.cardFrom(randomCard) }],
                        fromId: currentPlayerId,
                        toId: event.fromId,
                        toArea: 0 /* HandArea */,
                        moveReason: 2 /* ActiveMove */,
                        proposer: currentPlayerId,
                        triggeredBySkills: [this.Name],
                    });
                }
                else {
                    if (engine_1.Sanguosha.getCardById(cardId).is(1 /* Equip */)) {
                        await room.useCard({
                            fromId: event.fromId,
                            targetGroup: [[event.fromId]],
                            cardId,
                            customFromArea: currentArea,
                        }, true);
                    }
                    else {
                        await room.moveCards({
                            movingCards: [{ card: cardId, fromArea: currentArea }],
                            toId: event.fromId,
                            toArea: 0 /* HandArea */,
                            moveReason: 1 /* ActivePrey */,
                            proposer: event.fromId,
                            triggeredBySkills: [this.Name],
                        });
                    }
                }
            }
        }
        else {
            const response = await room.askForCardDrop(event.fromId, room.getFlag(event.fromId, this.Name), [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
            response.droppedCards.length > 0 &&
                (await room.dropCards(4 /* SelfDrop */, response.droppedCards, event.fromId, event.fromId, this.Name));
            room.removeFlag(event.fromId, this.Name);
        }
        return true;
    }
};
GuYing = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'guying', description: 'guying_description' })
], GuYing);
exports.GuYing = GuYing;
