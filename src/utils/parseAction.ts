import { Action, errors } from "../constants";

export const parseAction = (action: Action): string[] => {
  const reAction = /^([\w-]+|\*)(\.([\w-]+))*$/gimu;

  const match = reAction.exec(action);

  if (!match) {
    throw errors.ERR_INVALID_ACTION(action);
  }

  return match;
};
