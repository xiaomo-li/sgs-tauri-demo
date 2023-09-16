"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlcoholSkill = void 0;
const tslib_1 = require("tslib");
const alcohol_1 = require("core/ai/skills/cards/alcohol");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
let AlcoholSkill = class AlcoholSkill extends skill_1.ActiveSkill {
    constructor() {
        super(...arguments);
        this.recoverTag = 'recover';
    }
    canUse(room, owner, cardId) {
        return room.CommonRules.canUseCard(room, owner, engine_1.Sanguosha.getCardById(cardId));
    }
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isAvailableCard() {
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 0;
    }
    isCardAvailableTarget(owner, room, target) {
        const self = room.getPlayerById(owner);
        const player = room.getPlayerById(target);
        let isAvailable = true;
        if (self.Dying) {
            isAvailable = player.Hp < player.MaxHp;
        }
        return owner !== target && isAvailable;
    }
    isAvailableTarget() {
        return false;
    }
    async onUse(room, event) {
        precondition_1.Precondition.exists(event.fromId, 'no fromId for alcohol');
        const from = room.getPlayerById(event.fromId);
        if (from.Dying) {
            event_packer_1.EventPacker.addMiddleware({ tag: this.recoverTag, data: true }, event);
            event.extraUse = true;
        }
        event.targetGroup = [[event.fromId]];
        return true;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        const toId = precondition_1.Precondition.exists(toIds, 'no toIds for alcohol')[0];
        if (event_packer_1.EventPacker.getMiddleware(this.recoverTag, event)) {
            await room.recover({
                recoveredHp: 1,
                recoverBy: event.fromId,
                toId,
            });
        }
        else {
            room.getPlayerById(toId).getDrunk();
            room.broadcast(118 /* DrunkEvent */, { toId, drunk: true });
        }
        return true;
    }
};
AlcoholSkill = tslib_1.__decorate([
    skill_1.AI(alcohol_1.AlcoholSkillTrigger),
    skill_1.CommonSkill({ name: 'alcohol', description: 'alcohol_description' })
], AlcoholSkill);
exports.AlcoholSkill = AlcoholSkill;
