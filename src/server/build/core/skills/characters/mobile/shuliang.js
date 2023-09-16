"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShuLiang = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const tunchu_1 = require("./tunchu");
let ShuLiang = class ShuLiang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.toStage === 19 /* FinishStageStart */ &&
            owner.getCardIds(3 /* OutsideArea */, tunchu_1.TunChu.Name).length > 0 &&
            room.getPlayerById(content.playerId).getCardIds(0 /* HandArea */).length <
                room.getPlayerById(content.playerId).Hp);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.getPlayerById(owner).getCardIds(3 /* OutsideArea */, tunchu_1.TunChu.Name).includes(cardId);
    }
    availableCardAreas() {
        return [3 /* OutsideArea */];
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to remove a ‘liang’ to let {1} draws 2 cards?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.playerId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: 3 /* OutsideArea */ }],
            fromId: event.fromId,
            toArea: 4 /* DropStack */,
            moveReason: 6 /* PlaceToDropStack */,
            proposer: event.fromId,
            triggeredBySkills: [this.Name],
        });
        const toId = event.triggeredOnEvent.playerId;
        await room.drawCards(2, toId, 'top', event.fromId, this.Name);
        return true;
    }
};
ShuLiang = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'shuliang', description: 'shuliang_description' })
], ShuLiang);
exports.ShuLiang = ShuLiang;
