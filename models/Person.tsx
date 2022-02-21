export interface Person {
  name: string;
  pronoun1: string;
  pronoun2: string;
}
export const pronounOptions = ["he/him", "she/her", "they/them"] as const;
