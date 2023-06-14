import { WiserQuestion } from "./wiser-question";
import { WiserQuestionLoader } from "./wiser-question-loader";

export class WiserQuestionnaire {
  constructor(_question_loader: WiserQuestionLoader) {
  }
  public async init(): Promise<void> {
    throw new Error("Method not implemented");
  }
  public readWiserQuestionAtIndex(_index: number): WiserQuestion | undefined {
    throw new Error("Method not implemented");
  }
  public readCurrentWiserQuestion(): WiserQuestion | undefined {
    throw new Error("Method not implemented");
  }
  public readNextWiserQuestion(): WiserQuestion | undefined {
    throw new Error("Method not implemented");
  }
  public readPrevWiserQuestion(): WiserQuestion | undefined {
    throw new Error("Method not implemented");
  }
  public readSize(): number {
    throw new Error("Method not implemented");
  }
  public readIndex(): number {
    throw new Error("Method not implemented");
  }
  public toString(): string {
    throw new Error("Method not implemented");
  }
}