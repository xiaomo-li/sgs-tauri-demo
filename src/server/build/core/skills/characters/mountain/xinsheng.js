"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XinSheng = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const huashen_1 = require("./huashen");
let XinSheng = class XinSheng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, event) {
        return event.toId === owner.Id;
    }
    triggerableTimes(event) {
        return event.damage;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const player = room.getPlayerById(skillEffectEvent.fromId);
        const huashenCards = player.getCardIds(3 /* OutsideArea */, huashen_1.HuaShen.GeneralName);
        const huashen = room.getRandomCharactersFromLoadedPackage(1, huashenCards);
        if (huashen.length === 0) {
            return false;
        }
        room.setCharacterOutsideAreaCards(skillEffectEvent.fromId, huashen_1.HuaShen.GeneralName, [...huashenCards, ...huashen], translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} obtained character cards {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), translation_json_tool_1.TranslationPack.wrapArrayParams(...huashen.map(characterId => engine_1.Sanguosha.getCharacterById(characterId).Name))).extract(), translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} swapped {1} character cards', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(player), huashen.length).extract());
        return true;
    }
};
XinSheng = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xinsheng', description: 'xinsheng_description' })
], XinSheng);
exports.XinSheng = XinSheng;
