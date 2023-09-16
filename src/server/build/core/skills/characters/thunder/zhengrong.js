"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhengRong = void 0;
const tslib_1 = require("tslib");
const card_props_1 = require("core/cards/libs/card_props");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhengRong = class ZhengRong extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, content) {
        const canUse = content.fromId === owner.Id &&
            !!content.isFirstTarget &&
            content.byCardId !== undefined &&
            Object.values(card_props_1.DamageCardEnum).includes(engine_1.Sanguosha.getCardById(content.byCardId).GeneralName);
        let targets = [];
        if (canUse) {
            targets = aim_group_1.AimGroupUtil.getAllTargets(content.allTargets).filter(playerId => room.getPlayerById(playerId).getCardIds(0 /* HandArea */).length >=
                owner.getCardIds(0 /* HandArea */).length);
            if (targets.length > 0) {
                room.setFlag(owner.Id, this.Name, targets);
            }
        }
        return canUse && targets.length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        return (room.getFlag(owner, this.Name).includes(targetId) &&
            room.getPlayerById(targetId).getPlayerCards().length > 0);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to prey a card from him, and put this card on your general card as ‘Rong’?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const to = room.getPlayerById(toIds[0]);
        const options = {
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
        };
        if (fromId === toIds[0]) {
            options[0 /* HandArea */] = to.getCardIds(0 /* HandArea */);
        }
        const chooseCardEvent = event_packer_1.EventPacker.createUncancellableEvent({
            fromId,
            toId: toIds[0],
            options,
        });
        const response = await room.doAskForCommonly(170 /* AskForChoosingCardFromPlayerEvent */, chooseCardEvent, fromId);
        if (response.selectedCardIndex !== undefined) {
            const cardIds = to.getCardIds(0 /* HandArea */);
            response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
        }
        else if (response.selectedCard === undefined) {
            const cardIds = to.getPlayerCards();
            response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
        }
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: 0 /* HandArea */ }],
            fromId: toIds[0],
            toId: fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: this.Name,
            isOutsideAreaInPublic: false,
            proposer: fromId,
            movedByReason: this.Name,
        });
        return true;
    }
};
ZhengRong = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhengrong', description: 'zhengrong_description' })
], ZhengRong);
exports.ZhengRong = ZhengRong;
