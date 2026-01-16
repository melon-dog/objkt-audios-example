import { Query } from "../objkt.types";
import compress from "graphql-query-compress"

const gql = String.raw;
export function lastAudiosQuery(offset: number, limit: number): Query {
    return {
        operationName: "lastAudios",
        query: compress(gql`
            query lastAudios($offset: Int!, $limit: Int!) {
                token(
                    where: {mime: {_iregex: "^audio/"}}
                    offset: $offset
                    limit: $limit
                    order_by: {timestamp: desc}
                ) {
                    fa {
                        name
                        contract
                    }
                    artifact_uri
                    thumbnail_uri
                    timestamp
                    mime
                    creators {
                        holder {
                            address
                            alias
                            tzdomain
                        }
                    }
                }
            }
        `),
        variables: {
            limit,
            offset,
        },
    };
}
