"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XingZuoClear = exports.XingZuoShadow = exports.XingZuo = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XingZuo = class XingZuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 13 /* PlayCardStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const cards = room.getCards(3, 'bottom');
        const handcards = from.getCardIds(0 /* HandArea */);
        const bottomName = 'the bottom of draw stack';
        const { selectedCards } = await room.doAskForCommonly(165 /* AskForChoosingCardEvent */, {
            amount: 3,
            customCardFields: {
                [bottomName]: cards,
                [0 /* HandArea */]: handcards,
            },
            toId: fromId,
            customTitle: 'xingzuo: please select cards to put on draw stack bottom',
        }, fromId);
        if (selectedCards) {
            const toGain = cards.filter(card => !selectedCards.includes(card));
            if (toGain.length > 0) {
                const toBottom = selectedCards.filter(card => !cards.includes(card));
                await room.moveCards({
                    movingCards: toGain.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
                    toArea: 6 /* ProcessingArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: fromId,
                    engagedPlayerIds: [fromId],
                }, {
                    movingCards: toBottom.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                    fromId,
                    toArea: 6 /* ProcessingArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: fromId,
                    engagedPlayerIds: [],
                });
                await room.moveCards({
                    movingCards: toBottom.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                    toArea: 5 /* DrawStack */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: fromId,
                    engagedPlayerIds: [fromId],
                    placeAtTheBottomOfDrawStack: true,
                }, {
                    movingCards: toGain.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: fromId,
                });
                from.setFlag(this.Name, true);
            }
        }
        return true;
    }
};
XingZuo = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'xingzuo', description: 'xingzuo_description' })
], XingZuo);
exports.XingZuo = XingZuo;
let XingZuoShadow = class XingZuoShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.getFlag(this.GeneralName));
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to exchange hand cards with draw stack bottom?', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const toExchange = room.getPlayerById(toIds[0]).getCardIds(0 /* HandArea */);
        const num = toExchange.length;
        const cards = room.getCards(3, 'bottom');
        await room.moveCards({
            movingCards: cards.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
            toArea: 6 /* ProcessingArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: toIds[0],
        }, {
            movingCards: toExchange.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId: toIds[0],
            toArea: 6 /* ProcessingArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: toIds[0],
        });
        await room.moveCards({
            movingCards: toExchange.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
            toArea: 5 /* DrawStack */,
            moveReason: 2 /* ActiveMove */,
            proposer: toIds[0],
            placeAtTheBottomOfDrawStack: true,
        }, {
            movingCards: cards.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
            toId: toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: toIds[0],
        });
        num > 3 && (await room.loseHp(fromId, 1));
        return true;
    }
};
XingZuoShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: XingZuo.Name, description: XingZuo.Description })
], XingZuoShadow);
exports.XingZuoShadow = XingZuoShadow;
let XingZuoClear = class XingZuoClear extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        return content.from === 7 /* PhaseFinish */ && owner.getFlag(this.GeneralName);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
XingZuoClear = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: XingZuoShadow.Name, description: XingZuoShadow.Description })
], XingZuoClear);
exports.XingZuoClear = XingZuoClear;
