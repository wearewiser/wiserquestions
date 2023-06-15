import { expect } from "chai";
import { WiserQuestionFactory } from "./wiser-question-factory";
import { WiserQuestionTypes } from "./wiser-question-types";
import { MultipleChoiceWiserQuestion } from "./multiple-choice-wiser-question";
import { FivePointSliderWiserQuestion } from "./five-point-slider-wiser-question";

describe('WiserQuestionFactory', () => {
  describe("getInstance()", () => {
    it('should return instanceof MultipleChoiceWiserQuestion when row type matches WiserQuestionTypes.MULTIPLE_CHOICE', () => {
      expect(WiserQuestionFactory.getInstance({ Type: WiserQuestionTypes.MULTIPLE_CHOICE } as any)).to.be.instanceOf(MultipleChoiceWiserQuestion);
    });
    it('should return instanceof FivePointSliderWiserQuestion when row type matches WiserQuestionTypes.MULTIPLE_CHOICE', () => {
      expect(WiserQuestionFactory.getInstance({ Type: WiserQuestionTypes.FIVE_POINT_SLIDER } as any)).to.be.instanceOf(FivePointSliderWiserQuestion);
    });
  });
});