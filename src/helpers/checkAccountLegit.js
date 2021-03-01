import * as nearAPI from 'near-api-js';

/**
 *
 * @param {string} id Account ID
 * @param {any} connection
 *
 * @returns {Promise<boolean>}
 */
export default async function checkAccountLegit(id, connection) {
  try {
    if (!!(await new nearAPI.Account(connection, id).state())) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }

  return false;
}
