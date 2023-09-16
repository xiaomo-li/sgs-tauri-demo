"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeiCheng = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WeiCheng = class WeiCheng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => info.fromId === owner.Id &&
            info.movingCards.find(card => card.fromArea === 0 /* HandArea */) !== undefined &&
            info.toId !== owner.Id &&
            info.toArea === 0 /* HandArea */) !== undefined && owner.getCardIds(0 /* HandArea */).length < owner.Hp);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
WeiCheng = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'weicheng', description: 'weicheng_description' })
], WeiCheng);
exports.WeiCheng = WeiCheng;
