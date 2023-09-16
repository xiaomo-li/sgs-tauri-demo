"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuangTianGiveCard = exports.HuangTian = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_2 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HuangTian = class HuangTian extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    async whenLosingSkill(room) {
        room.uninstallSideEffectSkill(1 /* HuangTian */);
    }
    async whenObtainingSkill(room, owner) {
        room.installSideEffectSkill(1 /* HuangTian */, HuangTianGiveCard.Name, owner.Id);
    }
    isTriggerable(event, stage) {
        return stage === "BeforeGameStart" /* BeforeGameStart */;
    }
    canUse(room, owner, content) {
        return true;
    }
    async onTrigger(room, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, event) {
        room.installSideEffectSkill(1 /* HuangTian */, HuangTianGiveCard.Name, event.fromId);
        return true;
    }
};
HuangTian = tslib_1.__decorate([
    skill_2.LordSkill,
    skill_2.CommonSkill({ name: 'huangtian', description: 'huangtian_description' })
], HuangTian);
exports.HuangTian = HuangTian;
let HuangTianGiveCard = class HuangTianGiveCard extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card.GeneralName === 'jink' || card.GeneralName === 'lightning';
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return room.getPlayerById(target).hasSkill(HuangTian.GeneralName) && target !== owner;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: 0 /* HandArea */ }],
            fromId,
            toId: toIds[0],
            moveReason: 2 /* ActiveMove */,
            toArea: 0 /* HandArea */,
            proposer: fromId,
            movedByReason: this.GeneralName,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} obtains cards {1} from {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toIds[0])), translation_json_tool_1.TranslationPack.patchCardInTranslation(...cardIds), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
        });
        return true;
    }
};
HuangTianGiveCard = tslib_1.__decorate([
    skill_2.SideEffectSkill,
    skill_2.CommonSkill({ name: HuangTian.GeneralName, description: HuangTian.Description })
], HuangTianGiveCard);
exports.HuangTianGiveCard = HuangTianGiveCard;
