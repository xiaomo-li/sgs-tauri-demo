"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuanTuShadow = exports.HuanTu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HuanTu = class HuanTu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, content) {
        return (content.to === 3 /* DrawCardStage */ &&
            !owner.hasUsedSkill(this.Name) &&
            owner.getPlayerCards().length > 0 &&
            room.withinAttackDistance(owner, room.getPlayerById(content.toPlayer)));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to give {1} a card to skip his/her draw phase?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toPlayer))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        const toId = event.triggeredOnEvent.toPlayer;
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: room.getPlayerById(toId).cardFrom(event.cardIds[0]) }],
            fromId: event.fromId,
            toId,
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            triggeredBySkills: [this.Name],
        });
        room.getPlayerById(event.fromId).setFlag(this.Name, toId);
        await room.skip(toId, 3 /* DrawCardStage */);
        return true;
    }
};
HuanTu = tslib_1.__decorate([
    skill_wrappers_1.CircleSkill,
    skill_wrappers_1.CommonSkill({ name: 'huantu', description: 'huantu_description' })
], HuanTu);
exports.HuanTu = HuanTu;
let HuanTuShadow = class HuanTuShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        if (!owner.getFlag(this.GeneralName)) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.getFlag(this.GeneralName) &&
                phaseStageChangeEvent.toStage === 19 /* FinishStageStart */);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            return content.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        if (event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent) === 105 /* PhaseStageChangeEvent */) {
            const toId = room.getFlag(fromId, this.GeneralName);
            room.getPlayerById(fromId).removeFlag(this.GeneralName);
            const options = ['huantu:give'];
            room.getPlayerById(toId).LostHp > 0 && options.unshift('huantu:recover');
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose huantu options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toId))).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }, fromId, true);
            response.selectedOption = response.selectedOption || options[0];
            if (response.selectedOption === 'huantu:recover') {
                await room.recover({
                    toId,
                    recoveredHp: 1,
                    recoverBy: fromId,
                });
                await room.drawCards(2, toId, 'top', fromId, this.Name);
            }
            else {
                await room.drawCards(3, fromId, 'top', fromId, this.Name);
                if (room.getPlayerById(fromId).getCardIds(0 /* HandArea */).length > 1) {
                    const resp = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                        cardAmount: 2,
                        toId: fromId,
                        reason: this.Name,
                        conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose 2 hand cards to give them to {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toId))).extract(),
                        fromArea: [0 /* HandArea */],
                        triggeredBySkills: [this.Name],
                    }, fromId, true);
                    resp.selectedCards =
                        resp.selectedCards ||
                            algorithm_1.Algorithm.randomPick(2, room.getPlayerById(fromId).getCardIds(0 /* HandArea */));
                    await room.moveCards({
                        movingCards: resp.selectedCards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                        fromId,
                        toId,
                        toArea: 0 /* HandArea */,
                        moveReason: 2 /* ActiveMove */,
                        triggeredBySkills: [this.Name],
                    });
                }
            }
        }
        else {
            room.getPlayerById(fromId).removeFlag(this.GeneralName);
        }
        return true;
    }
};
HuanTuShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: HuanTu.Name, description: HuanTu.Description })
], HuanTuShadow);
exports.HuanTuShadow = HuanTuShadow;
