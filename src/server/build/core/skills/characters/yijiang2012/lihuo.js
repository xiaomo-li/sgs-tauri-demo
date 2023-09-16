"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiHuoRecord = exports.LiHuoLoseHp = exports.LiHuoPut = exports.LiHuoShadow = exports.LiHuo = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const chunlao_1 = require("./chunlao");
let LiHuo = class LiHuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardUseDeclared" /* AfterCardUseDeclared */;
    }
    canUse(room, owner, event) {
        return engine_1.Sanguosha.getCardById(event.cardId).Name === 'slash' && owner.Id === event.fromId;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to transfrom {1} into fire slash?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardUseEvent = event.triggeredOnEvent;
        const { cardId } = cardUseEvent;
        const fireSlash = card_1.VirtualCard.create({
            cardName: 'fire_slash',
            bySkill: this.Name,
        }, [cardId]);
        room.endProcessOnTag(cardUseEvent.cardId.toString());
        cardUseEvent.cardId = fireSlash.Id;
        room.addProcessingCards(cardUseEvent.cardId.toString(), cardUseEvent.cardId);
        room.broadcast(103 /* CustomGameDialog */, {
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, transfrom {2} into {3}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardId), translation_json_tool_1.TranslationPack.patchCardInTranslation(fireSlash.Id)).extract(),
        });
        return true;
    }
};
LiHuo = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'lihuo', description: 'lihuo_description' })
], LiHuo);
exports.LiHuo = LiHuo;
let LiHuoShadow = class LiHuoShadow extends skill_1.TriggerSkill {
    isAutoTrigger(room, owner, event) {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardTargetDeclared" /* AfterCardTargetDeclared */;
    }
    canUse(room, owner, event) {
        return (engine_1.Sanguosha.getCardById(event.cardId).Name === 'fire_slash' &&
            owner.Id === event.fromId &&
            room
                .getOtherPlayers(owner.Id)
                .find(player => room.canAttack(owner, player, event.cardId) &&
                !target_group_1.TargetGroupUtil.includeRealTarget(event.targetGroup, player.Id)) !== undefined);
    }
    async beforeUse(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const from = room.getPlayerById(fromId);
        const cardUseEvent = triggeredOnEvent;
        const players = room
            .getAlivePlayersFrom()
            .filter(player => room.canAttack(from, player, cardUseEvent.cardId) &&
            !target_group_1.TargetGroupUtil.includeRealTarget(cardUseEvent.targetGroup, player.Id))
            .map(player => player.Id);
        if (players.length < 1) {
            return false;
        }
        const askForPlayerChoose = {
            toId: fromId,
            players,
            requiredAmount: 1,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a target to be the additional target of {1}', this.GeneralName, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardUseEvent.cardId)).extract(),
            triggeredBySkills: [this.Name],
        };
        room.notify(167 /* AskForChoosingPlayerEvent */, askForPlayerChoose, fromId);
        const resp = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, fromId);
        if (!resp.selectedPlayers) {
            return false;
        }
        event.toIds = resp.selectedPlayers;
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds, triggeredOnEvent } = event;
        const cardUseEvent = triggeredOnEvent;
        target_group_1.TargetGroupUtil.pushTargets(cardUseEvent.targetGroup, toIds[0]);
        return true;
    }
};
LiHuoShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: LiHuo.Name, description: LiHuo.Description })
], LiHuoShadow);
exports.LiHuoShadow = LiHuoShadow;
let LiHuoPut = class LiHuoPut extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, event) {
        if (event.fromId === owner.Id &&
            event_packer_1.EventPacker.getMiddleware(this.GeneralName, event) &&
            room.isCardOnProcessing(event.cardId)) {
            const card = engine_1.Sanguosha.getCardById(event.cardId);
            if (card.isVirtualCard()) {
                const cardIds = card.getRealActualCards();
                return cardIds.length === 1 && engine_1.Sanguosha.getCardById(cardIds[0]).GeneralName === 'slash';
            }
            else {
                return card.GeneralName === 'slash';
            }
        }
        return false;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put {1} on your general card as Chun?', this.GeneralName, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const cardUseEvent = triggeredOnEvent;
        const card = engine_1.Sanguosha.getCardById(cardUseEvent.cardId);
        const realCardId = card.isVirtualCard() ? card.getRealActualCards()[0] : cardUseEvent.cardId;
        await room.moveCards({
            movingCards: [{ card: realCardId, fromArea: 6 /* ProcessingArea */ }],
            toId: fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: chunlao_1.ChunLao.Name,
            isOutsideAreaInPublic: true,
            proposer: fromId,
            movedByReason: this.GeneralName,
        });
        return true;
    }
};
LiHuoPut = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: LiHuoShadow.Name, description: LiHuoShadow.Description })
], LiHuoPut);
exports.LiHuoPut = LiHuoPut;
let LiHuoLoseHp = class LiHuoLoseHp extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        let isLiHuo = false;
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        if (card.isVirtualCard()) {
            const vCard = card;
            isLiHuo = vCard.findByGeneratedSkill(this.GeneralName);
        }
        return content.fromId === owner.Id && isLiHuo && event_packer_1.EventPacker.getDamageSignatureInCardUse(content);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.loseHp(event.fromId, 1);
        return true;
    }
};
LiHuoLoseHp = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: LiHuoPut.Name, description: LiHuoPut.Description })
], LiHuoLoseHp);
exports.LiHuoLoseHp = LiHuoLoseHp;
let LiHuoRecord = class LiHuoRecord extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    getPriority() {
        return 0 /* High */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        const flag = owner.getFlag(this.GeneralName);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            return cardUseEvent.fromId === owner.Id && !flag;
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return flag && phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const from = room.getPlayerById(fromId);
            from.setFlag(this.GeneralName, true);
            event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: true }, unknownEvent);
        }
        else {
            room.getPlayerById(fromId).removeFlag(this.GeneralName);
        }
        return true;
    }
};
LiHuoRecord = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: LiHuoLoseHp.Name, description: LiHuoLoseHp.Description })
], LiHuoRecord);
exports.LiHuoRecord = LiHuoRecord;
