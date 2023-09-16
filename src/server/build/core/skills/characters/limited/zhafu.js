"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhaFuDebuff = exports.ZhaFu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhaFu = class ZhaFu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
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
        const originalPlayers = room.getFlag(toIds[0], this.Name) || [];
        originalPlayers.includes(fromId) || originalPlayers.push(fromId);
        room.setFlag(toIds[0], this.Name, originalPlayers, this.Name);
        room.getPlayerById(toIds[0]).hasShadowSkill(ZhaFuDebuff.Name) ||
            (await room.obtainSkill(toIds[0], ZhaFuDebuff.Name));
        return true;
    }
};
ZhaFu = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'zhafu', description: 'zhafu_description' })
], ZhaFu);
exports.ZhaFu = ZhaFu;
let ZhaFuDebuff = class ZhaFuDebuff extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (content.playerId === owner &&
            content.toStage === 16 /* DropCardStageStart */ &&
            stage === "StageChanged" /* StageChanged */);
    }
    async whenDead(room, player) {
        await room.loseSkill(player.Id, this.Name);
        room.removeFlag(player.Id, ZhaFu.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return event.playerId === owner.Id && event.toStage === 16 /* DropCardStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const players = room.getFlag(event.fromId, ZhaFu.Name).slice();
        if (players) {
            room.removeFlag(event.fromId, ZhaFu.Name);
            if (players.length > 0) {
                room.sortPlayersByPosition(players);
                for (const player of players) {
                    const handCards = room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */);
                    if (handCards.length < 2) {
                        break;
                    }
                    if (room.getPlayerById(player).Dead) {
                        continue;
                    }
                    const response = await room.doAskForCommonly(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                        cardAmount: 1,
                        toId: event.fromId,
                        reason: this.Name,
                        conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a hand card, give the other cards to {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(player))).extract(),
                        fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                        triggeredBySkills: [this.Name],
                    }), event.fromId, true);
                    response.selectedCards =
                        response.selectedCards.length > 0
                            ? response.selectedCards
                            : [handCards[Math.floor(Math.random() * handCards.length)]];
                    await room.moveCards({
                        movingCards: handCards
                            .filter(id => id !== response.selectedCards[0])
                            .map(card => ({ card, fromArea: 0 /* HandArea */ })),
                        fromId: event.fromId,
                        toId: player,
                        toArea: 0 /* HandArea */,
                        moveReason: 2 /* ActiveMove */,
                        proposer: event.fromId,
                        triggeredBySkills: [this.Name],
                    });
                }
            }
        }
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
ZhaFuDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_zhafu_debuff', description: 's_zhafu_debuff_description' })
], ZhaFuDebuff);
exports.ZhaFuDebuff = ZhaFuDebuff;
