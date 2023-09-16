"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuLiangBuff = exports.DuLiang = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DuLiang = class DuLiang extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const toId = event.toIds[0];
        const choosingOption = {
            [0 /* HandArea */]: room.getPlayerById(toId).getCardIds(0 /* HandArea */).length,
        };
        const chooseCardEvent = {
            fromId: event.fromId,
            toId,
            options: choosingOption,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, chooseCardEvent.fromId, false, true);
        if (!response) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
            fromId: chooseCardEvent.toId,
            toId: chooseCardEvent.fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: chooseCardEvent.fromId,
            movedByReason: this.Name,
        });
        const options = ['duliang:basic', 'duliang:drawMore'];
        const resp = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose duliang options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toId))).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId);
        resp.selectedOption = resp.selectedOption || options[0];
        if (resp.selectedOption === options[1]) {
            let originalDrawNum = room.getFlag(toId, this.Name) || 0;
            originalDrawNum++;
            room.setFlag(toId, this.Name, originalDrawNum, translation_json_tool_1.TranslationPack.translationJsonPatcher('duliang: {0}', originalDrawNum).toString());
            room.getPlayerById(toId).hasShadowSkill(DuLiangBuff.Name) || (await room.obtainSkill(toId, DuLiangBuff.Name));
        }
        else {
            const topCards = room.getCards(2, 'top');
            room.displayCards(toId, topCards, [toId]);
            const basics = [];
            const leftCards = [];
            for (const cardId of topCards) {
                if (engine_1.Sanguosha.getCardById(cardId).is(0 /* Basic */)) {
                    basics.push(cardId);
                }
                else {
                    leftCards.push(cardId);
                }
            }
            basics.length > 0 &&
                (await room.moveCards({
                    movingCards: basics.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
                    toId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: toId,
                    triggeredBySkills: [this.Name],
                }));
            leftCards.length > 0 && room.putCards('top', ...leftCards.reverse());
        }
        return true;
    }
};
DuLiang = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'duliang', description: 'duliang_description' })
], DuLiang);
exports.DuLiang = DuLiang;
let DuLiangBuff = class DuLiangBuff extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const drawNum = room.getFlag(event.fromId, DuLiang.Name);
        if (drawNum !== undefined) {
            event.triggeredOnEvent.drawAmount += drawNum;
            room.removeFlag(event.fromId, DuLiang.Name);
        }
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
DuLiangBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_duliang_buff', description: 's_duliang_buff_description' })
], DuLiangBuff);
exports.DuLiangBuff = DuLiangBuff;
