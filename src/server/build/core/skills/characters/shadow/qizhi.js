"use strict";
var QiZhi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiZhiShadow = exports.QiZhi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QiZhi = QiZhi_1 = class QiZhi extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, phase) {
        return phase === 7 /* PhaseFinish */;
    }
    isTriggerable(event, stage) {
        return (stage === "AfterAim" /* AfterAim */ &&
            (engine_1.Sanguosha.getCardById(event.byCardId).is(0 /* Basic */) ||
                engine_1.Sanguosha.getCardById(event.byCardId).is(7 /* Trick */)) &&
            event.isFirstTarget);
    }
    canUse(room, owner, event) {
        let canUse = owner.Id === event.fromId && room.CurrentPlayer === owner;
        const allTargets = aim_group_1.AimGroupUtil.getAllTargets(event.allTargets);
        if (canUse) {
            const availableTargets = room
                .getAlivePlayersFrom()
                .filter(player => (player === owner
                ? player.getPlayerCards().find(id => room.canDropCard(player.Id, id))
                : player.getPlayerCards().length > 0) && !allTargets.includes(player.Id));
            canUse = availableTargets.length > 0;
            if (canUse) {
                room.setFlag(owner.Id, QiZhi_1.Targets, availableTargets.map(player => player.Id));
            }
        }
        return canUse;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    isAvailableTarget(owner, room, targetId) {
        const cardTargets = room.getPlayerById(owner).getFlag(QiZhi_1.Targets);
        return cardTargets.includes(targetId);
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to drop 1 hand card of another player, and this player will draw a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        const to = room.getPlayerById(toIds[0]);
        const times = room.getFlag(fromId, this.Name) || 0;
        room.setFlag(fromId, this.Name, times + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('qizhi times: {0}', times + 1).toString());
        const options = {
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
        };
        if (fromId === toIds[0]) {
            options[0 /* HandArea */] = to.getCardIds(0 /* HandArea */);
        }
        const chooseCardEvent = {
            fromId,
            toId: toIds[0],
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
        if (!response) {
            return false;
        }
        if (response.selectedCard !== undefined) {
            await room.dropCards(fromId === toIds[0] ? 4 /* SelfDrop */ : 5 /* PassiveDrop */, [response.selectedCard], toIds[0], fromId, this.Name);
            await room.drawCards(1, toIds[0], 'top', fromId, this.Name);
        }
        return true;
    }
};
QiZhi.Targets = 'Qizhi_Targets';
QiZhi = QiZhi_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qizhi', description: 'qizhi_description' })
], QiZhi);
exports.QiZhi = QiZhi;
let QiZhiShadow = class QiZhiShadow extends skill_1.TriggerSkill {
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
        return true;
    }
};
QiZhiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: QiZhi.Name, description: QiZhi.Description })
], QiZhiShadow);
exports.QiZhiShadow = QiZhiShadow;
