"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HanZhanHidden = exports.HanZhan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HanZhan = class HanZhan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforePinDianEffect" /* BeforePinDianEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.fromId || content.toIds.includes(owner.Id);
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, triggeredOnEvent } = skillUseEvent;
        const pindianEvent = triggeredOnEvent;
        if (pindianEvent.fromId === fromId) {
            pindianEvent.randomPinDianCardPlayer.push(...pindianEvent.toIds);
        }
        else {
            pindianEvent.randomPinDianCardPlayer.push(pindianEvent.fromId);
        }
        return true;
    }
};
HanZhan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'hanzhan', description: 'hanzhan_description' })
], HanZhan);
exports.HanZhan = HanZhan;
let HanZhanHidden = class HanZhanHidden extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterPinDianEffect" /* AfterPinDianEffect */;
    }
    canUse(room, owner, content) {
        const involved = owner.Id === content.fromId || content.toIds.includes(owner.Id);
        if (!involved) {
            return false;
        }
        return (engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash' ||
            content.procedures.find(result => engine_1.Sanguosha.getCardById(result.cardId).GeneralName === 'slash') !== undefined);
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, triggeredOnEvent } = skillUseEvent;
        const pindianEvent = triggeredOnEvent;
        const cards = pindianEvent.procedures.map(result => engine_1.Sanguosha.getCardById(result.cardId));
        cards.push(engine_1.Sanguosha.getCardById(pindianEvent.cardId));
        let bigCards = [];
        for (const card of cards) {
            if (card.GeneralName === 'slash') {
                if (bigCards.length === 0) {
                    bigCards.push(card);
                }
                else {
                    if (card.CardNumber === bigCards[0].CardNumber) {
                        bigCards.push(card);
                    }
                    else if (card.CardNumber > bigCards[0].CardNumber) {
                        bigCards = [card];
                    }
                }
            }
        }
        if (bigCards.length === 0) {
            return false;
        }
        let obtainingCard = bigCards[0].Id;
        if (bigCards.length > 1) {
            const askForChooseCardEvent = {
                toId: fromId,
                cardIds: bigCards.map(card => card.Id),
                amount: 1,
                customTitle: this.GeneralName,
                triggeredBySkills: [this.Name],
            };
            room.notify(165 /* AskForChoosingCardEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChooseCardEvent), fromId);
            const { selectedCards } = await room.onReceivingAsyncResponseFrom(165 /* AskForChoosingCardEvent */, fromId);
            obtainingCard = selectedCards[0];
        }
        await room.moveCards({
            movingCards: [
                {
                    card: obtainingCard,
                    fromArea: 6 /* ProcessingArea */,
                },
            ],
            moveReason: 1 /* ActivePrey */,
            movedByReason: this.GeneralName,
            toArea: 0 /* HandArea */,
            toId: fromId,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, obtained card {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), this.GeneralName, translation_json_tool_1.TranslationPack.patchCardInTranslation(obtainingCard)).extract(),
        });
        return true;
    }
};
HanZhanHidden = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: HanZhan.Name, description: HanZhan.Description })
], HanZhanHidden);
exports.HanZhanHidden = HanZhanHidden;
