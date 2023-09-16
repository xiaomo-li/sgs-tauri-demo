"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnYongShadow = exports.AnYong = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let AnYong = class AnYong extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, owner) {
        const records = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */ &&
            event.fromId === room.CurrentPlayer.Id &&
            event.toId !== event.fromId, undefined, 'round', undefined, 1);
        if (records.length > 0) {
            owner.setFlag(AnYongShadow.Name, true);
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, records[0]);
        }
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId !== undefined &&
            room.CurrentPlayer.Id === content.fromId &&
            content.toId !== content.fromId &&
            content.damage === 1 &&
            event_packer_1.EventPacker.getMiddleware(this.Name, content) === true &&
            owner.getCardIds(0 /* HandArea */).length > 0 &&
            !room.getPlayerById(content.toId).Dead);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard a card to deal 1 damage to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        await room.damage({
            fromId: event.fromId,
            toId: event.triggeredOnEvent.toId,
            damage: 1,
            damageType: "normal_property" /* Normal */,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
AnYong = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'anyong', description: 'anyong_description' })
], AnYong);
exports.AnYong = AnYong;
let AnYongShadow = class AnYongShadow extends skill_1.TriggerSkill {
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
        return stage === "DamageDone" /* DamageDone */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = event;
            return (damageEvent.fromId !== undefined &&
                room.CurrentPlayer.Id === damageEvent.fromId &&
                damageEvent.toId !== damageEvent.fromId &&
                !owner.getFlag(this.Name));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.from === 7 /* PhaseFinish */ && owner.getFlag(this.Name);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            room.getPlayerById(event.fromId).setFlag(this.Name, true);
            event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: true }, unknownEvent);
        }
        else {
            room.removeFlag(event.fromId, this.Name);
        }
        return true;
    }
};
AnYongShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: AnYong.Name, description: AnYong.Description })
], AnYongShadow);
exports.AnYongShadow = AnYongShadow;
