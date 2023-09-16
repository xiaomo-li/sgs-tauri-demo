"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuoYiShadow = exports.LuoYi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LuoYi = class LuoYi extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeDrawCardEffect" /* BeforeDrawCardEffect */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */ &&
            content.drawAmount > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const displayCards = room.getCards(3, 'top');
        const cardDisplayEvent = {
            displayCards,
            fromId: skillUseEvent.fromId,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, display cards: {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(...displayCards)).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, cardDisplayEvent);
        let luoyiObtain = [];
        for (const cardId of displayCards) {
            const card = engine_1.Sanguosha.getCardById(cardId);
            if (card.is(0 /* Basic */) || card.is(2 /* Weapon */) || card.GeneralName === 'duel') {
                luoyiObtain.push(cardId);
            }
        }
        if (luoyiObtain.length > 0) {
            const askForChooseOptionsEvent = {
                options: ['luoyi:obtain', 'luoyi:cancel'],
                toId: skillUseEvent.fromId,
                conversation: 'Obtain Basic Card, Equip Card and Duel in display cards?',
                triggeredBySkills: [this.Name],
            };
            room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChooseOptionsEvent), skillUseEvent.fromId);
            const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, skillUseEvent.fromId);
            if (selectedOption === 'luoyi:obtain') {
                const { triggeredOnEvent } = skillUseEvent;
                const drawCardEvent = triggeredOnEvent;
                drawCardEvent.drawAmount = 0;
                await room.moveCards({
                    movingCards: luoyiObtain.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                    toId: skillUseEvent.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                });
                room.setFlag(skillUseEvent.fromId, this.Name, true, this.Name);
            }
            else {
                luoyiObtain = [];
            }
        }
        await room.moveCards({
            movingCards: displayCards
                .filter(id => !luoyiObtain.includes(id))
                .map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
            moveReason: 6 /* PlaceToDropStack */,
            toArea: 4 /* DropStack */,
            hideBroadcast: true,
            movedByReason: this.Name,
        });
        return true;
    }
};
LuoYi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'luoyi', description: 'luoyi_description' })
], LuoYi);
exports.LuoYi = LuoYi;
let LuoYiShadow = class LuoYiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayer.Id === owner &&
            room.CurrentPlayerPhase === 0 /* PhaseBegin */ &&
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */);
    }
    getPriority() {
        return 0 /* High */;
    }
    isFlaggedSkill(room, event, stage) {
        return event.to === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isTriggerable(event, stage) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 104 /* PhaseChangeEvent */) {
            const currentEvent = event;
            return currentEvent.to === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
        }
        else {
            const currentEvent = event;
            return (stage === "DamageEffect" /* DamageEffect */ &&
                !currentEvent.isFromChainedDamage &&
                !!currentEvent.cardIds &&
                currentEvent.cardIds.length === 1 &&
                (engine_1.Sanguosha.getCardById(currentEvent.cardIds[0]).GeneralName === 'slash' ||
                    engine_1.Sanguosha.getCardById(currentEvent.cardIds[0]).GeneralName === 'duel'));
        }
    }
    canUse(room, owner, event) {
        if (!room.getFlag(owner.Id, this.GeneralName)) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            const currentEvent = event;
            return !!currentEvent.fromId && currentEvent.fromId === owner.Id;
        }
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 104 /* PhaseChangeEvent */) {
            const currentEvent = unknownEvent;
            currentEvent.toPlayer && room.removeFlag(currentEvent.toPlayer, this.GeneralName);
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damgeEvent = unknownEvent;
            damgeEvent.damage++;
            damgeEvent.messages = damgeEvent.messages || [];
            damgeEvent.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, damage increases to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(damgeEvent.fromId)), this.Name, damgeEvent.damage).toString());
        }
        return true;
    }
};
LuoYiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: LuoYi.GeneralName, description: LuoYi.Description })
], LuoYiShadow);
exports.LuoYiShadow = LuoYiShadow;
