export class PostDeckCardsDto {
  scryfallId: string;
  quantity: number;
  zone?: string;
  action: "add" | "modify" | "remove";
}
