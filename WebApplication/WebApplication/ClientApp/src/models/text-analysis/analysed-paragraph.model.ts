import { AnalysedSentenceModel } from "./analysed-senetence.model";

export class AnalysedParagraphModel {
  text: string;
  semanticSize: number;
  sentences: AnalysedSentenceModel[];
}
