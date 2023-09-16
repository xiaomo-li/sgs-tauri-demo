"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YangZhong = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YangZhong = class YangZhong extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */ || stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, event, stage) {
        return ((stage === "AfterDamageEffect" /* AfterDamageEffect */ &&
            event.fromId === owner.Id &&
            !room.getPlayerById(event.toId).Dead) ||
            (stage === "AfterDamagedEffect" /* AfterDamagedEffect */ &&
                event.toId === owner.Id &&
                event.fromId !== undefined &&
                !room.getPlayerById(event.fromId).Dead));
    }
    async beforeUse(room, event) {
        const source = event.triggeredOnEvent.fromId;
        if (room.getPlayerById(source).getPlayerCards().length > 1) {
            const response = await room.askForCardDrop(source, 2, [0 /* HandArea */, 1 /* EquipArea */], false, undefined, this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard 2 cards to let {1} lose 1 hp?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.triggeredOnEvent.toId))).extract());
            if (response.droppedCards.length > 1) {
                event.cardIds = response.droppedCards;
                return true;
            }
        }
        return false;
    }
    async onTrigger(room, event) {
        const damageEvent = event.triggeredOnEvent;
        event.animation = [{ from: damageEvent.fromId, tos: [damageEvent.toId] }];
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        const damageEvent = event.triggeredOnEvent;
        await room.dropCards(4 /* SelfDrop */, event.cardIds, damageEvent.fromId, damageEvent.fromId, this.Name);
        await room.loseHp(damageEvent.toId, 1);
        return true;
    }
};
YangZhong = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yangzhong', description: 'yangzhong_description' })
], YangZhong);
exports.YangZhong = YangZhong;
