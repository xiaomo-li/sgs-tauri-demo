"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChengXiang = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ChengXiang = class ChengXiang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        const chengxiangCards = room.getCards(4, 'top');
        const askForChooseCard = {
            toId: fromId,
            customCardFields: {
                [this.Name]: chengxiangCards,
            },
            cardFilter: 3 /* ChengXiang */,
            customTitle: this.Name,
            triggeredBySkills: [this.Name],
        };
        room.notify(166 /* AskForChoosingCardWithConditionsEvent */, askForChooseCard, fromId);
        const { selectedCards } = await room.onReceivingAsyncResponseFrom(166 /* AskForChoosingCardWithConditionsEvent */, fromId);
        if (selectedCards !== undefined && selectedCards.length > 0) {
            await room.moveCards({
                movingCards: selectedCards.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                movedByReason: this.Name,
                engagedPlayerIds: [this.Name],
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} obtains cards {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(...selectedCards)).extract(),
            });
        }
        return true;
    }
};
ChengXiang = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'chengxiang', description: 'chengxiang_description' })
], ChengXiang);
exports.ChengXiang = ChengXiang;
