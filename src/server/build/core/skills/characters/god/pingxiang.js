"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingXiangShadow = exports.PingXiang = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let PingXiang = class PingXiang extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return (room.CurrentPhasePlayer === owner && room.CurrentPlayerPhase === 4 /* PlayCardStage */ && owner.MaxHp > 9);
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter() {
        return true;
    }
    isAvailableTarget() {
        return false;
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.changeMaxHp(skillUseEvent.fromId, -9);
        const from = room.getPlayerById(skillUseEvent.fromId);
        let slashCount = 9;
        const virtualFireSlash = card_1.VirtualCard.create({ cardName: 'fire_slash', bySkill: this.Name });
        while (slashCount-- > 0) {
            const availableTargets = room
                .getOtherPlayers(skillUseEvent.fromId)
                .filter(player => room.canAttack(from, player, virtualFireSlash.Id) && room.withinAttackDistance(from, player));
            if (availableTargets.length === 0) {
                break;
            }
            const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                toId: skillUseEvent.fromId,
                players: availableTargets.map(player => player.Id),
                requiredAmount: 1,
                conversation: 'please choose one target to use fire slash',
            }, skillUseEvent.fromId);
            const { selectedPlayers } = response;
            if (!selectedPlayers) {
                break;
            }
            await room.useCard({
                fromId: skillUseEvent.fromId,
                cardId: virtualFireSlash.Id,
                targetGroup: [selectedPlayers],
                triggeredBySkills: [this.Name],
                extraUse: true,
            });
        }
        await room.loseSkill(skillUseEvent.fromId, 'jiufa', true);
        return true;
    }
};
PingXiang = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'pingxiang', description: 'pingxiang_description' })
], PingXiang);
exports.PingXiang = PingXiang;
let PingXiangShadow = class PingXiangShadow extends skill_1.RulesBreakerSkill {
    breakBaseCardHoldNumber(room, owner) {
        return owner.hasUsed(PingXiang.Name) ? owner.MaxHp : -1;
    }
};
PingXiangShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: PingXiang.GeneralName, description: PingXiang.Description })
], PingXiangShadow);
exports.PingXiangShadow = PingXiangShadow;
