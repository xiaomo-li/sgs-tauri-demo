"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XingXueEX = exports.XingXue = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XingXue = class XingXue extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['xingxue_ex'];
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 19 /* FinishStageStart */ && owner.Hp > 0;
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= owner.Hp;
    }
    isAvailableTarget() {
        return true;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose at most {1} target(s) to draw a card?', this.Name, owner.Hp).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        for (const toId of event.toIds) {
            await room.drawCards(1, toId, 'top', toId, this.Name);
        }
        for (const toId of event.toIds) {
            if (room.getPlayerById(toId).getCardIds(0 /* HandArea */).length <= room.getPlayerById(toId).Hp) {
                continue;
            }
            const response = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                cardAmount: 1,
                toId,
                reason: this.Name,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please put a card onto the top of draw stack', this.Name).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }, toId, true);
            const cards = room.getPlayerById(toId).getPlayerCards();
            response.selectedCards =
                response.selectedCards.length > 0 ? response.selectedCards : [cards[Math.floor(Math.random() * cards.length)]];
            await room.moveCards({
                movingCards: [
                    { card: response.selectedCards[0], fromArea: room.getPlayerById(toId).cardFrom(response.selectedCards[0]) },
                ],
                fromId: toId,
                toArea: 5 /* DrawStack */,
                moveReason: 7 /* PlaceToDrawStack */,
                proposer: toId,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
XingXue = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xingxue', description: 'xingxue_description' })
], XingXue);
exports.XingXue = XingXue;
let XingXueEX = class XingXueEX extends XingXue {
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 19 /* FinishStageStart */;
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= owner.MaxHp;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose at most {1} target(s) to draw a card?', this.Name, owner.MaxHp).extract();
    }
};
XingXueEX = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xingxue_ex', description: 'xingxue_ex_description' })
], XingXueEX);
exports.XingXueEX = XingXueEX;
