"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiJingSelect = exports.JiJing = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiJing = class JiJing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const judge = await room.judge(fromId, undefined, this.Name);
        const cardNumber = engine_1.Sanguosha.getCardById(judge.judgeCardId).CardNumber;
        const skillUseEvent = {
            invokeSkillNames: [JiJingSelect.Name],
            toId: fromId,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to drop cards with sum of {1} Card Number to recover 1 hp?', this.Name, cardNumber).extract(),
        };
        room.setFlag(fromId, this.Name, cardNumber);
        room.notify(171 /* AskForSkillUseEvent */, skillUseEvent, fromId);
        const { cardIds } = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, fromId);
        if (cardIds) {
            await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
            await room.recover({
                toId: fromId,
                recoveredHp: 1,
                recoverBy: fromId,
            });
        }
        room.removeFlag(fromId, this.Name);
        return true;
    }
};
JiJing = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jijing', description: 'jijing_description' })
], JiJing);
exports.JiJing = JiJing;
let JiJingSelect = class JiJingSelect extends skill_1.TriggerSkill {
    get Muted() {
        return true;
    }
    isTriggerable() {
        return false;
    }
    canUse() {
        return false;
    }
    cardFilter(room, owner, cards) {
        return (cards.length > 0 &&
            cards.reduce((sum, id) => (sum += engine_1.Sanguosha.getCardById(id).CardNumber), 0) ===
                room.getFlag(owner.Id, JiJing.Name));
    }
    isAvailableCard(owner, room, cardId, selectedCards) {
        const cardNumber = room.getFlag(owner, JiJing.Name);
        if (!room.canDropCard(owner, cardId)) {
            return false;
        }
        if (selectedCards.length > 0) {
            return (engine_1.Sanguosha.getCardById(cardId).CardNumber <=
                cardNumber - selectedCards.reduce((sum, id) => (sum += engine_1.Sanguosha.getCardById(id).CardNumber), 0));
        }
        return engine_1.Sanguosha.getCardById(cardId).CardNumber <= cardNumber;
    }
    async onTrigger() {
        return true;
    }
    async onEffect() {
        return true;
    }
};
JiJingSelect = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: 'shadow_jijing', description: 'shadow_jijing_description' })
], JiJingSelect);
exports.JiJingSelect = JiJingSelect;
