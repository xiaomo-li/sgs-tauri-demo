"use strict";
var ZhiWei_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiWeiChained = exports.ZhiWei = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhiWei = ZhiWei_1 = class ZhiWei extends skill_1.TriggerSkill {
    isAutoTrigger(room, owner, event) {
        return !!event && event_packer_1.EventPacker.getIdentifier(event) === 143 /* GameBeginEvent */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterGameBegan" /* AfterGameBegan */ || stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return (phaseChangeEvent.to === 0 /* PhaseBegin */ &&
                phaseChangeEvent.toPlayer === owner.Id &&
                (!owner.getFlag(this.Name) || room.getPlayerById(owner.getFlag(this.Name)).Dead));
        }
        return identifier === 143 /* GameBeginEvent */;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose another player to be the ‘Zhi Wei’ target?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        let toId;
        if (event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent) === 143 /* GameBeginEvent */) {
            const others = room.getOtherPlayers(event.fromId).map(player => player.Id);
            const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: others,
                toId: event.fromId,
                requiredAmount: 1,
                conversation: 'zhiwei: please choose another player to be your ‘Zhi Wei’ player',
                triggeredBySkills: [this.Name],
            }, event.fromId, true);
            toId = (response.selectedPlayers || [others[Math.floor(Math.random() * others.length)]])[0];
        }
        else {
            if (!event.toIds) {
                return false;
            }
            toId = event.toIds[0];
        }
        room.getPlayerById(event.fromId).setFlag(this.Name, toId);
        room.setFlag(toId, ZhiWei_1.ZhiWeiPlayer, false, this.Name, [event.fromId]);
        return true;
    }
};
ZhiWei.ZhiWeiPlayer = 'zhiwei_player';
ZhiWei = ZhiWei_1 = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zhiwei', description: 'zhiwei_description' })
], ZhiWei);
exports.ZhiWei = ZhiWei;
let ZhiWeiChained = class ZhiWeiChained extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return (stage === "AfterDamageEffect" /* AfterDamageEffect */ ||
            stage === "AfterDamagedEffect" /* AfterDamagedEffect */ ||
            stage === "AfterCardMoved" /* AfterCardMoved */);
    }
    canUse(room, owner, content, stage) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 137 /* DamageEvent */) {
            const canUse = (stage === "AfterDamageEffect" /* AfterDamageEffect */ &&
                content.fromId ===
                    owner.getFlag(this.GeneralName)) ||
                (stage === "AfterDamagedEffect" /* AfterDamagedEffect */ &&
                    content.toId ===
                        owner.getFlag(this.GeneralName));
            canUse && owner.setFlag(this.Name, stage);
            return canUse;
        }
        else if (identifier === 128 /* MoveCardEvent */) {
            return (room.CurrentPhasePlayer === owner &&
                room.CurrentPlayerPhase === 5 /* DropCardStage */ &&
                !!owner.getFlag(this.GeneralName) &&
                !room.getPlayerById(owner.getFlag(this.GeneralName)).Dead &&
                content.infos.find(info => info.moveReason === 4 /* SelfDrop */ &&
                    info.movingCards.find(cardInfo => room.isCardInDropStack(cardInfo.card))) !== undefined);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (!room.getFlag(room.getFlag(event.fromId, this.GeneralName), ZhiWei.ZhiWeiPlayer)) {
            room.setFlag(room.getFlag(event.fromId, this.GeneralName), ZhiWei.ZhiWeiPlayer, true, this.GeneralName);
        }
        if (identifier === 137 /* DamageEvent */) {
            const stage = room.getFlag(event.fromId, this.Name);
            if (stage === "AfterDamageEffect" /* AfterDamageEffect */) {
                await room.drawCards(1, event.fromId, 'top', event.fromId, this.GeneralName);
            }
            else if (stage === "AfterDamagedEffect" /* AfterDamagedEffect */) {
                const availableIds = room
                    .getPlayerById(event.fromId)
                    .getCardIds(0 /* HandArea */)
                    .filter(cardId => room.canDropCard(event.fromId, cardId));
                if (availableIds.length === 0) {
                    return false;
                }
                await room.dropCards(4 /* SelfDrop */, [availableIds[Math.floor(Math.random() * availableIds.length)]], event.fromId, event.fromId, this.GeneralName);
            }
        }
        else {
            const availableIds = event.triggeredOnEvent.infos.reduce((cardIds, info) => info.moveReason === 4 /* SelfDrop */
                ? cardIds.concat(...info.movingCards
                    .filter(cardInfo => room.isCardInDropStack(cardInfo.card))
                    .map(cardInfo => cardInfo.card))
                : cardIds, []);
            await room.moveCards({
                movingCards: availableIds.map(card => ({ card, fromArea: 4 /* DropStack */ })),
                toId: room.getFlag(event.fromId, this.GeneralName),
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: room.getFlag(event.fromId, this.GeneralName),
                triggeredBySkills: [this.GeneralName],
            });
        }
        return true;
    }
};
ZhiWeiChained = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill({ stubbornSkill: true }),
    skill_wrappers_1.CommonSkill({ name: ZhiWei.Name, description: ZhiWei.Description })
], ZhiWeiChained);
exports.ZhiWeiChained = ZhiWeiChained;
