import { context, PersistentMap } from "near-sdk-as";

@nearBindgen
export class CorgiList {
  constructor(public id: Array<string>) {}
}
@nearBindgen
export class Corgi {
  owner: string;
  constructor(
    public id: string,
    public name: string,
    public quote: string,
    public color: string,
    public backgroundColor: string,
    public rate: string,
    public sausage: string,
    public sender: string = "",
    public message: string = ""
  ) {
    this.owner = context.sender;
  }
}

// Collections where we store data
// store all corgis with unique dna
export const corgis = new PersistentMap<Uint8Array, Corgi>("corgis");
//store all corgis dna of a owner
export const corgisByOwner = new PersistentMap<string, CorgiList>(
  "corigsByOwner"
);

export const displayCorgis = new PersistentMap<string, CorgiList>("show");
