"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingXian = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QingXian = class QingXian extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.QingXianOptions = ['qingxian:loseHp', 'qingxian:recover'];
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */ || stage === "AfterRecoverEffect" /* AfterRecoverEffect */;
    }
    canUse(room, owner, content) {
        if (content.toId !== owner.Id || room.AlivePlayers.find(player => player.Dying)) {
            return false;
        }
        if (event_packer_1.EventPacker.getIdentifier(content) === 137 /* DamageEvent */) {
            const source = content.fromId;
            return !!source && !room.getPlayerById(source).Dead;
        }
        return true;
    }
    async beforeUse(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const isDamageEvent = event_packer_1.EventPacker.getIdentifier(unknownEvent) === 137 /* DamageEvent */;
        let toId;
        if (isDamageEvent) {
            toId = unknownEvent.fromId;
        }
        else {
            const { selectedPlayers } = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: room.getOtherPlayers(event.fromId).map(player => player.Id),
                toId: event.fromId,
                requiredAmount: 1,
                conversation: 'qingxian: do you want to choose a target to use this skill?',
                triggeredBySkills: [this.Name],
            }, event.fromId);
            if (selectedPlayers && selectedPlayers.length > 0) {
                toId = selectedPlayers[0];
            }
        }
        if (!toId) {
            return false;
        }
        const options = [this.QingXianOptions[0]];
        room.getPlayerById(toId).LostHp > 0 && options.push(this.QingXianOptions[1]);
        const resp = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose qingxian options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toId))).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId, isDamageEvent);
        isDamageEvent && (resp.selectedOption = resp.selectedOption || this.QingXianOptions[0]);
        if (resp.selectedOption) {
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: resp.selectedOption }, event);
            event.toIds = [toId];
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const toId = event.toIds[0];
        let isClub = false;
        if (event_packer_1.EventPacker.getMiddleware(this.Name, event) === this.QingXianOptions[0]) {
            await room.loseHp(toId, 1);
            const equips = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [1 /* Equip */] }));
            if (equips.length > 0) {
                const randomEquip = equips[Math.floor(Math.random() * equips.length)];
                await room.useCard({
                    fromId: toId,
                    targetGroup: [[toId]],
                    cardId: randomEquip,
                    customFromArea: 5 /* DrawStack */,
                });
                isClub = engine_1.Sanguosha.getCardById(randomEquip).Suit === 3 /* Club */;
            }
        }
        else {
            await room.recover({
                toId,
                recoveredHp: 1,
                recoverBy: event.fromId,
            });
            const playerEquips = room
                .getPlayerById(toId)
                .getPlayerCards()
                .filter(cardId => engine_1.Sanguosha.getCardById(cardId).is(1 /* Equip */));
            if (playerEquips.length > 0) {
                const randomEquip = playerEquips[Math.floor(Math.random() * playerEquips.length)];
                await room.dropCards(4 /* SelfDrop */, [randomEquip], toId, toId, this.Name);
                isClub = engine_1.Sanguosha.getCardById(randomEquip).Suit === 3 /* Club */;
            }
        }
        isClub && (await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name));
        return true;
    }
};
QingXian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'qingxian', description: 'qingxian_description' })
], QingXian);
exports.QingXian = QingXian;
