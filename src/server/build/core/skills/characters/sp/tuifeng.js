"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuiFengShadow = exports.TuiFengBuff = exports.TuiFeng = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TuiFeng = class TuiFeng extends skill_1.TriggerSkill {
    async whenDead(room, owner) {
        room.removeFlag(owner.Id, this.Name);
    }
    isAutoTrigger(room, owner, event) {
        return event !== undefined && event_packer_1.EventPacker.getIdentifier(event) === 105 /* PhaseStageChangeEvent */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */ || stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 137 /* DamageEvent */) {
            return (content.toId === owner.Id &&
                owner.getPlayerCards().length > 0);
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 3 /* PrepareStageStart */ &&
                owner.getCardIds(3 /* OutsideArea */, this.Name).length > 0);
        }
        return false;
    }
    triggerableTimes(event) {
        return event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */ ? event.damage : 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard() {
        return true;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put a card on your general card as ‘Feng’?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent);
        if (identifier === 137 /* DamageEvent */) {
            if (!event.cardIds) {
                return false;
            }
            await room.moveCards({
                movingCards: [
                    { card: event.cardIds[0], fromArea: room.getPlayerById(event.fromId).cardFrom(event.cardIds[0]) },
                ],
                fromId: event.fromId,
                toId: event.fromId,
                toArea: 3 /* OutsideArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: event.fromId,
                isOutsideAreaInPublic: true,
                toOutsideArea: this.Name,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            const feng = room.getPlayerById(event.fromId).getCardIds(3 /* OutsideArea */, this.Name).slice();
            await room.moveCards({
                movingCards: feng.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                fromId: event.fromId,
                toArea: 4 /* DropStack */,
                moveReason: 6 /* PlaceToDropStack */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
            await room.drawCards(feng.length * 2, event.fromId, 'top', event.fromId, this.Name);
            room.setFlag(event.fromId, this.Name, feng.length, translation_json_tool_1.TranslationPack.translationJsonPatcher('tuifeng: {0}', feng.length).toString());
        }
        return true;
    }
};
TuiFeng = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'tuifeng', description: 'tuifeng_description' })
], TuiFeng);
exports.TuiFeng = TuiFeng;
let TuiFengBuff = class TuiFengBuff extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableTimes(cardId, room, owner) {
        if (!room.getFlag(owner.Id, this.GeneralName)) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            match = engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        if (match) {
            return room.getFlag(owner.Id, this.GeneralName);
        }
        else {
            return 0;
        }
    }
};
TuiFengBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: TuiFeng.Name, description: TuiFeng.Description })
], TuiFengBuff);
exports.TuiFengBuff = TuiFengBuff;
let TuiFengShadow = class TuiFengShadow extends skill_1.TriggerSkill {
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
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.fromPlayer &&
            event.from === 7 /* PhaseFinish */ &&
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
TuiFengShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: TuiFengBuff.Name, description: TuiFengBuff.Description })
], TuiFengShadow);
exports.TuiFengShadow = TuiFengShadow;
