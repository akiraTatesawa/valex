export interface ServiceExecute<I, O> {
  execute(serviceRequestData: I): Promise<O>;
}
