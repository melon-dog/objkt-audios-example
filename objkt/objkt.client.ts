import RateKeeper from "rate-keeper";
import type { Audio, Audios, Query } from "./objkt.types";
import { lastAudiosQuery } from "./queries/lastAudios";
import { OBJKT_API_ENDPOINT, OBJKT_LIMITS, OBJKT_VERBOSE } from "./objkt.constants";

function logError(...data: any[]): void {
    console.error(...data);
}

function logWarning(...data: any[]): void {
    if (OBJKT_VERBOSE) console.warn(...data);
}

function logInfo(...data: any[]): void {
    if (OBJKT_VERBOSE) console.info(...data);
}

async function objktQuery<T>(query: Query): Promise<{ data: T | null; ok: boolean }> {
    try {
        const res = await fetch(OBJKT_API_ENDPOINT, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept-encoding": "gzip, deflate, br",
            },
            body: JSON.stringify(query),
        });

        if (!res.ok) {
            logError(`OBJKT API error: ${res.status} ${res.statusText}`);
            return { data: null, ok: false };
        }

        const json = await res.json();
        if (!json || typeof json !== "object" || !("data" in json)) {
            logError(`OBJKT API returned invalid JSON structure`);
            return { data: null, ok: false };
        }

        return { data: json.data as T, ok: true };
    } catch (error) {
        logError("OBJKT API fetch failed:", error);
        return { data: null, ok: false };
    }
}

// Rate-limited version of the query function
const safeObjktQuery = RateKeeper(objktQuery, OBJKT_LIMITS.RESPONSE_WAIT, { id: OBJKT_LIMITS.RATE_LIMIT_ID });

async function getLastAudios(offset: number, limit: number): Promise<Audio[]> {
    if (limit > OBJKT_LIMITS.RESPONSE_LIMIT) {
        logWarning(`Requested limit ${limit} exceeds maximum of ${OBJKT_LIMITS.RESPONSE_LIMIT}, capping to maximum.`);
        limit = OBJKT_LIMITS.RESPONSE_LIMIT;
    }

    const { data, ok } = await safeObjktQuery<Audios>(
        lastAudiosQuery(offset, limit)
    ).catch(() => ({ data: null, ok: false }));

    if (!ok) {
        logError("Failed to fetch audios.");
        return [];
    }

    if (data === null) {
        logError("Failed to fetch audios.");
        return [];
    }

    if (!Array.isArray(data.token)) {
        logError("OBJKT API returned invalid structure.");
        return [];
    }

    if (data.token.length === 0) {
        logWarning("No audios found.");
        return [];
    }

    logInfo(`Fetched ${data.token.length} audios.`);
    return data.token;
}

/**
 * Objkt API client
 */
export const ObjktClient = {
    MAX_RESPONSE: OBJKT_LIMITS.RESPONSE_LIMIT,
    getLastAudios: (offset: number, limit: number) =>
        getLastAudios(offset, limit),
};
