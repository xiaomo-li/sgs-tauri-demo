"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZaiQi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZaiQi = class ZaiQi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        if (owner.getFlag(this.Name) !== undefined) {
            room.removeFlag(owner.Id, this.Name);
        }
        let isUseable = owner.Id === content.playerId && content.toStage === 18 /* DropCardStageEnd */;
        if (isUseable) {
            let droppedCardNum = 0;
            const record = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
                event.infos.find(info => info.toArea === 4 /* DropStack */) !== undefined, content.playerId, 'round');
            for (const event of record) {
                if (event.infos.length === 1) {
                    droppedCardNum += event.infos[0].movingCards.filter(card => !engine_1.Sanguosha.isVirtualCardId(card.card)).length;
                }
                else {
                    const infos = event.infos.filter(info => info.toArea === 4 /* DropStack */);
                    for (const info of infos) {
                        droppedCardNum += info.movingCards.filter(card => !engine_1.Sanguosha.isVirtualCardId(card.card)).length;
                    }
                }
            }
            isUseable = droppedCardNum > 0;
            if (isUseable) {
                room.setFlag(owner.Id, this.Name, droppedCardNum);
            }
        }
        return isUseable;
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= owner.getFlag(this.Name);
    }
    isAvailableTarget(owner, room, target) {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds } = skillUseEvent;
        if (!toIds || toIds.length < 1) {
            return false;
        }
        const from = room.getPlayerById(fromId);
        for (const target of toIds) {
            const options = ['zaiqi:draw'];
            if (from.Hp < from.MaxHp) {
                options.push('zaiqi:recover');
            }
            const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose', this.Name).extract(),
                toId: target,
                triggeredBySkills: [this.Name],
            });
            room.notify(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, target);
            const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, target);
            response.selectedOption = response.selectedOption || 'zaiqi:draw';
            if (response.selectedOption === 'zaiqi:recover') {
                await room.recover({
                    toId: fromId,
                    recoveredHp: 1,
                    recoverBy: target,
                });
            }
            else {
                await room.drawCards(1, target, 'top', fromId, this.Name);
            }
        }
        return true;
    }
};
ZaiQi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zaiqi', description: 'zaiqi_description' })
], ZaiQi);
exports.ZaiQi = ZaiQi;
