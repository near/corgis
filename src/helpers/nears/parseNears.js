import * as nearAPI from 'near-api-js';

export default function parseNears(amount) {
  return nearAPI.utils.format.parseNearAmount(amount);
}
