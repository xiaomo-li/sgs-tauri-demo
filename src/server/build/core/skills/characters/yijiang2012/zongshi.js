"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZongShiProhibit = exports.ZongShiNullify = exports.ZongShi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZongShi = class ZongShi extends skill_1.RulesBreakerSkill {
    audioIndex() {
        return 0;
    }
    breakAdditionalCardHoldNumber(room) {
        const nations = room.AlivePlayers.reduce((allNations, player) => {
            if (!allNations.includes(player.Nationality)) {
                allNations.push(player.Nationality);
            }
            return allNations;
        }, []);
        return nations.length;
    }
};
ZongShi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zongshi', description: 'zongshi_description' })
], ZongShi);
exports.ZongShi = ZongShi;
let ZongShiNullify = class ZongShiNullify extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PreCardEffect" /* PreCardEffect */;
    }
    canUse(room, owner, event) {
        return (room.CurrentPlayer !== owner &&
            owner.getCardIds(0 /* HandArea */).length >= owner.getMaxCardHold(room) &&
            event.toIds !== undefined &&
            event.toIds.includes(owner.Id) &&
            engine_1.Sanguosha.getCardById(event.cardId).Color === 2 /* None */);
    }
    async onTrigger(room, content) {
        const cardEffectEvent = content.triggeredOnEvent;
        content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, nullify {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.GeneralName, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardEffectEvent.cardId)).extract();
        return true;
    }
    async onEffect(room, event) {
        var _a;
        const cardEffectEvent = event.triggeredOnEvent;
        (_a = cardEffectEvent.nullifiedTargets) === null || _a === void 0 ? void 0 : _a.push(event.fromId);
        return true;
    }
};
ZongShiNullify = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: ZongShi.Name, description: ZongShi.Description })
], ZongShiNullify);
exports.ZongShiNullify = ZongShiNullify;
let ZongShiProhibit = class ZongShiProhibit extends skill_1.FilterSkill {
    canBeUsedCard(cardId, room, owner, attacker) {
        const ownerPlayer = room.getPlayerById(owner);
        if (room.CurrentPlayer === ownerPlayer ||
            ownerPlayer.getCardIds(0 /* HandArea */).length < ownerPlayer.getMaxCardHold(room)) {
            return true;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return !new card_matcher_1.CardMatcher({ type: [8 /* DelayedTrick */] }).match(cardId);
        }
        else {
            return !engine_1.Sanguosha.getCardById(cardId).is(8 /* DelayedTrick */);
        }
    }
};
ZongShiProhibit = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: ZongShiNullify.Name, description: ZongShiNullify.Description })
], ZongShiProhibit);
exports.ZongShiProhibit = ZongShiProhibit;
