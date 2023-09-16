"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecadeShejian = void 0;
const tslib_1 = require("tslib");
const algorithm_1 = require("core/shares/libs/algorithm");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DecadeShejian = class DecadeShejian extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, event) {
        return (event.toId === owner.Id &&
            event.fromId !== owner.Id &&
            owner.hasUsedSkillTimes(this.Name) < 2 &&
            owner.getCardIds(0 /* HandArea */).length > 1 &&
            aim_group_1.AimGroupUtil.getAllTargets(event.allTargets).length === 1 &&
            !room.AlivePlayers.find(player => player.Dying));
    }
    cardFilter(room, owner, cards) {
        return cards.length > 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard at least 2 hand cards to use this skill to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        const userId = event.triggeredOnEvent.fromId;
        const user = room.getPlayerById(userId);
        const options = ['decade_shejian:damage'];
        user.getPlayerCards().length > 0 && options.push('decade_shejian:discard');
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose decade_shejian options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(user)).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        response.selectedOption = response.selectedOption || options[0];
        if (response.selectedOption === 'decade_shejian:discard') {
            let toDiscard = user.getPlayerCards();
            if (toDiscard.length > event.cardIds.length) {
                const resp = await room.doAskForCommonly(166 /* AskForChoosingCardWithConditionsEvent */, {
                    toId: event.fromId,
                    customCardFields: {
                        [1 /* EquipArea */]: user.getCardIds(1 /* EquipArea */),
                        [0 /* HandArea */]: user.getCardIds(0 /* HandArea */).length,
                    },
                    customTitle: this.Name,
                    amount: event.cardIds.length,
                    triggeredBySkills: [this.Name],
                }, event.fromId, true);
                if ((resp.selectedCards || []).length + (resp.selectedCardsIndex || []).length < event.cardIds.length) {
                    toDiscard = algorithm_1.Algorithm.randomPick(event.cardIds.length, user.getPlayerCards());
                }
                else {
                    toDiscard = resp.selectedCards || [];
                    toDiscard.push(...algorithm_1.Algorithm.randomPick(event.cardIds.length - toDiscard.length, user.getCardIds(0 /* HandArea */)));
                }
            }
            await room.dropCards(5 /* PassiveDrop */, toDiscard, userId, event.fromId, this.Name);
        }
        else {
            await room.damage({
                fromId: event.fromId,
                toId: userId,
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
DecadeShejian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'decade_shejian', description: 'decade_shejian_description' })
], DecadeShejian);
exports.DecadeShejian = DecadeShejian;
