"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShenDuan = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShenDuan = class ShenDuan extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.shenDuanTarget = 'shenduan_target';
        this.shenDuanCard = 'shenduan_card';
        this.shenDuanBannedIds = 'shenduan_banned_ids';
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => info.fromId === owner.Id &&
            (info.moveReason === 4 /* SelfDrop */ || info.moveReason === 5 /* PassiveDrop */) &&
            !(owner.Id === info.toId &&
                (info.toArea === 0 /* HandArea */ || info.toArea === 1 /* EquipArea */)) &&
            info.movingCards.find(card => card.fromArea === 0 /* HandArea */ || card.fromArea === 1 /* EquipArea */)) !== undefined);
    }
    async beforeUse(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const from = room.getPlayerById(fromId);
        const moveCardEvent = triggeredOnEvent;
        let availableIds = [];
        const flagIds = from.getFlag(this.shenDuanBannedIds);
        if (flagIds) {
            availableIds = flagIds;
        }
        else {
            availableIds = moveCardEvent.infos.reduce((cardIds, info) => {
                if ((info.toId === fromId && (info.toArea === 0 /* HandArea */ || info.toArea === 1 /* EquipArea */)) ||
                    (info.moveReason !== 4 /* SelfDrop */ && info.moveReason !== 5 /* PassiveDrop */)) {
                    return cardIds;
                }
                for (const movingCard of info.movingCards) {
                    const realCard = engine_1.Sanguosha.getCardById(movingCard.card);
                    if (!engine_1.Sanguosha.isVirtualCardId(movingCard.card) &&
                        realCard.isBlack() &&
                        !realCard.is(7 /* Trick */) &&
                        (movingCard.fromArea === 0 /* HandArea */ || movingCard.fromArea === 1 /* EquipArea */) &&
                        room.isCardInDropStack(movingCard.card)) {
                        cardIds.push(movingCard.card);
                    }
                }
                return cardIds;
            }, []);
            from.setFlag(this.shenDuanBannedIds, availableIds);
        }
        if (availableIds.length === 0) {
            from.removeFlag(this.shenDuanBannedIds);
            return false;
        }
        const askForChooseCardEvent = {
            toId: fromId,
            cardIds: availableIds,
            amount: 1,
            customTitle: 'shenduan: please choose one of these cards',
            ignoreNotifiedStatus: true,
        };
        const response = await room.doAskForCommonly(165 /* AskForChoosingCardEvent */, askForChooseCardEvent, fromId);
        if (response.selectedCards === undefined || response.selectedCards.length === 0) {
            from.removeFlag(this.shenDuanBannedIds);
            return false;
        }
        from.setFlag(this.shenDuanBannedIds, from.getFlag(this.shenDuanBannedIds).filter(id => id !== response.selectedCards[0]));
        const virtualCard = card_1.VirtualCard.create({
            cardName: 'bingliangcunduan',
            bySkill: this.Name,
        }, response.selectedCards);
        const availableTargets = room
            .getOtherPlayers(fromId)
            .filter(player => from.canUseCardTo(room, virtualCard.Id, player.Id) &&
            player
                .getCardIds(2 /* JudgeArea */)
                .find(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === 'bingliangcunduan') === undefined)
            .map(player => player.Id);
        const askForPlayerChoose = {
            toId: fromId,
            players: availableTargets,
            requiredAmount: 1,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a target for {1}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(virtualCard.Id)).extract(),
            triggeredBySkills: [this.Name],
        };
        const newResponse = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, askForPlayerChoose, fromId);
        if (newResponse.selectedPlayers === undefined || newResponse.selectedPlayers.length === 0) {
            from.removeFlag(this.shenDuanBannedIds);
            return false;
        }
        event_packer_1.EventPacker.addMiddleware({
            tag: this.shenDuanTarget,
            data: newResponse.selectedPlayers[0],
        }, event);
        event_packer_1.EventPacker.addMiddleware({
            tag: this.shenDuanCard,
            data: virtualCard.Id,
        }, event);
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const target = event_packer_1.EventPacker.getMiddleware(this.shenDuanTarget, event);
        const cardId = event_packer_1.EventPacker.getMiddleware(this.shenDuanCard, event);
        if (target === undefined || cardId === undefined) {
            return false;
        }
        await room.useCard({
            fromId,
            cardId,
            targetGroup: [[target]],
            customFromArea: 4 /* DropStack */,
        });
        const from = room.getPlayerById(fromId);
        if (from.getFlag(this.Name)) {
            return false;
        }
        from.setFlag(this.Name, true);
        while (true) {
            const invoke = await room.useSkill({
                fromId,
                skillName: this.Name,
                triggeredOnEvent: event.triggeredOnEvent,
            });
            if (!invoke) {
                from.removeFlag(this.Name);
                break;
            }
        }
        return true;
    }
};
ShenDuan = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'shenduan', description: 'shenduan_description' })
], ShenDuan);
exports.ShenDuan = ShenDuan;
