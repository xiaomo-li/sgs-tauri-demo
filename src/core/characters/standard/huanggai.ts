import { GameCharacterExtensions } from "../../game/game_props";
import { SkillLoader } from "../../game/package_loader/loader.skills";
import { Character, CharacterGender, CharacterNationality } from "../character";

const skillLoaderInstance = SkillLoader.getInstance();

export class HuangGai extends Character {
  constructor(id: number) {
    super(
      id,
      "huanggai",
      CharacterGender.Male,
      CharacterNationality.Wu,
      4,
      4,
      GameCharacterExtensions.Standard,
      [
        skillLoaderInstance.getSkillByName("kurou"),
        ...skillLoaderInstance.getSkillsByName("zhaxiang"),
      ]
    );
  }
}
