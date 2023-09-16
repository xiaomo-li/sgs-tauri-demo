"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhaoLie = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhaoLie = class ZhaoLie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    isRefreshAt(room, owner, stage) {
        return stage === 3 /* DrawCardStage */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        const from = room.getPlayerById(owner);
        const to = room.getPlayerById(targetId);
        return room.withinAttackDistance(from, to);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent, toIds, fromId } = skillUseEvent;
        const toId = toIds[0];
        const drawCardEvent = triggeredOnEvent;
        drawCardEvent.drawAmount -= 1;
        const displayCards = room.getCards(3, 'top');
        const cardDisplayEvent = {
            displayCards,
            fromId: skillUseEvent.fromId,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, display cards: {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(...displayCards)).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, cardDisplayEvent);
        let zhaolie = [];
        for (const cardId of displayCards) {
            const card = engine_1.Sanguosha.getCardById(cardId);
            if (card.is(0 /* Basic */)) {
                if (card.GeneralName !== 'peach') {
                    zhaolie.push(cardId);
                }
            }
        }
        const numcard = displayCards.filter(cardId => engine_1.Sanguosha.getCardById(cardId).is(7 /* Trick */) || engine_1.Sanguosha.getCardById(cardId).is(1 /* Equip */));
        const num = numcard.length;
        const options = ['zhaolie-dama', 'zhaolie-drop'];
        const askForChoosingOptionsEvent = {
            options,
            conversation: 'please choose: zhaolie-options',
            toId,
            askedBy: fromId,
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingOptionsEvent), toId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, toId);
        if (selectedOption === 'zhaolie-drop') {
            let droppedCards = 0;
            while (droppedCards < num) {
                const response = await room.askForCardDrop(toId, 1, [0 /* HandArea */, 1 /* EquipArea */], false, undefined, this.Name);
                if (response.droppedCards.length > 0) {
                    await room.dropCards(4 /* SelfDrop */, response.droppedCards, toId, toId, this.GeneralName);
                    droppedCards++;
                }
                else {
                    if (num > 0) {
                        await room.damage({
                            fromId,
                            toId,
                            damage: num,
                            damageType: "normal_property" /* Normal */,
                            triggeredBySkills: [this.Name],
                        });
                    }
                    if (zhaolie.length > 0) {
                        await room.moveCards({
                            movingCards: zhaolie.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                            toId,
                            toArea: 0 /* HandArea */,
                            moveReason: 1 /* ActivePrey */,
                        });
                    }
                    droppedCards = num;
                }
            }
            if (zhaolie.length !== 0) {
                await room.moveCards({
                    movingCards: zhaolie.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                    toId: skillUseEvent.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                });
            }
        }
        else {
            if (num > 0) {
                await room.damage({
                    fromId,
                    toId,
                    damage: num,
                    damageType: "normal_property" /* Normal */,
                    triggeredBySkills: [this.Name],
                });
            }
            if (zhaolie.length > 0) {
                await room.moveCards({
                    movingCards: zhaolie.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                    toId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                });
            }
        }
        zhaolie = [];
        return true;
    }
};
ZhaoLie = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhaolie', description: 'zhaolie_description' })
], ZhaoLie);
exports.ZhaoLie = ZhaoLie;
