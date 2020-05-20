import { context, logging, base64, math } from "near-sdk-as";
import {
  Corgi,
  CorgiList,
  corgis,
  corgisByOwner,
  displayOrders,
} from "./model";

const DNA_DIGITS: u32 = 16;
const ORDER_LIMIT = 8;

// RARITY:
// common: "COMMON", 0.1-1
// uncommon: "UNCOMMON", 0.05-0.1
// rare: "RARE", 0.01-0.05
// veryRare: "VERY RARE", 0-0.01
// ultraRare: "ULTRA RARE" 0

// *********************************************************

// //Methods for owner

export function getCorgisList(owner: string): Corgi[] {
  logging.log("get corgis");
  let corgisDNA = getCorgisByOwner(owner);
  let corgisList = new Array<Corgi>();
  for (let i = 0; i < corgisDNA.length; i++) {
    if (corgis.contains(corgisDNA[i])) {
      let corgi = getCorgi(corgisDNA[i]);
      corgisList.push(corgi);
    }
  }
  return corgisList;
}

function getCorgisByOwner(owner: string): Array<string> {
  let corgiDNA = corgisByOwner.get(owner);
  if (!corgiDNA) {
    return new Array<string>();
  }
  return corgiDNA.dna;
}

function setCorgisByOwner(owner: string, dna: string): void {
  let corgisDNA = getCorgisByOwner(owner);
  corgisDNA.push(dna);
  let newList = new CorgiList(corgisDNA);
  corgisByOwner.set(owner, newList);
}

function deleteCorgiByOwner(owner: string, dna: string): void {
  const corgisDNA = getCorgisByOwner(owner);
  const newCorgiDNA = corgisDNA.filter((s) => s !== dna);
  let newList = new CorgiList(newCorgiDNA);
  corgisByOwner.set(owner, newList);
}

// // Methods for Corgi
export function getCorgi(dna: string): Corgi {
  return corgis.getSome(dna);
}

function setCorgi(dna: string, corgi: Corgi): void {
  corgis.set(dna, corgi);
  displayOrders.push(corgi);
}

export function deleteCorgi(dna: string): void {
  let corgi = getCorgi(dna);
  deleteCorgiByOwner(corgi.owner, dna);
  corgis.delete(dna);
  logging.log("after delete");
}

//Transfer between users
export function transferCorgi(
  receiver: string,
  dna: string,
  message: string
): void {
  let corgi = getCorgi(dna);
  assert(
    corgi.owner !== context.sender,
    "This corgi does not belong to " + context.sender
  );
  corgi.message = message;
  corgi.sender = context.sender;

  deleteCorgiByOwner(corgi.owner, dna);
  setCorgisByOwner(receiver, dna);

  corgi.owner = receiver;
  setCorgi(dna, corgi);
  logging.log("after transfer");
  logging.log("send corgi to");
  logging.log(receiver);
}

// display global corgis
export function displayGolbalCorgis(): Corgi[] {
  const corgiNum = min(ORDER_LIMIT, displayOrders.length);
  const startIndex = displayOrders.length - corgiNum;
  const result = new Array<Corgi>(corgiNum);
  for (let i = 0; i < corgiNum; i++) {
    result[i] = displayOrders[i + startIndex];
  }
  return result;
}

// // Create unique Corgi
export function createCorgi(
  name: string,
  color: string,
  backgroundColor: string,
  quote: string
): void {
  let dna = generateRandomDna();
  let rate = generateRate();
  let sausage = generateSausage(rate);
  return generateCorgi(name, dna, color, rate, sausage, backgroundColor, quote);
}

function generateCorgi(
  name: string,
  dna: string,
  color: string,
  rate: string,
  sausage: string,
  backgroundColor: string,
  quote: string
): void {
  let corgi = new Corgi(name, color, rate, sausage, backgroundColor, quote);

  setCorgi(dna, corgi);
  setCorgisByOwner(context.sender, dna);
  logging.log("create a new corgi");
}

function generateRandomDna(): string {
  let buf = math.randomBuffer(DNA_DIGITS);
  let b64 = base64.encode(buf);
  return b64;
}

function randomNum(): u32 {
  let buf = math.randomBuffer(4);
  return (
    (((0xff & buf[0]) << 24) |
      ((0xff & buf[1]) << 16) |
      ((0xff & buf[2]) << 8) |
      ((0xff & buf[3]) << 0)) %
    100
  );
}

function generateRate(): string {
  let rand = randomNum();
  if (rand > 10) {
    return "COMMON";
  } else if (rand > 5) {
    return "UNCOMMON";
  } else if (rand > 1) {
    return "RARE";
  } else if (rand > 0) {
    return "VERY RARE";
  } else {
    return "ULTRA RARE";
  }
}

function generateSausage(rarity: string): string {
  let l = (randomNum() * 50) / 100;
  let sausage = 0;
  if (rarity == "VERY RARE") {
    sausage = l + 150;
  } else if (rarity == "RARE") {
    sausage = l + 100;
  } else if (rarity == "UNCOMMON") {
    sausage = l + 50;
  } else if (rarity == "COMMON") {
    sausage = l;
  }
  return sausage.toString();
}
