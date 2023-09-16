"use strict";
var KuangGu_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KuangGuShadow = exports.KuangGu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let KuangGu = KuangGu_1 = class KuangGu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.fromId && event_packer_1.EventPacker.getMiddleware(KuangGu_1.KuangGuTag, content) === true;
    }
    triggerableTimes(event) {
        return event.damage;
    }
    async onTrigger() {
        return true;
    }
    async doKuanggu(room, weiyanId) {
        const weiyan = room.getPlayerById(weiyanId);
        const options = ['kuanggu:draw'];
        if (weiyan.Hp < weiyan.MaxHp) {
            options.push('kuanggu:recover');
        }
        const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
            options,
            conversation: 'please choose',
            toId: weiyanId,
            triggeredBySkills: [this.Name],
        });
        room.notify(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, weiyanId);
        const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, weiyanId);
        response.selectedOption = response.selectedOption || 'kuanggu:draw';
        if (response.selectedOption === 'kuanggu:draw') {
            await room.drawCards(1, weiyanId, undefined, weiyanId, this.Name);
        }
        else {
            await room.recover({
                recoveredHp: 1,
                recoverBy: weiyanId,
                toId: weiyanId,
            });
        }
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const { fromId } = triggeredOnEvent;
        if (fromId !== undefined) {
            await this.doKuanggu(room, fromId);
        }
        return true;
    }
};
KuangGu.KuangGuTag = 'kuangGuTag';
KuangGu = KuangGu_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'kuanggu', description: 'kuanggu_description' })
], KuangGu);
exports.KuangGu = KuangGu;
let KuangGuShadow = class KuangGuShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return event.byReaon === 'damage' && stage === "BeforeHpChange" /* BeforeHpChange */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.fromId && room.distanceBetween(owner, room.getPlayerById(content.toId)) <= 1;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        triggeredOnEvent &&
            event_packer_1.EventPacker.addMiddleware({
                tag: KuangGu.KuangGuTag,
                data: true,
            }, triggeredOnEvent);
        return true;
    }
};
KuangGuShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: KuangGu.Name, description: KuangGu.Description })
], KuangGuShadow);
exports.KuangGuShadow = KuangGuShadow;
