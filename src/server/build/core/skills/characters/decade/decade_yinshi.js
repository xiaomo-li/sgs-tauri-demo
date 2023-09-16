"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecadeYinShi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let DecadeYinShi = class DecadeYinShi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */ || stage === "AfterJudgeEffect" /* AfterJudgeEffect */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            return (damageEvent.toId === owner.Id &&
                (!damageEvent.cardIds || engine_1.Sanguosha.getCardById(damageEvent.cardIds[0]).Suit === 0 /* NoSuit */));
        }
        else if (identifier === 140 /* JudgeEvent */) {
            const judgeEvent = content;
            return judgeEvent.toId === owner.Id && room.isCardOnProcessing(judgeEvent.realJudgeCardId);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        return true;
    }
};
DecadeYinShi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'decade_yinshi', description: 'decade_yinshi_description' })
], DecadeYinShi);
exports.DecadeYinShi = DecadeYinShi;
