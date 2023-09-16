"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoJunClear = exports.PoJunDamage = exports.PoJun = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let PoJun = class PoJun extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, aimEvent) {
        return (aimEvent.fromId === owner.Id &&
            !!aimEvent.byCardId &&
            engine_1.Sanguosha.getCardById(aimEvent.byCardId).GeneralName === 'slash' &&
            room.getPlayerById(aimEvent.toId).getPlayerCards().length > 0);
    }
    async onTrigger(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const aimEvent = triggeredOnEvent;
        const owner = room.getPlayerById(fromId);
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1} to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(owner), this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(aimEvent.toId))).extract();
        return true;
    }
    getAnimationSteps(event) {
        const { fromId, triggeredOnEvent } = event;
        const aimEvent = triggeredOnEvent;
        return [{ from: fromId, tos: [aimEvent.toId] }];
    }
    async onEffect(room, skillEffectEvent) {
        const aimEvent = skillEffectEvent.triggeredOnEvent;
        const to = room.getPlayerById(aimEvent.toId);
        const handCardIds = to.getCardIds(0 /* HandArea */);
        const equipCardIds = to.getCardIds(1 /* EquipArea */);
        const askForPoJunCards = {
            toId: aimEvent.toId,
            customCardFields: {
                [0 /* HandArea */]: handCardIds.length,
                [1 /* EquipArea */]: equipCardIds,
            },
            customTitle: this.Name,
            amount: [1, to.Hp],
            triggeredBySkills: [this.Name],
        };
        room.notify(166 /* AskForChoosingCardWithConditionsEvent */, askForPoJunCards, skillEffectEvent.fromId);
        const { selectedCards, selectedCardsIndex } = await room.onReceivingAsyncResponseFrom(166 /* AskForChoosingCardWithConditionsEvent */, skillEffectEvent.fromId);
        const movingCards = selectedCards
            ? selectedCards.map(id => ({ card: id, fromArea: to.cardFrom(id) }))
            : [];
        for (const card of selectedCardsIndex ? algorithm_1.Algorithm.randomPick(selectedCardsIndex.length, handCardIds) : []) {
            movingCards.push({ card, fromArea: 0 /* HandArea */ });
        }
        await room.moveCards({
            movingCards,
            fromId: to.Id,
            toId: to.Id,
            toArea: 3 /* OutsideArea */,
            moveReason: 3 /* PassiveMove */,
            proposer: skillEffectEvent.fromId,
            toOutsideArea: this.GeneralName,
            movedByReason: this.GeneralName,
        });
        return true;
    }
};
PoJun = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'pojun', description: 'pojun_description' })
], PoJun);
exports.PoJun = PoJun;
let PoJunDamage = class PoJunDamage extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */;
    }
    canUse(room, owner, event) {
        if (event.fromId === owner.Id &&
            !!event.cardIds &&
            !event.isFromChainedDamage &&
            engine_1.Sanguosha.getCardById(event.cardIds[0]).GeneralName === 'slash') {
            const to = room.getPlayerById(event.toId);
            const handCardLengthOfDamageTo = to.getCardIds(0 /* HandArea */).length;
            const handCardLengthOfDamageFrom = owner.getCardIds(0 /* HandArea */).length;
            const equipCardLengthOfDamageTo = to.getCardIds(1 /* EquipArea */).length;
            const equipCardLengthOfDamageFrom = owner.getCardIds(1 /* EquipArea */).length;
            return (handCardLengthOfDamageTo <= handCardLengthOfDamageFrom &&
                equipCardLengthOfDamageTo <= equipCardLengthOfDamageFrom);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const damageEvent = skillEffectEvent.triggeredOnEvent;
        damageEvent.damage++;
        damageEvent.messages = damageEvent.messages || [];
        damageEvent.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, damage increases to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillEffectEvent.fromId)), this.GeneralName, damageEvent.damage).toString());
        return true;
    }
};
PoJunDamage = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: PoJun.Name, description: PoJun.Description })
], PoJunDamage);
exports.PoJunDamage = PoJunDamage;
let PoJunClear = class PoJunClear extends skill_1.TriggerSkill {
    async pojunClear(room) {
        for (const player of room.getAlivePlayersFrom()) {
            const pojunCard = player.getCardIds(3 /* OutsideArea */, this.GeneralName);
            if (pojunCard.length) {
                await room.moveCards({
                    movingCards: pojunCard.map(id => ({ card: id, fromArea: 3 /* OutsideArea */ })),
                    fromId: player.Id,
                    toId: player.Id,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: player.Id,
                    movedByReason: this.GeneralName,
                });
            }
        }
    }
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    async whenDead(room, player) {
        if (room.CurrentPhasePlayer === player) {
            await this.pojunClear(room);
        }
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    canUse(room, owner, event) {
        return event.from === 7 /* PhaseFinish */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room) {
        await this.pojunClear(room);
        return true;
    }
};
PoJunClear = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: PoJunDamage.Name, description: PoJunDamage.Description })
], PoJunClear);
exports.PoJunClear = PoJunClear;
