export abstract class Mapper<DB, DTO> {
  public abstract toDTO(data: DB): DTO;
}
