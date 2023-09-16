"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaoYuan = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const zhengjian_1 = require("./zhengjian");
let GaoYuan = class GaoYuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "OnAimmed" /* OnAimmed */;
    }
    canUse(room, owner, content) {
        const canUse = content.toId === owner.Id &&
            engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' &&
            owner.getPlayerCards().length > 0;
        if (canUse) {
            const availableTargets = room.AlivePlayers.filter(player => content.fromId !== player.Id &&
                player.getFlag(zhengjian_1.ZhengJian.Name) !== undefined &&
                !aim_group_1.AimGroupUtil.getAllTargets(content.allTargets).includes(player.Id));
            if (availableTargets.length < 1) {
                return false;
            }
            room.setFlag(owner.Id, this.Name, availableTargets.map(player => player.Id));
        }
        return canUse;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.getFlag(owner, this.Name) && room.getFlag(owner, this.Name).includes(target);
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard a card to transfer the target of slash?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds || !event.toIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        const aimEvent = event.triggeredOnEvent;
        aim_group_1.AimGroupUtil.cancelTarget(aimEvent, event.fromId);
        aim_group_1.AimGroupUtil.addTargets(room, aimEvent, event.toIds);
        return true;
    }
};
GaoYuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'gaoyuan', description: 'gaoyuan_description' })
], GaoYuan);
exports.GaoYuan = GaoYuan;
