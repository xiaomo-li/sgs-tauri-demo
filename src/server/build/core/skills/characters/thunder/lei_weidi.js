"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeiWeiDi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LeiWeiDi = class LeiWeiDi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 16 /* DropCardStageStart */ &&
            owner.getCardIds(0 /* HandArea */).length - owner.getMaxCardHold(room) > 0 &&
            room.getOtherPlayers(owner.Id).find(player => player.Nationality === 3 /* Qun */) !== undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        var _a;
        return (target !== owner &&
            room.getPlayerById(target).Nationality === 3 /* Qun */ &&
            !((_a = room.getPlayerById(owner).getFlag(this.Name)) === null || _a === void 0 ? void 0 : _a.includes(target)));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard() {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a card to give it to another Qun general (can repeat {1} times)?', this.Name, owner.getCardIds(0 /* HandArea */).length - owner.getMaxCardHold(room)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        const from = room.getPlayerById(fromId);
        let n = from.getCardIds(0 /* HandArea */).length - room.getPlayerById(fromId).getMaxCardHold(room);
        let toGive = cardIds[0];
        let target = toIds[0];
        const targets = [];
        do {
            await room.moveCards({
                movingCards: [{ card: toGive, fromArea: 0 /* HandArea */ }],
                fromId,
                toId: target,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            });
            n--;
            if (n === 0 || from.getCardIds(0 /* HandArea */).length === 0) {
                break;
            }
            targets.push(target);
            room.setFlag(fromId, this.Name, targets);
            room.notify(171 /* AskForSkillUseEvent */, {
                invokeSkillNames: [this.Name],
                toId: fromId,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a card to give it to another Qun general (can repeat {1} times)?', this.Name, n).extract(),
            }, fromId);
            const response = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, fromId);
            if (response.toIds && response.cardIds) {
                target = response.toIds[0];
                toGive = response.cardIds[0];
            }
            else {
                break;
            }
        } while (true);
        room.removeFlag(fromId, this.Name);
        return true;
    }
};
LeiWeiDi = tslib_1.__decorate([
    skill_1.LordSkill,
    skill_1.CommonSkill({ name: 'lei_weidi', description: 'lei_weidi_description' })
], LeiWeiDi);
exports.LeiWeiDi = LeiWeiDi;
