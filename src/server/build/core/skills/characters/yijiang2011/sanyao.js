"use strict";
var SanYao_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanYao = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
let SanYao = SanYao_1 = class SanYao extends skill_1.ActiveSkill {
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    //TODO: use a shadow skill to remove flags
    async whenRefresh(room, owner) {
        room.removeFlag(owner.Id, SanYao_1.MostHp);
        room.removeFlag(owner.Id, SanYao_1.MostHandNum);
    }
    canUse(room, owner) {
        return owner.hasUsedSkillTimes(this.Name) < 2 && owner.getPlayerCards().length > 0;
    }
    numberOfTargets() {
        return [];
    }
    targetFilter(room, owner, targets, selectedCards) {
        return targets.length === selectedCards.length;
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableTarget(owner, room, target) {
        const ownerPlayer = room.getPlayerById(owner);
        const targetPlayer = room.getPlayerById(target);
        return ((ownerPlayer.getFlag(SanYao_1.MostHp) !== true &&
            room.getAlivePlayersFrom().find(player => player.Hp > targetPlayer.Hp) === undefined) ||
            (ownerPlayer.getFlag(SanYao_1.MostHandNum) !== true &&
                room
                    .getAlivePlayersFrom()
                    .find(player => player.getCardIds(0 /* HandArea */).length >
                    targetPlayer.getCardIds(0 /* HandArea */).length) === undefined));
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        const target = room.getPlayerById(toIds[0]);
        const from = room.getPlayerById(fromId);
        const hasMostHp = room.getOtherPlayers(toIds[0]).find(player => player.Hp > target.Hp) === undefined;
        const hasMostHandNum = room
            .getOtherPlayers(toIds[0])
            .find(player => player.getCardIds(0 /* HandArea */).length > target.getCardIds(0 /* HandArea */).length) === undefined;
        if (hasMostHp &&
            hasMostHandNum &&
            from.getFlag(SanYao_1.MostHp) !== true &&
            from.getFlag(SanYao_1.MostHandNum) !== true) {
            const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
                options: ['sanyao:hp', 'sanyao:handNum'],
                conversation: 'please choose sanyao options',
                toId: fromId,
                triggeredBySkills: [this.Name],
            });
            room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChooseEvent), fromId);
            const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
            response.selectedOption = response.selectedOption || askForChooseEvent.options[0];
            if (response.selectedOption === askForChooseEvent.options[1]) {
                room.setFlag(fromId, SanYao_1.MostHandNum, true);
            }
            else {
                room.setFlag(fromId, SanYao_1.MostHp, true);
            }
        }
        else if (hasMostHp) {
            room.setFlag(fromId, SanYao_1.MostHp, true);
        }
        else {
            room.setFlag(fromId, SanYao_1.MostHandNum, true);
        }
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        for (const toId of toIds) {
            const to = room.getPlayerById(toId);
            if (to.Dead) {
                continue;
            }
            await room.damage({
                fromId,
                toId,
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
SanYao.MostHp = 'SanYao_MostHp';
SanYao.MostHandNum = 'SanYao_MostHandNum';
SanYao = SanYao_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'sanyao', description: 'sanyao_description' })
], SanYao);
exports.SanYao = SanYao;
