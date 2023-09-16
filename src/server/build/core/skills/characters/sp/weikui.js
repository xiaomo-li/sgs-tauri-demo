"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeiKuiShadow = exports.WeiKuiBuff = exports.WeiKui = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let WeiKui = class WeiKui extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.Hp > 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        await room.loseHp(event.fromId, 1);
        const handCards = room.getPlayerById(event.toIds[0]).getCardIds(0 /* HandArea */);
        if (handCards.find(id => engine_1.Sanguosha.getCardById(id).GeneralName === 'jink')) {
            const originalPlayers = room.getFlag(event.fromId, this.Name) || [];
            originalPlayers.includes(event.toIds[0]) || originalPlayers.push(event.toIds[0]);
            room.setFlag(event.fromId, this.Name, originalPlayers);
            const virtualSlash = card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.Name }).Id;
            room.getPlayerById(event.fromId).canUseCardTo(room, virtualSlash, event.toIds[0], true) &&
                (await room.useCard({
                    fromId: event.fromId,
                    targetGroup: [event.toIds],
                    cardId: virtualSlash,
                }, true));
        }
        else {
            const options = {
                [0 /* HandArea */]: room.getPlayerById(event.toIds[0]).getCardIds(0 /* HandArea */),
            };
            const chooseCardEvent = {
                fromId: event.fromId,
                toId: event.toIds[0],
                options,
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForChoosingPlayerCard(chooseCardEvent, event.fromId, true, true);
            if (!response) {
                return false;
            }
            await room.dropCards(4 /* SelfDrop */, [response.selectedCard], event.toIds[0], event.fromId, this.Name);
        }
        return true;
    }
};
WeiKui = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'weikui', description: 'weikui_description' })
], WeiKui);
exports.WeiKui = WeiKui;
let WeiKuiBuff = class WeiKuiBuff extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakDistanceTo(room, owner, target) {
        var _a;
        return ((_a = owner.getFlag(this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes(target.Id)) ? 1 : 0;
    }
};
WeiKuiBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: WeiKui.Name, description: WeiKui.Description })
], WeiKuiBuff);
exports.WeiKuiBuff = WeiKuiBuff;
let WeiKuiShadow = class WeiKuiShadow extends skill_1.TriggerSkill {
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
        return (owner.Id === event.fromPlayer &&
            event.from === 7 /* PhaseFinish */ &&
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
WeiKuiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: WeiKuiBuff.Name, description: WeiKuiBuff.Description })
], WeiKuiShadow);
exports.WeiKuiShadow = WeiKuiShadow;
