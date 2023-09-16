"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheZhengShadow = exports.CheZheng = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let CheZheng = class CheZheng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        if (owner.Id === content.playerId && 15 /* PlayCardStageEnd */ === content.toStage) {
            const targets = room.getOtherPlayers(owner.Id).filter(player => !room.withinAttackDistance(player, owner));
            return (room.Analytics.getCardUseRecord(owner.Id, 'phase').length < targets.length &&
                targets.find(player => player.getPlayerCards().length > 0) !== undefined);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const players = room
            .getOtherPlayers(fromId)
            .filter(player => !room.withinAttackDistance(player, room.getPlayerById(fromId)) && player.getPlayerCards().length > 0)
            .map(player => player.Id);
        if (players.length === 0) {
            return false;
        }
        const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players,
            toId: fromId,
            requiredAmount: 1,
            conversation: 'chezheng: please choose a target to drop a card from him?',
            triggeredBySkills: [this.Name],
        }, fromId, true);
        resp.selectedPlayers = resp.selectedPlayers || [players[Math.floor(Math.random() * players.length)]];
        const toId = resp.selectedPlayers[0];
        const to = room.getPlayerById(toId);
        const options = {
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
        };
        const chooseCardEvent = {
            fromId,
            toId,
            options,
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
        if (!response) {
            return false;
        }
        await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], toId, fromId, this.Name);
        return true;
    }
};
CheZheng = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'chezheng', description: 'chezheng_description' })
], CheZheng);
exports.CheZheng = CheZheng;
let CheZhengShadow = class CheZhengShadow extends skill_1.GlobalFilterSkill {
    canUseCardTo(_, room, owner, from, to) {
        return !(room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            room.CurrentPhasePlayer === owner &&
            owner === from &&
            owner !== to &&
            !room.withinAttackDistance(to, owner));
    }
};
CheZhengShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: CheZheng.Name, description: CheZheng.Description })
], CheZhengShadow);
exports.CheZhengShadow = CheZhengShadow;
