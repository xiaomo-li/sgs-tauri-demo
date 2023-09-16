"use strict";
var QianXi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QianXiBlock = exports.QianXiShadow = exports.QianXi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let QianXi = QianXi_1 = class QianXi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && content.toStage === 3 /* PrepareStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        await room.drawCards(1, fromId, 'top', fromId, this.Name);
        if (room.getPlayerById(fromId).getPlayerCards().length < 1) {
            return false;
        }
        const response = await room.askForCardDrop(fromId, 1, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
        if (response.droppedCards.length === 0) {
            return false;
        }
        const color = engine_1.Sanguosha.getCardById(response.droppedCards[0]).Color;
        await room.dropCards(4 /* SelfDrop */, response.droppedCards, fromId, fromId, this.Name);
        const players = room
            .getAlivePlayersFrom()
            .filter(player => room.distanceBetween(room.getPlayerById(fromId), player) === 1)
            .map(player => player.Id);
        if (players.length < 1) {
            return false;
        }
        const askForPlayerChoose = {
            toId: fromId,
            players,
            requiredAmount: 1,
            conversation: 'qianxi: please choose a target with 1 Distance(to you)',
            triggeredBySkills: [this.Name],
        };
        room.notify(167 /* AskForChoosingPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForPlayerChoose), fromId);
        const resp = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, fromId);
        resp.selectedPlayers = resp.selectedPlayers || [players[0]];
        await room.obtainSkill(resp.selectedPlayers[0], QianXiBlock.Name);
        const flagName = color === 1 /* Black */ ? QianXi_1.Black : QianXi_1.Red;
        room.setFlag(resp.selectedPlayers[0], this.Name, color);
        room.setFlag(resp.selectedPlayers[0], flagName, true, flagName);
        return true;
    }
};
QianXi.Red = 'qianxi_red';
QianXi.Black = 'qianxi_black';
QianXi = QianXi_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qianxi', description: 'qianxi_description' })
], QianXi);
exports.QianXi = QianXi;
let QianXiShadow = class QianXiShadow extends skill_1.TriggerSkill {
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isFlaggedSkill() {
        return true;
    }
    isAutoTrigger() {
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
    async onEffect(room) {
        for (const player of room.AlivePlayers) {
            room.removeFlag(player.Id, this.GeneralName);
            room.removeFlag(player.Id, QianXi.Red);
            room.removeFlag(player.Id, QianXi.Black);
            if (player.hasSkill(QianXiBlock.Name)) {
                await room.loseSkill(player.Id, QianXiBlock.Name);
            }
        }
        return true;
    }
};
QianXiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: QianXi.Name, description: QianXi.Description })
], QianXiShadow);
exports.QianXiShadow = QianXiShadow;
let QianXiBlock = class QianXiBlock extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner) {
        const color = room.getFlag(owner, QianXi.Name);
        if (color === undefined) {
            return true;
        }
        return cardId instanceof card_matcher_1.CardMatcher
            ? true
            : room.getPlayerById(owner).cardFrom(cardId) !== 0 /* HandArea */ ||
                engine_1.Sanguosha.getCardById(cardId).Color !== color;
    }
};
QianXiBlock = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: 'qianxiBlocker', description: 'qianxiBlocker_description' })
], QianXiBlock);
exports.QianXiBlock = QianXiBlock;
