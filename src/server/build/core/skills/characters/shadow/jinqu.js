"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JinQu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const qizhi_1 = require("./qizhi");
let JinQu = class JinQu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 19 /* FinishStageStart */;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw 2 cards, then keep {1} hand cards?', this.Name, owner.hasUsedSkillTimes(qizhi_1.QiZhi.Name)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        await room.drawCards(2, fromId, 'top', fromId, this.Name);
        const dropNum = from.getCardIds(0 /* HandArea */).length - from.hasUsedSkillTimes(qizhi_1.QiZhi.Name);
        if (dropNum > 0) {
            const response = await room.askForCardDrop(fromId, dropNum, [0 /* HandArea */], true, undefined, this.Name);
            response.droppedCards.length > 0 &&
                (await room.dropCards(4 /* SelfDrop */, response.droppedCards, fromId, fromId, this.Name));
        }
        return true;
    }
};
JinQu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jinqu', description: 'jinqu_description' })
], JinQu);
exports.JinQu = JinQu;
