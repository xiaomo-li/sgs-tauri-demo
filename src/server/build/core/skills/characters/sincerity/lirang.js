"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiRangShadow = exports.LiRang = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LiRang = class LiRang extends skill_1.TriggerSkill {
    isAutoTrigger(room, owner, event) {
        return !!event && event_packer_1.EventPacker.getIdentifier(event) === 104 /* PhaseChangeEvent */;
    }
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */ || stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 127 /* DrawCardEvent */) {
            const drawCardEvent = content;
            return (owner.Id !== drawCardEvent.fromId &&
                room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
                drawCardEvent.bySpecialReason === 0 /* GameStage */ &&
                drawCardEvent.drawAmount > 0 &&
                owner.getMark("qian" /* Qian */) === 0);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return (phaseChangeEvent.to === 3 /* DrawCardStage */ &&
                phaseChangeEvent.toPlayer === owner.Id &&
                owner.getMark("qian" /* Qian */) > 0);
        }
        return false;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} draw 2 card(s) additionally?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 127 /* DrawCardEvent */) {
            const drawCardEvent = unknownEvent;
            drawCardEvent.drawAmount += 2;
            room.addMark(event.fromId, "qian" /* Qian */, 1);
            room.getPlayerById(event.fromId).setFlag(this.Name, drawCardEvent.fromId);
        }
        else {
            await room.skip(event.fromId, 3 /* DrawCardStage */);
            room.removeMark(event.fromId, "qian" /* Qian */);
        }
        return true;
    }
};
LiRang = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'lirang', description: 'lirang_description' })
], LiRang);
exports.LiRang = LiRang;
let LiRangShadow = class LiRangShadow extends skill_1.TriggerSkill {
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
                phaseStageChangeEvent.toStage === 18 /* DropCardStageEnd */ &&
                room.Analytics.getCardDropRecord(phaseStageChangeEvent.playerId, 'phase', undefined, 1).length > 0);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            return content.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async beforeUse(room, event) {
        if (event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent) ===
            105 /* PhaseStageChangeEvent */) {
            const currentId = event.triggeredOnEvent
                .playerId;
            const droppedCardIds = room.Analytics.getCardDropRecord(currentId, 'phase', undefined).reduce((cardIds, dropEvent) => {
                for (const info of dropEvent.infos) {
                    if (info.moveReason === 4 /* SelfDrop */ || info.moveReason === 5 /* PassiveDrop */) {
                        cardIds.push(...info.movingCards
                            .filter(cardInfo => room.isCardInDropStack(cardInfo.card))
                            .map(cardInfo => cardInfo.card));
                    }
                }
                return cardIds;
            }, []);
            if (droppedCardIds.length > 0) {
                const response = await room.doAskForCommonly(166 /* AskForChoosingCardWithConditionsEvent */, {
                    toId: event.fromId,
                    cardIds: droppedCardIds,
                    customTitle: 'lirang: you can choose at most 2 cards of these cards to gain',
                    amount: [1, 2],
                }, event.fromId);
                if (response.selectedCards && response.selectedCards.length > 0) {
                    event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: response.selectedCards }, event);
                    return true;
                }
            }
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 105 /* PhaseStageChangeEvent */) {
            const cardIdsChosen = event_packer_1.EventPacker.getMiddleware(this.Name, event);
            if (!cardIdsChosen) {
                return false;
            }
            await room.moveCards({
                movingCards: cardIdsChosen.map(card => ({ card, fromArea: 4 /* DropStack */ })),
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
LiRangShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: LiRang.Name, description: LiRang.Description })
], LiRangShadow);
exports.LiRangShadow = LiRangShadow;
