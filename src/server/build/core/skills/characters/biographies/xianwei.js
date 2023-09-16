"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XianWeiBuff = exports.XianWei = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XianWei = class XianWei extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 3 /* PrepareStageStart */ &&
            owner.AvailableEquipSections.length > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent({
            options: from.AvailableEquipSections,
            toId: fromId,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose and abort an equip section', this.Name).extract(),
            triggeredBySkills: [this.Name],
        }), fromId);
        response.selectedOption = response.selectedOption || from.AvailableEquipSections[0];
        await room.abortPlayerEquipSections(fromId, response.selectedOption);
        await room.drawCards(from.AvailableEquipSections.length, fromId, 'top', fromId, this.Name);
        const others = room.getOtherPlayers(fromId).map(player => player.Id);
        const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players: others,
            toId: fromId,
            requiredAmount: 1,
            conversation: 'xianwei: please choose a target to use equip from draw pile',
            triggeredBySkills: [this.Name],
        }, fromId, true);
        resp.selectedPlayers = resp.selectedPlayers || [others[Math.floor(Math.random() * others.length)]];
        const equips = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({
            type: [
                functional_1.Functional.convertEquipSectionAndCardType(response.selectedOption),
            ],
        }));
        if (equips.length > 0) {
            await room.useCard({
                fromId: resp.selectedPlayers[0],
                targetGroup: [[resp.selectedPlayers[0]]],
                cardId: equips[0],
                customFromArea: 5 /* DrawStack */,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            await room.drawCards(1, resp.selectedPlayers[0], 'top', resp.selectedPlayers[0], this.Name);
        }
        if (from.AvailableEquipSections.length === 0) {
            await room.changeMaxHp(fromId, 2);
            await room.obtainSkill(fromId, XianWeiBuff.Name);
        }
        return true;
    }
};
XianWei = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'xianwei', description: 'xianwei_description' })
], XianWei);
exports.XianWei = XianWei;
let XianWeiBuff = class XianWeiBuff extends skill_1.GlobalRulesBreakerSkill {
    breakWithinAttackDistance(room, owner, from, to) {
        return (from === owner && to !== owner) || (from !== owner && to === owner);
    }
};
XianWeiBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill({ stubbornSkill: true }),
    skill_wrappers_1.CommonSkill({ name: 'xianwei_buff', description: 'xianwei_buff_description' })
], XianWeiBuff);
exports.XianWeiBuff = XianWeiBuff;
