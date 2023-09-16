"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YaoWu = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YaoWu = class YaoWu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        const { fromId, toId, cardIds } = content;
        if (cardIds === undefined) {
            return false;
        }
        const card = engine_1.Sanguosha.getCardById(cardIds[0]);
        if (card.isRed() && (!fromId || room.getPlayerById(fromId).Dead)) {
            return false;
        }
        return owner.Id === toId;
    }
    async onTrigger(room, content) {
        content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const { fromId, cardIds } = triggeredOnEvent;
        if (engine_1.Sanguosha.getCardById(cardIds[0]).isRed()) {
            await room.drawCards(1, fromId, 'top', undefined, this.Name);
        }
        else {
            await room.drawCards(1, skillUseEvent.fromId, 'top', undefined, this.Name);
        }
        return true;
    }
};
YaoWu = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'yaowu', description: 'yaowu_description' })
], YaoWu);
exports.YaoWu = YaoWu;
