"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XianZhou = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XianZhou = class XianZhou extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.getCardIds(1 /* EquipArea */).length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        const from = room.getPlayerById(fromId);
        const equipsNum = from.getCardIds(1 /* EquipArea */).length;
        await room.moveCards({
            movingCards: from
                .getCardIds(1 /* EquipArea */)
                .map(card => ({ card, fromArea: 1 /* EquipArea */ })),
            fromId,
            toId: toIds[0],
            moveReason: 2 /* ActiveMove */,
            toArea: 0 /* HandArea */,
            proposer: fromId,
            movedByReason: this.Name,
        });
        const to = room.getPlayerById(toIds[0]);
        const availableTargets = room
            .getOtherPlayers(toIds[0])
            .filter(player => room.withinAttackDistance(to, player))
            .map(player => player.Id);
        if (availableTargets.length > 0) {
            const isWounded = from.MaxHp > from.Hp;
            const askForPlayerChoose = {
                toId: toIds[0],
                players: availableTargets,
                requiredAmount: [1, equipsNum],
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose at least {1} xianzhou {2} target(s) to deal 1 damage each?', this.Name, equipsNum, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
                triggeredBySkills: [this.Name],
            };
            const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, isWounded
                ? askForPlayerChoose
                : event_packer_1.EventPacker.createUncancellableEvent(askForPlayerChoose), toIds[0]);
            if (!isWounded) {
                response.selectedPlayers =
                    response.selectedPlayers || availableTargets.splice(0, Math.min(availableTargets.length, equipsNum));
            }
            if (response.selectedPlayers && response.selectedPlayers.length > 0) {
                room.sortPlayersByPosition(response.selectedPlayers);
                for (const player of response.selectedPlayers) {
                    await room.damage({
                        fromId: toIds[0],
                        damage: 1,
                        damageType: "normal_property" /* Normal */,
                        triggeredBySkills: [this.Name],
                        toId: player,
                    });
                }
            }
            else {
                await room.recover({
                    toId: fromId,
                    recoveredHp: equipsNum,
                    recoverBy: toIds[0],
                });
            }
        }
        else {
            await room.recover({
                toId: fromId,
                recoveredHp: equipsNum,
                recoverBy: toIds[0],
            });
        }
        return true;
    }
};
XianZhou = tslib_1.__decorate([
    skill_1.LimitSkill({ name: 'xianzhou', description: 'xianzhou_description' })
], XianZhou);
exports.XianZhou = XianZhou;
