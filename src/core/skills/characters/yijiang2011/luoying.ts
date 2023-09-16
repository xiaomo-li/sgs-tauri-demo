import { CardId, CardSuit } from "../../../cards/libs/card_props";
import {
  CardMoveArea,
  CardMovedBySpecifiedReason,
  CardMoveReason,
  GameEventIdentifiers,
  ServerEventFinder,
} from "../../../event/event";
import { EventPacker } from "../../../event/event_packer";
import { Sanguosha } from "../../../game/engine";
import { AllStage, CardMoveStage } from "../../../game/stage_processor";
import { Player } from "../../../player/player";
import { PlayerCardsArea } from "../../../player/player_props";
import { Room } from "../../../room/room";
import { TriggerSkill } from "../../skill";
import { CommonSkill } from "../../skill_wrappers";

@CommonSkill({ name: "luoying", description: "luoying_description" })
export class LuoYing extends TriggerSkill {
  public isTriggerable(
    event: ServerEventFinder<GameEventIdentifiers>,
    stage?: AllStage
  ): boolean {
    return stage === CardMoveStage.AfterCardMoved;
  }

  public canUse(
    room: Room,
    owner: Player,
    event: ServerEventFinder<GameEventIdentifiers.MoveCardEvent>
  ): boolean {
    return !!event.infos.find(
      (info) =>
        !!info.movingCards.find(
          (node) => Sanguosha.getCardById(node.card).Suit === CardSuit.Club
        ) &&
        ((info.fromId &&
          info.fromId !== owner.Id &&
          (info.moveReason === CardMoveReason.PassiveDrop ||
            info.moveReason === CardMoveReason.SelfDrop)) ||
          (info.proposer &&
            info.proposer !== owner.Id &&
            info.movedByReason === CardMovedBySpecifiedReason.JudgeProcess))
    );
  }

  public async onTrigger(): Promise<boolean> {
    return true;
  }

  public async onEffect(
    room: Room,
    skillEffectEvent: ServerEventFinder<GameEventIdentifiers.SkillEffectEvent>
  ): Promise<boolean> {
    const moveCardEvent =
      skillEffectEvent.triggeredOnEvent as ServerEventFinder<GameEventIdentifiers.MoveCardEvent>;
    const luoyingCard: CardId[] = [];
    if (moveCardEvent.infos.length === 1) {
      luoyingCard.push(
        ...moveCardEvent.infos[0].movingCards
          .filter(
            (node) => Sanguosha.getCardById(node.card).Suit === CardSuit.Club
          )
          .map((node) => node.card)
      );
    } else {
      const infos = moveCardEvent.infos.filter(
        (info) =>
          (info.fromId &&
            info.fromId !== skillEffectEvent.fromId &&
            (info.moveReason === CardMoveReason.PassiveDrop ||
              info.moveReason === CardMoveReason.SelfDrop)) ||
          (info.proposer &&
            info.proposer !== skillEffectEvent.fromId &&
            info.movedByReason === CardMovedBySpecifiedReason.JudgeProcess)
      );

      luoyingCard.push(
        ...infos.reduce<CardId[]>(
          (cardIds, info) =>
            cardIds.concat(
              info.movingCards
                .filter(
                  (node) =>
                    Sanguosha.getCardById(node.card).Suit === CardSuit.Club
                )
                .map((node) => node.card)
            ),
          []
        )
      );
    }

    const askForChoosingLuoYingCard: ServerEventFinder<GameEventIdentifiers.AskForChoosingCardWithConditionsEvent> =
      {
        amount: [1, luoyingCard.length],
        cardIds: luoyingCard,
        toId: skillEffectEvent.fromId,
        customTitle: this.GeneralName,
        triggeredBySkills: [this.Name],
      };

    room.notify(
      GameEventIdentifiers.AskForChoosingCardWithConditionsEvent,
      EventPacker.createUncancellableEvent<GameEventIdentifiers.AskForChoosingCardWithConditionsEvent>(
        askForChoosingLuoYingCard
      ),
      skillEffectEvent.fromId
    );
    const { selectedCards } = await room.onReceivingAsyncResponseFrom(
      GameEventIdentifiers.AskForChoosingCardWithConditionsEvent,
      skillEffectEvent.fromId
    );

    await room.moveCards({
      movingCards: (selectedCards?.length ? selectedCards : luoyingCard).map(
        (cardId) => ({
          card: cardId,
          fromArea: CardMoveArea.DropStack,
        })
      ),
      moveReason: CardMoveReason.ActivePrey,
      toId: skillEffectEvent.fromId,
      toArea: PlayerCardsArea.HandArea,
      proposer: skillEffectEvent.fromId,
      movedByReason: this.Name,
    });

    return true;
  }
}
