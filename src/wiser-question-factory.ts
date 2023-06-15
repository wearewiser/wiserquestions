import { FivePointSliderWiserQuestion } from "./five-point-slider-wiser-question";
import { NormalizedWiserQuestionForm } from "./models";
import { MultipleChoiceWiserQuestion } from "./multiple-choice-wiser-question";
import { WiserQuestion } from "./wiser-question";
import { WiserQuestionTypes } from "./wiser-question-types";

export class WiserQuestionFactory {
  public static getInstance(row: NormalizedWiserQuestionForm): WiserQuestion<unknown> | never {
    switch (row.Type) {
      case WiserQuestionTypes.MULTIPLE_CHOICE:
        return new MultipleChoiceWiserQuestion(row.WiserQuestion);
      case WiserQuestionTypes.FIVE_POINT_SLIDER:
        return new FivePointSliderWiserQuestion(row.WiserQuestion);
      default:
        throw new Error(`Unknown question type ${row.Type}`);
    }
  }
}