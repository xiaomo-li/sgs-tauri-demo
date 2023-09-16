import { GameEventIdentifiers, ServerEventFinder } from "../../../event/event";
import { AllStage, DamageEffectStage } from "../../../game/stage_processor";
import { Player } from "../../../player/player";
import { Room } from "../../../room/room";
import { TriggerSkill } from "../../skill";
import { CompulsorySkill } from "../../skill_wrappers";
import { TiaoXin } from "../mountain/tiaoxin";
import { PaoXiao } from "../standard/paoxiao";
import { ShenSu } from "../wind/shensu";

@CompulsorySkill({ name: "baobian", description: "baobian_description" })
export class BaoBian extends TriggerSkill {
  public get RelatedSkills(): string[] {
    return [TiaoXin.Name, PaoXiao.Name, ShenSu.Name];
  }

  public audioIndex(): number {
    return 0;
  }

  public isTriggerable(
    event: ServerEventFinder<GameEventIdentifiers>,
    stage?: AllStage
  ): boolean {
    return stage === DamageEffectStage.AfterDamagedEffect;
  }

  public canUse(
    room: Room,
    owner: Player,
    content: ServerEventFinder<GameEventIdentifiers.DamageEvent>
  ): boolean {
    return content.toId === owner.Id && owner.hasUsedSkillTimes(this.Name) < 3;
  }

  public async onTrigger(): Promise<boolean> {
    return true;
  }

  public async onEffect(
    room: Room,
    event: ServerEventFinder<GameEventIdentifiers.SkillEffectEvent>
  ): Promise<boolean> {
    await room.obtainSkill(
      event.fromId,
      this.RelatedSkills[
        room.getPlayerById(event.fromId).hasUsedSkillTimes(this.Name) - 1
      ]
    );

    return true;
  }
}
