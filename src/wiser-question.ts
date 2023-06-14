import { NormalizedWiserQuestionAnswer, NormalizedWiserQuestionAnswerScore } from "./models";

export abstract class WiserQuestion {
  constructor(_question_text: string) {}
  public returnWiserQuestionText(): string {
    throw new Error("Method not implemented");
  }
  public toString(): string {
    throw new Error("Method not implemented");
  }
  public setAnswerScore(_row: NormalizedWiserQuestionAnswerScore): void {
    throw new Error("Method not implemented");
  }
  public abstract selectAnswer(answer: number): void;
  public abstract selectAnswer(answer: string): void;
  public abstract selectAnswer(answer: string | number): void;
  public abstract setAnswerLabels(row: NormalizedWiserQuestionAnswer): void;
  protected abstract registerAnswerScoreWithAnswer(row: NormalizedWiserQuestionAnswer, scores: Map<string, number>): void;
}