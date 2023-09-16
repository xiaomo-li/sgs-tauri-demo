"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MingZhe = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let MingZhe = class MingZhe extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['wangyuanji'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    isTriggerable(event, stage) {
        return (stage === "CardUsing" /* CardUsing */ ||
            stage === "CardResponsing" /* CardResponsing */ ||
            stage === "AfterCardMoved" /* AfterCardMoved */);
    }
    canUse(room, owner, event) {
        if (room.CurrentPlayer === owner) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */ || identifier === 123 /* CardResponseEvent */) {
            const cardUseOrResponseEvent = event;
            return cardUseOrResponseEvent.fromId === owner.Id && engine_1.Sanguosha.getCardById(cardUseOrResponseEvent.cardId).isRed();
        }
        else if (identifier === 128 /* MoveCardEvent */) {
            return !!event.infos.find(info => info.fromId === owner.Id &&
                [4 /* SelfDrop */, 5 /* PassiveDrop */].includes(info.moveReason) &&
                info.movingCards.find(cardInfo => (cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */) &&
                    !cardInfo.asideMove &&
                    card_1.VirtualCard.getActualCards([cardInfo.card]).find(cardId => engine_1.Sanguosha.getCardById(cardId).isRed())));
        }
        return false;
    }
    triggerableTimes(event, owner) {
        if (event_packer_1.EventPacker.getIdentifier(event) !== 128 /* MoveCardEvent */) {
            return 0;
        }
        return event.infos.reduce((sum, info) => {
            if (info.fromId === owner.Id && [4 /* SelfDrop */, 5 /* PassiveDrop */].includes(info.moveReason)) {
                for (const cardInfo of info.movingCards) {
                    if ((cardInfo.fromArea !== 0 /* HandArea */ && cardInfo.fromArea !== 1 /* EquipArea */) ||
                        cardInfo.asideMove) {
                        continue;
                    }
                    sum += card_1.VirtualCard.getActualCards([cardInfo.card]).length;
                }
            }
            return sum;
        }, 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
MingZhe = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'mingzhe', description: 'mingzhe_description' })
], MingZhe);
exports.MingZhe = MingZhe;
