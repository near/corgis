import { context, PersistentMap, PersistentVector } from "near-sdk-as";

@nearBindgen
export class CorgiList {
  constructor(public dna: Array<string>) {}
}
@nearBindgen
export class Corgi {
  owner: string;
  constructor(
    public name: string,
    public quote: string,
    public color: string,
    public backgroundColor: string,
    public rate: string,
    public sausage: string,
    public sender?: string,
    public message?: string
  ) {
    this.owner = context.sender;
  }
}

// Collections where we store data
// store all corgis with unique dna
export const corgis = new PersistentMap<string, Corgi>("corgis");
//store all corgis dna of a owner
export const corgisByOwner = new PersistentMap<string, CorgiList>(
  "corigsByOwner"
);

export const displayOrders = new PersistentVector<Corgi>("display");
