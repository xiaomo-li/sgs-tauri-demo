"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeiYi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WeiYi = class WeiYi extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.WeiYiOptions = ['weiyi:loseHp', 'weiyi:recover'];
    }
    isAutoTrigger(room, owner, event) {
        return event !== undefined && room.getPlayerById(event.toId).Hp === owner.Hp;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        var _a;
        return !((_a = owner.getFlag(this.Name)) === null || _a === void 0 ? void 0 : _a.includes(content.toId)) && !room.getPlayerById(content.toId).Dead;
    }
    async beforeUse(room, event) {
        const victim = room.getPlayerById(event.triggeredOnEvent.toId);
        if (room.getPlayerById(event.fromId).Hp === victim.Hp) {
            const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options: this.WeiYiOptions,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose weiyi options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(victim)).extract(),
                toId: event.fromId,
                triggeredBySkills: [this.Name],
            }, event.fromId);
            if (selectedOption) {
                event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: selectedOption }, event);
            }
            else {
                return false;
            }
        }
        return true;
    }
    getSkillLog(room, owner, event) {
        const victim = room.getPlayerById(event.toId);
        return victim.Hp > owner.Hp
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} lose 1 hp?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(victim)).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} recover 1 hp?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(victim)).extract();
    }
    async onTrigger(room, event) {
        event.animation = [
            {
                from: event.fromId,
                tos: [event.triggeredOnEvent.toId],
            },
        ];
        return true;
    }
    async onEffect(room, event) {
        const victim = event.triggeredOnEvent.toId;
        const originalPlayers = room.getFlag(event.fromId, this.Name) || [];
        originalPlayers.includes(victim) || originalPlayers.push(victim);
        room.getPlayerById(event.fromId).setFlag(this.Name, originalPlayers);
        const chosen = event_packer_1.EventPacker.getMiddleware(this.Name, event);
        if (chosen) {
            if (chosen === this.WeiYiOptions[0]) {
                await room.loseHp(victim, 1);
            }
            else {
                await room.recover({ toId: victim, recoveredHp: 1, recoverBy: event.fromId });
            }
        }
        else if (room.getPlayerById(event.fromId).Hp < room.getPlayerById(victim).Hp) {
            await room.loseHp(victim, 1);
        }
        else {
            await room.recover({ toId: victim, recoveredHp: 1, recoverBy: event.fromId });
        }
        return true;
    }
};
WeiYi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'weiyi', description: 'weiyi_description' })
], WeiYi);
exports.WeiYi = WeiYi;
