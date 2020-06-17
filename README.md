# codenav-bash (Sourcegraph extension)

Provides tooltips and navigation capabilities in Bash scripts.

## Development

1. Install dependencies: `yarn install`
1. Update the web-tree-sitter dependency with a special customization: `yarn pre:publish`
1. Serve the extension on https://localhost:1234: `yarn serve`
1. Navigate to your Sourcegraph instance. Open the browser JavaScript console and run `localStorage.debug=true;location.reload()`
1. Click on the `EXT` button in the lower right of the screen, click `Load extension`, enter `http://localhost:1234`
1. Refresh the page and navigate to a Bash file. You should see hovers.

### Tests

To run tests, do the following:
1. Run `yarn pre:test` (note that this will break the extension if you're currently running it on a Sourcegraph instance)
1. Run `yarn test`

Note that because `yarn pre:test` breaks the extension, after running tests, you'll have to run
`yarn pre:publish && yarn serve` again to unbreak the extension if you're using it on a Sourcegraph
instance.

### Advanced

The extension fetches 2 WASM files over the network:
- `tree-sitter.wasm`, which executes tree-sitter
- `tree-sitter-bash.wasm`, which contains the tree-sitter grammar for Bash

You can optionally fetch these from localhost by doing the following:
- Kill `yarn serve` if it is currently running
- Run `yarn pre:localhost`
- Update calls to `initializeParser` to passing "http://localhost:8000/tree-sitter-bash.wasm" as the argument.
- Serve the files: `cd hacks && go run serve.go`
- Run `yarn serve`. You can verify the files are being fetched from the localhost server by looking at its standard output (it will print the name of each file it serves).

### Resources

* [Sourcegraph extension docs](https://docs.sourcegraph.com/extensions/authoring)
