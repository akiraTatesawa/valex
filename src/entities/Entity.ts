export abstract class Entity<T> {
  public props: T;

  constructor(props: T) {
    this.props = props;
  }
}
