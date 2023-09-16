"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JinkSkill = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
let JinkSkill = class JinkSkill extends skill_1.ResponsiveSkill {
    responsiveFor() {
        return new card_matcher_1.CardMatcher({
            name: ['jink'],
        });
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { responseToEvent, toCardIds } = event;
        if (responseToEvent !== undefined && toCardIds !== undefined) {
            if (event_packer_1.EventPacker.getIdentifier(responseToEvent) === 125 /* CardEffectEvent */) {
                responseToEvent.isCancelledOut = true;
            }
        }
        return true;
    }
};
JinkSkill = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jink', description: 'jink_description' })
], JinkSkill);
exports.JinkSkill = JinkSkill;
