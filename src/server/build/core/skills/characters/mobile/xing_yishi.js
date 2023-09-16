"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiShi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YiShi = class YiShi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */;
    }
    canUse(room, owner, event) {
        return event.fromId === owner.Id && event.toId !== owner.Id;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to prevent the damage to {1} to prey a card from his/her equip area?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const damageEffect = event.triggeredOnEvent;
        damageEffect.damage -= 1;
        damageEffect.damage < 1 && event_packer_1.EventPacker.terminate(damageEffect);
        const toId = damageEffect.toId;
        const to = room.getPlayerById(toId);
        if (to.getCardIds(1 /* EquipArea */).length > 0) {
            const options = {
                [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            };
            const chooseCardEvent = {
                fromId,
                toId,
                options,
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, false, true);
            if (!response) {
                return false;
            }
            await room.moveCards({
                movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
                fromId: chooseCardEvent.toId,
                toId: chooseCardEvent.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: chooseCardEvent.fromId,
                movedByReason: this.Name,
            });
        }
        return true;
    }
};
YiShi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xing_yishi', description: 'xing_yishi_description' })
], YiShi);
exports.YiShi = YiShi;
