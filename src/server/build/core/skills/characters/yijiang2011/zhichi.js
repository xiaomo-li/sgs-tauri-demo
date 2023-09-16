"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiChiShadow = exports.ZhiChi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhiChi = class ZhiChi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.toId && room.CurrentPlayer !== owner && room.getFlag(owner.Id, this.Name) !== true);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        room.setFlag(skillUseEvent.fromId, this.Name, true, this.Name);
        return true;
    }
};
ZhiChi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zhichi', description: 'zhichi_description' })
], ZhiChi);
exports.ZhiChi = ZhiChi;
let ZhiChiShadow = class ZhiChiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "PreCardEffect" /* PreCardEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        let canTrigger = false;
        if (event_packer_1.EventPacker.getIdentifier(content) === 125 /* CardEffectEvent */) {
            const cardEffectEvent = content;
            const card = engine_1.Sanguosha.getCardById(cardEffectEvent.cardId);
            canTrigger =
                cardEffectEvent.toIds !== undefined &&
                    cardEffectEvent.toIds.includes(owner.Id) &&
                    (card.GeneralName === 'slash' || (card.is(7 /* Trick */) && !card.is(8 /* DelayedTrick */)));
        }
        else if (event_packer_1.EventPacker.getIdentifier(content) === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            canTrigger = phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return canTrigger && room.getFlag(owner.Id, this.GeneralName) === true;
    }
    async onTrigger(room, content) {
        const unknownEvent = content.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 125 /* CardEffectEvent */) {
            const cardEffectEvent = unknownEvent;
            content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, nullify {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.GeneralName, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardEffectEvent.cardId)).extract();
        }
        return true;
    }
    async onEffect(room, event) {
        var _a;
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 125 /* CardEffectEvent */) {
            const cardEffectEvent = unknownEvent;
            (_a = cardEffectEvent.nullifiedTargets) === null || _a === void 0 ? void 0 : _a.push(event.fromId);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
ZhiChiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: ZhiChi.Name, description: ZhiChi.Description })
], ZhiChiShadow);
exports.ZhiChiShadow = ZhiChiShadow;
