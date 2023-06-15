import { expect } from "chai";
import { NormalizedWiserQuestionAnswer } from "./models";
import { WiserQuestion } from "./wiser-question";

let question: WiserQuestion;

class TestWiserQuestion extends WiserQuestion {
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
  describe("returnWiserQuestionText()", () => {
    it("should return the question text", () => {
      const question_text = "this is test text";
      question = new TestWiserQuestion("");
      question["question_text"] = question_text;
      expect(question.returnWiserQuestionText()).to.equal(question_text);
    });
  });
  describe("setAnswerScore()", () => {
    it("should call registerAnswerScoreWithAnswer", (done) => {
      class StubTestWiserQuestion extends TestWiserQuestion {
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
  describe("toString", () => {
    it("should return question text as string", () => {
      const question_text = "this is test text";
      question = new TestWiserQuestion("");
      question["question_text"] = question_text;
      expect(question.toString()).to.equal(question_text);
    })
  })
});