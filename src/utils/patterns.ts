export const reResource = /(?<resource>([\w-]+|\*)(\.([\w-]+|\*))*)/;

export const reAction = /(?<action>([\w-]+|\*)(\.([\w-]+))*)/;

export const rePermissionType = /([+-])/;

const ZERO_OR_MORE_SPACES = /\s*/;

const reResourceType = /(?<resourceType>[\w\s.-]+|\*)/;

const COMMA = ",";

const reResources = new RegExp(
  `(?<resources>(${reResource.source})(${ZERO_OR_MORE_SPACES.source}${COMMA}?${ZERO_OR_MORE_SPACES.source}(${reResource.source}))*`
);

const reActions = new RegExp(
  `(?<actions>(${reAction.source})(${ZERO_OR_MORE_SPACES.source}${COMMA}?${ZERO_OR_MORE_SPACES.source}(${reAction.source}))*`
);

const DELIMITER = ":";

export const rePermission = new RegExp(
  `^((?<type>${rePermissionType.source})${ZERO_OR_MORE_SPACES.source})?(${reResources.source})${ZERO_OR_MORE_SPACES.source}(${reResourceType.source})${ZERO_OR_MORE_SPACES.source}${DELIMITER}(${reActions.source})`,
  "gimu"
);
