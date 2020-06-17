import * as sourcegraph from "sourcegraph";
import Parser from "web-tree-sitter";
import { Analyzer } from "./analyzer";
import { remoteDocFetcher } from "./doc-fetcher";

/**
 * Initializes the parser from a grammar in a WASM file.
 *
 * @param parserWASMFile is the URL of the WASM file that contains the Bash grammar. Alternate
 * values include "http://localhost:8000/tree-sitter-bash.wasm" (when serving the file from
 * localhost) and "hacks/tree-sitter-bash.wasm" (when running tests and loading the file from local
 * disk).
 */
export async function initializeParser(
    parserWASMFile: string = "https://storage.googleapis.com/tree-sitter/tree-sitter-bash.wasm"
): Promise<Parser> {
    await Parser.init();
    const parser = new Parser();

    /**
     * See https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web#generate-wasm-language-files
     *
     * To compile:
     *  yarn add --dev tree-sitter-cli
     *  npx tree-sitter build-wasm node_modules/tree-sitter-bash
     *
     * The current files was compiled with:
     * "tree-sitter-bash": "^0.16.0",
     * "tree-sitter-cli": "^0.15.9"
     */
    const lang = await Parser.Language.load(parserWASMFile);
    parser.setLanguage(lang);
    return parser;
}

export async function activate(
    ctx: sourcegraph.ExtensionContext
): Promise<void> {
    console.log("Bash extension activated");
    try {
        const parser = await initializeParser();
        console.log("Parser initialized");
        const analyzer = new Analyzer(parser, remoteDocFetcher);

        // TODO(beyang): change file selector
        const selectors = [
            {
                language: "bash",
            },
            {
                language: "shell",
            },
            {
                pattern: "*.sh",
            },
        ];
        ctx.subscriptions.add(
            sourcegraph.languages.registerHoverProvider(selectors, analyzer)
        );
        ctx.subscriptions.add(
            sourcegraph.languages.registerDefinitionProvider(
                selectors,
                analyzer
            )
        );
        ctx.subscriptions.add(
            sourcegraph.languages.registerReferenceProvider(selectors, analyzer)
        );
    } catch (e) {
        console.error("Uncaught error during extension activation", e);
    }
}
