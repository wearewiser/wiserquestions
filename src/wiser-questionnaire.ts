import { EOL } from "os";
import { NormalizedWiserQuestionForm } from "./models";
import { WiserQuestion } from "./wiser-question";
import { WiserQuestionLoader } from "./wiser-question-loader";
import { WiserQuestionFactory } from "./wiser-question-factory";

export class WiserQuestionnaire {
  private question_factory = WiserQuestionFactory;
  private question_index = -1;
  private question_set: Set<WiserQuestion>;
  private question_loader: WiserQuestionLoader;
  constructor(question_loader: WiserQuestionLoader) {
    this.question_loader = question_loader;
    this.question_set = new Set<WiserQuestion>();
  }
  public async init(): Promise<void> {
    this.question_set.clear();
    const form: NormalizedWiserQuestionForm[] = await this.question_loader.loadNormalizedWiserQuestionForm();
    const question_matrix = new Map<string, WiserQuestion>();
    const keys = new Set<string>();
    form.forEach((row) => {
      keys.add(row.Question);
      if (!question_matrix.has(row.Question)) {
        question_matrix.set(row.Question, this.question_factory.getInstance(row));
      }
      (question_matrix.get(row.Question) as WiserQuestion).setAnswerLabels(row);
      (question_matrix.get(row.Question) as WiserQuestion).setAnswerScore(row);
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
  public readWiserQuestionAtIndex(index: number): WiserQuestion | undefined {
    const question = Array.from(this.question_set.values())[index];
    return question;
  }
  public readCurrentWiserQuestion(): WiserQuestion | undefined {
    const question = this.readWiserQuestionAtIndex(this.question_index);
    return question;
  }
  public readNextWiserQuestion(): WiserQuestion | undefined {
    const question = this.readWiserQuestionAtIndex(this.question_index + 1);
    if (question) {
      this.question_index++;
    }
    return question;
  }
  public readPrevWiserQuestion(): WiserQuestion | undefined {
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