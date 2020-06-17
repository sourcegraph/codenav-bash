/**
 * DocFetcher captures the functionality required to fetch docs. This allows us to swap out a mock
 * implementation for the "real one" (which fetches from a Git repo, github.com/beyang/docs).
 */
export interface DocFetcher {
    fetchDocs: (commandName: string) => Promise<string | null>;
}

async function fetchDocsFromRemote(
    commandName: string
): Promise<string | null> {
    console.log(
        `fetching man page from https://raw.githubusercontent.com/beyang/docs/master/docdump/all/${commandName}.txt`
    );
    return await fetch(
        `https://raw.githubusercontent.com/beyang/docs/master/docdump/all/${commandName}.txt`
    )
        .then((response) => (response.status === 200 ? response.text() : null))
        .catch(() => null);
}

export const remoteDocFetcher: DocFetcher = {
    fetchDocs: fetchDocsFromRemote,
};

export class MockDocFetcher {
    constructor(public docs: { [commandName: string]: string }) {}
    fetchDocs(commandName: string): Promise<string | null> {
        return Promise.resolve(this.docs[commandName]);
    }
}
