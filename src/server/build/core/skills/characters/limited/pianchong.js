"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PianChongShadow = exports.PianChong = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const algorithm_1 = require("core/shares/libs/algorithm");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let PianChong = class PianChong extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforeDrawCardEffect" /* BeforeDrawCardEffect */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */ &&
            content.drawAmount > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const drawCardEvent = event.triggeredOnEvent;
        drawCardEvent.drawAmount = 0;
        const redCards = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ suit: [4 /* Diamond */, 2 /* Heart */] }));
        const blackCards = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ suit: [3 /* Club */, 1 /* Spade */] }));
        const toGain = [];
        redCards.length > 0 && toGain.push(redCards[Math.floor(Math.random() * redCards.length)]);
        blackCards.length > 0 && toGain.push(blackCards[Math.floor(Math.random() * blackCards.length)]);
        toGain.length > 0 &&
            (await room.moveCards({
                movingCards: toGain.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            }));
        const options = ['pianchong:loseBlack', 'pianchong:loseRed'];
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose pianchong options', this.Name).extract(),
            toId: fromId,
            triggeredBySkills: [this.Name],
        }, fromId, true);
        response.selectedOption = response.selectedOption || options[0];
        const color = response.selectedOption === options[1] ? 0 /* Red */ : 1 /* Black */;
        const originalColors = room.getFlag(fromId, this.Name) || [];
        originalColors.includes(color) || originalColors.push(color);
        room.setFlag(fromId, this.Name, originalColors, originalColors.length > 1
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('pianchong: {0} {1}', ...originalColors.map(color => functional_1.Functional.getCardColorRawText(color))).toString()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('pianchong: {0}', functional_1.Functional.getCardColorRawText(originalColors[0])).toString());
        return true;
    }
};
PianChong = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'pianchong', description: 'pianchong_description' })
], PianChong);
exports.PianChong = PianChong;
let PianChongShadow = class PianChongShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    async whenDead(room, player) {
        room.removeFlag(player.Id, this.GeneralName);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ || stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, event) {
        const colors = owner.getFlag(this.GeneralName);
        if (!colors || colors.length === 0) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.toPlayer === owner.Id && phaseChangeEvent.to === 0 /* PhaseBegin */;
        }
        else if (identifier === 128 /* MoveCardEvent */) {
            const moveCardEvent = event;
            return (moveCardEvent.infos.find(info => info.fromId === owner.Id &&
                !(info.toId === owner.Id &&
                    (info.toArea === 0 /* HandArea */ || info.toArea === 1 /* EquipArea */)) &&
                info.movingCards.find(card => (card.fromArea === 0 /* HandArea */ || card.fromArea === 1 /* EquipArea */) &&
                    !engine_1.Sanguosha.isVirtualCardId(card.card) &&
                    colors.includes(engine_1.Sanguosha.getCardById(card.card).Color))) !== undefined);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 104 /* PhaseChangeEvent */) {
            room.removeFlag(fromId, this.GeneralName);
        }
        else {
            let redNum = 0;
            let blackNum = 0;
            const color = room.getFlag(fromId, this.GeneralName);
            for (const info of unknownEvent.infos) {
                if (!(info.fromId === fromId &&
                    !(info.toId === fromId && (info.toArea === 0 /* HandArea */ || info.toArea === 1 /* EquipArea */)))) {
                    continue;
                }
                for (const cardInfo of info.movingCards) {
                    if (!(cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */) ||
                        engine_1.Sanguosha.isVirtualCardId(cardInfo.card)) {
                        continue;
                    }
                    if (engine_1.Sanguosha.getCardById(cardInfo.card).isBlack() && color.includes(1 /* Black */)) {
                        blackNum++;
                    }
                    else if (engine_1.Sanguosha.getCardById(cardInfo.card).isRed() && color.includes(0 /* Red */)) {
                        redNum++;
                    }
                }
            }
            const toGain = [];
            if (blackNum > 0) {
                const redCards = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ suit: [4 /* Diamond */, 2 /* Heart */] }));
                if (redCards.length > 0) {
                    toGain.push(...algorithm_1.Algorithm.randomPick(Math.min(redCards.length, blackNum), redCards));
                }
            }
            if (redNum > 0) {
                const blackCards = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ suit: [3 /* Club */, 1 /* Spade */] }));
                if (blackCards.length > 0) {
                    toGain.push(...algorithm_1.Algorithm.randomPick(Math.min(blackCards.length, redNum), blackCards));
                }
            }
            toGain.length > 0 &&
                (await room.moveCards({
                    movingCards: toGain.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: fromId,
                    triggeredBySkills: [this.Name],
                }));
        }
        return true;
    }
};
PianChongShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: PianChong.Name, description: PianChong.Description })
], PianChongShadow);
exports.PianChongShadow = PianChongShadow;
