"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YongLve = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YongLve = class YongLve extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 7 /* JudgeStageStart */;
    }
    canUse(room, owner, content) {
        return (owner.Id !== content.playerId &&
            room.getPlayerById(content.playerId).getCardIds(2 /* JudgeArea */).length > 0);
    }
    getSkillLog(room, owner, content) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to drop a card from {1}’s judge area?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.playerId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const phaseStageChangeEvent = triggeredOnEvent;
        const toId = phaseStageChangeEvent.playerId;
        const from = room.getPlayerById(fromId);
        const to = room.getPlayerById(toId);
        const judgeAreaCards = to.getCardIds(2 /* JudgeArea */);
        const askForChooseCardEvent = event_packer_1.EventPacker.createUncancellableEvent({
            toId: fromId,
            cardIds: judgeAreaCards,
            amount: 1,
            customTitle: 'yonglve: please drop one of these cards',
        });
        const response = await room.doAskForCommonly(165 /* AskForChoosingCardEvent */, askForChooseCardEvent, fromId);
        response.selectedCards = response.selectedCards || [
            judgeAreaCards[Math.floor(Math.random() * judgeAreaCards.length)],
        ];
        await room.dropCards(5 /* PassiveDrop */, response.selectedCards, toId, fromId, this.Name);
        if (room.withinAttackDistance(from, to)) {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        else {
            const slash = card_1.VirtualCard.create({
                cardName: 'slash',
                bySkill: this.Name,
            }).Id;
            if (from.canUseCardTo(room, slash, toId)) {
                await room.useCard({
                    fromId,
                    cardId: slash,
                    targetGroup: [[toId]],
                });
            }
        }
        return true;
    }
};
YongLve = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'yonglve', description: 'yonglve_description' })
], YongLve);
exports.YongLve = YongLve;
