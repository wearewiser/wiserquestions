import { expect } from "chai";
import { WiserQuestionTypes } from "./wiser-question-types";

describe('WiserQuestionTypes', () => {
  it('should return "Multiple choice" for MULTIPLE_CHOICE', () => {
    expect(WiserQuestionTypes.MULTIPLE_CHOICE).to.equal("Multiple choice");
  });
  it('should return "5-points slider" for FIVE_POINT_SLIDER', () => {
    expect(WiserQuestionTypes.FIVE_POINT_SLIDER).to.equal("5-points slider");
  });
});