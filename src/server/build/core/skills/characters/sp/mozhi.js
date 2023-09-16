"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoZhi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MoZhi = class MoZhi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 19 /* FinishStageStart */;
    }
    canUse(room, owner, content) {
        if (content.playerId !== owner.Id ||
            (owner.getCardIds(0 /* HandArea */).length === 0 &&
                room.GameParticularAreas.find(name => owner.getCardIds(3 /* OutsideArea */, name).length > 0) ===
                    undefined)) {
            return false;
        }
        const records = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */ &&
            event.fromId === owner.Id &&
            (engine_1.Sanguosha.getCardById(event.cardId).is(0 /* Basic */) || engine_1.Sanguosha.getCardById(event.cardId).isCommonTrick()), owner.Id, 'round', [4 /* PlayCardStage */], 2);
        if (records.length > 0 &&
            owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: [engine_1.Sanguosha.getCardById(records[0].cardId).Name] }), new card_matcher_1.CardMatcher({ name: [engine_1.Sanguosha.getCardById(records[0].cardId).Name] })) &&
            !(engine_1.Sanguosha.getCardById(records[0].cardId).Skill instanceof skill_1.ResponsiveSkill)) {
            room.setFlag(owner.Id, this.Name, records.map(event => engine_1.Sanguosha.getCardById(event.cardId).Name));
            return true;
        }
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        const ownerPlayer = room.getPlayerById(owner);
        const outsideName = ownerPlayer.getOutsideAreaNameOf(cardId);
        return ((ownerPlayer.cardFrom(cardId) === 0 /* HandArea */ ||
            (outsideName !== undefined && room.GameParticularAreas.includes(outsideName))) &&
            ownerPlayer.canUseCard(room, card_1.VirtualCard.create({ cardName: room.getFlag(owner, this.Name)[0], bySkill: this.Name }, [cardId]).Id));
    }
    targetFilter(room, owner, targets, selectedCards) {
        const virtualCard = card_1.VirtualCard.create({ cardName: room.getFlag(owner.Id, this.Name)[0], bySkill: this.Name }, [selectedCards[0]]);
        return (!(virtualCard.Skill instanceof skill_1.ResponsiveSkill) &&
            virtualCard.Skill.targetFilter(room, owner, targets, selectedCards));
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        if (selectedCards.length === 0) {
            return false;
        }
        const virtualCard = card_1.VirtualCard.create({ cardName: room.getFlag(owner, this.Name)[0], bySkill: this.Name }, [selectedCards[0]]);
        return virtualCard.Skill.isAvailableTarget(owner, room, target, selectedCards, selectedTargets, virtualCard.Id);
    }
    availableCardAreas() {
        return [0 /* HandArea */, 3 /* OutsideArea */];
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to a hand card as {1} ?', this.Name, room.getFlag(owner.Id, this.Name)[0]).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        const mozhiCards = room.getFlag(event.fromId, this.Name);
        await room.useCard({
            fromId: event.fromId,
            targetGroup: event.toIds.length > 0 ? [event.toIds] : undefined,
            cardId: card_1.VirtualCard.create({ cardName: mozhiCards[0], bySkill: this.Name }, event.cardIds).Id,
        });
        if (mozhiCards.length > 1 &&
            room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */).length > 0 &&
            room
                .getPlayerById(event.fromId)
                .canUseCard(room, new card_matcher_1.CardMatcher({ name: [mozhiCards[1]] }), new card_matcher_1.CardMatcher({ name: [mozhiCards[1]] })) &&
            !(engine_1.Sanguosha.getCardByName(mozhiCards[1]).Skill instanceof skill_1.ResponsiveSkill)) {
            mozhiCards.shift();
            room.setFlag(event.fromId, this.Name, mozhiCards);
            room.notify(171 /* AskForSkillUseEvent */, {
                invokeSkillNames: [this.Name],
                toId: event.fromId,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to a hand card as {1} ?', this.Name, room.getFlag(event.fromId, this.Name)[0]).extract(),
            }, event.fromId);
            const response = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, event.fromId);
            if (response.cardIds && response.toIds) {
                await room.useCard({
                    fromId: event.fromId,
                    targetGroup: response.toIds.length > 0 ? [response.toIds] : undefined,
                    cardId: card_1.VirtualCard.create({ cardName: room.getFlag(event.fromId, this.Name)[0], bySkill: this.Name }, response.cardIds).Id,
                });
            }
        }
        return true;
    }
};
MoZhi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'mozhi', description: 'mozhi_description' })
], MoZhi);
exports.MoZhi = MoZhi;
