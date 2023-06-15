import { expect } from "chai";
import { NormalizedWiserQuestionForm } from "./models";
import { WiserQuestionLoader } from "./wiser-question-loader";
import { WiserQuestionTypes } from "./wiser-question-types";
import { WiserQuestionnaire } from "./wiser-questionnaire";
import { WiserQuestionFactory } from "./wiser-question-factory";
import { WiserQuestion } from "./wiser-question";

class TestWiserQuestionLoader extends WiserQuestionLoader {
  private rows: NormalizedWiserQuestionForm[];
  constructor(rows: NormalizedWiserQuestionForm[]) {
    super();
    this.rows = rows;
  }
  public async loadNormalizedWiserQuestionForm(): Promise<NormalizedWiserQuestionForm[]> {
    return this.rows;
  }
}

let questionnaire: WiserQuestionnaire;

describe('WiserQuestionnaire', () => {
  beforeEach(() => {
    questionnaire = new WiserQuestionnaire(new TestWiserQuestionLoader([
      {
        "Question": "Question One",
        "Type": WiserQuestionTypes.MULTIPLE_CHOICE,
        "Answer Labels": "Question One Answer One",
        "Answers": "Answer One",
        "Score One": "100",
        "Score Two": "-100",
      },
      {
        "Question": "Question One",
        "Type": WiserQuestionTypes.MULTIPLE_CHOICE,
        "Answer Labels": "Question One Answer Two",
        "Answers": "Answer Two",
        "Score One": "-50",
        "Score Two": "50",
      },
      {
        "Question": "Question Two",
        "Type": WiserQuestionTypes.FIVE_POINT_SLIDER,
        "Answer Labels": "Question Two Answer One",
        "Answers": "1",
        "Score One": "100",
        "Score Two": "-100",
      },
      {
        "Question": "Question Two",
        "Type": WiserQuestionTypes.FIVE_POINT_SLIDER,
        "Answer Labels": "Question Two Answer Two",
        "Answers": "2",
        "Score One": "-50",
        "Score Two": "50",
      },
    ]));
  });
  describe("init()", () => {
    it("should clear the question set", (done) => {
      questionnaire["question_set"] = { add: (..._args: any[]) => {}, clear: () => done()} as any;
      questionnaire.init();
    });
    it("should call the question factory for the first question", (done) => {
      questionnaire = new WiserQuestionnaire(new TestWiserQuestionLoader([
        {
          "Question": "Question One",
          "Type": WiserQuestionTypes.MULTIPLE_CHOICE,
          "Answer Labels": "Question One Answer One",
          "Answers": "Answer One",
          "Score One": "100",
          "Score Two": "-100",
        },
        {
          "Question": "Question One",
          "Type": WiserQuestionTypes.MULTIPLE_CHOICE,
          "Answer Labels": "Question One Answer Two",
          "Answers": "Answer Two",
          "Score One": "-50",
          "Score Two": "50",
        },
      ]));
      questionnaire["question_factory"] = { getInstance: (..._args: any[]) => done() } as any ;
      questionnaire.init();
    });
    it("should not call the question factory multiple times for same question", async () => {
      questionnaire = new WiserQuestionnaire(new TestWiserQuestionLoader([
        {
          "Question": "Question One",
          "Type": WiserQuestionTypes.MULTIPLE_CHOICE,
          "Answer Labels": "Question One Answer One",
          "Answers": "Answer One",
          "Score One": "100",
          "Score Two": "-100",
        },
        {
          "Question": "Question One",
          "Type": WiserQuestionTypes.MULTIPLE_CHOICE,
          "Answer Labels": "Question One Answer Two",
          "Answers": "Answer Two",
          "Score One": "-50",
          "Score Two": "50",
        },
      ]));
      let count = 0;
      questionnaire["question_factory"] = { getInstance: (args: any) => {
        count++;
        return WiserQuestionFactory.getInstance(args);
      } } as any;
      await questionnaire.init();
      expect(count).to.equal(1);
    });
    it("should call the question factory a second time for a second unique question", async () => {
      questionnaire = new WiserQuestionnaire(new TestWiserQuestionLoader([
        {
          "Question": "Question One",
          "Type": WiserQuestionTypes.MULTIPLE_CHOICE,
          "Answer Labels": "Question One Answer One",
          "Answers": "Answer One",
          "Score One": "100",
          "Score Two": "-100",
        },
        {
          "Question": "Question One",
          "Type": WiserQuestionTypes.MULTIPLE_CHOICE,
          "Answer Labels": "Question One Answer Two",
          "Answers": "Answer Two",
          "Score One": "-50",
          "Score Two": "50",
        },
        {
          "Question": "Question Two",
          "Type": WiserQuestionTypes.FIVE_POINT_SLIDER,
          "Answer Labels": "Question Two Answer One",
          "Answers": "1",
          "Score One": "100",
          "Score Two": "-100",
        },
        {
          "Question": "Question Two",
          "Type": WiserQuestionTypes.FIVE_POINT_SLIDER,
          "Answer Labels": "Question Two Answer Two",
          "Answers": "2",
          "Score One": "-50",
          "Score Two": "50",
        },
      ]));
      let count = 0;
      questionnaire["question_factory"] = { getInstance: (args: any) => {
        count++;
        return WiserQuestionFactory.getInstance(args);
      } } as any;
      await questionnaire.init();
      expect(count).to.equal(2);
    });
    it("should build a question set equal to unique questions", async () => {
      await questionnaire.init();
      expect(questionnaire['question_set'].size).to.equal(2);
    });
  });
  describe("readWiserQuestionAtIndex()", () => {
    it("should return undefined if out of bounds on the low end", async () => {
      await questionnaire.init();
      expect(questionnaire.readWiserQuestionAtIndex(-1)).to.be.undefined;
    });
    it("should return undefined if out of bounds on the high end", async () => {
      await questionnaire.init();
      expect(questionnaire.readWiserQuestionAtIndex(3)).to.be.undefined;      
    });
    it("should first question if passed lowest available index", async () => {
      await questionnaire.init();
      expect((questionnaire.readWiserQuestionAtIndex(0) as any)['answer']).to.equal('Answer Two');
    });
    it("should last question if passed high available index", async () => {
      await questionnaire.init();
      expect((questionnaire.readWiserQuestionAtIndex(1) as any)['answer']).to.equal(-1);      
    });
  });
  describe("readCurrentWiserQuestion()", () => {
    it("should call readWiserQuestionAtIndex with current index", (done) => {
      questionnaire.readWiserQuestionAtIndex = ((index: number) => {
        expect(index).to.equal(questionnaire['question_index']);
        done();
      }) as any;
      (async () => {
        await questionnaire.init();
        questionnaire.readCurrentWiserQuestion();
      })();
    });
  });
  describe("readNextWiserQuestion()", () => {
    it("should call readWiserQuestionAtIndex with next index", (done) => {
      questionnaire.readWiserQuestionAtIndex = ((index: number) => {
        expect(index).to.equal(questionnaire['question_index'] + 1);
        done();
      }) as any;
      (async () => {
        await questionnaire.init();
        questionnaire.readNextWiserQuestion();
      })();
    });
  });
  describe("readPrevWiserQuestion()", () => {
    it("should call readWiserQuestionAtIndex with prev index", (done) => {
      questionnaire.readWiserQuestionAtIndex = ((index: number) => {
        expect(index).to.equal(questionnaire['question_index'] - 1);
        done();
      }) as any;
      (async () => {
        await questionnaire.init();
        questionnaire.readPrevWiserQuestion();
      })();
    });
  });
  describe("readSize()", () => {
    it("should provide the size of the question set", async () => {
      await questionnaire.init();
      expect(questionnaire.readSize()).to.equal(2);
    });
  });
  describe("readIndex()", () => {
    it("should return the current index", async () => {
      await questionnaire.init();
      expect(questionnaire.readIndex()).to.equal(questionnaire['question_index']);
    });
  });
  describe("toString()", () => {
    it("should call toString on all questions", (done) => {
      let count = 0;
      const toString = () => {
        count++;
        if (count === 4) {
          done();
        }
        return "";
      }
      questionnaire['question_set'] = ([
        { toString },
        { toString },
        { toString },
        { toString },
      ]) as any;
      questionnaire.toString();
    });
  });
  describe("calculateScore()", () => {
    it("should calculate the score", async () => {
      let q: WiserQuestion<unknown>;
      await questionnaire.init();
      q = questionnaire.readNextWiserQuestion() as WiserQuestion<unknown>;
      q.selectAnswer(q.readAnswers()[0]);
      q = questionnaire.readNextWiserQuestion() as WiserQuestion<unknown>;
      q.selectAnswer(q.readAnswers()[0]);
      expect(questionnaire.calculateScore()).to.deep.equal([
        {
          label: "Score One",
          value: 200,
        },
        {
          label: "Score Two",
          value: -200,
        },
      ]);
    });
    it("should sort highest to lowest score", async () => {
      let q: WiserQuestion<unknown>;
      await questionnaire.init();
      q = questionnaire.readNextWiserQuestion() as WiserQuestion<unknown>;
      q.selectAnswer(q.readAnswers()[1]);
      q = questionnaire.readNextWiserQuestion() as WiserQuestion<unknown>;
      q.selectAnswer(q.readAnswers()[1]);
      expect(questionnaire.calculateScore()).to.deep.equal([
        {
          label: "Score Two",
          value: 100,
        },
        {
          label: "Score One",
          value: -100,
        },
      ]);
    });
  });
});
