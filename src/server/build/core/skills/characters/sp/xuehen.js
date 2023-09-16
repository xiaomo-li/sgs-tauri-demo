"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XueHen = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let XueHen = class XueHen extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    numberOfTargets() {
        return [];
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= Math.max(owner.LostHp, 1);
    }
    isAvailableTarget(owner, room, target) {
        return true;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId) && engine_1.Sanguosha.getCardById(cardId).isRed();
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        for (const toId of event.toIds) {
            await room.chainedOn(toId);
        }
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players: event.toIds,
            toId: event.fromId,
            requiredAmount: 1,
            conversation: 'xuehen: please choose a target to deal 1 fire damage',
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        response.selectedPlayers = response.selectedPlayers || [
            event.toIds[Math.floor(Math.random() * event.toIds.length)],
        ];
        await room.damage({
            fromId: event.fromId,
            toId: response.selectedPlayers[0],
            damage: 1,
            damageType: "fire_property" /* Fire */,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
XueHen = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xuehen', description: 'xuehen_description' })
], XueHen);
exports.XueHen = XueHen;
