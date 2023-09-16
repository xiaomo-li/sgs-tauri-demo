"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAI = void 0;
class PlayerAI {
    onAction(room, e, content) {
        switch (e) {
            case 157 /* AskForPlayCardsOrSkillsEvent */: {
                return this.onAskForPlayCardsOrSkillsEvent(content, room);
            }
            case 171 /* AskForSkillUseEvent */: {
                return this.onAskForSkillUseEvent(content, room);
            }
            case 159 /* AskForCardResponseEvent */: {
                return this.onAskForCardResponseEvent(content, room);
            }
            case 160 /* AskForCardUseEvent */: {
                return this.onAskForCardUseEvent(content, room);
            }
            case 162 /* AskForCardDropEvent */: {
                return this.onAskForCardDropEvent(content, room);
            }
            case 158 /* AskForPeachEvent */: {
                return this.onAskForPeachEvent(content, room);
            }
            case 161 /* AskForCardDisplayEvent */: {
                return this.onAskForCardDisplayEvent(content, room);
            }
            case 163 /* AskForCardEvent */: {
                return this.onAskForCardEvent(content, room);
            }
            case 164 /* AskForPinDianCardEvent */: {
                return this.onAskForPinDianCardEvent(content, room);
            }
            case 165 /* AskForChoosingCardEvent */: {
                return this.onAskForChoosingCardEvent(content, room);
            }
            case 167 /* AskForChoosingPlayerEvent */: {
                return this.onAskForChoosingPlayerEvent(content, room);
            }
            case 168 /* AskForChoosingOptionsEvent */: {
                return this.onAskForChoosingOptionsEvent(content, room);
            }
            case 169 /* AskForChoosingCharacterEvent */: {
                return this.onAskForChoosingCharacterEvent(content, room);
            }
            case 170 /* AskForChoosingCardFromPlayerEvent */: {
                return this.onAskForChoosingCardFromPlayerEvent(content, room);
            }
            case 172 /* AskForPlaceCardsInDileEvent */: {
                return this.onAskForPlaceCardsInDileEvent(content, room);
            }
            case 173 /* AskForContinuouslyChoosingCardEvent */: {
                return this.onAskForContinuouslyChoosingCardEvent(content, room);
            }
            case 166 /* AskForChoosingCardWithConditionsEvent */: {
                return this.onAskForChoosingCardWithConditionsEvent(content, room);
            }
            default:
        }
        return {};
    }
}
exports.PlayerAI = PlayerAI;
