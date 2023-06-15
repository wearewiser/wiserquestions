import { NormalizedWiserQuestionAnswer, NormalizedWiserQuestionAnswerScore, NormalizedWiserQuestionScore, WiserScore } from "./models";

export abstract class WiserQuestion<T> {
  protected answer: T | undefined;
  protected question_text: string;
  protected answers: T[];
  protected answer_labels: [string, string] | string[];
  protected answer_scores!: Map<T, Map<string, number>>;
  constructor(question_text: string) {
    this.question_text = question_text;
    this.answer_labels = [];
    this.answers = [];
  }
  public readQuestionText(): string {
    return this.question_text;
  }
  public readAnswers(): T[] {
    return this.answers;
  }
  public readSelectedAnswer(): T | undefined {
    return this.answer;
  }
  public calculateScore(): WiserScore[] {
    if (!this.answer || !this.answer_scores || this.answer_scores.size < 1) {
      return [];
    }
    const scores = this.answer_scores.get(this.answer);
    if (!scores) {
      return [];
    }
    return Array.from(scores.keys()).map(key => ({
      label: key,
      value: scores.get(key) as number,
    }));
  }
  public readSelectedAnswerLabel(): string | undefined {
    const answer: T | undefined = this.readSelectedAnswer();
    if (!answer) {
      return undefined;
    }
    const index = this.answers.findIndex(x => x === answer);
    return this.answer_labels[index];
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
  public abstract setAnswers(answer: string | T): void;
  public abstract selectAnswer(answer: T): void;
  public abstract setAnswerLabels(row: NormalizedWiserQuestionAnswer): void;
  protected abstract registerAnswerScoreWithAnswer(row: NormalizedWiserQuestionAnswer, scores: Map<string, number>): void;
}