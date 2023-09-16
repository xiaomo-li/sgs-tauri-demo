"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeiJiShadow = exports.LeiJi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
// import { Precondition } from 'core/shares/libs/precondition/precondition';
let LeiJi = class LeiJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "CardResponsing" /* CardResponsing */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        return owner.Id === content.fromId && (card.GeneralName === 'jink' || card.GeneralName === 'lightning');
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.judge(skillUseEvent.fromId, undefined, this.Name);
        return true;
    }
};
LeiJi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'leiji', description: 'leiji_description' })
], LeiJi);
exports.LeiJi = LeiJi;
let LeiJiShadow = class LeiJiShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterJudgeEffect" /* AfterJudgeEffect */ && engine_1.Sanguosha.getCardById(event.judgeCardId).isBlack();
    }
    isAutoTrigger() {
        return true;
    }
    canUse(room, owner, content) {
        const judgeCard = engine_1.Sanguosha.getCardById(content.judgeCardId);
        return owner.Id === content.toId && (judgeCard.Suit === 3 /* Club */ || judgeCard.Suit === 1 /* Spade */);
    }
    // isAvailableTarget(owner: PlayerId, room: Room, target: PlayerId) {
    //   return owner !== target;
    // }
    // targetFilter(room: Room, owner: Player, targets: PlayerId[]) {
    //   return targets.length === 1;
    // }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const judgeEvent = triggeredOnEvent;
        const judgeCard = engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId);
        const from = room.getPlayerById(skillUseEvent.fromId);
        if (judgeCard.Suit !== 1 /* Spade */ && judgeCard.Suit !== 3 /* Club */) {
            return false;
        }
        const thunderDamageNum = judgeCard.Suit === 1 /* Spade */ ? 2 : 1;
        const askForChoosePlayer = {
            toId: from.Id,
            players: room.AlivePlayers.filter(player => player.Id !== from.Id).map(player => player.Id),
            requiredAmount: 1,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a target to deal {1} damage?', this.Name, thunderDamageNum).extract(),
            triggeredBySkills: [this.Name],
        };
        room.notify(167 /* AskForChoosingPlayerEvent */, askForChoosePlayer, from.Id);
        const resp = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, from.Id);
        if (resp.selectedPlayers !== undefined && resp.selectedPlayers[0] !== undefined) {
            await room.damage({
                fromId: from.Id,
                toId: resp.selectedPlayers[0],
                damage: thunderDamageNum,
                damageType: "thunder_property" /* Thunder */,
                triggeredBySkills: [this.Name],
            });
            if (judgeCard.Suit === 3 /* Club */) {
                if (from.Hp < from.MaxHp) {
                    await room.recover({ recoveredHp: 1, recoverBy: from.Id, toId: from.Id, triggeredBySkills: [this.Name] });
                }
            }
        }
        return true;
    }
};
LeiJiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CommonSkill({ name: LeiJi.Name, description: LeiJi.Description })
], LeiJiShadow);
exports.LeiJiShadow = LeiJiShadow;
