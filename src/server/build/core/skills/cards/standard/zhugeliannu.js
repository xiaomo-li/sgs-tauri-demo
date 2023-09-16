"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuGeLianNuSlashSkill = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
let ZhuGeLianNuSlashSkill = class ZhuGeLianNuSlashSkill extends skill_1.RulesBreakerSkill {
    breakCardUsableTimes(cardId) {
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            match = engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        if (match) {
            return game_props_1.INFINITE_TRIGGERING_TIMES;
        }
        else {
            return 0;
        }
    }
};
ZhuGeLianNuSlashSkill = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhugeliannu', description: 'zhugeliannu_description' })
], ZhuGeLianNuSlashSkill);
exports.ZhuGeLianNuSlashSkill = ZhuGeLianNuSlashSkill;
