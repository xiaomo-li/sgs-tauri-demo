"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiaoShi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QiaoShi = class QiaoShi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return (owner.Id !== event.playerId &&
            event.toStage === 22 /* PhaseFinishStart */ &&
            room.getPlayerById(event.playerId).getCardIds(0 /* HandArea */).length ===
                owner.getCardIds(0 /* HandArea */).length);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card with {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.playerId))).extract();
    }
    async onTrigger(room, event) {
        event.animation = [
            {
                from: event.fromId,
                tos: [event.triggeredOnEvent.playerId],
            },
        ];
        return true;
    }
    async onEffect(room, event) {
        let invoked = false;
        do {
            invoked = false;
            const toId = event.triggeredOnEvent.playerId;
            const idA = (await room.drawCards(1, toId, 'top', event.fromId, this.Name))[0];
            const idB = (await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name))[0];
            if (room.getPlayerById(event.fromId).Dead || room.getPlayerById(toId).Dead) {
                break;
            }
            if (engine_1.Sanguosha.getCardById(idA).Suit === engine_1.Sanguosha.getCardById(idB).Suit) {
                const skillUseEvent = {
                    invokeSkillNames: [this.Name],
                    toId: event.fromId,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card with {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toId))).extract(),
                };
                room.notify(171 /* AskForSkillUseEvent */, skillUseEvent, event.fromId);
                const { invoke } = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, event.fromId);
                invoked = !!invoke;
            }
        } while (invoked);
        return true;
    }
};
QiaoShi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'qiaoshi', description: 'qiaoshi_description' })
], QiaoShi);
exports.QiaoShi = QiaoShi;
