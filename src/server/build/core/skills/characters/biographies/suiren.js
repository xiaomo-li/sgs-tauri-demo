"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuiRen = void 0;
const tslib_1 = require("tslib");
const card_props_1 = require("core/cards/libs/card_props");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let SuiRen = class SuiRen extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            owner
                .getCardIds(0 /* HandArea */)
                .find(id => Object.values(card_props_1.DamageCardEnum).includes(engine_1.Sanguosha.getCardById(id).GeneralName)) !==
                undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a another player to give him all the damage cards in your hand?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        await room.moveCards({
            movingCards: room
                .getPlayerById(event.fromId)
                .getCardIds(0 /* HandArea */)
                .filter(id => Object.values(card_props_1.DamageCardEnum).includes(engine_1.Sanguosha.getCardById(id).GeneralName))
                .map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId: event.fromId,
            toId: event.toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: event.fromId,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
SuiRen = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'suiren', description: 'suiren_description' })
], SuiRen);
exports.SuiRen = SuiRen;
