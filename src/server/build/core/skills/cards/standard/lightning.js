"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightningSkill = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
let LightningSkill = class LightningSkill extends skill_1.ActiveSkill {
    canUse(room, owner, containerCard) {
        let canUseTo = true;
        if (containerCard) {
            canUseTo = owner.canUseCardTo(room, containerCard, owner.Id);
        }
        return (owner
            .getCardIds(2 /* JudgeArea */)
            .find(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === 'lightning') === undefined && canUseTo);
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
    isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return (room.getPlayerById(owner).canUseCardTo(room, containerCard, target) &&
            room
                .getPlayerById(target)
                .getCardIds(2 /* JudgeArea */)
                .find(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === 'lightning') === undefined);
    }
    isAvailableTarget() {
        return false;
    }
    async onUse(room, event) {
        event.targetGroup = [[event.fromId]];
        return true;
    }
    async moveToNextPlayer(room, cardId, currentPlayer) {
        let player;
        while (true) {
            player = room.getNextAlivePlayer(player ? player.Id : currentPlayer);
            if (player.Id === currentPlayer) {
                await room.moveCards({
                    movingCards: [{ card: cardId, fromArea: 6 /* ProcessingArea */ }],
                    toArea: 2 /* JudgeArea */,
                    toId: currentPlayer,
                    moveReason: 3 /* PassiveMove */,
                });
                break;
            }
            const skip = !room.canUseCardTo(cardId, player, player) ||
                player
                    .getCardIds(2 /* JudgeArea */)
                    .find(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === this.Name) !== undefined;
            if (skip) {
                continue;
            }
            await room.moveCards({
                fromId: currentPlayer,
                movingCards: [{ card: cardId, fromArea: 6 /* ProcessingArea */ }],
                toArea: 2 /* JudgeArea */,
                toId: player.Id,
                moveReason: 3 /* PassiveMove */,
            });
            break;
        }
    }
    async onEffect(room, event) {
        const { toIds, cardId } = event;
        const judgeEvent = await room.judge(precondition_1.Precondition.exists(toIds, 'Unknown targets in lightning')[0], cardId, this.Name, 4 /* Lightning */);
        const card = engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId);
        if (judge_matchers_1.JudgeMatcher.onJudge(judgeEvent.judgeMatcherEnum, card)) {
            const damageEvent = {
                damageType: "thunder_property" /* Thunder */,
                damage: 3,
                toId: judgeEvent.toId,
                cardIds: [event.cardId],
                triggeredBySkills: event.triggeredBySkills ? [...event.triggeredBySkills, this.Name] : [this.Name],
            };
            await room.damage(damageEvent);
        }
        else {
            await this.moveToNextPlayer(room, cardId, judgeEvent.toId);
        }
        return true;
    }
    async onEffectRejected(room, event) {
        await this.moveToNextPlayer(room, event.cardId, event.toIds[0]);
    }
};
LightningSkill = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'lightning', description: 'lightning_description' }),
    skill_1.SelfTargetSkill
], LightningSkill);
exports.LightningSkill = LightningSkill;
