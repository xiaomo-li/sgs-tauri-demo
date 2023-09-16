"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiuYuan = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QiuYuan = class QiuYuan extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "OnAimmed" /* OnAimmed */;
    }
    canUse(room, owner, event) {
        if (!!event.byCardId && engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash' && event.toId === owner.Id) {
            room.setFlag(owner.Id, this.Name, [event.fromId, ...aim_group_1.AimGroupUtil.getAllTargets(event.allTargets)]);
            return true;
        }
        return false;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        const invalidTargets = room.getPlayerById(owner).getFlag(this.Name);
        return !invalidTargets.includes(target);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const to = room.getPlayerById(skillEffectEvent.toIds[0]);
        const from = room.getPlayerById(skillEffectEvent.fromId);
        const askForCard = {
            cardAmount: 1,
            toId: to.Id,
            fromArea: [0 /* HandArea */],
            cardMatcher: new card_matcher_1.CardMatcher({
                name: ['jink'],
            }).toSocketPassenger(),
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you need to give a jink to {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from)).extract(),
            reason: this.Name,
            triggeredBySkills: [this.Name],
        };
        room.notify(163 /* AskForCardEvent */, askForCard, to.Id);
        const { selectedCards } = await room.onReceivingAsyncResponseFrom(163 /* AskForCardEvent */, to.Id);
        if (selectedCards.length) {
            room.moveCards({
                movingCards: [{ card: selectedCards[0], fromArea: 0 /* HandArea */ }],
                fromId: to.Id,
                toId: skillEffectEvent.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: to.Id,
                movedByReason: this.Name,
                engagedPlayerIds: room.getAllPlayersFrom().map(player => player.Id),
            });
        }
        else {
            const aimEvent = skillEffectEvent.triggeredOnEvent;
            if (room.canUseCardTo(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), room.getPlayerById(aimEvent.fromId), to)) {
                aim_group_1.AimGroupUtil.addTargets(room, aimEvent, to.Id);
            }
        }
        room.removeFlag(skillEffectEvent.fromId, this.Name);
        return true;
    }
};
QiuYuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'qiuyuan', description: 'qiuyuan_description' })
], QiuYuan);
exports.QiuYuan = QiuYuan;
