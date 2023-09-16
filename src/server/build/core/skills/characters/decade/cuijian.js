"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuiJianEX = exports.CuiJianII = exports.CuiJianI = exports.CuiJian = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let CuiJian = class CuiJian extends skill_1.ActiveSkill {
    constructor() {
        super(...arguments);
        this.CuiJianNames = ['cuijian', 'cuijian_I', 'cuijian_II', 'cuijian_EX'];
    }
    canUse(room, owner) {
        return !this.CuiJianNames.find(name => owner.hasUsedSkill(name));
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
        const { fromId } = event;
        const to = room.getPlayerById(event.toIds[0]);
        if (to.getCardIds(0 /* HandArea */).find(id => engine_1.Sanguosha.getCardById(id).GeneralName === 'jink')) {
            const toGain = to
                .getCardIds(0 /* HandArea */)
                .filter(id => engine_1.Sanguosha.getCardById(id).GeneralName === 'jink');
            to.getEquipment(3 /* Shield */) && toGain.push(to.getEquipment(3 /* Shield */));
            await room.moveCards({
                movingCards: toGain.map(card => ({
                    card,
                    fromArea: card === to.getEquipment(3 /* Shield */) ? 1 /* EquipArea */ : 0 /* HandArea */,
                })),
                fromId: event.toIds[0],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: event.toIds[0],
                triggeredBySkills: [this.GeneralName],
            });
            let selectedCards = room.getPlayerById(fromId).getPlayerCards();
            if (selectedCards.length > toGain.length) {
                const resp = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                    cardAmount: toGain.length,
                    toId: fromId,
                    reason: this.Name,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please give {1} {2} card(s)', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to), toGain.length).extract(),
                    fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                    triggeredBySkills: [this.Name],
                }, fromId, true);
                selectedCards =
                    resp.selectedCards.length > 0 ? resp.selectedCards : algorithm_1.Algorithm.randomPick(toGain.length, selectedCards);
            }
            selectedCards.length > 0 &&
                (await room.moveCards({
                    movingCards: selectedCards.map(card => ({ card, fromArea: room.getPlayerById(fromId).cardFrom(card) })),
                    fromId,
                    toId: event.toIds[0],
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: fromId,
                    triggeredBySkills: [this.Name],
                }));
        }
        return true;
    }
};
CuiJian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'cuijian', description: 'cuijian_description' })
], CuiJian);
exports.CuiJian = CuiJian;
let CuiJianI = class CuiJianI extends CuiJian {
    get GeneralName() {
        return CuiJian.Name;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const { fromId } = event;
        const to = room.getPlayerById(event.toIds[0]);
        if (to.getCardIds(0 /* HandArea */).find(id => engine_1.Sanguosha.getCardById(id).GeneralName === 'jink')) {
            const toGain = to
                .getCardIds(0 /* HandArea */)
                .filter(id => engine_1.Sanguosha.getCardById(id).GeneralName === 'jink');
            to.getEquipment(3 /* Shield */) && toGain.push(to.getEquipment(3 /* Shield */));
            await room.moveCards({
                movingCards: toGain.map(card => ({
                    card,
                    fromArea: card === to.getEquipment(3 /* Shield */) ? 1 /* EquipArea */ : 0 /* HandArea */,
                })),
                fromId: event.toIds[0],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: event.toIds[0],
                triggeredBySkills: [this.GeneralName],
            });
            let selectedCards = room.getPlayerById(fromId).getPlayerCards();
            if (selectedCards.length > toGain.length) {
                const resp = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                    cardAmount: toGain.length,
                    toId: fromId,
                    reason: this.Name,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please give {1} {2} card(s)', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to), toGain.length).extract(),
                    fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                    triggeredBySkills: [this.Name],
                }, fromId, true);
                selectedCards =
                    resp.selectedCards.length > 0 ? resp.selectedCards : algorithm_1.Algorithm.randomPick(toGain.length, selectedCards);
            }
            selectedCards.length > 0 &&
                (await room.moveCards({
                    movingCards: selectedCards.map(card => ({ card, fromArea: room.getPlayerById(fromId).cardFrom(card) })),
                    fromId,
                    toId: event.toIds[0],
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: fromId,
                    triggeredBySkills: [this.Name],
                }));
        }
        else {
            await room.drawCards(2, fromId, 'top', fromId, this.Name);
        }
        return true;
    }
};
CuiJianI = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'cuijian_I', description: 'cuijian_I_description' })
], CuiJianI);
exports.CuiJianI = CuiJianI;
let CuiJianII = class CuiJianII extends CuiJian {
    get GeneralName() {
        return CuiJian.Name;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const { fromId } = event;
        const to = room.getPlayerById(event.toIds[0]);
        if (to.getCardIds(0 /* HandArea */).find(id => engine_1.Sanguosha.getCardById(id).GeneralName === 'jink')) {
            const toGain = to
                .getCardIds(0 /* HandArea */)
                .filter(id => engine_1.Sanguosha.getCardById(id).GeneralName === 'jink');
            to.getEquipment(3 /* Shield */) && toGain.push(to.getEquipment(3 /* Shield */));
            await room.moveCards({
                movingCards: toGain.map(card => ({
                    card,
                    fromArea: card === to.getEquipment(3 /* Shield */) ? 1 /* EquipArea */ : 0 /* HandArea */,
                })),
                fromId: event.toIds[0],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: event.toIds[0],
                triggeredBySkills: [this.GeneralName],
            });
        }
        return true;
    }
};
CuiJianII = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'cuijian_II', description: 'cuijian_II_description' })
], CuiJianII);
exports.CuiJianII = CuiJianII;
let CuiJianEX = class CuiJianEX extends CuiJian {
    get GeneralName() {
        return CuiJian.Name;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const { fromId } = event;
        const to = room.getPlayerById(event.toIds[0]);
        if (to.getCardIds(0 /* HandArea */).find(id => engine_1.Sanguosha.getCardById(id).GeneralName === 'jink')) {
            const toGain = to
                .getCardIds(0 /* HandArea */)
                .filter(id => engine_1.Sanguosha.getCardById(id).GeneralName === 'jink');
            to.getEquipment(3 /* Shield */) && toGain.push(to.getEquipment(3 /* Shield */));
            await room.moveCards({
                movingCards: toGain.map(card => ({
                    card,
                    fromArea: card === to.getEquipment(3 /* Shield */) ? 1 /* EquipArea */ : 0 /* HandArea */,
                })),
                fromId: event.toIds[0],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                triggeredBySkills: [this.GeneralName],
            });
        }
        else {
            await room.drawCards(2, fromId, 'top', fromId, this.Name);
        }
        return true;
    }
};
CuiJianEX = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'cuijian_EX', description: 'cuijian_EX_description' })
], CuiJianEX);
exports.CuiJianEX = CuiJianEX;
