"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiDao = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const algorithm_1 = require("core/shares/libs/algorithm");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let SiDao = class SiDao extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 4 /* PlayCardStage */;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        if (!(content.fromId === owner.Id &&
            room.CurrentPhasePlayer === owner &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            !owner.hasUsedSkill(this.Name))) {
            return false;
        }
        const record = room.Analytics.getCardUseRecord(owner.Id, 'phase');
        if (record.length < 2) {
            return false;
        }
        const targets = algorithm_1.Algorithm.intersection(target_group_1.TargetGroupUtil.getRealTargets(record[record.length - 1].targetGroup), target_group_1.TargetGroupUtil.getRealTargets(record[record.length - 2].targetGroup));
        const index = targets.findIndex(target => target === owner.Id);
        index !== -1 && targets.splice(index, 1);
        if (targets.length > 0) {
            room.setFlag(owner.Id, this.Name, targets);
            return true;
        }
        else {
            return false;
        }
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room
            .getPlayerById(owner)
            .canUseCard(room, card_1.VirtualCard.create({ cardName: 'shunshouqianyang', bySkill: this.Name }, [cardId]).Id);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target, selectedCards) {
        var _a;
        if (selectedCards.length === 0 || !((_a = room.getFlag(owner, this.Name)) === null || _a === void 0 ? void 0 : _a.includes(target))) {
            return false;
        }
        const virtualCard = card_1.VirtualCard.create({ cardName: 'shunshouqianyang', bySkill: this.Name }, [selectedCards[0]]);
        return virtualCard.Skill.isAvailableTarget(owner, room, target, selectedCards, [target], virtualCard.Id);
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use a card as ShunShouQianYang to one of them?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        await room.useCard({
            fromId: event.fromId,
            targetGroup: [event.toIds],
            cardId: card_1.VirtualCard.create({ cardName: 'shunshouqianyang', bySkill: this.Name }, event.cardIds).Id,
        });
        return true;
    }
};
SiDao = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'sidao', description: 'sidao_description' })
], SiDao);
exports.SiDao = SiDao;
