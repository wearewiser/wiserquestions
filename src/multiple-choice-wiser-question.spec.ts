import { expect } from "chai";
import { MultipleChoiceWiserQuestion } from "./multiple-choice-wiser-question";

let question: MultipleChoiceWiserQuestion;

describe('MultipleChoiceWiserQuestion', () => {
  describe("selectAnswer()", () => {
    it("should call testAnswerOrFail", (done) => {
      class StubFivePointSliderWiserQuestion extends MultipleChoiceWiserQuestion {
        public testAnswerOrFail(_answer: any): void {
          done();
        }
      }
      question = new StubFivePointSliderWiserQuestion("");
      question.selectAnswer("");
    });
    it("should set answer", () => {
      const answer = "my answer";
      question = new MultipleChoiceWiserQuestion("");
      question.selectAnswer(answer);
      expect(question['answer']).to.equal(answer);
    });
  });
  describe("setAnswers()", () => {
    const question_rows = [
      {
        "Answer Labels": "Answer Label 1",
        "Answers": "Answer 1",
      },
      {
        "Answer Labels": "Answer Label 2",
        "Answers": "Answer 2",
      },
      {
        "Answer Labels": "Answer Label 3",
        "Answers": "Answer 3",
      },
      {
        "Answer Labels": "Answer Label 4",
        "Answers": "Answer 4",
      },
      {
        "Answer Labels": "Answer Label 5",
        "Answers": "Answer 5",
      },
    ];
    beforeEach(() => {
      question = new MultipleChoiceWiserQuestion("");
      question_rows.forEach(row => question.setAnswers(row.Answers));
    });
    question_rows.forEach((row, index) => it(`should set answer at index ${index} to value "${row['Answers']}"`, () => {
      expect(question['answers'][index]).to.equal(row['Answers']);
    }));
  });
  describe("setAnswerLabels()", () => {
    const question_rows = [
      {
        "Answer Labels": "Answer Label 1",
        "Answers": "Answer 1",
      },
      {
        "Answer Labels": "Answer Label 2",
        "Answers": "Answer 2",
      },
      {
        "Answer Labels": "Answer Label 3",
        "Answers": "Answer 3",
      },
      {
        "Answer Labels": "Answer Label 4",
        "Answers": "Answer 4",
      },
      {
        "Answer Labels": "Answer Label 5",
        "Answers": "Answer 5",
      },
    ];
    beforeEach(() => {
      question = new MultipleChoiceWiserQuestion("");
      question_rows.forEach(row => question.setAnswerLabels(row));
    });
    question_rows.forEach((row, index) => it(`should set ${row['Answer Labels']} for ${row['Answers']}`, () => {
      expect(question['answer_labels'][index]).to.equal(row['Answer Labels']);
    }));
  });
  describe("toString()", () => {
    it("should include question text", () => {
      const question_text = "question text";
      question = new MultipleChoiceWiserQuestion(question_text);
      expect(question.toString()).to.include(question_text);
    });
    const question_rows = [
      {
        "Answer Labels": "Answer Label 1",
        "Answers": "Answer 1",
      },
      {
        "Answer Labels": "Answer Label 2",
        "Answers": "Answer 2",
      },
      {
        "Answer Labels": "Answer Label 3",
        "Answers": "Answer 3",
      },
      {
        "Answer Labels": "Answer Label 4",
        "Answers": "Answer 4",
      },
      {
        "Answer Labels": "Answer Label 5",
        "Answers": "Answer 5",
      },
    ];
    beforeEach(() => {
      question = new MultipleChoiceWiserQuestion("");
      question_rows.forEach(row => question.setAnswerLabels(row));
    });
    question_rows.forEach((row, index) => {
      it(`should include ${row['Answer Labels']}`, () => {
        expect(question.toString()).to.include(question_rows[index]["Answer Labels"]);
      });
    });
  });
  describe("registerAnswerScoreWithAnswer()", () => {
    it("should call testAnswerOrFail", (done) => {
      class StubFivePointSliderWiserQuestion extends MultipleChoiceWiserQuestion {
        public testAnswerOrFail(_answer: any): void {
          done();
        }
      }
      question = new StubFivePointSliderWiserQuestion("");
      question["registerAnswerScoreWithAnswer"](
        {
          "Answer Labels": "Answer Label",
          "Answers": "Answer",
        },
        new Map(),
      );
    });
    it("should set score map with answer", () => {
      class StubFivePointSliderWiserQuestion extends MultipleChoiceWiserQuestion {
        public testAnswerOrFail(_answer: any): void {}
      }
      question = new StubFivePointSliderWiserQuestion("");
      const map = new Map();
      question["registerAnswerScoreWithAnswer"](
        {
          "Answer Labels": "Answer Label",
          "Answers": "Answer",
        },
        map,
      );
      expect(question["answer_scores"].get("Answer")).to.equal(map);
    });
  });
  describe("testAnswerOrFail()", () => {
    beforeEach(() => {
      question = new MultipleChoiceWiserQuestion("");
    })
    it("should fail if number", () => {
      expect(() => question["testAnswerOrFail"](1 as any)).to.throw();
    });
    ["hello", "world", "1", ""].forEach(
      str => it(`should pass if string "${str}"`, () => {
        expect(() => question["testAnswerOrFail"](str)).to.not.throw();
      }),
    );
  });
});