import { CardSuit } from "../libs/card_props";
import type { RealCardId } from "../libs/card_props";
import { TrickCard } from "../trick_card";
import { GameCardExtensions } from "../../game/game_props";
import { SkillLoader } from "../../game/package_loader/loader.skills";
import { ShunShouQianYangSkill } from "../../skills";

export class ShunshouQianYang extends TrickCard {
  constructor(id: RealCardId, cardNumber: number, suit: CardSuit) {
    super(
      id,
      cardNumber,
      suit,
      1,
      "shunshouqianyang",
      "shunshouqianyang_description",
      GameCardExtensions.Standard,
      SkillLoader.getInstance().getSkillByName("shunshouqianyang")
    );
  }

  get Skill() {
    return this.skill as ShunShouQianYangSkill;
  }
}
