import { GameCharacterExtensions } from "../../game/game_props";
import { SkillLoader } from "../../game/package_loader/loader.skills";
import { Character, CharacterGender, CharacterNationality } from "../character";

const skillLoaderInstance = SkillLoader.getInstance();

export class SiMaZhao extends Character {
  constructor(id: number) {
    super(
      id,
      "simazhao",
      CharacterGender.Male,
      CharacterNationality.Wei,
      3,
      3,
      GameCharacterExtensions.Mobile,
      [
        skillLoaderInstance.getSkillByName("daigong"),
        ...skillLoaderInstance.getSkillsByName("zhaoxin"),
      ]
    );
  }
}
