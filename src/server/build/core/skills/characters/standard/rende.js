"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenDeShadow = exports.Rende = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
let Rende = class Rende extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && !room.getPlayerById(target).getFlag(this.Name);
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.moveCards({
            movingCards: skillUseEvent.cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId: skillUseEvent.fromId,
            toId: skillUseEvent.toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: skillUseEvent.fromId,
            movedByReason: this.Name,
        });
        room.setFlag(skillUseEvent.toIds[0], this.Name, true);
        const from = room.getPlayerById(skillUseEvent.fromId);
        from.addInvisibleMark(this.Name, skillUseEvent.cardIds.length);
        if (from.getInvisibleMark(this.Name) >= 2 && from.getInvisibleMark(this.Name + '-used') === 0) {
            const hasLegionFightExt = room.Info.cardExtensions.includes("legion_fight" /* LegionFight */);
            const options = [];
            if (from.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['peach'] }))) {
                options.push('peach');
            }
            if (hasLegionFightExt && from.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['alcohol'] }))) {
                options.push('alcohol');
            }
            if (from.canUseCard(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }))) {
                options.push('slash');
                if (hasLegionFightExt) {
                    options.push('fire_slash');
                    options.push('thunder_slash');
                }
            }
            if (options.length === 0) {
                return true;
            }
            const chooseEvent = {
                options,
                askedBy: skillUseEvent.fromId,
                conversation: 'please choose a basic card to use',
                toId: skillUseEvent.fromId,
                triggeredBySkills: [this.Name],
            };
            room.notify(168 /* AskForChoosingOptionsEvent */, chooseEvent, skillUseEvent.fromId);
            const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, skillUseEvent.fromId);
            if (!response.selectedOption) {
                return true;
            }
            else if (response.selectedOption === 'slash' ||
                response.selectedOption === 'thunder_slash' ||
                response.selectedOption === 'fire_slash') {
                const targets = [];
                for (const player of room.AlivePlayers) {
                    if (player === room.CurrentPlayer || !room.canAttack(from, player)) {
                        continue;
                    }
                    targets.push(player.Id);
                }
                const choosePlayerEvent = {
                    players: targets,
                    toId: from.Id,
                    requiredAmount: 1,
                    conversation: 'Please choose your slash target',
                    triggeredBySkills: [this.Name],
                };
                room.notify(167 /* AskForChoosingPlayerEvent */, choosePlayerEvent, from.Id);
                const choosePlayerResponse = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, from.Id);
                if (choosePlayerResponse.selectedPlayers !== undefined) {
                    const slashUseEvent = {
                        fromId: from.Id,
                        cardId: card_1.VirtualCard.create({
                            cardName: response.selectedOption,
                            bySkill: this.Name,
                        }).Id,
                        targetGroup: [choosePlayerResponse.selectedPlayers],
                    };
                    await room.useCard(slashUseEvent);
                }
            }
            else {
                const cardUseEvent = {
                    fromId: from.Id,
                    cardId: card_1.VirtualCard.create({
                        cardName: response.selectedOption,
                        bySkill: this.Name,
                    }).Id,
                };
                await room.useCard(cardUseEvent);
            }
            from.addInvisibleMark(this.Name + '-used', 1);
        }
        return true;
    }
};
Rende = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'rende', description: 'rende_description' })
], Rende);
exports.Rende = Rende;
let RenDeShadow = class RenDeShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */ && event.from === 4 /* PlayCardStage */;
    }
    canUse(room, owner, content) {
        return content.fromPlayer === owner.Id;
    }
    isFlaggedSkill() {
        return true;
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent } = event;
        const phaseChangeEvent = precondition_1.Precondition.exists(triggeredOnEvent, 'Unknown phase change event in rende');
        if (phaseChangeEvent.fromPlayer) {
            const player = room.getPlayerById(phaseChangeEvent.fromPlayer);
            player.removeInvisibleMark(this.GeneralName);
            player.removeInvisibleMark(this.GeneralName + '-used');
            for (const player of room.getOtherPlayers(phaseChangeEvent.fromPlayer)) {
                room.removeFlag(player.Id, this.GeneralName);
            }
        }
        return true;
    }
};
RenDeShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: Rende.GeneralName, description: Rende.Description })
], RenDeShadow);
exports.RenDeShadow = RenDeShadow;
