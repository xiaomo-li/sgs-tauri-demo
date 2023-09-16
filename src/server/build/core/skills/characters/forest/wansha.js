"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WanSha = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let WanSha = class WanSha extends skill_1.GlobalFilterSkill {
    get RelatedCharacters() {
        return ['god_simayi'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    canUseCardTo(cardId, room, owner, from, to) {
        const inOwnersRound = room.CurrentPlayer.Id === owner.Id && to.Dying && from.Id !== to.Id;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            if (inOwnersRound && cardId.match(new card_matcher_1.CardMatcher({ name: ['peach'] }))) {
                return false;
            }
        }
        else {
            if (inOwnersRound && engine_1.Sanguosha.getCardById(cardId).GeneralName === 'peach') {
                return false;
            }
        }
        return true;
    }
};
WanSha = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'wansha', description: 'wansha_description' })
], WanSha);
exports.WanSha = WanSha;
