"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenXin = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let RenXin = class RenXin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id !== content.toId && room.getPlayerById(content.toId).Hp === 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).BaseType === 1 /* Equip */ && room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner, content) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('do you want to trigger skill {0} to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.toId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, cardIds, triggeredOnEvent } = skillUseEvent;
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        await room.turnOver(fromId);
        const damageEvent = triggeredOnEvent;
        event_packer_1.EventPacker.terminate(damageEvent);
        return true;
    }
};
RenXin = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'renxin', description: 'renxin_description' })
], RenXin);
exports.RenXin = RenXin;
