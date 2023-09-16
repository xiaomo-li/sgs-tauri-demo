"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingXi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QingXi = class QingXi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            (engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' ||
                engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'duel'));
    }
    getSkillLog(room, owner, content) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use this skill to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.toId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const aimEvent = event.triggeredOnEvent;
        const weapon = room.getPlayerById(fromId).getEquipment(2 /* Weapon */);
        const withinAttackRange = Math.min(room.getOtherPlayers(fromId).filter(player => room.withinAttackDistance(room.getPlayerById(fromId), player))
            .length, weapon ? 4 : 2);
        let option2 = true;
        if (withinAttackRange > 0 && room.getPlayerById(aimEvent.toId).getCardIds(0 /* HandArea */).length > 0) {
            const response = await room.askForCardDrop(aimEvent.toId, withinAttackRange, [0 /* HandArea */], false, undefined, this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please drop {1} card(s), or {2} will deal 1 more damage to you', this.Name, withinAttackRange, translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId)).extract());
            if (response.droppedCards.length > 0) {
                option2 = false;
                await room.dropCards(4 /* SelfDrop */, response.droppedCards, aimEvent.toId, aimEvent.toId, this.Name);
                weapon && (await room.dropCards(5 /* PassiveDrop */, [weapon], fromId, aimEvent.toId, this.Name));
            }
        }
        if (option2) {
            aimEvent.additionalDamage = aimEvent.additionalDamage || 0;
            aimEvent.additionalDamage++;
            const judgeEvent = await room.judge(fromId, undefined, this.Name, 12 /* QingXi */);
            if (judge_matchers_1.JudgeMatcher.onJudge(judgeEvent.judgeMatcherEnum, engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId))) {
                event_packer_1.EventPacker.setDisresponsiveEvent(aimEvent);
            }
        }
        return true;
    }
};
QingXi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'qingxi', description: 'qingxi_description' })
], QingXi);
exports.QingXi = QingXi;
