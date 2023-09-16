"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiJiaoHandler = exports.YiJiao = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YiJiao = class YiJiao extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getMark("yi" /* Yi */) === 0;
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const options = ['1', '2', '3', '4'];
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose yijiao options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toIds[0]))).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        response.selectedOption = response.selectedOption || options[0];
        room.addMark(event.toIds[0], "yi" /* Yi */, parseInt(response.selectedOption, 10) * 10);
        room.getPlayerById(event.toIds[0]).setFlag(this.Name, event.fromId);
        room.getPlayerById(event.toIds[0]).hasShadowSkill(YiJiaoHandler.Name) ||
            (await room.obtainSkill(event.toIds[0], YiJiaoHandler.Name));
        return true;
    }
};
YiJiao = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yijiao', description: 'yijiao_description' })
], YiJiao);
exports.YiJiao = YiJiao;
let YiJiaoHandler = class YiJiaoHandler extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        player.removeFlag(YiJiao.Name);
        player.getFlag(this.Name) !== undefined && room.removeFlag(player.Id, this.Name);
        await room.loseSkill(player.Id, this.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return (stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ ||
            stage === "StageChanged" /* StageChanged */ ||
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            return (room.CurrentPlayer === owner &&
                cardUseEvent.fromId === owner.Id &&
                engine_1.Sanguosha.getCardById(cardUseEvent.cardId).CardNumber > 0);
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = event;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 19 /* FinishStageStart */ &&
                owner.getMark("yi" /* Yi */) > 0);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.from === 6 /* FinishStage */ && phaseChangeEvent.fromPlayer === owner.Id;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardNumber = engine_1.Sanguosha.getCardById(unknownEvent.cardId).CardNumber;
            let count = room.getFlag(event.fromId, this.Name) || 0;
            count += cardNumber;
            room.setFlag(event.fromId, this.Name, count, translation_json_tool_1.TranslationPack.translationJsonPatcher('yijiao: {0}', count).toString());
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const count = room.getFlag(event.fromId, this.Name) || 0;
            if (room.getMark(event.fromId, "yi" /* Yi */) > count) {
                const handCards = room
                    .getPlayerById(event.fromId)
                    .getCardIds(0 /* HandArea */)
                    .filter(cardId => room.canDropCard(event.fromId, cardId));
                handCards.length > 0 &&
                    (await room.dropCards(4 /* SelfDrop */, [handCards[Math.floor(Math.random() * handCards.length)]], event.fromId, event.fromId, YiJiao.Name));
            }
            else if (room.getMark(event.fromId, "yi" /* Yi */) === count) {
                room.insertPlayerRound(event.fromId);
            }
            else {
                const skillSource = room.getFlag(event.fromId, YiJiao.Name);
                skillSource && (await room.drawCards(2, skillSource, 'top', skillSource, YiJiao.Name));
            }
        }
        else {
            const from = room.getPlayerById(event.fromId);
            from.removeFlag(YiJiao.Name);
            from.getFlag(this.Name) !== undefined && room.removeFlag(event.fromId, this.Name);
            room.removeMark(event.fromId, "yi" /* Yi */);
            await room.loseSkill(event.fromId, this.Name);
        }
        return true;
    }
};
YiJiaoHandler = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_yijiao_handler', description: 's_yijiao_handler_description' })
], YiJiaoHandler);
exports.YiJiaoHandler = YiJiaoHandler;
