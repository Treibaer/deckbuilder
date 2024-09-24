export class Connection {
  id: string;
  hasAuthenticated: boolean = false;
  deckId: string = "";
  playtestId: number = 0;

  constructor(id: string) {
    this.id = id;
  }
}
