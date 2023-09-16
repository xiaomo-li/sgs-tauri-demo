"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnYuan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let EnYuan = class EnYuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */ || stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    triggerableTimes(event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            return event.damage;
        }
        else {
            return 1;
        }
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            return (damageEvent.toId === owner.Id &&
                damageEvent.fromId !== undefined &&
                room.getPlayerById(damageEvent.fromId).Dead === false);
        }
        else {
            const moveCardEvent = content;
            return (moveCardEvent.infos.find(info => info.toId === owner.Id &&
                info.fromId !== undefined &&
                info.fromId !== owner.Id &&
                info.toArea === 0 /* HandArea */ &&
                info.movingCards.length >= 2 &&
                room.getPlayerById(info.fromId).Dead === false) !== undefined);
        }
    }
    getSkillLog(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        let target;
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            target = room.getPlayerById(damageEvent.fromId);
        }
        else {
            const moveCardEvent = content;
            const info = moveCardEvent.infos.length === 1
                ? moveCardEvent.infos[0]
                : moveCardEvent.infos.find(info => info.toId === owner.Id &&
                    info.fromId !== undefined &&
                    info.toArea === 0 /* HandArea */ &&
                    info.movingCards.length >= 2 &&
                    room.getPlayerById(info.fromId).Dead === false);
            target = room.getPlayerById(info.fromId);
        }
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('do you want to trigger skill {0} to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(target)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const identifier = event_packer_1.EventPacker.getIdentifier(triggeredOnEvent);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = triggeredOnEvent;
            const damageFromId = damageEvent.fromId;
            const damageFrom = room.getPlayerById(damageFromId);
            if (damageFrom.getCardIds(0 /* HandArea */).length > 0) {
                const { selectedCards } = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                    cardAmount: 1,
                    toId: damageFromId,
                    reason: this.Name,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you need to give a handcard to {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
                    fromArea: [0 /* HandArea */],
                    triggeredBySkills: [this.Name],
                }, damageFromId);
                if (selectedCards.length > 0) {
                    const suit = engine_1.Sanguosha.getCardById(selectedCards[0]).Suit;
                    await room.moveCards({
                        movingCards: selectedCards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                        moveReason: 2 /* ActiveMove */,
                        fromId: damageFromId,
                        toId: fromId,
                        toArea: 0 /* HandArea */,
                        proposer: damageFromId,
                    });
                    if (suit !== 2 /* Heart */) {
                        await room.drawCards(1, fromId, 'top', fromId, this.Name);
                    }
                }
                else {
                    await room.loseHp(damageFromId, 1);
                }
            }
            else {
                await room.loseHp(damageFromId, 1);
            }
        }
        else {
            const moveCardEvent = triggeredOnEvent;
            const info = moveCardEvent.infos.length === 1
                ? moveCardEvent.infos[0]
                : moveCardEvent.infos.find(info => info.toId === fromId &&
                    info.fromId !== undefined &&
                    info.toArea === 0 /* HandArea */ &&
                    info.movingCards.length >= 2 &&
                    room.getPlayerById(info.fromId).Dead === false);
            await room.drawCards(1, info.fromId, undefined, fromId, this.Name);
        }
        return true;
    }
};
EnYuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'enyuan', description: 'enyuan_description' })
], EnYuan);
exports.EnYuan = EnYuan;
