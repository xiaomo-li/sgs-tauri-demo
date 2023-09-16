"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FengPo = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let FengPo = class FengPo extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.FengPoOptions = ['fengpo:draw', 'fengpo:damage'];
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            room.CurrentPhasePlayer === owner &&
            aim_group_1.AimGroupUtil.getAllTargets(content.allTargets).length === 1 &&
            room.getPlayerById(content.toId).getCardIds(0 /* HandArea */).length > 0 &&
            (engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' ||
                engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'duel') &&
            room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */ &&
                event.fromId === owner.Id &&
                (engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'slash' ||
                    engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'duel'), owner.Id, 'phase', undefined, 2).length === 1);
    }
    async beforeUse(room, event) {
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options: this.FengPoOptions,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose fengpo options: {1} {2}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.triggeredOnEvent.byCardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.triggeredOnEvent.toId))).extract(),
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
        const { fromId } = event;
        const chosen = event_packer_1.EventPacker.getMiddleware(this.Name, event);
        const diamonds = room
            .getPlayerById(event.triggeredOnEvent.toId)
            .getCardIds(0 /* HandArea */)
            .filter(id => engine_1.Sanguosha.getCardById(id).Suit === 4 /* Diamond */).length;
        if (diamonds) {
            if (chosen === this.FengPoOptions[0]) {
                await room.drawCards(diamonds, fromId, 'top', fromId, this.Name);
            }
            else {
                const aimEvent = event.triggeredOnEvent;
                aimEvent.additionalDamage = aimEvent.additionalDamage || 0;
                aimEvent.additionalDamage += diamonds;
            }
        }
        return true;
    }
};
FengPo = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'fengpo', description: 'fengpo_description' })
], FengPo);
exports.FengPo = FengPo;
