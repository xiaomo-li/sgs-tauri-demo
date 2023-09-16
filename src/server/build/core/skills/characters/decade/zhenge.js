"use strict";
var ZhenGe_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhenGe = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhenGe = ZhenGe_1 = class ZhenGe extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 3 /* PrepareStageStart */;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const targets = room.getFlag(fromId, ZhenGe_1.ZhenGeTargets) || [];
        targets.includes(toIds[0]) || targets.push(toIds[0]);
        room.getPlayerById(fromId).setFlag(ZhenGe_1.ZhenGeTargets, targets);
        let additionalAttackRange = room.getFlag(toIds[0], this.Name) || 0;
        if (additionalAttackRange < 5) {
            additionalAttackRange++;
            room.setFlag(toIds[0], this.Name, additionalAttackRange, translation_json_tool_1.TranslationPack.translationJsonPatcher('zhenge: {0}', additionalAttackRange).toString());
            room.syncGameCommonRules(toIds[0], user => {
                room.CommonRules.addAdditionalAttackRange(user, 1);
            });
        }
        if (!room.getOtherPlayers(toIds[0]).find(player => !room.withinAttackDistance(room.getPlayerById(toIds[0]), player))) {
            const targets = room
                .getOtherPlayers(toIds[0])
                .filter(player => room.getPlayerById(toIds[0]).canUseCardTo(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }), player.Id))
                .map(player => player.Id);
            if (targets.length > 0) {
                const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                    players: targets,
                    toId: fromId,
                    requiredAmount: 1,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to be the target of the slash what use by {1}?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toIds[0]))).extract(),
                    triggeredBySkills: [this.Name],
                }, fromId);
                if (resp.selectedPlayers && resp.selectedPlayers.length > 0) {
                    await room.useCard({
                        fromId: toIds[0],
                        targetGroup: [resp.selectedPlayers],
                        cardId: card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.Name }).Id,
                        extraUse: true,
                        triggeredBySkills: [this.Name],
                    });
                }
            }
        }
        return true;
    }
};
ZhenGe.ZhenGeTargets = 'zhenge_targets';
ZhenGe = ZhenGe_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhenge', description: 'zhenge_description' })
], ZhenGe);
exports.ZhenGe = ZhenGe;
