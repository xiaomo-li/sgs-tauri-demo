"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YongJinMove = exports.YongJin = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YongJin = class YongJin extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return true;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 2;
    }
    isAvailableCard() {
        return false;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        if (selectedTargets.length === 0) {
            const to = room.getPlayerById(target);
            const equipCardIds = to.getCardIds(1 /* EquipArea */);
            return equipCardIds.length > 0;
        }
        else if (selectedTargets.length === 1) {
            const from = room.getPlayerById(selectedTargets[0]);
            const fromEquipArea = from.getCardIds(1 /* EquipArea */);
            return fromEquipArea.find(id => room.canPlaceCardTo(id, target)) !== undefined;
        }
        return false;
    }
    resortTargets() {
        return false;
    }
    getAnimationSteps(event) {
        const { fromId, toIds } = event;
        return [
            { from: fromId, tos: [toIds[0]] },
            { from: toIds[0], tos: [toIds[1]] },
        ];
    }
    async onUse(room, event) {
        event.animation = this.getAnimationSteps(event);
        return true;
    }
    async yongJinMove(room, user, fromId, toId) {
        const moveFrom = room.getPlayerById(fromId);
        const moveTo = room.getPlayerById(toId);
        const canMovedEquipCardIds = [];
        const fromEquipArea = moveFrom.getCardIds(1 /* EquipArea */);
        const banIds = room.getFlag(user, this.Name);
        canMovedEquipCardIds.push(...fromEquipArea.filter(id => room.canPlaceCardTo(id, moveTo.Id) && (banIds ? !banIds.includes(id) : true)));
        const options = {
            [1 /* EquipArea */]: canMovedEquipCardIds,
        };
        const chooseCardEvent = {
            fromId: user,
            toId: user,
            options,
            triggeredBySkills: [this.Name],
        };
        room.notify(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(chooseCardEvent), user);
        const response = await room.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, user);
        response.selectedCard = response.selectedCard || canMovedEquipCardIds[0];
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
            moveReason: 3 /* PassiveMove */,
            toId: moveTo.Id,
            fromId: moveFrom.Id,
            toArea: response.fromArea,
            proposer: chooseCardEvent.fromId,
            movedByReason: this.Name,
        });
        return response.selectedCard;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        let banId = await this.yongJinMove(room, fromId, toIds[0], toIds[1]);
        room.setFlag(fromId, this.Name, [banId]);
        for (let i = 0; i < 2; i++) {
            const skillUseEvent = {
                invokeSkillNames: [YongJinMove.Name],
                toId: fromId,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose two target to move their equipment', this.Name).extract(),
            };
            room.notify(171 /* AskForSkillUseEvent */, skillUseEvent, fromId);
            const { toIds } = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, fromId);
            if (!toIds) {
                break;
            }
            banId = await this.yongJinMove(room, fromId, toIds[0], toIds[1]);
            const banIds = room.getFlag(fromId, this.Name) || [];
            banIds.push(banId);
            room.setFlag(fromId, this.Name, banIds);
        }
        room.removeFlag(fromId, this.Name);
        return true;
    }
};
YongJin = tslib_1.__decorate([
    skill_1.LimitSkill({ name: 'yongjin', description: 'yongjin_description' })
], YongJin);
exports.YongJin = YongJin;
let YongJinMove = class YongJinMove extends skill_1.TriggerSkill {
    isTriggerable() {
        return false;
    }
    canUse() {
        return false;
    }
    numberOfTargets() {
        return 2;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        const banIds = room.getFlag(owner, YongJin.Name) || [];
        if (selectedTargets.length === 0) {
            const to = room.getPlayerById(target);
            const equipCardIds = to.getCardIds(1 /* EquipArea */);
            return equipCardIds.filter(id => !banIds.includes(id)).length > 0;
        }
        else if (selectedTargets.length === 1) {
            const from = room.getPlayerById(selectedTargets[0]);
            const fromEquipArea = from.getCardIds(1 /* EquipArea */);
            return (fromEquipArea.find(id => room.canPlaceCardTo(id, target) && (banIds ? !banIds.includes(id) : true)) !==
                undefined);
        }
        return false;
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
YongJinMove = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: 'yongjin_move', description: 'yongjin_move_description' })
], YongJinMove);
exports.YongJinMove = YongJinMove;
