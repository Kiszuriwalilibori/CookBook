import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, useCdn, token } from "../../lib/env";

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn,
});

export default client;

