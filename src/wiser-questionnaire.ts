import { EOL } from "os";
import { NormalizedWiserQuestionForm, WiserScore } from "./models";
import { WiserQuestion } from "./wiser-question";
import { WiserQuestionLoader } from "./wiser-question-loader";
import { WiserQuestionFactory } from "./wiser-question-factory";

export class WiserQuestionnaire {
  private question_factory = WiserQuestionFactory;
  private question_index = -1;
  private question_set: Set<WiserQuestion<unknown>>;
  private question_loader: WiserQuestionLoader;
  constructor(question_loader: WiserQuestionLoader) {
    this.question_loader = question_loader;
    this.question_set = new Set<WiserQuestion<unknown>>();
  }
  public async init(): Promise<void> {
    this.question_set.clear();
    const form: NormalizedWiserQuestionForm[] = await this.question_loader.loadNormalizedWiserQuestionForm();
    const question_matrix = new Map<string, WiserQuestion<unknown>>();
    const keys = new Set<string>();
    form.forEach((row) => {
      keys.add(row.Question);
      if (!question_matrix.has(row.Question)) {
        question_matrix.set(row.Question, this.question_factory.getInstance(row));
      }
      (question_matrix.get(row.Question) as WiserQuestion<unknown>).setAnswerLabels(row);
      (question_matrix.get(row.Question) as WiserQuestion<unknown>).setAnswers(row.Answers);
      (question_matrix.get(row.Question) as WiserQuestion<unknown>).setAnswerScore(row);
    });
    Array.from(keys.values()).forEach(
      key => {
        const question = question_matrix.get(key);
        if (question) {
          this.question_set.add(question);
        }
      }
    );
  }
  public calculateScore(): WiserScore[] {
    const score_table = new Map<string, WiserScore>();
    Array.from(this.question_set.values()).forEach(question => {
      const scores = question.calculateScore();
      scores.forEach(
        score => {
          if (!score_table.has(score.label)) {
            score_table.set(score.label, score);
          } else {
            (score_table.get(score.label) as WiserScore).value += score.value;
          }
        }
      );
    });
    return Array.from(score_table.values()).sort((a, b) => b.value - a.value);
  }
  public readWiserQuestionAtIndex(index: number): WiserQuestion<unknown> | undefined {
    const question = Array.from(this.question_set.values())[index];
    return question;
  }
  public readCurrentWiserQuestion(): WiserQuestion<unknown> | undefined {
    const question = this.readWiserQuestionAtIndex(this.question_index);
    return question;
  }
  public readNextWiserQuestion(): WiserQuestion<unknown> | undefined {
    const question = this.readWiserQuestionAtIndex(this.question_index + 1);
    if (question) {
      this.question_index++;
    }
    return question;
  }
  public readPrevWiserQuestion(): WiserQuestion<unknown> | undefined {
    const question = this.readWiserQuestionAtIndex(this.question_index -1);
    if (question) {
      this.question_index--;
    }
    return question;
  }
  public readSize(): number {
    return this.question_set.size;
  }
  public readIndex(): number {
    return this.question_index;
  }
  public toString(): string {
    let str = "";
    this.question_set.forEach(
      question => {
        str += question.toString() + EOL;
      }
    )
    return str;
  }
}