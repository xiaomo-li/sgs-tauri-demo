"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuHai = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhuHai = class ZhuHai extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.ZhuHaiSlashTag = 'zhuHaiSlash';
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id !== content.playerId &&
            19 /* FinishStageStart */ === content.toStage &&
            room.Analytics.getDamageRecord(content.playerId, 'round', undefined, 1).filter(event => event.fromId === content.playerId).length > 0);
    }
    async beforeUse(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const changeEvent = triggeredOnEvent;
        const response = await room.askForCardUse({
            toId: fromId,
            cardUserId: fromId,
            scopedTargets: [changeEvent.playerId],
            cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }).toSocketPassenger(),
            extraUse: true,
            commonUse: false,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use a slash to {1}?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(changeEvent.playerId))).extract(),
            triggeredBySkills: [this.Name],
        }, fromId);
        if (response.cardId !== undefined) {
            const cardUseEvent = {
                fromId: response.fromId,
                cardId: response.cardId,
                targetGroup: [response.toIds],
                triggeredBySkills: [this.Name],
            };
            event_packer_1.EventPacker.addMiddleware({
                tag: this.ZhuHaiSlashTag,
                data: cardUseEvent,
            }, event);
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const cardUseEvent = event_packer_1.EventPacker.getMiddleware(this.ZhuHaiSlashTag, skillUseEvent);
        if (cardUseEvent === undefined) {
            return false;
        }
        await room.useCard(cardUseEvent, true);
        return true;
    }
};
ZhuHai = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhuhai', description: 'zhuhai_description' })
], ZhuHai);
exports.ZhuHai = ZhuHai;
