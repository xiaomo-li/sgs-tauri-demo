"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WanWeiShadow = exports.WanWei = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WanWei = class WanWei extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard(owner, room, cardId, selectedCards) {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const hp = room.getPlayerById(fromId).Hp;
        await room.recover({
            toId: toIds[0],
            recoveredHp: hp + 1,
            recoverBy: fromId,
        });
        await room.loseHp(fromId, hp);
        return true;
    }
};
WanWei = tslib_1.__decorate([
    skill_1.CircleSkill,
    skill_1.CommonSkill({ name: 'wanwei', description: 'wanwei_description' })
], WanWei);
exports.WanWei = WanWei;
let WanWeiShadow = class WanWeiShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, content) {
        return (content.dying !== owner.Id && !owner.hasUsedSkill(this.GeneralName) && room.getPlayerById(content.dying).Hp <= 0);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} recover {2} hp, then you lose {3} hp?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.dying)), owner.Hp + 1, owner.Hp).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const dyingEvent = triggeredOnEvent;
        const hp = room.getPlayerById(fromId).Hp;
        await room.recover({
            toId: dyingEvent.dying,
            recoveredHp: hp + 1,
            recoverBy: fromId,
        });
        await room.loseHp(fromId, hp);
        return true;
    }
};
WanWeiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CircleSkill,
    skill_1.CommonSkill({ name: WanWei.Name, description: WanWei.Description })
], WanWeiShadow);
exports.WanWeiShadow = WanWeiShadow;
