import { expect } from "chai";
import { FivePointSliderWiserQuestion } from "./five-point-slider-wiser-question";
import { NormalizedWiserQuestionAnswer } from "./models";

let question: FivePointSliderWiserQuestion;

describe('FivePointSliderWiserQuestion', () => {
  describe("selectAnswer()", () => {
    it("should call testAnswerOrFail", (done) => {
      class StubFivePointSliderWiserQuestion extends FivePointSliderWiserQuestion {
        public testAnswerOrFail(_answer: any): void {
          done();
        }
      }
      question = new StubFivePointSliderWiserQuestion("");
      question.selectAnswer("");
    });
    it("should set answer", () => {
      const answer = 1;
      question = new FivePointSliderWiserQuestion("");
      question.selectAnswer(answer);
      expect(question['answer']).to.equal(answer);
    });
  });
  describe("setAnswers()", () => {
    const question_rows = [
      {
        "Answer Labels": "Answer Label 1",
        "Answers": "1",
      },
      {
        "Answer Labels": "",
        "Answers": "2",
      },
      {
        "Answer Labels": "",
        "Answers": "3",
      },
      {
        "Answer Labels": "4",
        "Answers": "4",
      },
      {
        "Answer Labels": "Answer Label 5",
        "Answers": "5",
      },
    ];
    beforeEach(() => {
      question = new FivePointSliderWiserQuestion("");
      question_rows.forEach(row => question.setAnswers(row.Answers));
    });
    question_rows.forEach((row, index) => it(`should set answer at index ${index} to value ${row['Answers']}`, () => {
      expect(question['answers'][index]).to.equal(Number(row['Answers']));
    }));
  });
  describe("setAnswerLabels()", () => {
    it("should set first tuple entry if Answer is 1", () => {
      const row: NormalizedWiserQuestionAnswer = {
        "Answer Labels": "Hello",
        "Answers": "1",
      };
      question = new FivePointSliderWiserQuestion("");
      question.setAnswerLabels(row);
      expect(question['answer_labels'][0]).to.equal(row["Answer Labels"]);
      expect(question['answer_labels'][1]).to.be.undefined;
    });
    it("should set no tuple entry if Answer is 2", () => {
      const row: NormalizedWiserQuestionAnswer = {
        "Answer Labels": "Hello",
        "Answers": "2",
      };
      question = new FivePointSliderWiserQuestion("");
      question.setAnswerLabels(row);
      expect(question['answer_labels'][0]).to.be.undefined;
      expect(question['answer_labels'][1]).to.be.undefined;
    });
    it("should set no tuple entry if Answer is 3", () => {
      const row: NormalizedWiserQuestionAnswer = {
        "Answer Labels": "Hello",
        "Answers": "3",
      };
      question = new FivePointSliderWiserQuestion("");
      question.setAnswerLabels(row);
      expect(question['answer_labels'][0]).to.be.undefined;
      expect(question['answer_labels'][1]).to.be.undefined;
    });
    it("should set no tuple entry if Answer is 4", () => {
      const row: NormalizedWiserQuestionAnswer = {
        "Answer Labels": "Hello",
        "Answers": "4",
      };
      question = new FivePointSliderWiserQuestion("");
      question.setAnswerLabels(row);
      expect(question['answer_labels'][0]).to.be.undefined;
      expect(question['answer_labels'][1]).to.be.undefined;
    });
    it("should set second tuple entry if Answer is 5", () => {
      const row: NormalizedWiserQuestionAnswer = {
        "Answer Labels": "Hello",
        "Answers": "5",
      };
      question = new FivePointSliderWiserQuestion("");
      question.setAnswerLabels(row);
      expect(question['answer_labels'][0]).to.be.undefined;
      expect(question['answer_labels'][1]).to.equal(row["Answer Labels"]);
    });
  });
  describe("toString()", () => {
    it("should include question text", () => {
      const question_text = "question text";
      question = new FivePointSliderWiserQuestion(question_text);
      expect(question.toString()).to.include(question_text);
    });
    const question_rows = [
      {
        "Answer Labels": "Hello",
        "Answers": "1",
      },
      {
        "Answer Labels": "",
        "Answers": "2",
      },
      {
        "Answer Labels": "",
        "Answers": "3",
      },
      {
        "Answer Labels": "",
        "Answers": "4",
      },
      {
        "Answer Labels": "World",
        "Answers": "5",
      },
    ];
    beforeEach(() => {
      const question_text = "question text";
      question = new FivePointSliderWiserQuestion(question_text);
      question_rows.forEach(row => question.setAnswerLabels(row));
    });
    it("should include first answer label", () => {
      expect(question.toString()).to.include(question_rows[0]["Answer Labels"]);
    });
    it("should include last answer label", () => {
      expect(question.toString()).to.include(question_rows[4]["Answer Labels"]);
    });
  });
  describe("registerAnswerScoreWithAnswer()", () => {
    it("should call testAnswerOrFail", (done) => {
      class StubFivePointSliderWiserQuestion extends FivePointSliderWiserQuestion {
        public testAnswerOrFail(_answer: any): void {
          done();
        }
      }
      question = new StubFivePointSliderWiserQuestion("");
      question["registerAnswerScoreWithAnswer"](
        {
          "Answer Labels": "Hello",
          "Answers": "1",
        },
        new Map(),
      );
    });
    it("should set score map with answer", () => {
      class StubFivePointSliderWiserQuestion extends FivePointSliderWiserQuestion {
        public testAnswerOrFail(_answer: any): void {}
      }
      question = new StubFivePointSliderWiserQuestion("");
      const map = new Map();
      question["registerAnswerScoreWithAnswer"](
        {
          "Answer Labels": "Hello",
          "Answers": "1",
        },
        map,
      );
      expect(question["answer_scores"].get(1)).to.equal(map);
    });
  });
  describe("testAnswerOrFail()", () => {
    beforeEach(() => {
      question = new FivePointSliderWiserQuestion("");
    })
    it("should fail if string", () => {
      expect(() => question["testAnswerOrFail"]("2" as any)).to.throw();
    });
    it("should fail if not integer", () => {
      expect(() => question["testAnswerOrFail"](2.5)).to.throw();
    });
    it("should fail if zero", () => {
      expect(() => question["testAnswerOrFail"](0)).to.throw();
    });
    it("should fail if negative", () => {
      expect(() => question["testAnswerOrFail"](-1)).to.throw();
    });
    it("should fail if more than five", () => {
      expect(() => question["testAnswerOrFail"](6)).to.throw();
    });
    [1, 2, 3, 4, 5].forEach(
      num => it(`should pass if ${num}`, () => {
        expect(() => question["testAnswerOrFail"](num)).to.not.throw();
      }),
    );
  });
});
