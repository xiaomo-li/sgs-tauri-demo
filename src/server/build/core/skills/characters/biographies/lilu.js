"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiLuSelect = exports.LiLu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LiLu = class LiLu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforeDrawCardEffect" /* BeforeDrawCardEffect */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */ &&
            content.drawAmount > 0);
    }
    getSkillLog(room, owner) {
        const n = Math.min(owner.MaxHp, 5) - owner.getCardIds(0 /* HandArea */).length;
        return n > 0
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s) instead of drawing cards by rule?', this.Name, n).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to give up to draw cards by rule?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, triggeredOnEvent } = skillUseEvent;
        const drawCardEvent = triggeredOnEvent;
        drawCardEvent.drawAmount = 0;
        const from = room.getPlayerById(fromId);
        const n = Math.min(from.MaxHp, 5) - from.getCardIds(0 /* HandArea */).length;
        if (n > 0) {
            await room.drawCards(n, fromId, 'top', fromId, this.Name);
        }
        const hands = from.getCardIds(0 /* HandArea */);
        if (hands.length > 0) {
            const skillUseEvent = event_packer_1.EventPacker.createUncancellableEvent({
                invokeSkillNames: [LiLuSelect.Name],
                toId: fromId,
                conversation: 'lilu: please give a handcard to another player',
            });
            room.notify(171 /* AskForSkillUseEvent */, skillUseEvent, fromId);
            const response = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, fromId);
            const others = room.getOtherPlayers(fromId);
            const cardIds = response.cardIds || [hands[Math.floor(Math.random() * hands.length)]];
            const toIds = response.toIds || [others[Math.floor(Math.random() * others.length)].Id];
            await room.moveCards({
                movingCards: cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                fromId,
                toId: toIds[0],
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: fromId,
            });
            const liluCount = from.getFlag(this.Name);
            if (liluCount !== undefined && cardIds.length > liluCount) {
                await room.changeMaxHp(fromId, 1);
                await room.recover({
                    toId: fromId,
                    recoveredHp: 1,
                    recoverBy: fromId,
                });
            }
            room.setFlag(fromId, this.Name, cardIds.length, translation_json_tool_1.TranslationPack.translationJsonPatcher('lilu count: {0}', cardIds.length).toString());
        }
        return true;
    }
};
LiLu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'lilu', description: 'lilu_description' })
], LiLu);
exports.LiLu = LiLu;
let LiLuSelect = class LiLuSelect extends skill_1.TriggerSkill {
    isTriggerable() {
        return false;
    }
    canUse() {
        return false;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    isAvailableCard() {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onTrigger() {
        return true;
    }
    async onEffect() {
        return true;
    }
};
LiLuSelect = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: 'shadow_lilu', description: 'shadow_lilu_description' })
], LiLuSelect);
exports.LiLuSelect = LiLuSelect;
