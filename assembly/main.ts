import { context, logging, base64, math } from "near-sdk-as";
import {
  Corgi,
  CorgiList,
  corgis,
  corgisByOwner,
  displayCorgis,
} from "./model";

const DNA_DIGITS: u32 = 16;
const ORDER_LIMIT = 8;

// RARITY:
// common: "COMMON", 0.1-1
// uncommon: "UNCOMMON", 0.05-0.1
// rare: "RARE", 0.01-0.05
// veryRare: "VERY RARE", 0-0.01
// ultraRare: "ULTRA RARE" 0

/**
 * Gets the list of `Corgi`s belonging to `owner`.
 * 
 * @param owner The owner of the `Corgi`s to get.
 */
export function getCorgisList(owner: string): Corgi[] {
  let corgiIdList = getCorgisByOwner(owner);
  let corgisList = new Array<Corgi>();
  for (let i = 0; i < corgiIdList.length; i++) {
    let corgiDNA = base64.decode(corgiIdList[i]);
    if (corgis.contains(corgiDNA)) {
      let corgi = corgis.getSome(corgiDNA);
      corgisList.push(corgi);
    }
  }
  return corgisList;
}

function getCorgisByOwner(owner: string): Array<string> {
  logging.log(`Getting Corgis for owner ` + owner);

  let corgiIdList = corgisByOwner.get(owner);
  if (!corgiIdList) {
    return new Array<string>();
  }
  return corgiIdList.id;
}

function setCorgisByOwner(owner: string, id: string): void {
  let corgiIdList = getCorgisByOwner(owner);
  corgiIdList.push(id);
  let newList = new CorgiList(corgiIdList);
  corgisByOwner.set(owner, newList);
}

function deleteCorgiByOwner(owner: string, id: string): void {
  const corgiIdList = getCorgisByOwner(owner);
  for (let i = 0; i < corgiIdList.length; i++) {
    if (id == corgiIdList[i]) {
      corgiIdList.splice(i, 1);
    }
  }
  let newList = new CorgiList(corgiIdList);
  corgisByOwner.set(owner, newList);
}

/**
 * Gets the `Corgi` with the given `id`.
 * 
 * @param id The id of the `Corgi` to get.
 */
export function getCorgi(id: string): Corgi {
  const dna = base64.decode(id);
  return corgis.getSome(dna);
}

function setCorgi(dna: Uint8Array, corgi: Corgi): void {
  corgis.set(dna, corgi);
  setGlobalCorgis(corgi.id);
}

/**
 * Deletes the `Corgi` with the given `id`.
 * 
 * @param id The id of the `Corgi` to delete.
 */
export function deleteCorgi(id: string): void {
  let corgi = getCorgi(id);
  deleteCorgiByOwner(corgi.owner, id);
  deleteGlobalCorgi(id);
  const dna = base64.decode(id);
  corgis.delete(dna);
  logging.log("after delete");
}

/**
 * Transfers the `Corgi` given by `id` to `receiver`.
 * 
 * @param receiver The receiver account of the transferred corgi.
 * @param id The of the `Corgi` to transfer.
 * @param message The new message belonging to the transferred corgi.
 */
export function transferCorgi(
  receiver: string,
  id: string,
  message: string
): void {
  let corgi = getCorgi(id);
  assert(
    corgi.owner !== context.sender,
    "This corgi does not belong to " + context.sender
  );
  corgi.message = message;
  corgi.sender = context.sender;

  deleteCorgiByOwner(corgi.owner, id);
  setCorgisByOwner(receiver, id);

  corgi.owner = receiver;
  const dna = base64.decode(id);
  setCorgi(dna, corgi);

  logging.log("after transfer");
  logging.log("send corgi to");
  logging.log(receiver);
}

/**
 * Returns the global list of existing `Corgi`s.
 * This list contains all `Corgi`s from all users.
 * 
 * @returns all existing `Corgi`s.
 */
export function displayGlobalCorgis(): Corgi[] {
  logging.log("Displaying global list of Corgis");

  let corgiIdList = getGlobalCorgis();
  const corgiNum = min(ORDER_LIMIT, corgiIdList.length);
  const result = new Array<Corgi>(corgiNum);
  for (let i = corgiIdList.length - 1; i >= corgiIdList.length - corgiNum; i--) {
    result[i - corgiIdList.length + corgiNum] = getCorgi(corgiIdList[i]);
  }

  return result;
}

function getGlobalCorgis(): Array<string> {
  let corgiIdList = displayCorgis.get("global");
  if (!corgiIdList) {
    return new Array<string>();
  }
  return corgiIdList.id;
}

function setGlobalCorgis(id: string): void {
  let corgiIdList = getGlobalCorgis();
  corgiIdList.push(id);
  let newList = new CorgiList(corgiIdList);
  displayCorgis.set("global", newList);
}

function deleteGlobalCorgi(id: string): void {
  const corgiIdList = getGlobalCorgis();
  for (let i = 0; i < corgiIdList.length; i++) {
    if (id == corgiIdList[i]) {
      corgiIdList.splice(i, 1);
    }
  }
  let newList = new CorgiList(corgiIdList);
  displayCorgis.set("global", newList);
}

/**
 * Creates a unique `Corgi`.
 * 
 * @param name The name given to the newly created `Corgi`.
 * @param color The color of the `Corgi`.
 * @param backgroundColor The background color of the `Corgi`.
 * @param quote A memorable quote attached to the `Corgi.
 * @returns The `id` of the created `Corgi`.
 */
export function createCorgi(
  name: string,
  color: string,
  backgroundColor: string,
  quote: string
): string[] {
  let dna = generateRandomDna();
  let id = base64.encode(dna);
  let rate = generateRate();
  let sausage = generateSausage(rate);
  return generateCorgi(
    dna,
    id,
    name,
    quote,
    color,
    backgroundColor,
    rate,
    sausage
  );
}

function generateCorgi(
  dna: Uint8Array,
  id: string,
  name: string,
  quote: string,
  color: string,
  backgroundColor: string,
  rate: string,
  sausage: string
): string[] {
  let corgi = new Corgi(id, name, quote, color, backgroundColor, rate, sausage);
  setCorgi(dna, corgi);
  setCorgisByOwner(context.sender, id);
  logging.log(`Generate a new Corgi in account ` + id);
  // logging.log(id);
  // logging.log(`asd ${id}`)
  return [name, id];
}

function generateRandomDna(): Uint8Array {
  return math.randomBuffer(DNA_DIGITS);
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
