"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaEn = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let FaEn = class FaEn extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "TurnedOver" /* TurnedOver */ || stage === "AfterChainedOn" /* AfterChainedOn */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 156 /* PlayerTurnOverEvent */) {
            return room.getPlayerById(content.toId).isFaceUp();
        }
        else if (identifier === 119 /* ChainLockedEvent */) {
            const chainedEvent = content;
            return chainedEvent.linked === true;
        }
        return false;
    }
    getSkillLog(room, owner, content) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} draw 1 card?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.toId))).extract();
    }
    getAnimationSteps(event) {
        return [
            {
                from: event.fromId,
                tos: [
                    event.triggeredOnEvent.toId,
                ],
            },
        ];
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.triggeredOnEvent.toId, 'top', event.fromId, this.Name);
        return true;
    }
};
FaEn = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'faen', description: 'faen_description' })
], FaEn);
exports.FaEn = FaEn;
