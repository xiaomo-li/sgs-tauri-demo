"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZenHuiShadow = exports.ZenHui = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZenHui = class ZenHui extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */ && aim_group_1.AimGroupUtil.getAllTargets(event.allTargets).length === 1;
    }
    canUse(room, owner, event) {
        const card = engine_1.Sanguosha.getCardById(event.byCardId);
        return (owner.Id === event.fromId &&
            !owner.getFlag(this.Name) &&
            room.CurrentPlayer === owner &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            (card.GeneralName === 'slash' ||
                (card.is(7 /* Trick */) && !card.is(8 /* DelayedTrick */) && card.isBlack())) &&
            room
                .getAlivePlayersFrom()
                .map(player => player.Id)
                .find(playerId => !aim_group_1.AimGroupUtil.getAllTargets(event.allTargets).includes(playerId) &&
                room.isAvailableTarget(event.byCardId, owner.Id, playerId) &&
                engine_1.Sanguosha.getCardById(event.byCardId).Skill.isCardAvailableTarget(owner.Id, room, playerId, [], [], event.byCardId)) !== undefined);
    }
    async beforeUse(room, event) {
        const aimEvent = event.triggeredOnEvent;
        const { selectedPlayers } = await room.doAskForCommonly(174 /* AskForChoosingCardAvailableTargetEvent */, {
            user: event.fromId,
            cardId: aimEvent.byCardId,
            exclude: aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets),
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please select a player who can be the target of {1}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId), this.Name).extract(),
            triggeredBySkills: [this.Name],
        }, event.fromId);
        if (selectedPlayers) {
            event.toIds = selectedPlayers;
            return true;
        }
        return false;
    }
    getAnimationSteps(event) {
        const step = [{ from: event.fromId, tos: [event.toIds[0]] }];
        if (event.toIds.length > 1) {
            step.push({ from: event.toIds[0], tos: event.toIds.slice(1, event.toIds.length) });
        }
        return step;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, triggeredOnEvent } = event;
        if (!toIds) {
            return false;
        }
        const aimEvent = triggeredOnEvent;
        let option2 = true;
        if (room.getPlayerById(fromId).getCardIds(0 /* HandArea */).length > 0) {
            const { selectedCards } = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                cardAmount: 1,
                toId: toIds[0],
                reason: this.Name,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please give a card to {1}, or you will be the new target of {2}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId)).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }, toIds[0]);
            if (selectedCards.length > 0) {
                option2 = false;
                await room.moveCards({
                    movingCards: [{ card: selectedCards[0], fromArea: room.getPlayerById(toIds[0]).cardFrom(selectedCards[0]) }],
                    fromId: toIds[0],
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    proposer: toIds[0],
                    moveReason: 2 /* ActiveMove */,
                    triggeredBySkills: [this.Name],
                });
                aimEvent.fromId = toIds[0];
            }
        }
        if (option2) {
            aim_group_1.AimGroupUtil.addTargets(room, aimEvent, toIds);
            room.getPlayerById(fromId).setFlag(this.Name, true);
        }
        return true;
    }
};
ZenHui.Targets = 'Zenhui_Targets';
ZenHui = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zenhui', description: 'zenhui_description' })
], ZenHui);
exports.ZenHui = ZenHui;
let ZenHuiShadow = class ZenHuiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
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
            event.from === 4 /* PlayCardStage */ &&
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
ZenHuiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: ZenHui.Name, description: ZenHui.Description })
], ZenHuiShadow);
exports.ZenHuiShadow = ZenHuiShadow;
