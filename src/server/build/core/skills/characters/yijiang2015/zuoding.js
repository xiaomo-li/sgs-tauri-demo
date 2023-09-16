"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZuoDing = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZuoDing = class ZuoDing extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        return (content.fromId !== owner.Id &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            room.CurrentPhasePlayer.Id === content.fromId &&
            content.isFirstTarget &&
            engine_1.Sanguosha.getCardById(content.byCardId).Suit === 1 /* Spade */ &&
            room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */, undefined, 'phase', undefined, 1).length === 0);
    }
    async beforeUse(room, event) {
        const players = aim_group_1.AimGroupUtil.getAllTargets(event.triggeredOnEvent.allTargets);
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players,
            toId: event.fromId,
            requiredAmount: 1,
            conversation: 'zuoding: do you want to choose a target to draw a card?',
            triggeredBySkills: [this.Name],
        }, event.fromId);
        if (response.selectedPlayers && response.selectedPlayers.length > 0) {
            event.toIds = response.selectedPlayers;
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        await room.drawCards(1, toIds[0], 'top', fromId, this.Name);
        return true;
    }
};
ZuoDing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zuoding', description: 'zuoding_description' })
], ZuoDing);
exports.ZuoDing = ZuoDing;
