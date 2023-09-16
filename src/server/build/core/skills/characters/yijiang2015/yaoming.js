"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YaoMingShadow = exports.YaoMing = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YaoMing = class YaoMing extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */ || stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content, stage) {
        return (((owner.getFlag(this.Name) || []).length < 3 &&
            stage === "AfterDamageEffect" /* AfterDamageEffect */ &&
            content.fromId === owner.Id) ||
            (stage === "AfterDamagedEffect" /* AfterDamagedEffect */ && content.toId === owner.Id));
    }
    async beforeUse(room, event) {
        const { fromId } = event;
        let players = room.getAlivePlayersFrom();
        const handcards = room.getPlayerById(fromId).getCardIds(0 /* HandArea */).length;
        const used = room.getFlag(fromId, this.Name);
        used &&
            (players = players.filter(player => {
                const playerHandcards = player.getCardIds(0 /* HandArea */).length;
                return (!(used.includes(0 /* Draw */) && playerHandcards < handcards) &&
                    !(used.includes(1 /* Discard */) && playerHandcards > handcards) &&
                    !(used.includes(2 /* ZhiHeng */) && playerHandcards === handcards));
            }));
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players: players.map(player => player.Id),
            toId: fromId,
            requiredAmount: 1,
            conversation: 'do you want choose a target to use YaoMing?',
            triggeredBySkills: [this.Name],
        }, fromId);
        if (response.selectedPlayers && response.selectedPlayers.length > 0) {
            event.toIds = response.selectedPlayers;
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const from = room.getPlayerById(fromId);
        const to = room.getPlayerById(toIds[0]);
        const fromHandcards = from.getCardIds(0 /* HandArea */).length;
        const toHandcards = to.getCardIds(0 /* HandArea */).length;
        if (fromHandcards > toHandcards) {
            const used = from.getFlag(this.Name) || [];
            used.push(0 /* Draw */);
            from.setFlag(this.Name, used);
            await room.drawCards(1, toIds[0], 'top', fromId, this.Name);
        }
        else if (fromHandcards < toHandcards) {
            const options = {
                [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
            };
            const chooseCardEvent = {
                fromId,
                toId: toIds[0],
                options,
                triggeredBySkills: [this.Name],
            };
            const resp = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
            if (!resp) {
                return false;
            }
            const used = from.getFlag(this.Name) || [];
            used.push(1 /* Discard */);
            from.setFlag(this.Name, used);
            await room.dropCards(5 /* PassiveDrop */, [resp.selectedCard], toIds[0], fromId, this.Name);
        }
        else {
            const used = from.getFlag(this.Name) || [];
            used.push(2 /* ZhiHeng */);
            from.setFlag(this.Name, used);
            const resp = await room.askForCardDrop(toIds[0], [1, 2], [0 /* HandArea */], false, undefined, this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you can discard at most 2 cards, and then draw the same amount of cards', this.GeneralName).extract());
            if (resp.droppedCards.length > 0) {
                await room.dropCards(4 /* SelfDrop */, resp.droppedCards, toIds[0], toIds[0], this.Name);
                await room.drawCards(resp.droppedCards.length, toIds[0], 'top', toIds[0], this.Name);
            }
        }
        return true;
    }
};
YaoMing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yaoming', description: 'yaoming_description' })
], YaoMing);
exports.YaoMing = YaoMing;
let YaoMingShadow = class YaoMingShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
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
        return event.from === 7 /* PhaseFinish */ && owner.getFlag(this.GeneralName) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
YaoMingShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: YaoMing.Name, description: YaoMing.Description })
], YaoMingShadow);
exports.YaoMingShadow = YaoMingShadow;
