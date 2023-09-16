import { CompulsorySkill, RulesBreakerSkill } from "../../skill";

@CompulsorySkill({
  name: "offense_horse",
  description: "offense_horse_description",
})
export class OffenseHorseSkill extends RulesBreakerSkill {
  public breakOffenseDistance() {
    return 1;
  }
}
