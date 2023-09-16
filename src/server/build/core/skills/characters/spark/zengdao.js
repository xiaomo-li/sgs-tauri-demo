"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZengDaoBuff = exports.ZengDao = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZengDao = class ZengDao extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.getCardIds(1 /* EquipArea */).length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    availableCardAreas() {
        return [1 /* EquipArea */];
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: cardIds.map(card => ({ card, fromArea: 1 /* EquipArea */ })),
            fromId,
            toId: toIds[0],
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: this.Name,
            isOutsideAreaInPublic: true,
            proposer: fromId,
            movedByReason: this.Name,
        });
        room.getPlayerById(toIds[0]).hasShadowSkill(ZengDaoBuff.Name) ||
            (await room.obtainSkill(toIds[0], ZengDaoBuff.Name));
        return true;
    }
};
ZengDao = tslib_1.__decorate([
    skill_1.LimitSkill({ name: 'zengdao', description: 'zengdao_description' })
], ZengDao);
exports.ZengDao = ZengDao;
let ZengDaoBuff = class ZengDaoBuff extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        await room.loseSkill(player.Id, this.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */;
    }
    canUse(room, owner, content) {
        return content.fromId === owner.Id && owner.getCardIds(3 /* OutsideArea */, ZengDao.Name).length > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const dao = room.getPlayerById(fromId).getCardIds(3 /* OutsideArea */, ZengDao.Name);
        const response = await room.doAskForCommonly(163 /* AskForCardEvent */, {
            cardAmount: 1,
            toId: fromId,
            reason: this.Name,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please remove a ‘Dao’', this.Name).extract(),
            fromArea: [3 /* OutsideArea */],
            cardMatcher: new card_matcher_1.CardMatcher({
                cards: dao,
            }).toSocketPassenger(),
            triggeredBySkills: [this.Name],
        }, fromId, true);
        response.selectedCards = response.selectedCards || dao[0];
        await room.moveCards({
            movingCards: [{ card: response.selectedCards[0], fromArea: 3 /* OutsideArea */ }],
            fromId,
            toArea: 4 /* DropStack */,
            moveReason: 6 /* PlaceToDropStack */,
            proposer: fromId,
            triggeredBySkills: [ZengDao.Name],
        });
        event.triggeredOnEvent.damage++;
        if (room.getPlayerById(fromId).getCardIds(3 /* OutsideArea */, ZengDao.Name).length === 0) {
            await room.loseSkill(fromId, this.Name);
        }
        return true;
    }
};
ZengDaoBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: 's_zengdao_buff', description: 's_zengdao_buff_description' })
], ZengDaoBuff);
exports.ZengDaoBuff = ZengDaoBuff;
