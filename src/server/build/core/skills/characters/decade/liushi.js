"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuShiShadow = exports.LiuShi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LiuShi = class LiuShi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.getPlayerCards().length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return (target !== owner &&
            room.getPlayerById(owner).canUseCardTo(room, new card_matcher_1.CardMatcher({ name: ['slash'] }), target, true));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).Suit === 2 /* Heart */;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: room.getPlayerById(event.fromId).cardFrom(event.cardIds[0]) }],
            fromId: event.fromId,
            toArea: 5 /* DrawStack */,
            moveReason: 7 /* PlaceToDrawStack */,
            proposer: event.fromId,
            triggeredBySkills: [this.Name],
        });
        await room.useCard({
            fromId: event.fromId,
            targetGroup: [event.toIds],
            cardId: card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.Name }).Id,
            extraUse: true,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
LiuShi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'liushi', description: 'liushi_description' })
], LiuShi);
exports.LiuShi = LiuShi;
let LiuShiShadow = class LiuShiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, event) {
        return (!event.isFromChainedDamage &&
            event.cardIds !== undefined &&
            engine_1.Sanguosha.isVirtualCardId(event.cardIds[0]) &&
            engine_1.Sanguosha.getCardById(event.cardIds[0]).findByGeneratedSkill(this.GeneralName));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.syncGameCommonRules(event.triggeredOnEvent.toId, user => {
            room.CommonRules.addAdditionalHoldCardNumber(user, -1);
            const liushiNum = room.getFlag(user.Id, this.GeneralName) || 0;
            room.setFlag(user.Id, this.GeneralName, liushiNum + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('liushi: {0}', liushiNum + 1).toString());
        });
        return true;
    }
};
LiuShiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: LiuShi.Name, description: LiuShi.Description })
], LiuShiShadow);
exports.LiuShiShadow = LiuShiShadow;
