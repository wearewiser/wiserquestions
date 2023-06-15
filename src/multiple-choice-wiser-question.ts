import { EOL } from "os";
import { NormalizedWiserQuestionAnswer } from "./models";
import { WiserQuestion } from "./wiser-question";

export class MultipleChoiceWiserQuestion extends WiserQuestion<string> {
  constructor(question_text: string) {
    super(question_text);
    this.answer = "";
    this.answer_scores = new Map<string, Map<string, number>>();
  }
  public selectAnswer(answer: number | string): void {
    this.testAnswerOrFail(answer as string);
    this.answer = answer as string;
  }
  public setAnswers(answer: string): void {
    this.answers.push(answer);
  }
  public setAnswerLabels(row: NormalizedWiserQuestionAnswer): void {
    this.answer_labels.push(row["Answer Labels"]);
  }
  public toString(): string {
    let str = super.toString();
    str += EOL;
    str += `   ${this.answer_labels.join(', ')}${EOL}`;
    this.answer_scores.forEach((scores, key) => {
      str += `   [${key.toString()}]:${EOL}`;
      scores.forEach((v, k) => {
        str += `      ${k.slice(0, 36).padEnd(36, "-")}: ${v}${EOL}`
      })
    })
    return str;
  }
  protected registerAnswerScoreWithAnswer(row: NormalizedWiserQuestionAnswer, score: Map<string, number>): void {
    const answer: string = row.Answers;
    this.testAnswerOrFail(answer);
    this.answer_scores.set(answer, score);
  }
  protected testAnswerOrFail(answer: string): void | never {
    if (typeof answer !== "string") {
      throw new Error(`Selected answer must be in options. Question "${this.question_text}" received answer ${answer}`);
    }
    this.answer = answer;
  }
}