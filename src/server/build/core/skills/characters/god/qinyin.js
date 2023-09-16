"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinYin = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let QinYin = class QinYin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        let isUseable = owner.Id === content.playerId && content.toStage === 18 /* DropCardStageEnd */;
        if (isUseable) {
            let droppedCardNum = 0;
            const record = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
                event.infos.find(info => info.fromId === content.playerId && info.moveReason === 4 /* SelfDrop */) !==
                    undefined, content.playerId, 'round', [5 /* DropCardStage */]);
            for (const event of record) {
                if (event.infos.length === 1) {
                    droppedCardNum += event.infos[0].movingCards.filter(card => !engine_1.Sanguosha.isVirtualCardId(card.card)).length;
                }
                else {
                    const infos = event.infos.filter(info => info.fromId === content.playerId && info.moveReason === 4 /* SelfDrop */);
                    for (const info of infos) {
                        droppedCardNum += info.movingCards.filter(card => !engine_1.Sanguosha.isVirtualCardId(card.card)).length;
                    }
                }
            }
            isUseable = droppedCardNum >= 2;
        }
        return isUseable;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const options = ['qinyin: loseHp'];
        room.getAlivePlayersFrom().find(player => player.isInjured()) && options.push('qinyin: recoverHp');
        const askForChoosingOptionsEvent = {
            options,
            toId: skillEffectEvent.fromId,
            conversation: 'qinyin: please choose a choice to make everyone lose hp or recover hp',
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingOptionsEvent), skillEffectEvent.fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, skillEffectEvent.fromId);
        if (selectedOption === 'qinyin: loseHp') {
            for (const player of room.getAlivePlayersFrom()) {
                await room.loseHp(player.Id, 1);
            }
        }
        else if (selectedOption === 'qinyin: recoverHp') {
            for (const player of room.getAlivePlayersFrom()) {
                await room.recover({ recoveredHp: 1, recoverBy: skillEffectEvent.fromId, toId: player.Id });
            }
        }
        else {
            return false;
        }
        return true;
    }
};
QinYin = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'qinyin', description: 'qinyin_description' })
], QinYin);
exports.QinYin = QinYin;
