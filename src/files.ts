import { API } from "./api";
import * as path from "path";
import { SyntaxNode } from "web-tree-sitter";
import { depthFirstSearch } from "./util";

export async function matchFile(
    api: API,
    sourceUri: string,
    candidateFilename: string
): Promise<URL[]> {
    const sourceURL = new URL(sourceUri);
    const { repo, rev, path: sourcePath } = fileURLToRepoRevPath(sourceURL);

    const trySourcePaths = [];
    for (
        let prev = sourcePath, cur = path.dirname(sourcePath);
        prev !== cur;
        prev = cur, cur = path.dirname(cur)
    ) {
        trySourcePaths.push(cur);
    }

    const urls = [];
    for (const trySourcePath of trySourcePaths) {
        const destPath = path.normalize(
            path.join(trySourcePath, candidateFilename)
        );
        try {
            await api.getFileContent(repo, rev, destPath);
        } catch (e) {
            continue;
        }
        urls.push(repoRevPathToFileURL(repo, rev, destPath));
    }
    return urls;
}

export async function getSourcedFileURLs(
    api: API,
    sourceUri: string,
    root: SyntaxNode
): Promise<URL[]> {
    const filenames = await getSourcedFilenames(root);
    return await (
        await Promise.all(
            filenames.map(async (filename) => {
                const x = await matchFile(api, sourceUri, filename);
                return x;
            })
        )
    ).flatMap((n) => n);
}

async function getSourcedFilenames(root: SyntaxNode): Promise<string[]> {
    const found = depthFirstSearch(
        root,
        null,
        (node: SyntaxNode) =>
            node.type === "command" &&
            node.firstChild?.type === "command_name" &&
            (node.firstChild?.text === "source" ||
                node.firstChild?.text === ".")
    );
    return found
        .filter((n) => n.childCount === 2)
        .flatMap((n) => {
            const text = n.child(1)?.text;
            return text ? [text] : [];
        });
}

export function fileURLToRepoRevPath(
    url: URL
): {
    repo: string;
    rev: string;
    path: string;
} {
    const repo = url.host + url.pathname;
    const rev = url.search.substr(1);
    const path = url.hash.substr(1);
    return { repo, rev, path };
}

export function repoRevPathToFileURL(
    repo: string,
    rev: string,
    path: string
): URL {
    return new URL(`git://${repo}?${rev}#${path}`);
}
