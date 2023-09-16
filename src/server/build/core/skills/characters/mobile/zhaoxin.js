"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhaoXinShadow = exports.ZhaoXin = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhaoXin = class ZhaoXin extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return (!owner.hasUsedSkill(this.Name) &&
            owner.getCardIds(3 /* OutsideArea */, this.Name).length < 3 &&
            owner.getPlayerCards().length > 0);
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0 && cards.length <= 3 - owner.getCardIds(3 /* OutsideArea */, this.Name).length;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: cardIds.map(card => ({ card, fromArea: room.getPlayerById(fromId).cardFrom(card) })),
            fromId,
            toId: fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            isOutsideAreaInPublic: true,
            toOutsideArea: this.Name,
            triggeredBySkills: [this.Name],
        });
        await room.drawCards(cardIds.length, fromId, 'top', fromId, this.Name);
        return true;
    }
};
ZhaoXin = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhaoxin', description: 'zhaoxin_description' })
], ZhaoXin);
exports.ZhaoXin = ZhaoXin;
let ZhaoXinShadow = class ZhaoXinShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 12 /* DrawCardStageEnd */;
    }
    canUse(room, owner, event) {
        return (owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length > 0 &&
            (event.playerId === owner.Id || room.withinAttackDistance(owner, room.getPlayerById(event.playerId))));
    }
    async beforeUse(room, event) {
        const playerId = event.triggeredOnEvent.playerId;
        const response = await room.doAskForCommonly(165 /* AskForChoosingCardEvent */, {
            toId: playerId,
            cardIds: room.getPlayerById(event.fromId).getCardIds(3 /* OutsideArea */, this.GeneralName),
            amount: 1,
            customTitle: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you can choose a card to gain. If you do this, {1} can deal 1 damage to you', this.GeneralName, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).toString(),
            triggeredBySkills: [this.GeneralName],
        }, playerId);
        if (response.selectedCards && response.selectedCards.length > 0) {
            event.cardIds = response.selectedCards;
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        const playerId = event.triggeredOnEvent.playerId;
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: 3 /* OutsideArea */ }],
            fromId: event.fromId,
            toId: playerId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: playerId,
            triggeredBySkills: [this.GeneralName],
        });
        const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            toId: event.fromId,
            options: ['yes', 'no'],
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to deal 1 damage to {1} ?', this.GeneralName, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(playerId))).extract(),
        }, event.fromId, true);
        if (selectedOption === 'yes') {
            await room.damage({
                fromId: event.fromId,
                toId: playerId,
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.GeneralName],
            });
        }
        return true;
    }
};
ZhaoXinShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: ZhaoXin.Name, description: ZhaoXin.Description })
], ZhaoXinShadow);
exports.ZhaoXinShadow = ZhaoXinShadow;
