async function run() {
  const Parser = window.TreeSitter;
  await Parser.init()
  const Bash = await Parser.Language.load('tree-sitter-bash.wasm');
  const parser = new Parser();
  parser.setLanguage(Bash);
  const sourceCode = 'echo hi';
  const tree = parser.parse(sourceCode);
  console.log('parse tree', tree);
  console.log(tree.rootNode.toString());
  console.log(tree.rootNode.firstChild.toString());
  console.log(tree.rootNode.firstChild.firstChild);
}

run().then(() => console.log("# Done"))
