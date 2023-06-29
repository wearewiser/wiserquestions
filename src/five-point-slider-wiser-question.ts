import { EOL } from "os";
import { NormalizedWiserQuestionAnswer } from "./models";
import { WiserQuestion } from "./wiser-question";

export class FivePointSliderWiserQuestion extends WiserQuestion<number> {
  constructor(question_text: string) {
    super(question_text);
    this.answer = -1;
    this.answer_scores = new Map<number, Map<string, number>>();
  }
  public selectAnswer(answer: number | string): void {
    this.testAnswerOrFail(answer as number);
    this.answer = answer as number;
  }
  public setAnswers(answer: string | number): void {
    this.answers.push(Number(answer));
  }
  public setAnswerLabels(row: NormalizedWiserQuestionAnswer): void {
    if (row.Answers === "1") {
      this.answer_labels[0] = row["Answer Labels"];
    }
    if (row.Answers === "5") {
      this.answer_labels[1] = row["Answer Labels"];
    }
  }
  public getMinLabel(): string {
    return this.answer_labels[0];
  }
  public getMaxLabel(): string {
    return this.answer_labels[1];
  }
  public toString(): string {
    let str = super.toString();
    str += EOL;
    str += `   (1) ${this.answer_labels[0]} ... (5) ${this.answer_labels[1]}${EOL}`;
    this.answer_scores.forEach((scores, key) => {
      str += `  [${key.toString().padStart(2, " ")}]:${EOL}`;
      scores.forEach((v, k) => {
        str += `      ${k.slice(0, 36).padEnd(36, "-")}: ${v}${EOL}`
      })
    })
    return str;
  }
  protected registerAnswerScoreWithAnswer(row: NormalizedWiserQuestionAnswer, score: Map<string, number>): void {
    const answer = Number(row.Answers);
    this.testAnswerOrFail(answer);
    this.answer_scores.set(answer, score);
  }
  protected testAnswerOrFail(answer: number): void | never {
    if (typeof answer !== "number" || !Number.isInteger(answer) || answer < 1 || answer > 5) {
      throw new Error(`Answer must be positive integer from 1-5. Question "${this.question_text}" received answer ${answer}`);
    }
  }
}