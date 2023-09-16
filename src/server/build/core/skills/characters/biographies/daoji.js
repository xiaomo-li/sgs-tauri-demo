"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaoJiRemover = exports.DaoJiDebuff = exports.DaoJi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DaoJi = class DaoJi extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.DaoJiOptions = ['daoji:prey', 'daoji:block'];
    }
    async whenObtainingSkill(room, owner) {
        const players = owner.getFlag(this.Name) || [];
        for (const other of room.getOtherPlayers(owner.Id)) {
            if (!players.includes(other.Id) &&
                room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */ &&
                    event.fromId === other.Id &&
                    engine_1.Sanguosha.getCardById(event.cardId).is(2 /* Weapon */), undefined, undefined, undefined, 1).length > 0) {
                players.push(other.Id);
            }
        }
        owner.setFlag(this.Name, players);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */;
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */;
    }
    canUse(room, owner, content, stage) {
        const players = owner.getFlag(this.Name) || [];
        if (stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ &&
            content.fromId !== owner.Id &&
            engine_1.Sanguosha.getCardById(content.cardId).is(2 /* Weapon */) &&
            !players.includes(content.fromId)) {
            players.push(content.fromId);
            owner.setFlag(this.Name, players);
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, content);
        }
        return stage === "CardUsing" /* CardUsing */ && event_packer_1.EventPacker.getMiddleware(this.Name, content) === true;
    }
    async beforeUse(room, event) {
        const options = this.DaoJiOptions.slice();
        const cardUseEvent = event.triggeredOnEvent;
        !room.isCardOnProcessing(cardUseEvent.cardId) && options.shift();
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose daoji options: {1} {2}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardUseEvent.cardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(cardUseEvent.fromId))).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId);
        if (response.selectedOption) {
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: response.selectedOption }, event);
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const chosen = event_packer_1.EventPacker.getMiddleware(this.Name, event);
        if (chosen === this.DaoJiOptions[0]) {
            await room.moveCards({
                movingCards: [
                    {
                        card: event.triggeredOnEvent.cardId,
                        fromArea: 6 /* ProcessingArea */,
                    },
                ],
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                proposer: event.fromId,
                moveReason: 1 /* ActivePrey */,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            const user = room.getPlayerById(event.triggeredOnEvent.fromId);
            user.hasShadowSkill(DaoJiDebuff.Name) || (await room.obtainSkill(user.Id, DaoJiDebuff.Name));
        }
        return true;
    }
};
DaoJi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'daoji', description: 'daoji_description' })
], DaoJi);
exports.DaoJi = DaoJi;
let DaoJiDebuff = class DaoJiDebuff extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner) {
        return cardId instanceof card_matcher_1.CardMatcher
            ? !cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }))
            : engine_1.Sanguosha.getCardById(cardId).GeneralName !== 'slash';
    }
};
DaoJiDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_daoji_debuff', description: 's_daoji_debuff_description' })
], DaoJiDebuff);
exports.DaoJiDebuff = DaoJiDebuff;
let DaoJiRemover = class DaoJiRemover extends skill_1.TriggerSkill {
    async whenDead(room, owner) {
        owner.hasShadowSkill(DaoJiDebuff.Name) && (await room.loseSkill(owner.Id, DaoJiDebuff.Name));
        await room.loseSkill(owner.Id, this.Name);
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
        return event.from === 7 /* PhaseFinish */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.getPlayerById(event.fromId).hasShadowSkill(DaoJiDebuff.Name) &&
            (await room.loseSkill(event.fromId, DaoJiDebuff.Name));
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
DaoJiRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_daoji_remover', description: 's_daoji_remover_description' })
], DaoJiRemover);
exports.DaoJiRemover = DaoJiRemover;
