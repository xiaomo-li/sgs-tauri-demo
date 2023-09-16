"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangJieSelect = exports.RangJie = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let RangJie = class RangJie extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.RangJieOptions = ['rangjie:move', 'rangjie:gain'];
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id;
    }
    triggerableTimes(event) {
        return event.damage;
    }
    async beforeUse(room, event) {
        const canMove = room.AlivePlayers.find(player => {
            const cards = [...player.getCardIds(1 /* EquipArea */), ...player.getCardIds(2 /* JudgeArea */)];
            if (cards.length === 0) {
                return false;
            }
            return room.getOtherPlayers(player.Id).find(p => cards.find(id => room.canPlaceCardTo(id, p.Id)));
        });
        const options = this.RangJieOptions.slice();
        canMove || options.shift();
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose rangjie options', this.Name).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId);
        if (response.selectedOption) {
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: response.selectedOption }, event);
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const chosen = event_packer_1.EventPacker.getMiddleware(this.Name, event);
        if (chosen === this.RangJieOptions[0]) {
            room.notify(171 /* AskForSkillUseEvent */, {
                invokeSkillNames: [RangJieSelect.Name],
                toId: fromId,
                conversation: 'rangjie: please move a card on the game board',
            }, fromId);
            const response = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, fromId);
            if (response.toIds) {
                const toIds = response.toIds;
                const moveFrom = room.getPlayerById(toIds[0]);
                const moveTo = room.getPlayerById(toIds[1]);
                const canMovedEquipCardIds = [];
                const canMovedJudgeCardIds = [];
                const fromEquipArea = moveFrom.getCardIds(1 /* EquipArea */);
                canMovedEquipCardIds.push(...fromEquipArea.filter(id => room.canPlaceCardTo(id, moveTo.Id)));
                const fromJudgeArea = moveFrom.getCardIds(2 /* JudgeArea */);
                canMovedJudgeCardIds.push(...fromJudgeArea.filter(id => room.canPlaceCardTo(id, moveTo.Id)));
                const options = {
                    [2 /* JudgeArea */]: canMovedJudgeCardIds,
                    [1 /* EquipArea */]: canMovedEquipCardIds,
                };
                const chooseCardEvent = {
                    fromId,
                    toId: fromId,
                    options,
                    triggeredBySkills: [this.Name],
                };
                const resp = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, false, true);
                if (!resp) {
                    return false;
                }
                const area = moveFrom.getCardIds(1 /* EquipArea */).includes(resp.selectedCard)
                    ? 1 /* EquipArea */
                    : 2 /* JudgeArea */;
                await room.moveCards({
                    movingCards: [{ card: resp.selectedCard, fromArea: area }],
                    fromId: toIds[0],
                    toId: toIds[1],
                    toArea: area,
                    moveReason: 3 /* PassiveMove */,
                    proposer: fromId,
                    triggeredBySkills: [this.Name],
                });
            }
        }
        else {
            const options = ['basic card', 'trick card', 'equip card'];
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose rangjie options', this.Name).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }, fromId, true);
            response.selectedOption = response.selectedOption || options[0];
            const typeNameMapper = {
                [options[0]]: 0 /* Basic */,
                [options[1]]: 7 /* Trick */,
                [options[2]]: 1 /* Equip */,
            };
            const type = typeNameMapper[response.selectedOption];
            const cards = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [type] }));
            cards.length > 0 &&
                (await room.moveCards({
                    movingCards: [{ card: cards[Math.floor(Math.random() * cards.length)], fromArea: 5 /* DrawStack */ }],
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: fromId,
                    triggeredBySkills: [this.Name],
                }));
        }
        await room.drawCards(1, fromId, 'top', fromId, this.Name);
        return true;
    }
};
RangJie = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'rangjie', description: 'rangjie_description' })
], RangJie);
exports.RangJie = RangJie;
let RangJieSelect = class RangJieSelect extends skill_1.TriggerSkill {
    isTriggerable() {
        return false;
    }
    canUse() {
        return false;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 2;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        const to = room.getPlayerById(target);
        const equiprCardIds = to.getCardIds(1 /* EquipArea */);
        const judgeCardIds = to.getCardIds(2 /* JudgeArea */);
        if (selectedTargets.length === 0) {
            return equiprCardIds.length + judgeCardIds.length > 0;
        }
        else if (selectedTargets.length === 1) {
            let canBeTarget = false;
            const from = room.getPlayerById(selectedTargets[0]);
            const fromEquipArea = from.getCardIds(1 /* EquipArea */);
            canBeTarget = canBeTarget || fromEquipArea.find(id => room.canPlaceCardTo(id, target)) !== undefined;
            const fromJudgeArea = from.getCardIds(2 /* JudgeArea */);
            canBeTarget = canBeTarget || fromJudgeArea.find(id => room.canPlaceCardTo(id, target)) !== undefined;
            return canBeTarget;
        }
        return false;
    }
    getAnimationSteps(event) {
        const { fromId, toIds } = event;
        return [
            { from: fromId, tos: [toIds[0]] },
            { from: toIds[0], tos: [toIds[1]] },
        ];
    }
    resortTargets() {
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect() {
        return true;
    }
};
RangJieSelect = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: 'rangjie_select', description: 'rangjie_select_description' })
], RangJieSelect);
exports.RangJieSelect = RangJieSelect;
