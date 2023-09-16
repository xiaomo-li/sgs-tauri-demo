"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MingLuan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MingLuan = class MingLuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId !== owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.getPlayerCards().length > 0 &&
            room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 138 /* RecoverEvent */, undefined, 'round', undefined, 1).length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getSkillLog(room) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard a card to use this skill?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        const current = room.CurrentPlayer;
        if (current && !current.Dead) {
            const drawNum = Math.min(current.getCardIds(0 /* HandArea */).length, 5) -
                room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */).length;
            drawNum > 0 && (await room.drawCards(drawNum, event.fromId, 'top', event.fromId, this.Name));
        }
        return true;
    }
};
MingLuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'mingluan', description: 'mingluan_description' })
], MingLuan);
exports.MingLuan = MingLuan;
