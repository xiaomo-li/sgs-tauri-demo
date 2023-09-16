"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZongKui = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZongKui = class ZongKui extends skill_1.TriggerSkill {
    isAutoTrigger(room, owner, event) {
        return event !== undefined && event_packer_1.EventPacker.getIdentifier(event) === 144 /* CircleStartEvent */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */ || stage === "AfterCircleStarted" /* AfterCircleStarted */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return (phaseChangeEvent.to === 0 /* PhaseBegin */ &&
                phaseChangeEvent.toPlayer === owner.Id &&
                room.getOtherPlayers(owner.Id).find(player => player.getMark("kui" /* Kui */) === 0) !== undefined);
        }
        else if (identifier === 144 /* CircleStartEvent */) {
            const minimun = room.getOtherPlayers(owner.Id).reduce((min, player) => {
                player.Hp < min && (min = player.Hp);
                return min;
            }, room.getOtherPlayers(owner.Id)[0].Hp);
            return (room.getOtherPlayers(owner.Id).find(player => player.getMark("kui" /* Kui */) === 0 && player.Hp === minimun) !==
                undefined);
        }
        return false;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getMark(target, "kui" /* Kui */) === 0;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to gain 1 ‘Kui’ token?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent) ===
            104 /* PhaseChangeEvent */) {
            if (!event.toIds) {
                return false;
            }
            room.addMark(event.toIds[0], "kui" /* Kui */, 1);
        }
        else {
            const minimun = room.getOtherPlayers(event.fromId).reduce((min, player) => {
                player.Hp < min && (min = player.Hp);
                return min;
            }, room.getOtherPlayers(event.fromId)[0].Hp);
            const players = room
                .getOtherPlayers(event.fromId)
                .filter(player => player.getMark("kui" /* Kui */) === 0 && player.Hp === minimun)
                .map(player => player.Id);
            let chosen = players[0];
            if (players.length > 1) {
                const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                    players,
                    toId: event.fromId,
                    requiredAmount: 1,
                    conversation: 'zongkui: please choose a target to gain 1 ‘Kui’ token',
                    triggeredBySkills: [this.Name],
                }, event.fromId, true);
                resp.selectedPlayers = resp.selectedPlayers || [players[Math.floor(Math.random() * players.length)]];
                chosen = resp.selectedPlayers[0];
            }
            room.addMark(chosen, "kui" /* Kui */, 1);
        }
        return true;
    }
};
ZongKui = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zongkui', description: 'zongkui_description' })
], ZongKui);
exports.ZongKui = ZongKui;
