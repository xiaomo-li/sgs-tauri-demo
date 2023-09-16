"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuanJiBuff = exports.QuanJiShadow = exports.QuanJi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QuanJi = class QuanJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        const unknownEvent = event_packer_1.EventPacker.getIdentifier(content);
        if (unknownEvent === 105 /* PhaseStageChangeEvent */) {
            const event = content;
            return (event.playerId === owner.Id &&
                event.toStage === 15 /* PlayCardStageEnd */ &&
                owner.getCardIds(0 /* HandArea */).length > owner.Hp);
        }
        else if (unknownEvent === 137 /* DamageEvent */) {
            const event = content;
            return event.toId === owner.Id;
        }
        return false;
    }
    triggerableTimes(event) {
        if (event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */) {
            const damageEvent = event;
            return damageEvent.damage;
        }
        return 1;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card, then put a hand card on your general card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        await room.drawCards(1, fromId, 'top', fromId, this.Name);
        if (from.getCardIds(0 /* HandArea */).length > 0) {
            let card;
            if (from.getCardIds(0 /* HandArea */).length > 1) {
                const skillUseEvent = {
                    invokeSkillNames: [QuanJiShadow.Name],
                    toId: fromId,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please put a hand card on your general card', this.Name).extract(),
                };
                room.notify(171 /* AskForSkillUseEvent */, event_packer_1.EventPacker.createUncancellableEvent(skillUseEvent), fromId);
                const { cardIds } = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, fromId);
                const handcards = from.getCardIds(0 /* HandArea */);
                card = cardIds ? cardIds[0] : handcards[Math.floor(Math.random() * handcards.length)];
            }
            else {
                card = from.getCardIds(0 /* HandArea */)[0];
            }
            await room.moveCards({
                movingCards: [{ card, fromArea: 0 /* HandArea */ }],
                fromId,
                toId: fromId,
                toArea: 3 /* OutsideArea */,
                moveReason: 2 /* ActiveMove */,
                toOutsideArea: this.Name,
                isOutsideAreaInPublic: true,
                proposer: fromId,
                movedByReason: this.Name,
            });
        }
        return true;
    }
};
QuanJi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'quanji', description: 'quanji_description' })
], QuanJi);
exports.QuanJi = QuanJi;
let QuanJiShadow = class QuanJiShadow extends skill_1.TriggerSkill {
    isTriggerable() {
        return false;
    }
    canUse() {
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard() {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onTrigger() {
        return true;
    }
    async onEffect() {
        return true;
    }
};
QuanJiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: QuanJi.Name, description: QuanJi.Description })
], QuanJiShadow);
exports.QuanJiShadow = QuanJiShadow;
let QuanJiBuff = class QuanJiBuff extends skill_1.RulesBreakerSkill {
    breakAdditionalCardHoldNumber(room, owner) {
        return owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length;
    }
};
QuanJiBuff = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: QuanJiShadow.Name, description: QuanJiShadow.Description })
], QuanJiBuff);
exports.QuanJiBuff = QuanJiBuff;
