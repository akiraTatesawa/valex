import { randUuid } from "@ngneat/falso";
import { Entity } from "./Entity";

interface CompanyProps {
  name: string;
  apikey?: string;
}

export class Company extends Entity<CompanyProps> {
  private constructor(props: CompanyProps) {
    super(props);
  }

  public static create({ name, apikey }: CompanyProps) {
    if (name.length === 0) {
      throw Error("Company name cannot be empty");
    }

    return new Company({
      name,
      apikey: apikey ?? randUuid(),
    });
  }
}
