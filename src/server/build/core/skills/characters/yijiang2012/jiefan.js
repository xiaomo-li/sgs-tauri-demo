"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieFanRefresh = exports.JieFan = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JieFan = class JieFan extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return true;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        const to = room.getPlayerById(toIds[0]);
        const targets = room.getOtherPlayers(toIds[0]).filter(player => room.withinAttackDistance(player, to));
        for (const player of targets) {
            const response = await room.askForCardDrop(player.Id, 1, [0 /* HandArea */, 1 /* EquipArea */], false, player.getPlayerCards().filter(cardId => !engine_1.Sanguosha.getCardById(cardId).is(2 /* Weapon */)), this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please drop a weapon, or {1} will draw a card', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract());
            if (response.droppedCards.length > 0) {
                await room.dropCards(4 /* SelfDrop */, response.droppedCards, player.Id, player.Id, this.Name);
            }
            else {
                await room.drawCards(1, toIds[0], 'top', player.Id, this.Name);
            }
        }
        if (room.Circle === 1) {
            room.getPlayerById(event.fromId).setFlag(this.Name, true);
        }
        return true;
    }
};
JieFan = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'jiefan', description: 'jiefan_description' })
], JieFan);
exports.JieFan = JieFan;
let JieFanRefresh = class JieFanRefresh extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.fromPlayer &&
            event.from === 7 /* PhaseFinish */ &&
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        room.refreshPlayerOnceSkill(event.fromId, this.GeneralName);
        return true;
    }
};
JieFanRefresh = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: JieFan.Name, description: JieFan.Description })
], JieFanRefresh);
exports.JieFanRefresh = JieFanRefresh;
