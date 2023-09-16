"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaoYuanJieYiSkill = void 0;
const tslib_1 = require("tslib");
const taoyuanjieyi_1 = require("core/ai/skills/cards/taoyuanjieyi");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
let TaoYuanJieYiSkill = class TaoYuanJieYiSkill extends skill_1.ActiveSkill {
    canUse(room, owner, containerCard) {
        if (containerCard) {
            for (const target of room.getAlivePlayersFrom()) {
                if (owner.canUseCardTo(room, containerCard, target.Id)) {
                    return true;
                }
            }
        }
        return false;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    isCardAvailableTarget() {
        return true;
    }
    isAvailableTarget() {
        return false;
    }
    async onUse(room, event) {
        const from = room.getPlayerById(event.fromId);
        const allPlayers = room.getAlivePlayersFrom().filter(player => from.canUseCardTo(room, event.cardId, player.Id));
        event.targetGroup = [...allPlayers.map(player => [player.Id])];
        event.nullifiedTargets = allPlayers.filter(player => player.Hp === player.MaxHp).map(player => player.Id);
        return true;
    }
    async onEffect(room, event) {
        const { toIds, cardId } = event;
        await room.recover({
            cardIds: [cardId],
            recoveredHp: 1 + (event.additionalRecoveredHp || 0),
            toId: precondition_1.Precondition.exists(toIds, 'Unknown targets in taoyuanjieyi')[0],
        });
        return true;
    }
};
TaoYuanJieYiSkill = tslib_1.__decorate([
    skill_1.AI(taoyuanjieyi_1.TaoYuanJieYiSkillTrigger),
    skill_1.CommonSkill({ name: 'taoyuanjieyi', description: 'taoyuanjieyi_description' })
], TaoYuanJieYiSkill);
exports.TaoYuanJieYiSkill = TaoYuanJieYiSkill;
