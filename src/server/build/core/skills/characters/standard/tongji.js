"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TongJi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TongJi = class TongJi extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return (stage === "OnAimmed" /* OnAimmed */ &&
            event.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash');
    }
    canUse(room, owner, event) {
        const to = room.getPlayerById(event.toId);
        return (event.toId !== owner.Id &&
            event.fromId !== owner.Id &&
            room.withinAttackDistance(to, owner) &&
            !aim_group_1.AimGroupUtil.getAllTargets(event.allTargets).includes(owner.Id));
    }
    async beforeUse(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const aimEvent = triggeredOnEvent;
        if (!room
            .getPlayerById(aimEvent.toId)
            .getPlayerCards()
            .find(id => room.canDropCard(aimEvent.toId, id))) {
            return false;
        }
        const response = await room.askForCardDrop(aimEvent.toId, 1, [0 /* HandArea */, 1 /* EquipArea */], false, undefined, this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard 1 card to transfer the target of {1} to {2}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract());
        if (response.droppedCards.length > 0) {
            event.cardIds = response.droppedCards;
            return true;
        }
        return false;
    }
    async onTrigger(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const aimEvent = triggeredOnEvent;
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, transfer the target of {1} to {2}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract();
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent, cardIds, fromId } = event;
        const aimEvent = triggeredOnEvent;
        await room.dropCards(4 /* SelfDrop */, cardIds, aimEvent.toId, aimEvent.toId, this.Name);
        aim_group_1.AimGroupUtil.cancelTarget(aimEvent, aimEvent.toId);
        aim_group_1.AimGroupUtil.addTargets(room, aimEvent, fromId);
        event_packer_1.EventPacker.terminate(aimEvent);
        return true;
    }
};
TongJi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'tongji', description: 'tongji_description' })
], TongJi);
exports.TongJi = TongJi;
