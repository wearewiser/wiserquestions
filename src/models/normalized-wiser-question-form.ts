import { NormalizedWiserQuestionAnswerScore } from "./normalized-wiser-question-answer-score";
import { NormalizedWiserQuestionInformation } from "./normalized-wiser-question-information";

export interface NormalizedWiserQuestionForm extends
  NormalizedWiserQuestionInformation,
  NormalizedWiserQuestionAnswerScore {
}