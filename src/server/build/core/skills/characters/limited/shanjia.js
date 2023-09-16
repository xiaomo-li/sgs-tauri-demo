"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShanJiaShadow = exports.ShanJia = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShanJia = class ShanJia extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, owner) {
        const recordNum = owner.getFlag(this.Name);
        if (owner.getFlag(this.Name) === undefined) {
            const lostNum = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
                event.infos.find(info => info.fromId === owner.Id &&
                    info.toId !== owner.Id &&
                    info.movingCards &&
                    info.movingCards.find(card => (card.fromArea === 0 /* HandArea */ || card.fromArea === 1 /* EquipArea */) &&
                        engine_1.Sanguosha.getCardById(card.card).is(1 /* Equip */)) !== undefined &&
                    info.moveReason !== 8 /* CardUse */) !== undefined).reduce((sum, event) => {
                if (event.infos.length === 1) {
                    return (sum + event.infos[0].movingCards.filter(card => engine_1.Sanguosha.getCardById(card.card).is(1 /* Equip */)).length);
                }
                else {
                    const infos = event.infos.filter(info => info.fromId === owner.Id &&
                        info.toId !== owner.Id &&
                        info.movingCards &&
                        info.movingCards.find(card => (card.fromArea === 0 /* HandArea */ || card.fromArea === 1 /* EquipArea */) &&
                            engine_1.Sanguosha.getCardById(card.card).is(1 /* Equip */)) !== undefined &&
                        info.moveReason !== 8 /* CardUse */);
                    for (const info of infos) {
                        sum += info.movingCards.filter(card => engine_1.Sanguosha.getCardById(card.card).is(1 /* Equip */)).length;
                    }
                }
                return sum;
            }, 0);
            const dropNum = 3 - lostNum;
            dropNum > 0 &&
                room.setFlag(owner.Id, this.Name, dropNum, translation_json_tool_1.TranslationPack.translationJsonPatcher('shanjia count: {0}', dropNum).toString());
        }
        else if (recordNum > 0) {
            room.setFlag(owner.Id, this.Name, recordNum, translation_json_tool_1.TranslationPack.translationJsonPatcher('shanjia count: {0}', recordNum).toString());
        }
    }
    async whenLosingSkill(room, owner) {
        const recordNum = owner.getFlag(this.Name);
        if (recordNum) {
            room.setFlag(owner.Id, this.Name, recordNum);
        }
    }
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
        await room.drawCards(3, fromId, 'top', fromId, this.Name);
        const dropNum = room.getFlag(fromId, this.Name);
        let dropCards;
        if (dropNum && dropNum > 0) {
            const response = await room.askForCardDrop(fromId, dropNum, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please drop {1} card(s), if all of them are equip card, you can use a virtual slash', this.Name, dropNum).extract());
            if (response.droppedCards.length > 0) {
                dropCards = response.droppedCards;
                await room.dropCards(4 /* SelfDrop */, dropCards, fromId, fromId, this.Name);
            }
        }
        if (!dropCards ||
            (dropCards.length > 0 && !dropCards.find(card => !engine_1.Sanguosha.getCardById(card).is(1 /* Equip */)))) {
            const targets = room
                .getOtherPlayers(fromId)
                .filter(player => room.getPlayerById(fromId).canUseCardTo(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }), player.Id))
                .map(player => player.Id);
            if (targets.length > 0) {
                const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                    players: targets,
                    toId: fromId,
                    requiredAmount: 1,
                    conversation: 'shanjia: do you want to use a slash?',
                    triggeredBySkills: [this.Name],
                }, fromId);
                if (resp.selectedPlayers && resp.selectedPlayers.length > 0) {
                    await room.useCard({
                        fromId,
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
ShanJia = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'shanjia', description: 'shanjia_description' })
], ShanJia);
exports.ShanJia = ShanJia;
let ShanJiaShadow = class ShanJiaShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return (event_packer_1.EventPacker.getIdentifier(event) === 142 /* GameStartEvent */ || stage === "AfterCardMoved" /* AfterCardMoved */);
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 128 /* MoveCardEvent */) {
            const moveCardEvent = content;
            return (moveCardEvent.infos.find(info => info.fromId === owner.Id &&
                info.toId !== owner.Id &&
                info.movingCards.find(card => (card.fromArea === 0 /* HandArea */ || card.fromArea === 1 /* EquipArea */) &&
                    engine_1.Sanguosha.getCardById(card.card).is(1 /* Equip */)) !== undefined &&
                info.moveReason !== 8 /* CardUse */) !== undefined && owner.getFlag(this.GeneralName) !== 0);
        }
        return identifier === 142 /* GameStartEvent */ && owner.getFlag(this.GeneralName) === undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 142 /* GameStartEvent */) {
            room.setFlag(fromId, this.GeneralName, 3, translation_json_tool_1.TranslationPack.translationJsonPatcher('shanjia count: {0}', 3).toString());
        }
        else {
            const recordNum = room.getFlag(fromId, this.GeneralName) === undefined
                ? 3
                : room.getFlag(fromId, this.GeneralName);
            if (recordNum > 0) {
                const moveCardEvent = unknownEvent;
                let num = 0;
                if (moveCardEvent.infos.length === 0) {
                    num += moveCardEvent.infos[0].movingCards.filter(card => engine_1.Sanguosha.getCardById(card.card).is(1 /* Equip */)).length;
                }
                else {
                    const infos = moveCardEvent.infos.filter(info => info.fromId === fromId &&
                        info.toId !== fromId &&
                        info.movingCards.find(card => (card.fromArea === 0 /* HandArea */ || card.fromArea === 1 /* EquipArea */) &&
                            engine_1.Sanguosha.getCardById(card.card).is(1 /* Equip */)) !== undefined &&
                        info.moveReason !== 8 /* CardUse */);
                    for (const info of infos) {
                        num += info.movingCards.filter(card => engine_1.Sanguosha.getCardById(card.card).is(1 /* Equip */)).length;
                    }
                }
                const newRecord = Math.max(recordNum - num, 0);
                room.setFlag(fromId, this.GeneralName, newRecord, newRecord > 0
                    ? translation_json_tool_1.TranslationPack.translationJsonPatcher('shanjia count: {0}', newRecord).toString()
                    : undefined);
            }
        }
        return true;
    }
};
ShanJiaShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CommonSkill({ name: ShanJia.Name, description: ShanJia.Description })
], ShanJiaShadow);
exports.ShanJiaShadow = ShanJiaShadow;
