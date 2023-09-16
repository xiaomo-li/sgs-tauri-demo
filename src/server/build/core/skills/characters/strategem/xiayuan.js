"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaYuan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XiaYuan = class XiaYuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        const losingAllArmorTag = event_packer_1.EventPacker.getLosingAllArmorTag(content) || 0;
        return (losingAllArmorTag > 0 &&
            content.toId !== owner.Id &&
            !room.getPlayerById(content.toId).Dead &&
            owner.getCardIds(0 /* HandArea */).length > 1);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 2;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard 2 hand cards to let {1} gain {2} armor?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId)), event_packer_1.EventPacker.getLosingAllArmorTag(event)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        await room.changeArmor(event.triggeredOnEvent.toId, event_packer_1.EventPacker.getLosingAllArmorTag(event.triggeredOnEvent));
        return true;
    }
};
XiaYuan = tslib_1.__decorate([
    skill_wrappers_1.CircleSkill,
    skill_wrappers_1.CommonSkill({ name: 'xiayuan', description: 'xiayuan_description' })
], XiaYuan);
exports.XiaYuan = XiaYuan;
