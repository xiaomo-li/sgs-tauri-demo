"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuoJingRemover = exports.DuoJingShadow = exports.DuoJing = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DuoJing = class DuoJing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id && owner.Armor > 0 && engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash');
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use this skill to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.changeArmor(event.fromId, -1);
        const to = room.getPlayerById(event.triggeredOnEvent.toId);
        if (to.getPlayerCards().length > 0) {
            const options = {
                [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
            };
            const chooseCardEvent = {
                fromId: event.fromId,
                toId: to.Id,
                options,
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForChoosingPlayerCard(chooseCardEvent, chooseCardEvent.fromId, false, true);
            if (!response) {
                return false;
            }
            await room.moveCards({
                movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
                fromId: chooseCardEvent.toId,
                toId: chooseCardEvent.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: chooseCardEvent.fromId,
                triggeredBySkills: [this.Name],
            });
        }
        const aimEvent = event.triggeredOnEvent;
        event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: event.fromId }, aimEvent);
        aimEvent.triggeredBySkills = aimEvent.triggeredBySkills || [];
        aimEvent.triggeredBySkills.push(this.Name);
        return true;
    }
};
DuoJing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'duojing', description: 'duojing_description' })
], DuoJing);
exports.DuoJing = DuoJing;
let DuoJingShadow = class DuoJingShadow extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
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
DuoJingShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: DuoJing.Name, description: DuoJing.Description })
], DuoJingShadow);
exports.DuoJingShadow = DuoJingShadow;
let DuoJingRemover = class DuoJingRemover extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            return (event_packer_1.EventPacker.getMiddleware(this.GeneralName, event) === owner.Id &&
                room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
                room.CurrentPhasePlayer === owner);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            return owner.getFlag(this.GeneralName) !== undefined;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent) ===
            124 /* CardUseEvent */) {
            const additionalUsableTimes = room.getFlag(event.fromId, this.GeneralName) || 0;
            room.setFlag(event.fromId, this.GeneralName, additionalUsableTimes + 1);
        }
        else {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
DuoJingRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: DuoJingShadow.Name, description: DuoJingShadow.Description })
], DuoJingRemover);
exports.DuoJingRemover = DuoJingRemover;
