"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChouCe = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const xianfu_1 = require("./xianfu");
let ChouCe = class ChouCe extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    triggerableTimes(event) {
        return event.damage;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const judgeEvent = await room.judge(fromId, undefined, this.Name);
        if (engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId).isBlack()) {
            const players = room
                .getAlivePlayersFrom()
                .filter(player => player.Id === fromId
                ? player.getCardIds().find(id => room.canDropCard(fromId, id))
                : player.getCardIds().length > 0)
                .map(player => player.Id);
            if (players.length === 0) {
                return false;
            }
            const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players,
                toId: event.fromId,
                requiredAmount: 1,
                conversation: 'chouce: please choose a target to discard a card from his area',
                triggeredBySkills: [this.Name],
            }, event.fromId, true);
            response.selectedPlayers = response.selectedPlayers || [players[Math.floor(Math.random() * players.length)]];
            const to = room.getPlayerById(response.selectedPlayers[0]);
            const options = {
                [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
                [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
            };
            const chooseCardEvent = {
                fromId,
                toId: response.selectedPlayers[0],
                options,
                triggeredBySkills: [this.Name],
            };
            const resp = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
            if (!resp) {
                return false;
            }
            await room.dropCards(response.selectedPlayers[0] === fromId ? 4 /* SelfDrop */ : 5 /* PassiveDrop */, [resp.selectedCard], response.selectedPlayers[0], fromId, this.Name);
        }
        else if (engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId).isRed()) {
            const players = room.getAlivePlayersFrom().map(player => player.Id);
            const xianfuPlayer = room.getFlag(fromId, xianfu_1.XianFu.Name);
            const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players,
                toId: event.fromId,
                requiredAmount: 1,
                conversation: xianfuPlayer
                    ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a target to draw a card (If the target is {1}, draw 2 cards instead)', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(xianfuPlayer))).extract()
                    : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a target to draw a card', this.Name).extract(),
                triggeredBySkills: [this.Name],
            }, event.fromId, true);
            response.selectedPlayers = response.selectedPlayers || [event.fromId];
            if (response.selectedPlayers[0] === xianfuPlayer && !room.getFlag(xianfuPlayer, xianfu_1.XianFu.XianFuPlayer)) {
                room.setFlag(xianfuPlayer, xianfu_1.XianFu.XianFuPlayer, true, xianfu_1.XianFu.Name);
            }
            await room.drawCards(response.selectedPlayers[0] === xianfuPlayer ? 2 : 1, response.selectedPlayers[0], 'top', fromId, this.Name);
        }
        return true;
    }
};
ChouCe = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'chouce', description: 'chouce_description' })
], ChouCe);
exports.ChouCe = ChouCe;
