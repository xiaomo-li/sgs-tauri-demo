"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuXieKeJiSkill = void 0;
const tslib_1 = require("tslib");
const wuxiekeji_1 = require("core/ai/skills/cards/wuxiekeji");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const system_1 = require("core/shares/libs/system");
const skill_1 = require("core/skills/skill");
let WuXieKeJiSkill = class WuXieKeJiSkill extends skill_1.ResponsiveSkill {
    responsiveFor() {
        return new card_matcher_1.CardMatcher({
            name: ['wuxiekeji'],
        });
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { responseToEvent, toCardIds } = event;
        if (!responseToEvent ||
            !toCardIds ||
            event_packer_1.EventPacker.getIdentifier(responseToEvent) !== 125 /* CardEffectEvent */) {
            return false;
        }
        responseToEvent.isCancelledOut = true;
        room.doNotify(room.AlivePlayers.map(player => player.Id), 1500);
        await system_1.System.MainThread.sleep(1500);
        return true;
    }
};
WuXieKeJiSkill = tslib_1.__decorate([
    skill_1.AI(wuxiekeji_1.WuXieKeJiSkillTrigger),
    skill_1.CommonSkill({ name: 'wuxiekeji', description: 'wuxiekeji_description' })
], WuXieKeJiSkill);
exports.WuXieKeJiSkill = WuXieKeJiSkill;
