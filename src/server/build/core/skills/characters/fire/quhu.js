"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuHu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QuHu = class QuHu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        const player = room.getPlayerById(owner);
        const targetPlayer = room.getPlayerById(target);
        return (target !== owner &&
            player.Hp < targetPlayer.Hp &&
            targetPlayer.getCardIds(0 /* HandArea */).length > 0 &&
            room.canPindian(owner, target));
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { toIds, fromId } = event;
        const { pindianRecord } = await room.pindian(fromId, toIds, this.Name);
        if (!pindianRecord.length) {
            return false;
        }
        const target = room.getPlayerById(toIds[0]);
        if (pindianRecord[0].winner === fromId) {
            const askForChoosingPlayer = {
                toId: fromId,
                players: room.AlivePlayers.filter(player => room.withinAttackDistance(target, player)).map(player => player.Id),
                requiredAmount: 1,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('please choose a player to get a damage from {0}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(target)).extract(),
                triggeredBySkills: [this.Name],
            };
            room.notify(167 /* AskForChoosingPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingPlayer), fromId);
            const { selectedPlayers } = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, fromId);
            await room.damage({
                fromId: target.Id,
                toId: selectedPlayers[0],
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            await room.damage({
                fromId: target.Id,
                toId: fromId,
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
QuHu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'quhu', description: 'quhu_description' })
], QuHu);
exports.QuHu = QuHu;
