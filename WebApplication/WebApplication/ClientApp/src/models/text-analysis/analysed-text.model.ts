import { TermModel } from "../terms/term.model";
import { AnalysedParagraphModel } from "./analysed-paragraph.model";

export class AnalysedTextModel {
  text: string;
  terms: TermModel[];
  paragraphs: AnalysedParagraphModel[];
  semanticSize: number;
}
