"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TieJiShadow = exports.TieJi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const uncompulsory_blocker_1 = require("./uncompulsory_blocker");
let TieJi = class TieJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "AfterAim" /* AfterAim */ &&
            event.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash');
    }
    canUse(room, owner, event) {
        return owner.Id === event.fromId;
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const aimEvent = triggeredOnEvent;
        room.setFlag(aimEvent.toId, this.Name, true, this.Name);
        room.getPlayerById(aimEvent.toId).hasShadowSkill(uncompulsory_blocker_1.UncompulsoryBlocker.Name) ||
            (await room.obtainSkill(aimEvent.toId, uncompulsory_blocker_1.UncompulsoryBlocker.Name));
        const to = room.getPlayerById(aimEvent.toId);
        const judge = await room.judge(skillUseEvent.fromId, undefined, this.Name);
        const judgeCard = engine_1.Sanguosha.getCardById(judge.judgeCardId);
        const response = await room.askForCardDrop(aimEvent.toId, 1, [0 /* HandArea */, 1 /* EquipArea */], false, to.getPlayerCards().filter(cardId => engine_1.Sanguosha.getCardById(cardId).Suit !== judgeCard.Suit), this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher("please drop a {0} card, otherwise you can't do response of slash", functional_1.Functional.getCardSuitRawText(judgeCard.Suit)).extract());
        if (response.droppedCards.length === 0) {
            event_packer_1.EventPacker.setDisresponsiveEvent(aimEvent);
        }
        else {
            await room.dropCards(4 /* SelfDrop */, response.droppedCards, aimEvent.toId, skillUseEvent.fromId, this.Name);
        }
        return true;
    }
};
TieJi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'tieji', description: 'tieji_description' })
], TieJi);
exports.TieJi = TieJi;
let TieJiShadow = class TieJiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    getPriority() {
        return 0 /* High */;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ && event.from === 7 /* PhaseFinish */;
    }
    isFlaggedSkill(room, event, stage) {
        return true;
    }
    canUse(room, owner, content) {
        return room.AlivePlayers.find(player => player.getFlag(this.GeneralName)) !== undefined;
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        for (const player of room.AlivePlayers) {
            room.removeFlag(player.Id, this.GeneralName);
            player.hasShadowSkill(uncompulsory_blocker_1.UncompulsoryBlocker.Name) && (await room.loseSkill(player.Id, uncompulsory_blocker_1.UncompulsoryBlocker.Name));
        }
        return true;
    }
};
TieJiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CompulsorySkill({ name: TieJi.GeneralName, description: TieJi.Description })
], TieJiShadow);
exports.TieJiShadow = TieJiShadow;
