"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BengHuai = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const jiuchi_1 = require("./jiuchi");
let BengHuai = class BengHuai extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['zhugedan'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeStageChange" /* BeforeStageChange */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.playerId &&
            19 /* FinishStageStart */ === event.toStage &&
            room.getFlag(owner.Id, jiuchi_1.JiuChi.Used) !== true &&
            !room.getOtherPlayers(owner.Id).every(player => owner.Hp <= player.Hp));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const options = ['benghuai:maxhp'];
        if (from.Hp > 0) {
            options.unshift('benghuai:hp');
        }
        const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose', this.Name).extract(),
            toId: fromId,
            triggeredBySkills: [this.Name],
        });
        room.notify(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, fromId);
        const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
        response.selectedOption = response.selectedOption || options[0];
        if (response.selectedOption === 'benghuai:hp') {
            await room.loseHp(fromId, 1);
        }
        else {
            await room.changeMaxHp(fromId, -1);
        }
        return true;
    }
};
BengHuai = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'benghuai', description: 'benghuai_description' })
], BengHuai);
exports.BengHuai = BengHuai;
