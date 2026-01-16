export interface Query {
    operationName: string;
    query: string;
    variables: {
        limit: number;
        offset: number;
    },
}

export interface FA {
    name: string;
    contract: string;
}

export interface Holder {
    address: string;
    alias: string | null;
    tzdomain: string | null;
}

export interface Creator {
    holder: Holder;
}

export interface Audio {
    fa: FA;
    artifact_uri: string;
    thumbnail_uri: string;
    timestamp: string;
    mime: string;
    creators: Creator[];
}

export interface Audios {
    token: Audio[];
}