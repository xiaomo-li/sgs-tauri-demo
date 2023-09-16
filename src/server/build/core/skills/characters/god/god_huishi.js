"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodHuiShi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GodHuiShi = class GodHuiShi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.MaxHp < 10;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget() {
        return false;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        let judgeCardIds = [];
        const judge = await room.judge(fromId, undefined, this.Name);
        judgeCardIds.push(judge.judgeCardId);
        do {
            const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                toId: fromId,
                options: ['yes', 'no'],
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to gain a max hp and judge again?', this.Name).extract(),
            }, fromId, true);
            if (selectedOption !== 'yes') {
                break;
            }
            await room.changeMaxHp(fromId, 1);
            const judgeEvent = await room.judge(fromId, undefined, this.Name);
            judgeCardIds.push(judgeEvent.judgeCardId);
            if (judgeCardIds.find(id => id !== judgeEvent.judgeCardId &&
                engine_1.Sanguosha.getCardById(id).Suit === engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId).Suit)) {
                break;
            }
        } while (judgeCardIds.length < 4 && room.getPlayerById(fromId).MaxHp < 10);
        judgeCardIds = judgeCardIds.filter(id => room.isCardInDropStack(id));
        if (judgeCardIds.length === 0) {
            return false;
        }
        const observeCardsEvent = {
            cardIds: judgeCardIds,
            selected: [],
        };
        room.notify(129 /* ObserveCardsEvent */, observeCardsEvent, fromId);
        const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players: room.getAlivePlayersFrom().map(player => player.Id),
            toId: fromId,
            requiredAmount: 1,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a target to gain these cards', this.Name).extract(),
            triggeredBySkills: [this.Name],
        }, fromId, true);
        room.notify(130 /* ObserveCardFinishEvent */, {}, fromId);
        resp.selectedPlayers = resp.selectedPlayers || [fromId];
        await room.moveCards({
            movingCards: judgeCardIds.map(card => ({ card, fromArea: 4 /* DropStack */ })),
            toId: resp.selectedPlayers[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        room
            .getOtherPlayers(resp.selectedPlayers[0])
            .find(player => room.getPlayerById(resp.selectedPlayers[0]).getCardIds(0 /* HandArea */).length <
            player.getCardIds(0 /* HandArea */).length) || (await room.changeMaxHp(fromId, -1));
        return true;
    }
};
GodHuiShi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'god_huishi', description: 'god_huishi_description' })
], GodHuiShi);
exports.GodHuiShi = GodHuiShi;
