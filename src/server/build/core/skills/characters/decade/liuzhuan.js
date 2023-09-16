"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuZhuanRemove = exports.LiuZhuanProhibited = exports.LiuZhuanShadow = exports.LiuZhuan = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let LiuZhuan = class LiuZhuan extends skill_1.TriggerSkill {
    async whenLosingSkill(room) {
        room.CurrentPlayer &&
            room.CurrentPlayer.getCardTag(this.Name) !== undefined &&
            room.removeCardTag(room.CurrentPlayer.Id, this.Name);
    }
    async whenDead(room) {
        room.CurrentPlayer &&
            room.CurrentPlayer.getCardTag(this.Name) !== undefined &&
            room.removeCardTag(room.CurrentPlayer.Id, this.Name);
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return !!content.infos.find(info => info.fromId !== owner.Id &&
            info.fromId !== undefined &&
            room.CurrentPlayer.Id === info.fromId &&
            info.toArea === 4 /* DropStack */ &&
            (room.getCardTag(info.fromId, this.Name) || []).length > 0 &&
            info.movingCards.find(cardInfo => !cardInfo.asideMove &&
                room.getCardTag(info.fromId, this.Name).includes(cardInfo.card) &&
                (cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */)));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const infos = event.triggeredOnEvent.infos;
        const toObtain = [];
        if (infos.length === 1) {
            toObtain.push(...infos[0].movingCards
                .filter(cardInfo => !cardInfo.asideMove &&
                room.getCardTag(infos[0].fromId, this.Name).includes(cardInfo.card) &&
                (cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */) &&
                room.isCardInDropStack(cardInfo.card))
                .map(cardInfo => cardInfo.card));
        }
        else {
            for (const info of infos) {
                if (info.fromId !== event.fromId &&
                    info.fromId !== undefined &&
                    room.CurrentPlayer.Id === info.fromId &&
                    info.toArea === 4 /* DropStack */ &&
                    (room.getCardTag(info.fromId, this.Name) || []).length > 0 &&
                    info.movingCards.find(cardInfo => !cardInfo.asideMove &&
                        room.getCardTag(info.fromId, this.Name).includes(cardInfo.card) &&
                        (cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */))) {
                    toObtain.push(...info.movingCards
                        .filter(cardInfo => !cardInfo.asideMove &&
                        room.getCardTag(infos[0].fromId, this.Name).includes(cardInfo.card) &&
                        (cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */) &&
                        room.isCardInDropStack(cardInfo.card))
                        .map(cardInfo => cardInfo.card));
                }
            }
        }
        toObtain.length > 0 &&
            (await room.moveCards({
                movingCards: toObtain.map(card => ({ card, fromArea: 4 /* DropStack */ })),
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            }));
        return true;
    }
};
LiuZhuan = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'liuzhuan', description: 'liuzhuan_description' })
], LiuZhuan);
exports.LiuZhuan = LiuZhuan;
let LiuZhuanShadow = class LiuZhuanShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return !!content.infos.find(info => info.toId !== owner.Id &&
            info.toId !== undefined &&
            room.CurrentPlayer.Id === info.toId &&
            info.toArea === 0 /* HandArea */ &&
            room.CurrentPlayerPhase !== 3 /* DrawCardStage */ &&
            info.movingCards.find(cardInfo => { var _a; return !((_a = room.getCardTag(info.toId, this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes(cardInfo.card)); }));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        for (const info of event.triggeredOnEvent.infos) {
            if (info.toId !== event.fromId &&
                room.CurrentPlayer.Id === info.toId &&
                info.toArea === 0 /* HandArea */ &&
                room.CurrentPlayerPhase !== 3 /* DrawCardStage */) {
                const cardIdsRecorded = room.getCardTag(info.toId, this.GeneralName) || [];
                const singletonCardIds = algorithm_1.Algorithm.singleton([
                    ...cardIdsRecorded,
                    ...info.movingCards.filter(cardInfo => !cardInfo.asideMove).map(cardInfo => cardInfo.card),
                ]);
                singletonCardIds > cardIdsRecorded && room.setCardTag(info.toId, this.GeneralName, singletonCardIds);
            }
        }
        return true;
    }
};
LiuZhuanShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: LiuZhuan.Name, description: LiuZhuan.Description })
], LiuZhuanShadow);
exports.LiuZhuanShadow = LiuZhuanShadow;
let LiuZhuanProhibited = class LiuZhuanProhibited extends skill_1.FilterSkill {
    canBeUsedCard(cardId, room, owner, attacker) {
        var _a;
        return !(!(cardId instanceof card_matcher_1.CardMatcher) &&
            attacker &&
            ((_a = room.getCardTag(attacker, this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes(cardId)));
    }
};
LiuZhuanProhibited = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: LiuZhuanShadow.Name, description: LiuZhuanShadow.Description })
], LiuZhuanProhibited);
exports.LiuZhuanProhibited = LiuZhuanProhibited;
let LiuZhuanRemove = class LiuZhuanRemove extends skill_1.TriggerSkill {
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
        return (event.from === 7 /* PhaseFinish */ &&
            event.fromPlayer !== undefined &&
            room.getCardTag(event.fromPlayer, this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeCardTag(event.triggeredOnEvent.fromPlayer, this.GeneralName);
        return true;
    }
};
LiuZhuanRemove = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: LiuZhuanProhibited.Name, description: LiuZhuanProhibited.Description })
], LiuZhuanRemove);
exports.LiuZhuanRemove = LiuZhuanRemove;
