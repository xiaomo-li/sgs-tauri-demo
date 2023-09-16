"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuShiShadow = exports.DuShi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let DuShi = class DuShi extends skill_1.TriggerSkill {
    afterDead(room) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */;
    }
    isTriggerable(event, stage) {
        return stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const players = room.getOtherPlayers(event.fromId).map(player => player.Id);
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players,
            toId: event.fromId,
            requiredAmount: 1,
            conversation: 'dushi: please choose a target to gain this skill',
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        response.selectedPlayers = response.selectedPlayers || [players[Math.floor(Math.random() * players.length)]];
        await room.obtainSkill(response.selectedPlayers[0], this.Name, true);
        return true;
    }
};
DuShi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'dushi', description: 'dushi_description' })
], DuShi);
exports.DuShi = DuShi;
let DuShiShadow = class DuShiShadow extends skill_1.GlobalFilterSkill {
    canUseCardTo(cardId, room, owner, from, to) {
        if (to !== owner || from === to || !to.Dying) {
            return true;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return !cardId.match(new card_matcher_1.CardMatcher({ name: ['peach'] }));
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName !== 'peach';
        }
    }
};
DuShiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: DuShi.Name, description: DuShi.Description })
], DuShiShadow);
exports.DuShiShadow = DuShiShadow;
