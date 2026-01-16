export const OBJKT_API_ENDPOINT = Object.freeze("https://data.objkt.com/v3/graphql");
export const OBJKT_VERBOSE = Object.freeze(false);
export const OBJKT_LIMITS = Object.freeze({
    RESPONSE_LIMIT: 500,
    RESPONSE_WAIT: 500,
    RATE_LIMIT_ID: 555,
} as const);