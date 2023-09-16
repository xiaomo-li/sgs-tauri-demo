"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhenLie = void 0;
const tslib_1 = require("tslib");
const zhenlie_1 = require("core/ai/skills/characters/yijiang2012/zhenlie");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhenLie = class ZhenLie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        if (!event.byCardId) {
            return false;
        }
        const card = engine_1.Sanguosha.getCardById(event.byCardId);
        return (stage === "AfterAimmed" /* AfterAimmed */ &&
            (card.GeneralName === 'slash' || (card.is(7 /* Trick */) && !card.is(8 /* DelayedTrick */))));
    }
    canUse(room, owner, event) {
        return event.toId === owner.Id && event.fromId !== owner.Id && owner.Hp > 0;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to lose 1 hp to nullify {1}, then drop a card from {2}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.byCardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const aimEvent = triggeredOnEvent;
        await room.loseHp(fromId, 1);
        aimEvent.nullifiedTargets.push(fromId);
        if (aimEvent.fromId) {
            const user = room.getPlayerById(aimEvent.fromId);
            if (user.getPlayerCards().length < 1 || room.getPlayerById(fromId).Dead) {
                return false;
            }
            const options = {
                [1 /* EquipArea */]: user.getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: user.getCardIds(0 /* HandArea */).length,
            };
            const chooseCardEvent = {
                fromId,
                toId: aimEvent.fromId,
                options,
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
            if (!response) {
                return false;
            }
            await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], chooseCardEvent.toId, fromId, this.Name);
        }
        return true;
    }
};
ZhenLie = tslib_1.__decorate([
    skill_1.AI(zhenlie_1.ZhenLieSkillTrigger),
    skill_1.CommonSkill({ name: 'zhenlie', description: 'zhenlie_description' })
], ZhenLie);
exports.ZhenLie = ZhenLie;
