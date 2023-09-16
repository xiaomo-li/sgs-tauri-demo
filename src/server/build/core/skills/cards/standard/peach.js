"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeachSkill = void 0;
const tslib_1 = require("tslib");
const peach_1 = require("core/ai/skills/cards/peach");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let PeachSkill = class PeachSkill extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.Hp < owner.MaxHp;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 0;
    }
    isAvailableCard() {
        return false;
    }
    isCardAvailableTarget(owner, room, target) {
        const player = room.getPlayerById(target);
        return owner !== target && player.Hp < player.MaxHp;
    }
    isAvailableTarget() {
        return false;
    }
    async onUse(room, event) {
        if (!event.targetGroup) {
            event.targetGroup = [[event.fromId]];
        }
        return true;
    }
    async onEffect(room, event) {
        const toId = precondition_1.Precondition.exists(event.toIds, 'Unknown targets in peach')[0];
        const recoverContent = {
            recoverBy: event.fromId,
            toId,
            recoveredHp: 1 + (event.additionalRecoveredHp || 0),
            cardIds: [event.cardId],
            triggeredBySkills: [this.Name],
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} recovers {1} hp', room.getPlayerById(toId).Name, '1').extract(),
        };
        await room.recover(recoverContent);
        return true;
    }
};
PeachSkill = tslib_1.__decorate([
    skill_1.AI(peach_1.PeachSkillTrigger),
    skill_1.CommonSkill({ name: 'peach', description: 'peach_skill_description' }),
    skill_1.SelfTargetSkill
], PeachSkill);
exports.PeachSkill = PeachSkill;
