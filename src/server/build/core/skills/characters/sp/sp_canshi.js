"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPCanShi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let SPCanShi = class SPCanShi extends skill_1.TriggerSkill {
    isAutoTrigger(room, owner, event) {
        return event !== undefined && event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */ || stage === "AfterCardTargetDeclared" /* AfterCardTargetDeclared */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 131 /* AimEvent */) {
            const aimEvent = content;
            return (aimEvent.toId === owner.Id &&
                room.getMark(aimEvent.fromId, "kui" /* Kui */) > 0 &&
                (engine_1.Sanguosha.getCardById(aimEvent.byCardId).is(0 /* Basic */) ||
                    engine_1.Sanguosha.getCardById(aimEvent.byCardId).isCommonTrick()) &&
                aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets).length === 1);
        }
        else if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            return (cardUseEvent.fromId === owner.Id &&
                (engine_1.Sanguosha.getCardById(cardUseEvent.cardId).is(0 /* Basic */) ||
                    engine_1.Sanguosha.getCardById(cardUseEvent.cardId).isCommonTrick()));
        }
        return false;
    }
    async beforeUse(room, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event.triggeredOnEvent;
            const players = room
                .getAlivePlayersFrom()
                .map(player => player.Id)
                .filter(playerId => room.getMark(playerId, "kui" /* Kui */) > 0 &&
                !target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).includes(playerId) &&
                room.isAvailableTarget(cardUseEvent.cardId, event.fromId, playerId) &&
                engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Skill.isCardAvailableTarget(event.fromId, room, playerId, [], [], cardUseEvent.cardId));
            const allTargets = target_group_1.TargetGroupUtil.getAllTargets(cardUseEvent.targetGroup);
            if (players.length > 0 && allTargets !== undefined) {
                if (allTargets[0].length === 1) {
                    const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                        players,
                        toId: event.fromId,
                        requiredAmount: [1, players.length],
                        conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please select at least Kuis to append to {1} targets', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardUseEvent.cardId)).extract(),
                        triggeredBySkills: [this.Name],
                    }, event.fromId);
                    if (resp.selectedPlayers && resp.selectedPlayers.length > 0) {
                        event.toIds = resp.selectedPlayers;
                        return true;
                    }
                }
                else if (allTargets[0].length > 1) {
                    const targets = target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup);
                    const chosen = [];
                    while (players.length > 0) {
                        const { selectedPlayers } = await room.doAskForCommonly(174 /* AskForChoosingCardAvailableTargetEvent */, {
                            user: event.fromId,
                            cardId: cardUseEvent.cardId,
                            exclude: targets,
                            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please select a Kui to append to {1} targets', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardUseEvent.cardId)).extract(),
                            triggeredBySkills: [this.Name],
                        }, event.fromId);
                        if (!selectedPlayers || selectedPlayers.length < 2) {
                            break;
                        }
                        else {
                            chosen.push(selectedPlayers);
                            targets.push(selectedPlayers[0]);
                            const index = players.findIndex(player => player === selectedPlayers[0]);
                            index !== -1 && players.splice(index, 1);
                        }
                    }
                    if (chosen.length > 0) {
                        for (const selected of chosen) {
                            target_group_1.TargetGroupUtil.pushTargets(cardUseEvent.targetGroup, selected);
                            room.removeMark(selected[0], "kui" /* Kui */);
                        }
                        event.toIds = [];
                        return true;
                    }
                }
            }
        }
        return identifier === 131 /* AimEvent */;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to cancel {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.byCardId)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 131 /* AimEvent */) {
            const aimEvent = unknownEvent;
            aim_group_1.AimGroupUtil.cancelTarget(aimEvent, event.fromId);
            room.removeMark(aimEvent.fromId, "kui" /* Kui */);
        }
        else {
            if (!event.toIds) {
                return false;
            }
            if (event.toIds.length > 0) {
                for (const toId of event.toIds) {
                    target_group_1.TargetGroupUtil.pushTargets(unknownEvent.targetGroup, toId);
                    room.removeMark(toId, "kui" /* Kui */);
                }
            }
        }
        return true;
    }
};
SPCanShi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'sp_canshi', description: 'sp_canshi_description' })
], SPCanShi);
exports.SPCanShi = SPCanShi;
