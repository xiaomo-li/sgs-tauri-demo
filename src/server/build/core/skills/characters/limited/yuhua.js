"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YuHua = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YuHua = class YuHua extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (event_packer_1.EventPacker.getIdentifier(event) === 162 /* AskForCardDropEvent */ ||
            stage === "StageChanged" /* StageChanged */);
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 162 /* AskForCardDropEvent */) {
            return room.CurrentPlayerPhase === 5 /* DropCardStage */ && room.CurrentPhasePlayer.Id === owner.Id;
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 19 /* FinishStageStart */ &&
                owner.getCardIds(0 /* HandArea */).length > owner.MaxHp);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 162 /* AskForCardDropEvent */) {
            const askForCardDropEvent = unknownEvent;
            const player = room.getPlayerById(askForCardDropEvent.toId);
            const unbasic = player
                .getCardIds(0 /* HandArea */)
                .filter(cardId => !engine_1.Sanguosha.getCardById(cardId).is(0 /* Basic */));
            if (unbasic.length > 0) {
                const otherHandCards = player.getCardIds(0 /* HandArea */).filter(card => !unbasic.includes(card));
                const discardAmount = otherHandCards.length - player.getMaxCardHold(room);
                askForCardDropEvent.cardAmount = discardAmount;
                askForCardDropEvent.except = askForCardDropEvent.except ? [...askForCardDropEvent.except, ...unbasic] : unbasic;
            }
        }
        else {
            const cards = room.getCards(1, 'top');
            const guanxingEvent = {
                cardIds: cards,
                top: 1,
                topStackName: 'draw stack top',
                bottom: 1,
                bottomStackName: 'draw stack bottom',
                toId: event.fromId,
                movable: true,
                triggeredBySkills: [this.Name],
            };
            room.notify(172 /* AskForPlaceCardsInDileEvent */, guanxingEvent, event.fromId);
            const { top, bottom } = await room.onReceivingAsyncResponseFrom(172 /* AskForPlaceCardsInDileEvent */, event.fromId);
            room.broadcast(103 /* CustomGameDialog */, {
                translationsMessage: top.length > 0
                    ? translation_json_tool_1.TranslationPack.translationJsonPatcher('yuhua finished, the card placed on the top').extract()
                    : translation_json_tool_1.TranslationPack.translationJsonPatcher('yuhua finished, the card placed at the bottom').extract(),
            });
            top.length > 0 && room.putCards('top', top[0]);
            bottom.length > 0 && room.putCards('bottom', bottom[0]);
        }
        return true;
    }
};
YuHua = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'yuhua', description: 'yuhua_description' })
], YuHua);
exports.YuHua = YuHua;
