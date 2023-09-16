"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveClassicTianJi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let PveClassicTianJi = class PveClassicTianJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id !== content.playerId &&
            21 /* FinishStageEnd */ === content.toStage &&
            owner.getPlayerCards().length > 0 &&
            room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */, content.playerId, 'round', undefined, 1).length === 0);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you can drop a card to deal 1 thunder damage to current player?', this.Name).extract();
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (event.cardIds !== undefined && event.cardIds.length === 1) {
            await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId);
            const current = room.CurrentPlayer;
            if (!current.Dead) {
                await room.damage({
                    fromId: event.fromId,
                    toId: current.Id,
                    damage: 1,
                    damageType: "thunder_property" /* Thunder */,
                    triggeredBySkills: [this.GeneralName],
                });
            }
        }
        return true;
    }
};
PveClassicTianJi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'pve_classic_tianji', description: 'pve_classic_tianji_description' })
], PveClassicTianJi);
exports.PveClassicTianJi = PveClassicTianJi;
