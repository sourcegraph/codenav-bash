import * as sourcegraph from "sourcegraph";
import Parser, { SyntaxNode } from "web-tree-sitter";
import { API } from "./api";
import { matchCommand, matchTokenInCommand } from "./commands";
import { fileURLToRepoRevPath, getSourcedFileURLs, matchFile } from "./files";
import { backtrackDepthFirstSearch, depthFirstSearch } from "./util";
import { DocFetcher } from "./doc-fetcher";

function isDefinition(defName: string) {
    return (candidate: SyntaxNode) =>
        candidate.type === "variable_name" &&
        defName === candidate.text &&
        candidate.parent?.type === "variable_assignment" &&
        candidate.parent?.firstChild?.equals(candidate) === true;
}

function nodeLocation(fileURI: string, node: SyntaxNode): sourcegraph.Location {
    return new sourcegraph.Location(
        new URL(fileURI),
        new sourcegraph.Position(
            node.startPosition.row,
            node.startPosition.column
        )
    );
}

export class Analyzer {
    private api: API;
    private reservedVariables: Promise<{ [key: string]: string }>;
    constructor(private parser: Parser, private docFetcher: DocFetcher) {
        this.api = new API();
        this.reservedVariables = fetch(
            "https://raw.githubusercontent.com/beyang/docs/master/generate_special_vars/generated/vars.json"
        ).then(async (response) => {
            if (response.status !== 200) {
                throw new Error(
                    `Error fetching special vars docs (status: ${
                        response.status
                    } ${response.statusText}: ${await response.text()}`
                );
            }
            const responseText = await response.text();
            if (responseText.length === 0) {
                throw new Error(
                    "Error fetching special vars docs: response text was empty"
                );
            }
            return JSON.parse(responseText);
        });
    }

    public async provideHover(
        document: { text: string | undefined },
        position: sourcegraph.Position
    ): Promise<sourcegraph.Hover | null> {
        const docContents = document.text || "";
        const tree = this.parser.parse(docContents);
        const node = tree.rootNode.descendantForPosition({
            row: position.line,
            column: position.character,
        });

        switch (node.type) {
            case "export":
                return await matchCommand("export", this.docFetcher);
            case "[":
                // TODO: need to handle flags here properly
                return await matchCommand("test", this.docFetcher);
            case "word":
                return await matchTokenInCommand(node, this.docFetcher);
            case "variable_name":
                const specialVars = await this.reservedVariables;
                const specialVarDoc = specialVars[node.text];
                if (specialVars) {
                    return {
                        contents: {
                            value: specialVarDoc,
                            kind: sourcegraph.MarkupKind.Markdown,
                        },
                        range: new sourcegraph.Range(
                            new sourcegraph.Position(
                                node.startPosition.row,
                                node.startPosition.column
                            ),
                            new sourcegraph.Position(
                                node.startPosition.row,
                                node.startPosition.column
                            )
                        ),
                    };
                }
            default:
            // As-yet unhandled cases:
            // - Bash syntax such as:
            //    - case statements
            //    - array ()
            //    - ${VAR} constructs (prefix, suffix, etc)
            //    - [[ ]]
            //    - $() ``
            //    - bash pipes <()
            //    - > &> 1>&2 2>&1 <
            //
            // Other resources that can serve as inspiration for what additional to cover
            // - https://devhints.io/bash
            // - https://tldp.org/LDP/Bash-Beginners-Guide/html/index.html
            // - http://www.tldp.org/LDP/abs/html/
            // - https://www.gnu.org/software/bash/manual/html_node/index.html
        }

        return { contents: { value: "" } };
    }

    public async provideDefinition(
        document: sourcegraph.TextDocument,
        position: sourcegraph.Position
    ): Promise<sourcegraph.Definition> {
        const docContents = document.text || "";
        const tree = this.parser.parse(docContents);
        const node = tree.rootNode.descendantForPosition({
            row: position.line,
            column: position.character,
        });

        switch (node.type) {
            case "variable_name":
                const localDefs = await backtrackDepthFirstSearch(
                    node,
                    isDefinition(node.text)
                ).map((defNode) => nodeLocation(document.uri, defNode));
                if (localDefs.length > 0) {
                    return localDefs;
                }
                const sourcedFileURLs = await getSourcedFileURLs(
                    this.api,
                    document.uri,
                    tree.rootNode
                );
                const sourcedFileDefLocations = await Promise.all(
                    sourcedFileURLs.map(async (sourcedFileURL) => {
                        const { repo, rev, path } = fileURLToRepoRevPath(
                            sourcedFileURL
                        );
                        const fileContents = await this.api.getFileContent(
                            repo,
                            rev,
                            path
                        );
                        if (!fileContents) {
                            return null;
                        }
                        const fileTree = this.parser.parse(fileContents);
                        const fileDefs = depthFirstSearch(
                            fileTree.rootNode,
                            null,
                            isDefinition(node.text)
                        );
                        return fileDefs.map((defNode) =>
                            nodeLocation(sourcedFileURL.toString(), defNode)
                        );
                    })
                );
                return sourcedFileDefLocations.flatMap((n) => n || []);
            case "word":
                return (await matchFile(this.api, document.uri, node.text)).map(
                    (url) =>
                        new sourcegraph.Location(
                            url,
                            new sourcegraph.Position(0, 0)
                        )
                );
        }
        return null;
    }

    public provideReferences(
        document: sourcegraph.TextDocument,
        position: sourcegraph.Position
    ): sourcegraph.ProviderResult<sourcegraph.Badged<sourcegraph.Location>[]> {
        const docContents = document.text || "";
        const tree = this.parser.parse(docContents);
        const node = tree.rootNode.descendantForPosition({
            row: position.line,
            column: position.character,
        });

        if (node.type !== "variable_name") {
            return null;
        }

        const refNodes = backtrackDepthFirstSearch(
            node,
            (candidate) =>
                candidate.type === "variable_name" &&
                candidate.text === node.text
        );

        return refNodes.map(
            (n) =>
                new sourcegraph.Location(
                    new URL(document.uri),
                    new sourcegraph.Position(
                        n.startPosition.row,
                        n.startPosition.column
                    )
                )
        );
    }
}
