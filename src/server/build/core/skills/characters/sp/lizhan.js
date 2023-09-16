"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiZhan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LiZhan = class LiZhan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            room.AlivePlayers.find(player => player.LostHp > 0) !== undefined);
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0;
    }
    isAvailableTarget(owner, room, target) {
        return room.getPlayerById(target).LostHp > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard() {
        return false;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose targets to draw a card each?', this.Name).extract();
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
        return true;
    }
};
LiZhan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'lizhan', description: 'lizhan_description' })
], LiZhan);
exports.LiZhan = LiZhan;
