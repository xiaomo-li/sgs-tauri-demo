"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiTiShadow = exports.ZhiTi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhiTi = class ZhiTi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "AfterDamageEffect" /* AfterDamageEffect */ ||
            stage === "AfterDamagedEffect" /* AfterDamagedEffect */ ||
            stage === "PinDianConfirmed" /* PinDianResultConfirmed */);
    }
    canUse(room, owner, content, stage) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (owner.DisabledEquipSections.length === 0) {
            return false;
        }
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            const toId = stage === "AfterDamageEffect" /* AfterDamageEffect */ ? damageEvent.toId : damageEvent.fromId;
            if (!toId) {
                return false;
            }
            const to = room.getPlayerById(toId);
            return (((damageEvent.fromId === owner.Id &&
                damageEvent.cardIds &&
                engine_1.Sanguosha.getCardById(damageEvent.cardIds[0]).GeneralName === 'duel') ||
                damageEvent.toId === owner.Id) &&
                !to.Dead &&
                room.withinAttackDistance(owner, to) &&
                to.LostHp > 0);
        }
        else if (identifier === 134 /* PinDianEvent */) {
            const pindianEvent = content;
            const currentProcedureIndex = pindianEvent.procedures.length - 1;
            const currentProcedure = pindianEvent.procedures[currentProcedureIndex];
            let toId = owner.Id;
            if (pindianEvent.fromId === owner.Id) {
                toId = currentProcedure.toId;
            }
            else if (currentProcedure.toId === owner.Id) {
                toId = pindianEvent.fromId;
            }
            if (toId !== owner.Id) {
                const to = room.getPlayerById(toId);
                return (to &&
                    !to.Dead &&
                    room.withinAttackDistance(owner, to) &&
                    to.LostHp > 0 &&
                    currentProcedure.winner === owner.Id);
            }
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const resp = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent({
            options: room.getPlayerById(fromId).DisabledEquipSections,
            toId: fromId,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose and resume an equip section', this.Name).extract(),
            triggeredBySkills: [this.Name],
        }), fromId);
        resp.selectedOption = resp.selectedOption || room.getPlayerById(fromId).DisabledEquipSections[0];
        await room.resumePlayerEquipSections(fromId, resp.selectedOption);
        return true;
    }
};
ZhiTi = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'zhiti', description: 'zhiti_description' })
], ZhiTi);
exports.ZhiTi = ZhiTi;
let ZhiTiShadow = class ZhiTiShadow extends skill_1.GlobalRulesBreakerSkill {
    breakAdditionalCardHold(room, owner, target) {
        return room.withinAttackDistance(owner, target) && target.LostHp > 0 ? -1 : 0;
    }
};
ZhiTiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: ZhiTi.Name, description: ZhiTi.Description })
], ZhiTiShadow);
exports.ZhiTiShadow = ZhiTiShadow;
