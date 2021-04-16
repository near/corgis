import * as nearAPI from 'near-api-js';

export default function formatToNears(amount) {
  return nearAPI.utils.format.formatNearAmount(amount);
}
