"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanShiSelect = exports.PanShi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const cixiao_1 = require("./cixiao");
let PanShi = class PanShi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "DamageEffect" /* DamageEffect */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 3 /* PrepareStageStart */ &&
                owner.getCardIds(0 /* HandArea */).length > 0 &&
                room.getOtherPlayers(owner.Id).find(player => player.hasSkill(cixiao_1.CiXiao.Name)) !== undefined);
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            return (room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
                damageEvent.cardIds !== undefined &&
                engine_1.Sanguosha.getCardById(damageEvent.cardIds[0]).GeneralName === 'slash' &&
                damageEvent.fromId === owner.Id &&
                room.getPlayerById(damageEvent.toId).hasSkill(cixiao_1.CiXiao.Name));
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const hands = room.getPlayerById(fromId).getCardIds(0 /* HandArea */);
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            let card;
            let toId;
            const dad = room.getOtherPlayers(fromId).filter(player => player.hasSkill(cixiao_1.CiXiao.Name));
            if (dad.length > 1) {
                const skillUseEvent = event_packer_1.EventPacker.createUncancellableEvent({
                    invokeSkillNames: [PanShiSelect.Name],
                    toId: fromId,
                    conversation: 'panshi: please choose one hand card and one target',
                });
                room.notify(171 /* AskForSkillUseEvent */, skillUseEvent, fromId);
                const response = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, fromId);
                if (response.cardIds) {
                    card = response.cardIds[0];
                }
                else {
                    card = hands[Math.floor(Math.random() * hands.length)];
                }
                if (response.toIds) {
                    toId = response.toIds[0];
                }
                else {
                    toId = dad[Math.floor(Math.random() * dad.length)].Id;
                }
            }
            else {
                const response = await room.doAskForCommonly(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                    cardAmount: 1,
                    toId: fromId,
                    reason: this.Name,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you need to give a handcard to {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(dad[0])).extract(),
                    fromArea: [0 /* HandArea */],
                    triggeredBySkills: [this.Name],
                }), fromId);
                response.selectedCards =
                    response.selectedCards.length > 0
                        ? response.selectedCards
                        : [hands[Math.floor(Math.random() * hands.length)]];
                card = response.selectedCards[0];
                toId = dad[0].Id;
            }
            await room.moveCards({
                movingCards: [{ card, fromArea: 0 /* HandArea */ }],
                fromId,
                toId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: fromId,
            });
        }
        else {
            const damageEvent = unknownEvent;
            damageEvent.damage++;
            room.endPhase(4 /* PlayCardStage */);
        }
        return true;
    }
};
PanShi = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'panshi', description: 'panshi_description' })
], PanShi);
exports.PanShi = PanShi;
let PanShiSelect = class PanShiSelect extends skill_1.TriggerSkill {
    isTriggerable() {
        return false;
    }
    canUse() {
        return false;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).hasSkill(cixiao_1.CiXiao.Name);
    }
    isAvailableCard() {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onTrigger() {
        return true;
    }
    async onEffect() {
        return true;
    }
};
PanShiSelect = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: 'shadow_panshi', description: 'shadow_panshi_description' })
], PanShiSelect);
exports.PanShiSelect = PanShiSelect;
