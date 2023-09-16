import { GameCharacterExtensions } from "../../game/game_props";
import { SkillLoader } from "../../game/package_loader/loader.skills";
import { Character, CharacterGender, CharacterNationality } from "../character";

const skillLoaderInstance = SkillLoader.getInstance();

export class BuLianShi extends Character {
  constructor(id: number) {
    super(
      id,
      "bulianshi",
      CharacterGender.Female,
      CharacterNationality.Wu,
      3,
      3,
      GameCharacterExtensions.YiJiang2012,
      [
        skillLoaderInstance.getSkillByName("anxu"),
        skillLoaderInstance.getSkillByName("zhuiyi"),
      ]
    );
  }
}
