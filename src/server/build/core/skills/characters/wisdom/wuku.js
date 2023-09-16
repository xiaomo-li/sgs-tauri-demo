"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuKu = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WuKu = class WuKu extends skill_1.TriggerSkill {
    async whenLosingSkill(room, owner) {
        room.removeFlag(owner.Id, this.Name);
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        const wuku = owner.getFlag(this.Name) || 0;
        return engine_1.Sanguosha.getCardById(content.cardId).is(1 /* Equip */) && wuku < 3;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const wuku = room.getFlag(event.fromId, this.Name) || 0;
        room.setFlag(event.fromId, this.Name, wuku + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('wuku: {0}', wuku + 1).toString());
        return true;
    }
};
WuKu = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'wuku', description: 'wuku_description' })
], WuKu);
exports.WuKu = WuKu;
