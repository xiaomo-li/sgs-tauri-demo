"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FenCheng = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let FenCheng = class FenCheng extends skill_1.ActiveSkill {
    canUse() {
        return true;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, SkillEffectEvent) {
        const { fromId } = SkillEffectEvent;
        let x = 1;
        for (const player of room.getOtherPlayers(fromId)) {
            const playerCardsLength = player.getPlayerCards().filter(id => room.canDropCard(player.Id, id)).length;
            const options = ['option-one', 'option-two'];
            playerCardsLength < x && options.shift();
            const askForChoosingOptionsEvent = {
                options,
                conversation: 'please choose: fencheng-options',
                toId: player.Id,
                askedBy: SkillEffectEvent.fromId,
                triggeredBySkills: [this.Name],
            };
            room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingOptionsEvent), player.Id);
            const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, player.Id);
            if (selectedOption === 'option-one') {
                const response = await room.askForCardDrop(player.Id, [x, playerCardsLength], [0 /* HandArea */, 1 /* EquipArea */], false, undefined, this.Name);
                if (response.droppedCards.length > 0) {
                    x = response.droppedCards.length + 1;
                    await room.dropCards(4 /* SelfDrop */, response.droppedCards, player.Id, player.Id, this.GeneralName);
                }
                else {
                    await room.damage({
                        fromId: SkillEffectEvent.fromId,
                        toId: player.Id,
                        damage: 2,
                        damageType: "fire_property" /* Fire */,
                        triggeredBySkills: [this.Name],
                    });
                }
            }
            else {
                await room.damage({
                    fromId: SkillEffectEvent.fromId,
                    toId: player.Id,
                    damage: 2,
                    damageType: "fire_property" /* Fire */,
                    triggeredBySkills: [this.Name],
                });
            }
        }
        return true;
    }
};
FenCheng = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'fencheng', description: 'fencheng_description' })
], FenCheng);
exports.FenCheng = FenCheng;
