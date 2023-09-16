"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YuXu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YuXu = class YuXu extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 4 /* PlayCardStage */;
    }
    isAutoTrigger(room, owner) {
        return owner.hasUsedSkillTimes(this.Name) % 2 === 1;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            room.CurrentPhasePlayer === owner &&
            !(owner.hasUsedSkillTimes(this.Name) % 2 === 1 &&
                owner.getPlayerCards().find(id => room.canDropCard(owner.Id, id)) === undefined));
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (room.getPlayerById(event.fromId).hasUsedSkillTimes(this.Name) % 2 === 1) {
            await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        }
        else {
            const response = await room.askForCardDrop(event.fromId, 1, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
            response.droppedCards.length > 0 &&
                (await room.dropCards(4 /* SelfDrop */, response.droppedCards, event.fromId, event.fromId, this.Name));
        }
        return true;
    }
};
YuXu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yuxu', description: 'yuxu_description' })
], YuXu);
exports.YuXu = YuXu;
