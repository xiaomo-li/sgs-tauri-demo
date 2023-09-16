import { CardId } from "../../../cards/libs/card_props";
import {
  CardMoveReason,
  GameEventIdentifiers,
  ServerEventFinder,
} from "../../../event/event";
import { Sanguosha } from "../../../game/engine";
import { AllStage, DamageEffectStage } from "../../../game/stage_processor";
import { Player } from "../../../player/player";
import { PlayerCardsArea } from "../../../player/player_props";
import { Room } from "../../../room/room";
import { TriggerSkill } from "../../skill";
import { CommonSkill } from "../../skill_wrappers";
import { TranslationPack } from "../../../translations/translation_json_tool";

@CommonSkill({ name: "yuce", description: "yuce_description" })
export class YuCe extends TriggerSkill {
  public isTriggerable(
    event: ServerEventFinder<GameEventIdentifiers.DamageEvent>,
    stage?: AllStage
  ) {
    return stage === DamageEffectStage.AfterDamagedEffect;
  }

  public canUse(
    room: Room,
    owner: Player,
    content: ServerEventFinder<GameEventIdentifiers.DamageEvent>
  ) {
    return (
      owner.Id === content.toId &&
      owner.getCardIds(PlayerCardsArea.HandArea).length > 0
    );
  }

  public cardFilter(room: Room, owner: Player, cards: CardId[]) {
    return cards.length === 1;
  }

  public isAvailableCard() {
    return true;
  }

  public availableCardAreas() {
    return [PlayerCardsArea.HandArea];
  }

  public async onTrigger() {
    return true;
  }

  public async onEffect(
    room: Room,
    skillUseEvent: ServerEventFinder<GameEventIdentifiers.SkillEffectEvent>
  ) {
    const { fromId, cardIds, triggeredOnEvent } = skillUseEvent;

    const showCardEvent: ServerEventFinder<GameEventIdentifiers.CardDisplayEvent> =
      {
        displayCards: cardIds!,
        fromId,
        translationsMessage: TranslationPack.translationJsonPatcher(
          "{0} display hand card {1}",
          TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)),
          TranslationPack.patchCardInTranslation(...cardIds!)
        ).extract(),
      };

    room.broadcast(GameEventIdentifiers.CardDisplayEvent, showCardEvent);

    const damageEvent =
      triggeredOnEvent as ServerEventFinder<GameEventIdentifiers.DamageEvent>;
    const damageFromId = damageEvent.fromId;

    if (damageFromId !== undefined && !room.getPlayerById(damageFromId).Dead) {
      const handCards = room
        .getPlayerById(damageFromId)
        .getCardIds(PlayerCardsArea.HandArea);
      if (handCards.length <= 0) {
        await room.recover({
          toId: fromId,
          recoveredHp: 1,
        });
      } else {
        const type = Sanguosha.getCardById(cardIds![0]).BaseType;
        const response = await room.askForCardDrop(
          damageFromId,
          1,
          [PlayerCardsArea.HandArea],
          false,
          room
            .getPlayerById(damageFromId)
            .getCardIds(PlayerCardsArea.HandArea)
            .filter((id) => Sanguosha.getCardById(id).BaseType === type),
          this.Name
        );

        if (response.droppedCards.length > 0) {
          await room.dropCards(
            CardMoveReason.SelfDrop,
            response.droppedCards,
            damageFromId,
            damageFromId,
            this.Name
          );
        } else {
          await room.recover({
            toId: fromId,
            recoveredHp: 1,
          });
        }
      }
    }

    return true;
  }
}
