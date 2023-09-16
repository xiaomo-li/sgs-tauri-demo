"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiBie = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QiBie = class QiBie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterPlayerDied" /* AfterPlayerDied */;
    }
    canUse(room, owner, event) {
        return !!owner.getCardIds(0 /* HandArea */).find(cardId => room.canDropCard(owner.Id, cardId));
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard all your hand cards to recover 1 hp and draw cards?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const toDiscard = room
            .getPlayerById(event.fromId)
            .getCardIds(0 /* HandArea */)
            .filter(cardId => room.canDropCard(event.fromId, cardId));
        if (toDiscard.length < 1) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, toDiscard, event.fromId, event.fromId, this.Name);
        await room.recover({
            toId: event.fromId,
            recoveredHp: 1,
            recoverBy: event.fromId,
        });
        await room.drawCards(toDiscard.length + 1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
QiBie = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'qibie', description: 'qibie_description' })
], QiBie);
exports.QiBie = QiBie;
