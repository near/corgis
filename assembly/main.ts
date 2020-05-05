import {
  context,
  storage,
  PersistentMap,
  logging,
  base64,
  math,
} from "near-sdk-as";
import { Corgi, CorgiArray, CorgiMetaData } from "./model";

const DNA_DIGITS: u32 = 16;

// RARITY:
// common: "COMMON", 0.1-1
// uncommon: "UNCOMMON", 0.05-0.1
// rare: "RARE", 0.01-0.05
// veryRare: "VERY RARE", 0-0.01
// ultraRare: "ULTRA RARE" 0

// Collections where we store data
// store all corgis with unique dna
let corgis = new PersistentMap<string, Corgi>("corgis");
//store all corgis dna of a owner
let corgisByOwner = new PersistentMap<string, CorgiMetaData>("corigsByOwner");

// *********************************************************

// //Methods for owner

export function ownerOf(tokenId: string): string {
  let corgi = getCorgi(tokenId);
  let owner = corgi.owner;
  return owner;
}

export function getCorgis(owner: string): CorgiArray {
  logging.log("get corgis");
  let _corgisDNA = getCorgisByOwner(owner);
  let _corgisList = new Array<Corgi>();
  for (let i = 0; i < _corgisDNA.length; i++) {
    if (corgis.contains(_corgisDNA[i])) {
      let _corgi = getCorgi(_corgisDNA[i]);
      _corgisList.push(_corgi);
    }
  }
  let cl = new CorgiArray();
  cl.corgis = _corgisList;
  cl.len = _corgisList.length;
  return cl;
}

export function getCorgisByOwner(owner: string): Array<string> {
  let corgiDNA = corgisByOwner.get(owner);
  if (!corgiDNA) {
    return new Array<string>();
  }
  let dna = corgiDNA.dna;

  return dna;
}

export function setCorgisByOwner(corgi: Corgi): void {
  let _corgisDNA = getCorgisByOwner(corgi.owner);
  if (_corgisDNA == null) {
    _corgisDNA = new Array<string>();
    _corgisDNA.push(corgi.dna);
  } else {
    _corgisDNA.push(corgi.dna);
  }
  let co = new CorgiMetaData();
  co.dna = _corgisDNA;
  corgisByOwner.set(corgi.owner, co);
}

// // Methods for Corgi
export function getCorgi(tokenId: string): Corgi {
  let corgi = corgis.getSome(tokenId);
  return corgi;
}

export function setCorgi(corgi: Corgi): void {
  corgis.set(corgi.dna, corgi);
}

export function getSender(): string {
  return context.sender;
}

function deleteCorgi(tokenId: string): void {
  corgis.delete(tokenId);
}

export function deleteCorgiProfile(tokenId: string): CorgiArray {
  let corgi = getCorgi(tokenId);
  decrementOldOwnerCorgis(corgi.owner, tokenId);
  let leftCorgis = getCorgis(corgi.owner);
  logging.log("after delete");
  return leftCorgis;
}

//Transfer between users
export function transfer(
  to: string,
  tokenId: string,
  message: string,
  sender: string
): CorgiArray {
  let corgi = getCorgi(tokenId);
  corgi.message = message;
  corgi.sender = sender;
  let corgi_temp = corgi;
  setCorgi(corgi);
  assert(
    corgi.owner !== context.sender,
    "corgi does not belong to " + context.sender
  );
  decrementOldOwnerCorgis(corgi.owner, tokenId);
  incrementNewOwnerCorgis(to, corgi_temp);
  let leftCorgis = getCorgis(corgi.sender);
  logging.log("after transfer");
  return leftCorgis;
}

function incrementNewOwnerCorgis(to: string, corgi: Corgi): void {
  corgi.owner = to;
  logging.log("send to another account");
  logging.log(to);
  setCorgisByOwner(corgi);
  setCorgi(corgi);
}

function decrementOldOwnerCorgis(from: string, tokenId: string): void {
  let _corgisDNA = getCorgisByOwner(from);
  for (let i = 0; i < _corgisDNA.length; i++) {
    if (tokenId == _corgisDNA[i]) {
      _corgisDNA.splice(i, 1);
      logging.log("match");
      break;
    }
  }
  let co = new CorgiMetaData();
  co.dna = _corgisDNA;
  corgisByOwner.set(from, co);
  deleteCorgi(tokenId);
}

// // Create unique Corgi
export function createRandomCorgi(
  name: string,
  color: string,
  backgroundColor: string,
  quote: string
): Corgi {
  let randDna = generateRandomDna();
  let rate = generateRandomrate();
  let sausage = generateRandomLength(rate);
  logging.log("get into generating corgi");
  return _createCorgi(
    name,
    randDna,
    color,
    rate,
    sausage,
    backgroundColor,
    quote
  );
}

function _createCorgi(
  name: string,
  dna: string,
  color: string,
  rate: string,
  sausage: string,
  backgroundColor: string,
  quote: string
): Corgi {
  logging.log("start generating corgi");
  let corgi = new Corgi();
  corgi.owner = context.sender;
  corgi.dna = dna;
  corgi.name = name;
  corgi.color = color;
  corgi.sausage = sausage;
  corgi.backgroundColor = backgroundColor;
  corgi.quote = quote;
  corgi.rate = rate;
  setCorgi(corgi);
  setCorgisByOwner(corgi);
  logging.log("create a new corgi");
  return corgi;
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

function generateRandomrate(): string {
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

function generateRandomLength(rarity: string): string {
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

//ERROR handling
function _corgiDNEError(corgi: Corgi): boolean {
  return assert(corgi == null, "This corgi does not exist");
}
