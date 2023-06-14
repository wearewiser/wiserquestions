import { NormalizedWiserQuestionForm } from "./models";
import { WiserQuestion } from "./wiser-question";

export class WiserQuestionFactory {
  public static getInstance(_row: NormalizedWiserQuestionForm): WiserQuestion | never {
    throw new Error("Method not implemented");
  }
}