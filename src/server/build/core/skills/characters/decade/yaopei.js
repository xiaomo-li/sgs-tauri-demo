"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YaoPei = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YaoPei = class YaoPei extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId !== owner.Id &&
            !room.getPlayerById(content.playerId).Dead &&
            content.toStage === 18 /* DropCardStageEnd */ &&
            room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
                event.infos.find(info => info.fromId === content.playerId && info.moveReason === 4 /* SelfDrop */) !==
                    undefined, content.playerId, 'phase').length > 0);
    }
    async beforeUse(room, event) {
        const current = event.triggeredOnEvent.playerId;
        const records = room.Analytics.getRecordEvents(moveCardEvent => event_packer_1.EventPacker.getIdentifier(moveCardEvent) === 128 /* MoveCardEvent */ &&
            moveCardEvent.infos.find(info => info.fromId === current && info.moveReason === 4 /* SelfDrop */) !==
                undefined, current, 'phase');
        const cardSuits = records.reduce((suits, moveCardEvent) => {
            if (suits.length > 3) {
                return suits;
            }
            if (moveCardEvent.infos.length === 1) {
                for (const cardInfo of moveCardEvent.infos[0].movingCards) {
                    const suit = engine_1.Sanguosha.getCardById(cardInfo.card).Suit;
                    suits.includes(suit) || suits.push(suit);
                }
            }
            else {
                for (const info of moveCardEvent.infos) {
                    if (info.fromId !== current || info.moveReason !== 4 /* SelfDrop */) {
                        continue;
                    }
                    for (const cardInfo of info.movingCards) {
                        const suit = engine_1.Sanguosha.getCardById(cardInfo.card).Suit;
                        suits.includes(suit) || suits.push(suit);
                    }
                }
            }
            return suits;
        }, []);
        const response = await room.askForCardDrop(event.fromId, 1, [0 /* HandArea */, 1 /* EquipArea */], false, room
            .getPlayerById(event.fromId)
            .getPlayerCards()
            .filter(id => cardSuits.includes(engine_1.Sanguosha.getCardById(id).Suit)), this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want discard a card?', this.Name).extract());
        if (response.droppedCards.length > 0) {
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: response.droppedCards }, event);
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        await room.dropCards(4 /* SelfDrop */, event_packer_1.EventPacker.getMiddleware(this.Name, event), fromId, fromId, this.Name);
        const current = event.triggeredOnEvent.playerId;
        const options = ['yaopei:you', 'yaopei:opponent'];
        const resp = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose yaopei options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(current))).extract(),
            toId: fromId,
            triggeredBySkills: [this.Name],
        }, fromId, true);
        resp.selectedOption = resp.selectedOption || options[1];
        await room.recover({
            toId: resp.selectedOption === options[0] ? fromId : current,
            recoveredHp: 1,
            recoverBy: fromId,
        });
        await room.drawCards(2, resp.selectedOption === options[0] ? current : fromId, 'top', fromId, this.Name);
        return true;
    }
};
YaoPei = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yaopei', description: 'yaopei_description' })
], YaoPei);
exports.YaoPei = YaoPei;
