"use strict";
var TaoLuan_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaoLuanClear = exports.TaoLuanShadow = exports.TaoLuan = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TaoLuan = TaoLuan_1 = class TaoLuan extends skill_1.ViewAsSkill {
    async whenObtainingSkill(room, player) {
        const records = room.Analytics.getCardUseRecord(player.Id);
        for (const event of records) {
            const usedCards = player.getFlag(this.Name) || [];
            const card = engine_1.Sanguosha.getCardById(event.cardId);
            if (card.isVirtualCard() &&
                card.findByGeneratedSkill(this.Name) &&
                !usedCards.includes(card.GeneralName)) {
                usedCards.push(card.GeneralName);
                room.setFlag(player.Id, this.Name, usedCards);
            }
        }
    }
    canViewAs(room, owner) {
        const usedCards = owner.getFlag(this.Name) || [];
        return engine_1.Sanguosha.getCardNameByType(types => (types.includes(7 /* Trick */) || types.includes(0 /* Basic */)) && !types.includes(8 /* DelayedTrick */)).filter(name => !usedCards.includes(engine_1.Sanguosha.getCardByName(name).GeneralName));
    }
    canUse(room, owner, event) {
        if (owner.getFlag(TaoLuan_1.Used)) {
            return false;
        }
        const identifier = event && event_packer_1.EventPacker.getIdentifier(event);
        const usedCards = owner.getFlag(this.Name) || [];
        if (identifier === 160 /* AskForCardUseEvent */) {
            return (engine_1.Sanguosha.getCardNameByType(types => (types.includes(7 /* Trick */) || types.includes(0 /* Basic */)) &&
                !types.includes(8 /* DelayedTrick */)).find(name => !usedCards.includes(engine_1.Sanguosha.getCardByName(name).GeneralName) &&
                owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: [name] }), new card_matcher_1.CardMatcher(event.cardMatcher))) !== undefined);
        }
        return (identifier !== 159 /* AskForCardResponseEvent */ &&
            engine_1.Sanguosha.getCardNameByType(types => types.includes(0 /* Basic */)).find(name => !usedCards.includes(engine_1.Sanguosha.getCardByName(name).GeneralName) &&
                owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: [name] }))) !== undefined);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return true;
    }
    viewAs(selectedCards, owner, viewAs) {
        precondition_1.Precondition.assert(!!viewAs, 'Unknown taoluan card');
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: this.Name,
        }, selectedCards);
    }
};
TaoLuan.Used = 'taoluan_used';
TaoLuan = TaoLuan_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'taoluan', description: 'taoluan_description' })
], TaoLuan);
exports.TaoLuan = TaoLuan;
let TaoLuanShadow = class TaoLuanShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    getPriority() {
        return 2 /* Low */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content, stage) {
        return ((stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ &&
            content.fromId === owner.Id &&
            engine_1.Sanguosha.getCardById(content.cardId).isVirtualCard() &&
            engine_1.Sanguosha.getCardById(content.cardId).findByGeneratedSkill(this.GeneralName)) ||
            event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) === owner.Id);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (event_packer_1.EventPacker.getMiddleware(this.GeneralName, event.triggeredOnEvent) === event.fromId) {
            const others = room.getOtherPlayers(event.fromId).map(player => player.Id);
            const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: others,
                toId: event.fromId,
                requiredAmount: 1,
                conversation: 'taoluan: please choose another player to ask for a card',
                triggeredBySkills: [this.GeneralName],
            }, event.fromId, true);
            response.selectedPlayers = response.selectedPlayers || [others[Math.floor(Math.random() * others.length)]];
            const card = engine_1.Sanguosha.getCardById(event.triggeredOnEvent.cardId);
            const typeExcept = [0 /* Basic */, 7 /* Trick */, 1 /* Equip */].filter(type => type !== card.BaseType);
            const resp = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                cardAmount: 1,
                toId: response.selectedPlayers[0],
                reason: this.GeneralName,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please give a card to {1}, or he/she will lose 1 hp', this.GeneralName, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract(),
                cardMatcher: new card_matcher_1.CardMatcher({ type: typeExcept }).toSocketPassenger(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.GeneralName],
            }, response.selectedPlayers[0]);
            if (resp.selectedCards && resp.selectedCards.length > 0) {
                await room.moveCards({
                    movingCards: [
                        {
                            card: resp.selectedCards[0],
                            fromArea: room.getPlayerById(response.selectedPlayers[0]).cardFrom(resp.selectedCards[0]),
                        },
                    ],
                    fromId: response.selectedPlayers[0],
                    toId: event.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: response.selectedPlayers[0],
                    triggeredBySkills: [this.GeneralName],
                });
            }
            else {
                await room.loseHp(event.fromId, 1);
                room.setFlag(event.fromId, TaoLuan.Used, true);
            }
        }
        else {
            const card = engine_1.Sanguosha.getCardById(event.triggeredOnEvent.cardId);
            const usedCards = room.getFlag(event.fromId, this.GeneralName) || [];
            usedCards.includes(card.GeneralName) || usedCards.push(card.GeneralName);
            room.setFlag(event.fromId, this.GeneralName, usedCards);
            event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: event.fromId }, event.triggeredOnEvent);
        }
        return true;
    }
};
TaoLuanShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: TaoLuan.Name, description: TaoLuan.Description })
], TaoLuanShadow);
exports.TaoLuanShadow = TaoLuanShadow;
let TaoLuanClear = class TaoLuanClear extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return event.from === 7 /* PhaseFinish */ && owner.getFlag(TaoLuan.Used) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, TaoLuan.Used);
        return true;
    }
};
TaoLuanClear = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: TaoLuanShadow.Name, description: TaoLuanShadow.Description })
], TaoLuanClear);
exports.TaoLuanClear = TaoLuanClear;
