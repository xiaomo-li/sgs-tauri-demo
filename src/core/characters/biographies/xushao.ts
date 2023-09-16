import { GameCharacterExtensions } from "../../game/game_props";
import { SkillLoader } from "../../game/package_loader/loader.skills";
import { Character, CharacterGender, CharacterNationality } from "../character";

const skillLoaderInstance = SkillLoader.getInstance();

export class XuShao extends Character {
  constructor(id: number) {
    super(
      id,
      "xushao",
      CharacterGender.Male,
      CharacterNationality.Qun,
      4,
      4,
      GameCharacterExtensions.Biographies,
      [...skillLoaderInstance.getSkillsByName("pingjian")]
    );
  }
}
