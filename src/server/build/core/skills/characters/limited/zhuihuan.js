"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuiHuanBuff = exports.ZhuiHuan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhuiHuan = class ZhuiHuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return event.playerId === owner.Id && event.toStage === 19 /* FinishStageStart */;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget() {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        room.setFlag(event.toIds[0], this.Name, true, this.Name, [event.fromId]);
        room.getPlayerById(event.toIds[0]).hasShadowSkill(ZhuiHuanBuff.Name) ||
            (await room.obtainSkill(event.toIds[0], ZhuiHuanBuff.Name));
        return true;
    }
};
ZhuiHuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhuihuan', description: 'zhuihuan_description' })
], ZhuiHuan);
exports.ZhuiHuan = ZhuiHuan;
let ZhuiHuanBuff = class ZhuiHuanBuff extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        player.removeFlag(this.Name);
        player.getFlag(ZhuiHuan.Name) !== undefined && room.removeFlag(player.Id, ZhuiHuan.Name);
        await room.loseSkill(player.Id, this.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "DamageDone" /* DamageDone */;
    }
    isTriggerable(event, stage) {
        return stage === "DamageDone" /* DamageDone */ || stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = event;
            return damageEvent.toId === owner.Id && !!damageEvent.fromId;
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = event;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 3 /* PrepareStageStart */);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 137 /* DamageEvent */) {
            const sources = room.getFlag(event.fromId, this.Name) || [];
            const source = unknownEvent.fromId;
            if (!sources.includes(source)) {
                sources.push(source);
                room.getPlayerById(event.fromId).setFlag(this.Name, sources);
            }
        }
        else {
            const sources = room.getFlag(event.fromId, this.Name) || [];
            if (sources.length > 0) {
                room.sortPlayersByPosition(sources);
                for (const source of sources) {
                    const sourcePlayer = room.getPlayerById(source);
                    if (sourcePlayer.Dead) {
                        continue;
                    }
                    if (sourcePlayer.Hp > room.getPlayerById(event.fromId).Hp) {
                        await room.damage({
                            fromId: event.fromId,
                            toId: source,
                            damage: 2,
                            damageType: "normal_property" /* Normal */,
                            triggeredBySkills: [ZhuiHuan.Name],
                        });
                    }
                    else if (sourcePlayer.getCardIds(0 /* HandArea */).length > 0) {
                        let toDiscard = sourcePlayer
                            .getCardIds(0 /* HandArea */)
                            .filter(cardId => room.canDropCard(source, cardId));
                        toDiscard.length > 2 && (toDiscard = algorithm_1.Algorithm.randomPick(2, toDiscard));
                        await room.dropCards(4 /* SelfDrop */, toDiscard, source, source, ZhuiHuan.Name);
                    }
                }
            }
            room.getPlayerById(event.fromId).removeFlag(this.Name);
            room.getFlag(event.fromId, ZhuiHuan.Name) !== undefined && room.removeFlag(event.fromId, ZhuiHuan.Name);
            await room.loseSkill(event.fromId, this.Name);
        }
        return true;
    }
};
ZhuiHuanBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_zhuihuan_buff', description: 's_zhuihuan_buff_description' })
], ZhuiHuanBuff);
exports.ZhuiHuanBuff = ZhuiHuanBuff;
