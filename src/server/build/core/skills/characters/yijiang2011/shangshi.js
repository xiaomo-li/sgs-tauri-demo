"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShangShi = void 0;
const tslib_1 = require("tslib");
const shangshi_1 = require("core/ai/skills/characters/yijiang2011/shangshi");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShangShi = class ShangShi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "AfterCardMoved" /* AfterCardMoved */ ||
            stage === "AfterHpChange" /* AfterHpChange */ ||
            event_packer_1.EventPacker.getIdentifier(event) === 136 /* ChangeMaxHpEvent */);
    }
    canUse(room, owner, content) {
        if (owner.getCardIds(0 /* HandArea */).length >= owner.LostHp) {
            return false;
        }
        const unknownEvent = event_packer_1.EventPacker.getIdentifier(content);
        if (unknownEvent === 128 /* MoveCardEvent */) {
            const event = content;
            return (event.infos.find(info => info.fromId === owner.Id &&
                info.movingCards.find(card => card.fromArea === 0 /* HandArea */) !== undefined) !== undefined);
        }
        else if (unknownEvent === 139 /* HpChangeEvent */) {
            const event = content;
            return event.toId === owner.Id;
        }
        else if (unknownEvent === 136 /* ChangeMaxHpEvent */) {
            const event = content;
            return event.toId === owner.Id;
        }
        return false;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s)?', this.Name, owner.LostHp - owner.getCardIds(0 /* HandArea */).length).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const x = from.LostHp - from.getCardIds(0 /* HandArea */).length;
        await room.drawCards(x, fromId, 'top', fromId, this.Name);
        return true;
    }
};
ShangShi = tslib_1.__decorate([
    skill_wrappers_1.AI(shangshi_1.ShangShiSkillTrigger),
    skill_wrappers_1.CommonSkill({ name: 'shangshi', description: 'shangshi_description' })
], ShangShi);
exports.ShangShi = ShangShi;
