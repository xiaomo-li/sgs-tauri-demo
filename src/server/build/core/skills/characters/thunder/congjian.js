"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CongJian = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let CongJian = class CongJian extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['tongyuan_c'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        const allTargets = aim_group_1.AimGroupUtil.getAllTargets(content.allTargets);
        if (content.toId === owner.Id &&
            content.byCardId &&
            engine_1.Sanguosha.getCardById(content.byCardId).is(7 /* Trick */) &&
            content.allTargets &&
            allTargets.length > 1) {
            room.setFlag(owner.Id, this.Name, allTargets.filter(target => target !== owner.Id));
            return true;
        }
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard() {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.getFlag(owner, this.Name).includes(target);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to give a card to another target?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        const type = engine_1.Sanguosha.getCardById(cardIds[0]).BaseType;
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: room.getPlayerById(fromId).cardFrom(cardIds[0]) }],
            fromId,
            toId: toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        if (type === 1 /* Equip */) {
            await room.drawCards(2, fromId, 'top', fromId, this.Name);
        }
        else {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        return true;
    }
};
CongJian = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'congjian', description: 'congjian_description' })
], CongJian);
exports.CongJian = CongJian;
