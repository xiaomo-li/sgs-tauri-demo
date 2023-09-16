"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheYi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let SheYi = class SheYi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, event) {
        return (event.toId !== owner.Id &&
            owner.hasUsedSkill(this.Name) &&
            !room.getPlayerById(event.toId).Dead &&
            owner.Hp > room.getPlayerById(event.toId).Hp &&
            owner.getPlayerCards().length >= owner.Hp);
    }
    cardFilter(room, owner, cards) {
        return cards.length >= owner.Hp;
    }
    isAvailableCard() {
        return true;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to give at least {1} card(s) to {2} to prevent the damage?', this.Name, owner.Hp, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const damageEvent = event.triggeredOnEvent;
        if (event.cardIds && event.cardIds.length > 0) {
            await room.moveCards({
                movingCards: event.cardIds.map(card => ({ card, fromArea: room.getPlayerById(event.fromId).cardFrom(card) })),
                fromId: event.fromId,
                toId: damageEvent.toId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
        }
        damageEvent.damage = 0;
        event_packer_1.EventPacker.terminate(damageEvent);
        return true;
    }
};
SheYi = tslib_1.__decorate([
    skill_wrappers_1.CircleSkill,
    skill_wrappers_1.CommonSkill({ name: 'sheyi', description: 'sheyi_description' })
], SheYi);
exports.SheYi = SheYi;
