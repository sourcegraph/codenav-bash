import * as sourcegraph from "sourcegraph";
import { Hover } from "sourcegraph";
import { SyntaxNode } from "web-tree-sitter";
import { DocFetcher } from "./doc-fetcher";

/**
 * Returns the documentation for the token.
 *
 * We treat the token (e.g., `--stat`) as part of a command invocation. Given the list of tokens (e.g., ['git', 'log', '--stat'])
 * that comprise the command invocation, we consider the possiblity that the token is one of the following:
 * - The primary command (e.g., `git`)
 * - A flag of the primary command (e.g., `--version` in `git --version`)
 * - A subcommand (e.g., `log` in `git log`)
 * - A flag of the subcommand (e.g., `--stat` in `git log --stat`)
 *
 * @param node is the syntax node that represents the token we are looking up documentation for.
 */
export async function matchTokenInCommand(
    node: SyntaxNode,
    docFetcher: DocFetcher
): Promise<Hover | null> {
    const cmdRoot = getCommandRoot(node);
    if (!cmdRoot) {
        return null;
    }
    const tokenNodes = getLeafNodes(cmdRoot);
    const tokenIndex = tokenNodes.findIndex(
        (n) =>
            n.text === node.text &&
            n.type == node.type &&
            n.startIndex == node.startIndex &&
            n.endIndex == node.endIndex
    );
    if (tokenIndex < 0) {
        return null;
    }

    const cmdTokens = tokenNodes.map((node) => node.text);
    if (tokenIndex === 0) {
        // Command
        return await getFormattedManPageHover(cmdTokens[0], docFetcher);
    }
    // Main command flag
    const hover = await getFormattedManPageHover(cmdTokens[0], docFetcher, {
        flagNode: tokenNodes[tokenIndex],
    });
    if (hover) {
        return hover;
    }

    // Subcommand name
    const subCommandName = `${cmdTokens[0]}-${cmdTokens[tokenIndex]}`;
    const subCommandHover = await getFormattedManPageHover(
        subCommandName,
        docFetcher
    );
    if (subCommandHover) {
        return subCommandHover;
    }

    // Subcommand flag
    const nonFlagTokensBeforeThisOne = [];
    for (let i = 0; i < tokenIndex; i++) {
        if (cmdTokens[i].match(/^[A-Za-z]/)) {
            nonFlagTokensBeforeThisOne.push(cmdTokens[i]);
        }
    }
    const subCommandFlagHover = getFormattedManPageHover(
        nonFlagTokensBeforeThisOne.join("-"),
        docFetcher,
        {
            flagNode: tokenNodes[tokenIndex],
        }
    );
    if (subCommandFlagHover) {
        return subCommandFlagHover;
    }

    return null;
}

function getCommandRoot(node: SyntaxNode): SyntaxNode | null {
    for (let n: SyntaxNode | null = node; (n = n.parent); n != null) {
        if (n.type === "command") {
            return n;
        }
    }
    return null;
}

function getLeafNodes(node: SyntaxNode): SyntaxNode[] {
    if (node.childCount === 0) {
        return [node];
    }
    return node.children.map(getLeafNodes).reduce((nodes, moreNodes) => {
        nodes.push(...moreNodes);
        return nodes;
    });
}

export async function matchCommand(
    commandName: string,
    docFetcher: DocFetcher
): Promise<Hover | null> {
    const manpage = await docFetcher.fetchDocs(commandName);
    if (manpage) {
        return {
            contents: {
                value: `\`\`\`${"\n"}${abbreviate(
                    manpage,
                    [0],
                    100
                )}${"\n"}\`\`\``,
                kind: sourcegraph.MarkupKind.Markdown,
            },
        };
    }
    return null;
}

async function getFormattedManPageHover(
    commandName: string,
    docFetcher: DocFetcher,
    op?: { flagNode?: SyntaxNode }
): Promise<Hover | null> {
    const manpage = await docFetcher.fetchDocs(commandName);
    if (!manpage) {
        return null;
    }
    if (!op?.flagNode) {
        return {
            contents: {
                value: `\`\`\`${"\n"}${abbreviate(
                    manpage,
                    [0],
                    100
                )}${"\n"}\`\`\``,
                kind: sourcegraph.MarkupKind.Markdown,
            },
        };
    }
    const flags = [];
    const flagToken = op.flagNode.text;
    if (flagToken.startsWith("--")) {
        flags.push(flagToken);
    } else if (flagToken.startsWith("-") || flagToken.startsWith("+")) {
        const flagLeadChar = flagToken[0];
        flags.push(
            ...flagToken
                .substr(1)
                .split("")
                .map((flagChar) => `${flagLeadChar}${flagChar}`)
        );
    }
    if (flags.length === 0) {
        return null;
    }
    const foundLines = findLines(manpage, flags);
    const flattenedFoundLines = [];
    for (const l of foundLines) {
        flattenedFoundLines.push(...l);
    }
    const snippet = abbreviate(manpage, flattenedFoundLines, 20);
    if (snippet.trim().length === 0) {
        return null;
    }
    return {
        contents: {
            value: `\`\`\`${"\n"}${snippet}${"\n"}\`\`\``,
            kind: sourcegraph.MarkupKind.Markdown,
        },
        range: new sourcegraph.Range(
            op.flagNode.startPosition.row,
            op.flagNode.startPosition.column + 1,
            op.flagNode.endPosition.row,
            op.flagNode.endPosition.column + 1
        ),
    };
}

function findLines(doc: string, keywords: string[]): number[][] {
    const docLines = doc.split("\n");
    const foundLines: number[][] = keywords.map(() => []);
    for (let l = 0; l < docLines.length; l++) {
        const line = docLines[l];
        for (let k = 0; k < keywords.length; k++) {
            const keyword = keywords[k];
            // if (line.indexOf(keyword) !== -1) {
            if (line.trimLeft().startsWith(keyword)) {
                foundLines[k].push(l);
            }
        }
    }
    return foundLines;
}

/**
 * abbreviates a document by showing the specified lines with a number of context lines after. "..."
 * is used to delineate the end of different summary portions.
 */
function abbreviate(
    doc: string,
    lines: number[],
    afterContext: number
): string {
    const docLines = doc.split("\n");
    const chunks = [];
    for (const line of lines) {
        if (line > docLines.length) {
            continue;
        }
        const endLine: number =
            line + afterContext > docLines.length
                ? docLines.length
                : line + afterContext;
        chunks.push(docLines.slice(line, endLine).join("\n"));
    }
    return chunks.join("\n\n...\n\n");
}
