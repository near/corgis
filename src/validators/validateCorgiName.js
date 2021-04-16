import { CORGI_VALIDATION_MESSAGES, NAME_LIMIT } from '~constants/validation/corgi';

import { checkProfanity } from '~validators/';

export default function validateCorgiName(name) {
  if (name.length > NAME_LIMIT) {
    return CORGI_VALIDATION_MESSAGES.LIMIT;
  }

  if (checkProfanity(name)) {
    return CORGI_VALIDATION_MESSAGES.PROFANE;
  }

  return CORGI_VALIDATION_MESSAGES.SUCCESS;
}
