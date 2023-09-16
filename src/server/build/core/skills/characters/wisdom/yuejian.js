"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YueJianShadow = exports.YueJian = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YueJian = class YueJian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, content) {
        return (content.dying === owner.Id && room.getPlayerById(content.dying).Hp <= 0 && owner.getPlayerCards().length >= 2);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 2;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to drop 2 cards to recover 1 hp?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        await room.recover({
            toId: fromId,
            recoveredHp: 1,
            recoverBy: fromId,
        });
        return true;
    }
};
YueJian = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'yuejian', description: 'yuejian_description' })
], YueJian);
exports.YueJian = YueJian;
let YueJianShadow = class YueJianShadow extends skill_1.RulesBreakerSkill {
    breakBaseCardHoldNumber(room, owner) {
        return owner.MaxHp;
    }
};
YueJianShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: YueJian.Name, description: YueJian.Description })
], YueJianShadow);
exports.YueJianShadow = YueJianShadow;
