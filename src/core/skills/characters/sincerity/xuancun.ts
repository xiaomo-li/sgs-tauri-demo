import { GameEventIdentifiers, ServerEventFinder } from "../../../event/event";
import {
  AllStage,
  PhaseChangeStage,
  PlayerPhase,
} from "../../../game/stage_processor";
import { Player } from "../../../player/player";
import { PlayerCardsArea } from "../../../player/player_props";
import { Room } from "../../../room/room";
import { TriggerSkill } from "../../skill";
import { CommonSkill } from "../../skill_wrappers";
import {
  PatchedTranslationObject,
  TranslationPack,
} from "../../../translations/translation_json_tool";

@CommonSkill({ name: "xuancun", description: "xuancun_description" })
export class XuanCun extends TriggerSkill {
  public isTriggerable(
    event: ServerEventFinder<GameEventIdentifiers>,
    stage?: AllStage
  ): boolean {
    return stage === PhaseChangeStage.PhaseChanged;
  }

  public canUse(
    room: Room,
    owner: Player,
    event: ServerEventFinder<GameEventIdentifiers.PhaseChangeEvent>
  ): boolean {
    return (
      event.fromPlayer !== undefined &&
      event.fromPlayer !== owner.Id &&
      !room.getPlayerById(event.fromPlayer).Dead &&
      event.from === PlayerPhase.PhaseFinish &&
      owner.Hp > owner.getCardIds(PlayerCardsArea.HandArea).length
    );
  }

  public getSkillLog(
    room: Room,
    owner: Player,
    event: ServerEventFinder<GameEventIdentifiers.PhaseChangeEvent>
  ): PatchedTranslationObject {
    return TranslationPack.translationJsonPatcher(
      "{0}: do you want to let {1} draws {2} card(s)?",
      this.Name,
      TranslationPack.patchPlayerInTranslation(
        room.getPlayerById(event.fromPlayer!)
      ),
      Math.min(owner.Hp - owner.getCardIds(PlayerCardsArea.HandArea).length, 2)
    ).extract();
  }

  public async onTrigger(): Promise<boolean> {
    return true;
  }

  public async onEffect(
    room: Room,
    event: ServerEventFinder<GameEventIdentifiers.SkillEffectEvent>
  ): Promise<boolean> {
    await room.drawCards(
      Math.min(
        room.getPlayerById(event.fromId).Hp -
          room.getPlayerById(event.fromId).getCardIds(PlayerCardsArea.HandArea)
            .length,
        2
      ),
      (
        event.triggeredOnEvent as ServerEventFinder<GameEventIdentifiers.PhaseChangeEvent>
      ).fromPlayer!,
      "top",
      event.fromId,
      this.Name
    );

    return true;
  }
}
