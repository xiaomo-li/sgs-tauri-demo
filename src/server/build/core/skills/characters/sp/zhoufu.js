"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhouFuDebuff = exports.ZhouFu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skills_1 = require("core/skills");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhouFu = class ZhouFu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return (target !== owner && room.getPlayerById(target).getCardIds(3 /* OutsideArea */, this.Name).length === 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: 0 /* HandArea */ }],
            fromId: event.fromId,
            toId: event.toIds[0],
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: this.Name,
            isOutsideAreaInPublic: true,
            triggeredBySkills: [this.Name],
        });
        room.getPlayerById(event.toIds[0]).hasShadowSkill(ZhouFuDebuff.Name) ||
            (await room.obtainSkill(event.toIds[0], ZhouFuDebuff.Name));
        return true;
    }
};
ZhouFu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhoufu', description: 'zhoufu_description' })
], ZhouFu);
exports.ZhouFu = ZhouFu;
let ZhouFuDebuff = class ZhouFuDebuff extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        player.removeFlag(this.Name);
        await room.loseSkill(player.Id, this.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return (stage === "beforeJudge" /* BeforeJudge */ ||
            stage === "PhaseChanged" /* PhaseChanged */ ||
            stage === "CardMoving" /* CardMoving */);
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.to === 7 /* PhaseFinish */ && owner.getFlag(this.Name) === true;
        }
        else if (identifier === 140 /* JudgeEvent */) {
            const judgeEvent = event;
            return judgeEvent.toId === owner.Id && owner.getCardIds(3 /* OutsideArea */, ZhouFu.Name).length > 0;
        }
        else if (identifier === 128 /* MoveCardEvent */) {
            return (event.infos.find(info => info.fromId === owner.Id &&
                info.movingCards.find(card => card.fromArea === 3 /* OutsideArea */ && owner.getOutsideAreaNameOf(card.card) === ZhouFu.Name)) !== undefined);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 140 /* JudgeEvent */) {
            const judgeEvent = unknownEvent;
            judgeEvent.realJudgeCardId = room
                .getPlayerById(event.fromId)
                .getCardIds(3 /* OutsideArea */, ZhouFu.Name)[0];
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            room.getPlayerById(event.fromId).removeFlag(this.Name);
            await room.loseHp(event.fromId, 1);
            room.getPlayerById(event.fromId).getCardIds(3 /* OutsideArea */, ZhouFu.Name).length === 0 &&
                (await room.loseSkill(event.fromId, this.Name));
        }
        else {
            for (const player of room.getAllPlayersFrom()) {
                if (player.getFlag(skills_1.YingBing.Name) === event.fromId) {
                    player.removeFlag(skills_1.YingBing.Name);
                }
            }
            room.getPlayerById(event.fromId).setFlag(this.Name, true);
        }
        return true;
    }
};
ZhouFuDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_zhoufu_debuff', description: 's_zhoufu_debuff_description' })
], ZhouFuDebuff);
exports.ZhouFuDebuff = ZhouFuDebuff;
