import "isomorphic-fetch";
import mock from "mock-require";
import { createStubSourcegraphAPI } from "@sourcegraph/extension-api-stubs";
const sourcegraph = createStubSourcegraphAPI();
mock("sourcegraph", sourcegraph);

import { initializeParser } from "./codenav-bash";
import { Analyzer } from "./analyzer";

import { expect } from "chai";
import { MockDocFetcher } from "./doc-fetcher";

async function expectHover(
    analyzer: Analyzer,
    text: string,
    matchers: RegExp[],
    contents: RegExp
) {
    let searchText = text;
    let index = 0;
    for (const matcher of matchers) {
        const result = searchText.match(matcher);
        if (!result) {
            throw new Error(
                `Unable to find matching pattern(s) ${matchers} in text`
            );
        }
        searchText = result[0];
        index += result.index || 0;
    }
    const line = text.substr(0, index).match(/\n/g)?.length || 0;
    let col = index;
    if (line > 0) {
        col = index - text.substr(0, index).lastIndexOf("\n") - 1;
    }

    const hover = await analyzer.provideHover(
        { text },
        new sourcegraph.Position(line, col)
    );
    expect(hover?.contents.value || "").to.match(contents);
}

describe("Expected code intelligence actions", () => {
    it("Hover tooltip on subcommand", async () => {
        const docFetcher = new MockDocFetcher({
            git: "git docs",
            "git-log": `git-log docs

--stat docs for --stat
`,
            echo: `echo - display a line of text

-n do not output the trailing newline
`,
        });
        const testCases = {
            "git.sh": `#!/bin/bash

git log --stat
echo -n master | xargs git log | less
        `,
        };

        const parser = await initializeParser("hacks/tree-sitter-bash.wasm");
        const analyzer = new Analyzer(parser, docFetcher);

        await expectHover(
            analyzer,
            testCases["git.sh"],
            [/git log --stat/, /git/],
            /git docs/
        );
        await expectHover(
            analyzer,
            testCases["git.sh"],
            [/echo -n master/],
            /echo - display a line of text/
        );
        await expectHover(
            analyzer,
            testCases["git.sh"],
            [/echo -n master/, /-n/],
            /do not output the trailing newline/
        );
        await expectHover(
            analyzer,
            testCases["git.sh"],
            [/git log --stat/, /log/],
            /git-log docs/
        );
        await expectHover(
            analyzer,
            testCases["git.sh"],
            [/git log --stat/, /--stat/],
            /^`*\s*--stat docs for --stat\s*`*$/
        );
    });
});
