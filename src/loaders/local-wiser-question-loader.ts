import * as csvtojson from "csvtojson";
import { readFileSync } from "fs";
import { WiserQuestionLoader } from "../wiser-question-loader";
import { NormalizedWiserQuestionForm } from "../models";

export class LocalWiserQuestionLoader extends WiserQuestionLoader {
  private path: string;
  constructor(path: string) {
    super();
    this.path = path;
  }
  public async loadNormalizedWiserQuestionForm(): Promise<NormalizedWiserQuestionForm[]> {
    const csv_file = readFileSync(this.path);
    return await csvtojson().fromString(csv_file.toString()) as NormalizedWiserQuestionForm[];
  }
}