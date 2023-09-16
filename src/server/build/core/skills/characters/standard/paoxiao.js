"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaoXiaoRemove = exports.PaoXiaoShadow = exports.PaoXiao = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let PaoXiao = class PaoXiao extends skill_1.RulesBreakerSkill {
    get RelatedCharacters() {
        return ['xiahouba', 'guanxingzhangbao'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.slice(1, this.RelatedCharacters.length).includes(characterName)
            ? 1
            : 2;
    }
    breakCardUsableTimes(cardId) {
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ? game_props_1.INFINITE_TRIGGERING_TIMES : 0;
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash' ? game_props_1.INFINITE_TRIGGERING_TIMES : 0;
        }
    }
};
PaoXiao = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'paoxiao', description: 'paoxiao_description' })
], PaoXiao);
exports.PaoXiao = PaoXiao;
let PaoXiaoShadow = class PaoXiaoShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardEffectCancelledOut" /* CardEffectCancelledOut */;
    }
    canUse(room, owner, content) {
        return content.fromId === owner.Id && engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash';
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const baseDamage = room.getFlag(event.fromId, this.GeneralName) || 0;
        room.setFlag(event.fromId, this.GeneralName, baseDamage + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('paoxiao DMG: {0}', baseDamage + 1).toString());
        return true;
    }
};
PaoXiaoShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: PaoXiao.GeneralName, description: PaoXiao.Description })
], PaoXiaoShadow);
exports.PaoXiaoShadow = PaoXiaoShadow;
let PaoXiaoRemove = class PaoXiaoRemove extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        let canTrigger = false;
        if (event_packer_1.EventPacker.getIdentifier(content) === 137 /* DamageEvent */) {
            const damageEvent = content;
            canTrigger =
                damageEvent.fromId !== undefined &&
                    damageEvent.fromId === owner.Id &&
                    damageEvent.cardIds !== undefined &&
                    engine_1.Sanguosha.getCardById(damageEvent.cardIds[0]).GeneralName === 'slash';
        }
        else if (event_packer_1.EventPacker.getIdentifier(content) === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            canTrigger = owner.Id === phaseChangeEvent.fromPlayer && phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return canTrigger && room.getFlag(owner.Id, this.GeneralName) > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = unknownEvent;
            const additionalDamage = room.getFlag(damageEvent.fromId, this.GeneralName);
            if (additionalDamage < 1) {
                return false;
            }
            damageEvent.damage += additionalDamage;
            damageEvent.messages = damageEvent.messages || [];
            damageEvent.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, damage increases to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(damageEvent.fromId)), this.GeneralName, damageEvent.damage).toString());
            room.removeFlag(damageEvent.fromId, this.GeneralName);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = unknownEvent;
            const { fromPlayer } = phaseChangeEvent;
            fromPlayer && room.removeFlag(fromPlayer, this.GeneralName);
        }
        return true;
    }
};
PaoXiaoRemove = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: PaoXiaoShadow.Name, description: PaoXiaoShadow.Description })
], PaoXiaoRemove);
exports.PaoXiaoRemove = PaoXiaoRemove;
