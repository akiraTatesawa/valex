import { CustomError } from "../errors";
import { BusinessType } from "../types/business";
import { Entity } from "./Entity";

interface BusinessProps {
  name: string;
  type: BusinessType;
}

export class Business extends Entity<BusinessProps> {
  private constructor(props: BusinessProps) {
    super(props);
  }

  public static create({ name, type }: BusinessProps) {
    if (name.length === 0) {
      throw new CustomError(
        "error_internal_server_error",
        "Business name cannot be empty"
      );
    }

    return new Business({ name, type });
  }
}
