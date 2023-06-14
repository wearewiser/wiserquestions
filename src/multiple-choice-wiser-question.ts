import { NormalizedWiserQuestionAnswer } from "./models";
import { WiserQuestion } from "./wiser-question";

export class MultipleChoiceWiserQuestion extends WiserQuestion {
  public selectAnswer(_answer: number | string): void {
    throw new Error("Method not implemented");
  }
  public setAnswerLabels(_row: NormalizedWiserQuestionAnswer): void {
    throw new Error("Method not implemented");
  }
  public toString(): string {
    throw new Error("Method not implemented");
  }
  protected registerAnswerScoreWithAnswer(_row: NormalizedWiserQuestionAnswer, _score: Map<string, number>): void {
    throw new Error("Method not implemented");
  }
  protected testAnswerOrFail(_answer: string): void | never {
    throw new Error("Method not implemented");
  }
}