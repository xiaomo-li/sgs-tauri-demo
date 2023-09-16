"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuJian = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JuJian = class JuJian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            19 /* FinishStageStart */ === content.toStage &&
            owner.getPlayerCards().length > 0);
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    isAvailableCard(owner, room, cardId) {
        return !engine_1.Sanguosha.getCardById(cardId).is(0 /* Basic */) && room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to drop a card except basic card and choose a target', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.dropCards(4 /* SelfDrop */, skillUseEvent.cardIds, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
        const toId = skillUseEvent.toIds[0];
        const to = room.getPlayerById(toId);
        const options = ['jujian:draw'];
        if (to.LostHp > 0) {
            options.push('jujian:recover');
        }
        if (to.ChainLocked || !to.isFaceUp()) {
            options.push('jujian:restore');
        }
        const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose', this.Name).extract(),
            toId,
            triggeredBySkills: [this.Name],
        });
        room.notify(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, toId);
        const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, toId);
        response.selectedOption = response.selectedOption || 'jujian:draw';
        if (response.selectedOption === 'jujian:recover') {
            await room.recover({
                toId,
                recoveredHp: 1,
                recoverBy: toId,
            });
        }
        else if (response.selectedOption === 'jujian:restore') {
            if (to.ChainLocked) {
                await room.chainedOn(toId);
            }
            if (!to.isFaceUp()) {
                await room.turnOver(toId);
            }
        }
        else {
            await room.drawCards(2, toId, 'top', toId, this.Name);
        }
        return true;
    }
};
JuJian = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jujian', description: 'jujian_description' })
], JuJian);
exports.JuJian = JuJian;
