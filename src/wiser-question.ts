import { NormalizedWiserQuestionAnswer, NormalizedWiserQuestionAnswerScore, NormalizedWiserQuestionScore } from "./models";

export abstract class WiserQuestion {
  protected question_text: string;
  protected answer_labels: [string, string] | string[];
  constructor(question_text: string) {
    this.question_text = question_text;
    this.answer_labels = [];
  }
  public returnWiserQuestionText(): string {
    return this.question_text;
  }
  public toString(): string {
    let str = "";
    str += this.question_text;
    return str;
  }
  public setAnswerScore(row: NormalizedWiserQuestionAnswerScore): void {
    const score_labels: NormalizedWiserQuestionScore = Object.assign({}, row);
    [
      'Question',
      'Type',
      'Answer Labels',
      'Answers',
    ].forEach(x => delete score_labels[x]);
    const scores = new Map<string, number>();
    Object.keys(score_labels).forEach(label => scores.set(label, Number(row[label])));
    this.registerAnswerScoreWithAnswer(row, scores);
  }
  public abstract selectAnswer(answer: number): void;
  public abstract selectAnswer(answer: string): void;
  public abstract selectAnswer(answer: string | number): void;
  public abstract setAnswerLabels(row: NormalizedWiserQuestionAnswer): void;
  protected abstract registerAnswerScoreWithAnswer(row: NormalizedWiserQuestionAnswer, scores: Map<string, number>): void;
}