"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiQiRemover = exports.TiQi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TiQi = class TiQi extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    canUse(room, owner, content) {
        owner.getFlag(this.Name) !== undefined && owner.removeFlag(this.Name);
        if (content.to !== 4 /* PlayCardStage */ ||
            content.toPlayer === owner.Id ||
            room.getPlayerById(content.toPlayer).Dead) {
            return false;
        }
        const drawnNum = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 127 /* DrawCardEvent */ &&
            event.fromId === content.toPlayer &&
            event.bySpecialReason === 0 /* GameStage */, undefined, 'round', [3 /* DrawCardStage */]).reduce((sum, event) => sum + event.drawAmount, 0);
        if (drawnNum !== 2) {
            owner.setFlag(this.Name, drawnNum);
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const currentPlayer = event.triggeredOnEvent.toPlayer;
        const diff = Math.abs(2 - room.getPlayerById(event.fromId).getFlag(this.Name));
        await room.drawCards(diff, event.fromId, 'top', event.fromId, this.Name);
        const options = ['tiqi:increase', 'tiqi:decrease', 'cancel'];
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose tiqi options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(currentPlayer))).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        if (response.selectedOption !== 'cancel') {
            room.syncGameCommonRules(currentPlayer, user => {
                const changedValue = response.selectedOption === options[0] ? diff : -diff;
                user.addInvisibleMark(this.Name, user.getInvisibleMark(this.Name) + changedValue);
                room.CommonRules.addAdditionalHoldCardNumber(user, changedValue);
            });
            room.getPlayerById(currentPlayer).hasShadowSkill(TiQiRemover.Name) ||
                (await room.obtainSkill(currentPlayer, TiQiRemover.Name));
        }
        return true;
    }
};
TiQi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'tiqi', description: 'tiqi_description' })
], TiQi);
exports.TiQi = TiQi;
let TiQiRemover = class TiQiRemover extends skill_1.TriggerSkill {
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        return content.from === 7 /* PhaseFinish */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.syncGameCommonRules(event.fromId, user => {
            const extraHold = user.getInvisibleMark(TiQi.Name);
            user.removeInvisibleMark(TiQi.Name);
            room.CommonRules.addAdditionalHoldCardNumber(user, -extraHold);
        });
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
TiQiRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_tiqi_remover', description: 's_tiqi_remover_description' })
], TiQiRemover);
exports.TiQiRemover = TiQiRemover;
