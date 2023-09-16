"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnGuo = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let AnGuo = class AnGuo extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const from = room.getPlayerById(fromId);
        const to = room.getPlayerById(toIds[0]);
        let flag = 1;
        for (const player of [to, from]) {
            if (flag % 2 !== 0 &&
                !room
                    .getOtherPlayers(player.Id)
                    .find(p => p.getCardIds(0 /* HandArea */).length < player.getCardIds(0 /* HandArea */).length)) {
                flag *= 2;
                await room.drawCards(1, player.Id, 'top', fromId, this.Name);
            }
            if (flag % 3 !== 0 && !room.getOtherPlayers(player.Id).find(p => p.Hp < player.Hp) && player.LostHp > 0) {
                flag *= 3;
                await room.recover({
                    toId: player.Id,
                    recoveredHp: 1,
                    recoverBy: fromId,
                });
            }
            if (flag % 5 !== 0 &&
                !room
                    .getOtherPlayers(player.Id)
                    .find(p => p.getCardIds(1 /* EquipArea */).length < player.getCardIds(1 /* EquipArea */).length)) {
                const equips = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [1 /* Equip */] }));
                if (equips.length > 0) {
                    const randomEquip = equips[Math.floor(Math.random() * equips.length)];
                    if (player.canUseCardTo(room, randomEquip, player.Id)) {
                        flag *= 5;
                        await room.useCard({
                            fromId: player.Id,
                            targetGroup: [[player.Id]],
                            cardId: randomEquip,
                            customFromArea: 5 /* DrawStack */,
                            triggeredBySkills: [this.Name],
                        });
                    }
                }
            }
        }
        return true;
    }
};
AnGuo = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'anguo', description: 'anguo_description' })
], AnGuo);
exports.AnGuo = AnGuo;
