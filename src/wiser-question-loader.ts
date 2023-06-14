import { NormalizedWiserQuestionForm } from "./models";

export abstract class WiserQuestionLoader {
  public abstract loadNormalizedWiserQuestionForm(): Promise<NormalizedWiserQuestionForm[]>;
}