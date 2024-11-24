export class Wrapper<T> {
  type: string;
  data: T;

  constructor(params: { type: string; data: T }) {
    this.type = params.type;
    this.data = params.data;
  }
}
