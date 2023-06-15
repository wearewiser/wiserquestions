import { expect } from "chai";
import { NormalizedWiserQuestionAnswer } from "./models";
import { WiserQuestion } from "./wiser-question";

let question: WiserQuestion<unknown>;

class TestWiserQuestion extends WiserQuestion<unknown> {
  public setAnswers(_answer: unknown): void {
    throw new Error("Method not implemented.");
  }
  public selectAnswer(answer: number): void;
  public selectAnswer(answer: string): void;
  public selectAnswer(answer: string | number): void;
  public selectAnswer(_answer: unknown): void {
    throw new Error("Method not implemented.");
  }
  public setAnswerLabels(_row: NormalizedWiserQuestionAnswer): void {
    throw new Error("Method not implemented.");
  }
  protected registerAnswerScoreWithAnswer(_row: NormalizedWiserQuestionAnswer, _scores: Map<string, number>): void {
    throw new Error("Method not implemented.");
  }

}

describe('WiserQuestion', () => {
  describe("readQuestionText()", () => {
    it("should return the question text", () => {
      const question_text = "this is test text";
      question = new TestWiserQuestion("");
      question["question_text"] = question_text;
      expect(question.readQuestionText()).to.equal(question_text);
    });
  });
  describe("readAnswers()", () => {
    it("should return the questions array", () => {
      question = new TestWiserQuestion("");
      expect(question.readAnswers()).to.equal(question['answers']);
    });
  });
  describe("readSelectedAnswer()", () => {
    it("should return undefined if answer not set", () => {
      question = new TestWiserQuestion("");
      expect(question.readSelectedAnswer()).to.be.undefined;
    });
    it("should return the value of answer if set", () => {
      question = new TestWiserQuestion("");
      const answer = "xxx";
      question["answer"] = answer;
      expect(question.readSelectedAnswer()).to.equal(answer);
    });
  });
  describe("readSelectedAnswerLabel()", () => {
    it("should return undefined if answer not set", () => {
      question = new TestWiserQuestion("");
      expect(question.readSelectedAnswerLabel()).to.be.undefined;
    });
    it("should return the label of of the answer if set", () => {
      question = new TestWiserQuestion("");
      question["answer"] = "two";
      question["answers"] = ["one", "two", "three"];
      question["answer_labels"] = ["One", "Two", "Three"];
      expect(question.readSelectedAnswerLabel()).to.equal(question["answer_labels"][1]);
    });
  });
  describe("setAnswerScore()", () => {
    it("should call registerAnswerScoreWithAnswer", (done) => {
      class StubTestWiserQuestion extends TestWiserQuestion {
        public setAnswers(_answer: unknown): void {
          throw new Error("Method not implemented.");
        }
        protected registerAnswerScoreWithAnswer(_row: NormalizedWiserQuestionAnswer, _scores: Map<string, number>): void {
          done();
        }
      }
      question = new StubTestWiserQuestion("");
      question.setAnswerScore({
        "Question": "",
        "Type": "",
        "Answer Labels": "",
        "Answers": "",
      });
    });
    it("should pass map to registerAnswerScoreWithAnswer", (done) => {
      class StubTestWiserQuestion extends TestWiserQuestion {
        public setAnswers(_answer: unknown): void {
          throw new Error("Method not implemented.");
        }
        protected registerAnswerScoreWithAnswer(_row: NormalizedWiserQuestionAnswer, scores: Map<string, number>): void {
          expect(scores).to.be.instanceOf(Map);
          done();
        }
      }
      question = new StubTestWiserQuestion("");
      question.setAnswerScore({
        "Question": "",
        "Type": "",
        "Answer Labels": "",
        "Answers": "",
      });
    });
    [
      "Question",
      "Type",
      "Answer Labels",
      "Answers",
    ].forEach(
      exclude => {
        it(`should not include ${exclude} in map`, (done) => {
          class StubTestWiserQuestion extends TestWiserQuestion {
            public setAnswers(_answer: unknown): void {
              throw new Error("Method not implemented.");
            }
            protected registerAnswerScoreWithAnswer(_row: NormalizedWiserQuestionAnswer, scores: Map<string, number>): void {
              expect(Array.from(scores.keys())).to.not.include(exclude);
              done();
            }
          }
          question = new StubTestWiserQuestion("");
          question.setAnswerScore({
            "Question": "",
            "Type": "",
            "Answer Labels": "",
            "Answers": "",
            "Hello": "",
            "World": "",
          });
        });
      }
    );
    [
      "Hello",
      "World",
    ].forEach(
      included => {
        it(`should include provided score column "${included}" in map`, (done) => {
          class StubTestWiserQuestion extends TestWiserQuestion {
            public setAnswers(_answer: unknown): void {
              throw new Error("Method not implemented.");
            }
            protected registerAnswerScoreWithAnswer(_row: NormalizedWiserQuestionAnswer, scores: Map<string, number>): void {
              expect(Array.from(scores.keys())).to.include(included);
              done();
            }
          }
          question = new StubTestWiserQuestion("");
          question.setAnswerScore({
            "Question": "",
            "Type": "",
            "Answer Labels": "",
            "Answers": "",
            "Hello": "",
            "World": "",
          });
        });
      }
    );
  });
  describe("calculateScore()", () => {
    it('should return empty array when no answer set', () => {
      question = new TestWiserQuestion("");
      question["answer_scores"] = new Map<number, Map<string, number>>();
      question["answer_scores"].set("one", new Map<string, number>());
      (question["answer_scores"].get("one") as Map<string, number>).set("Hello", 10);
      (question["answer_scores"].get("one") as Map<string, number>).set("World", 11);
      question["answer_scores"].set("two", new Map<string, number>());
      (question["answer_scores"].get("two") as Map<string, number>).set("Hello", 20);
      (question["answer_scores"].get("two") as Map<string, number>).set("World", 22);
      question["answer_scores"].set("three", new Map<string, number>());
      (question["answer_scores"].get("three") as Map<string, number>).set("Hello", 30);
      (question["answer_scores"].get("three") as Map<string, number>).set("World", 33);
      expect(question.calculateScore()).to.deep.equal([]);
    });
    it('should return empty array when scores set', () => {
      question = new TestWiserQuestion("");
      question["answer"] = "two";
      expect(question.calculateScore()).to.deep.equal([]);
    });
    it('should return the correct score for the selected answer', () => {
      question = new TestWiserQuestion("");
      question["answer_scores"] = new Map<number, Map<string, number>>();
      question["answer_scores"].set("one", new Map<string, number>());
      (question["answer_scores"].get("one") as Map<string, number>).set("Hello", 10);
      (question["answer_scores"].get("one") as Map<string, number>).set("World", 11);
      question["answer_scores"].set("two", new Map<string, number>());
      (question["answer_scores"].get("two") as Map<string, number>).set("Hello", 20);
      (question["answer_scores"].get("two") as Map<string, number>).set("World", 22);
      question["answer_scores"].set("three", new Map<string, number>());
      (question["answer_scores"].get("three") as Map<string, number>).set("Hello", 30);
      (question["answer_scores"].get("three") as Map<string, number>).set("World", 33);
      question["answer"] = "two";
      expect(question.calculateScore()).to.deep.equal([
        {
          label: "Hello",
          value: 20,
        },
        {
          label: "World",
          value: 22,
        },
      ]);
    });
  });
  describe("toString", () => {
    it("should return question text as string", () => {
      const question_text = "this is test text";
      question = new TestWiserQuestion("");
      question["question_text"] = question_text;
      expect(question.toString()).to.equal(question_text);
    })
  })
});