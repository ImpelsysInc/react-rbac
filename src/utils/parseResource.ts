import { errors } from "../constants";

export const parseResource = (resource: string): string[] => {
  const reResource = /^([\w-]+|\*)(\.([\w-]+|\*))*$/gimu;

  const match = reResource.exec(resource);

  if (!match) {
    throw errors.ERR_INVALID_RESOURCE(resource);
  }

  return match;
};
