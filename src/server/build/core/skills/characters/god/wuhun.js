"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuHunDeath = exports.WuHun = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WuHun = class WuHun extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId && !!content.fromId && !room.getPlayerById(content.fromId).Dead;
    }
    triggerableTimes(event) {
        return event.damage;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const damageEvent = triggeredOnEvent;
        room.addMark(damageEvent.fromId, "nightmare" /* Nightmare */, 1);
        return true;
    }
};
WuHun = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'wuhun', description: 'wuhun_description' })
], WuHun);
exports.WuHun = WuHun;
let WuHunDeath = class WuHunDeath extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            room.getOtherPlayers(owner.Id).find(player => player.getMark("nightmare" /* Nightmare */) > 0) !== undefined);
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const owner = room.getPlayerById(event.fromId);
        const alivePlayers = room.getAlivePlayersFrom();
        let maxMarkNum = 0;
        for (const player of alivePlayers) {
            if (player.getMark("nightmare" /* Nightmare */) > maxMarkNum) {
                maxMarkNum = player.getMark("nightmare" /* Nightmare */);
            }
        }
        const revengeList = [];
        for (const player of alivePlayers) {
            if (player.getMark("nightmare" /* Nightmare */) === maxMarkNum) {
                revengeList.push(player);
            }
            if (player.getMark("nightmare" /* Nightmare */) > 0) {
                room.removeMark(player.Id, "nightmare" /* Nightmare */);
            }
        }
        let sacrificer;
        if (revengeList.length === 1) {
            sacrificer = revengeList[0];
        }
        else if (revengeList.length > 1) {
            const choosePlayerEvent = {
                players: revengeList.map(player => player.Id),
                toId: owner.Id,
                requiredAmount: 1,
                conversation: 'wuhun:Please choose a target to die with you',
                triggeredBySkills: [this.Name],
            };
            room.notify(167 /* AskForChoosingPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(choosePlayerEvent), owner.Id);
            const choosePlayerResponse = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, owner.Id);
            sacrificer = room.getPlayerById(choosePlayerResponse.selectedPlayers[0]);
        }
        else {
            return false;
        }
        const judge = await room.judge(sacrificer.Id, undefined, this.GeneralName, 6 /* WuHun */);
        const judgeCard = engine_1.Sanguosha.getCardById(judge.judgeCardId);
        if (judge_matchers_1.JudgeMatcher.onJudge(judge.judgeMatcherEnum, judgeCard)) {
            room.broadcast(103 /* CustomGameDialog */, {
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} use skill {1}, bring {2} to hell', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(owner), this.GeneralName, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(sacrificer.Id))).extract(),
            });
            await room.kill(sacrificer, owner.Id);
        }
        return true;
    }
};
WuHunDeath = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: WuHun.Name, description: WuHun.Description })
], WuHunDeath);
exports.WuHunDeath = WuHunDeath;
