"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiJiangShadow = exports.JiJiang = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiJiang = class JiJiang extends skill_1.ViewAsSkill {
    get RelatedCharacters() {
        return ['liushan'];
    }
    canViewAs() {
        return ['slash'];
    }
    canUse(room, owner) {
        return (owner.canUseCard(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] })) &&
            room.getAlivePlayersFrom().filter(player => player.Nationality === 1 /* Shu */ && player !== owner)
                .length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return false;
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'slash',
            bySkill: this.Name,
        });
    }
};
JiJiang = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jijiang', description: 'jijiang_description' }),
    skill_1.LordSkill
], JiJiang);
exports.JiJiang = JiJiang;
let JiJiangShadow = class JiJiangShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return ((stage === "PreCardUse" /* PreCardUse */ || stage === "PreCardResponse" /* PreCardResponse */) &&
            card_1.Card.isVirtualCardId(event.cardId));
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            engine_1.Sanguosha.getCardById(content.cardId).findByGeneratedSkill(this.GeneralName));
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const jijiangEvent = event.triggeredOnEvent;
        const from = room.getPlayerById(event.fromId);
        let success = false;
        for (const player of room.getAlivePlayersFrom()) {
            if (player.Id === event.fromId || player.Nationality !== 1 /* Shu */) {
                continue;
            }
            const response = await room.askForCardResponse({
                cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }).toSocketPassenger(),
                toId: player.Id,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('do you wanna response a {0} card for skill {1} from {2}', 'slash', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from)).extract(),
                triggeredBySkills: [this.Name],
            }, player.Id);
            if (response.cardId !== undefined) {
                await room.responseCard({
                    fromId: player.Id,
                    cardId: response.cardId,
                    triggeredBySkills: [this.Name],
                    withoutInvokes: true,
                });
                jijiangEvent.cardId = response.cardId;
                success = true;
                break;
            }
        }
        if (!success) {
            event_packer_1.EventPacker.terminate(jijiangEvent);
        }
        return true;
    }
};
JiJiangShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.LordSkill,
    skill_1.CommonSkill({ name: JiJiang.Name, description: JiJiang.Description })
], JiJiangShadow);
exports.JiJiangShadow = JiJiangShadow;
