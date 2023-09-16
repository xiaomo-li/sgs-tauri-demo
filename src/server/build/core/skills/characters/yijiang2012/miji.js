"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiJiShadow = exports.MiJi = void 0;
const tslib_1 = require("tslib");
const miji_1 = require("core/ai/skills/characters/yijiang2012/miji");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MiJi = class MiJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && content.toStage === 19 /* FinishStageStart */ && owner.LostHp > 0;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s)?', this.Name, owner.LostHp).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const x = from.LostHp;
        await room.drawCards(x, fromId, 'top', fromId, this.Name);
        if (from.getCardIds(0 /* HandArea */).length >= x) {
            room.setFlag(fromId, this.Name, x);
            const skillUseEvent = {
                invokeSkillNames: [MiJiShadow.Name],
                toId: fromId,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to give another player {1} hand card(s)?', this.Name, x).extract(),
            };
            room.notify(171 /* AskForSkillUseEvent */, skillUseEvent, fromId);
            const { toIds, cardIds } = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, fromId);
            room.removeFlag(fromId, this.Name);
            if (toIds && cardIds) {
                await room.moveCards({
                    movingCards: cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                    fromId,
                    toId: toIds[0],
                    moveReason: 1 /* ActivePrey */,
                    toArea: 0 /* HandArea */,
                    proposer: fromId,
                    movedByReason: this.Name,
                });
            }
        }
        return true;
    }
};
MiJi = tslib_1.__decorate([
    skill_1.AI(miji_1.MiJiSkillTrigger),
    skill_1.CommonSkill({ name: 'miji', description: 'miji_description' })
], MiJi);
exports.MiJi = MiJi;
let MiJiShadow = class MiJiShadow extends skill_1.TriggerSkill {
    isTriggerable() {
        return false;
    }
    canUse() {
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length === owner.getFlag(this.GeneralName);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableCard(owner, room, cardId, selectedCards) {
        const player = room.getPlayerById(owner);
        return selectedCards.length <= player.getFlag(this.GeneralName);
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    async onTrigger() {
        return true;
    }
    async onEffect() {
        return true;
    }
};
MiJiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: MiJi.Name, description: MiJi.Description })
], MiJiShadow);
exports.MiJiShadow = MiJiShadow;
