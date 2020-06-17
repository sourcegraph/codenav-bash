import { SyntaxNode } from "web-tree-sitter";

export function printTree(node: SyntaxNode, maxLevels: number): void {
    const levels = subtreeToLevels(node, maxLevels);
    const levelStrings = [];
    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        levelStrings.push(`${i}: ${level.map(nodeToString).join(" ")}`);
    }
    console.log(levelStrings.join("\n"));
}

export function nodeToString(node: SyntaxNode): string {
    return `[${node.type}: ${node.text}]`;
}

export function subtreeToLevels(
    node: SyntaxNode,
    maxLevels: number
): SyntaxNode[][] {
    let currentLevel = [node];
    const levels: SyntaxNode[][] = [currentLevel];
    for (let i = 0; i < maxLevels; i++) {
        const nextLevel: SyntaxNode[] = [];
        for (const node of currentLevel) {
            for (const child of node.children) {
                nextLevel.push(child);
            }
        }

        if (nextLevel.length === 0) {
            break;
        }
        levels.push(nextLevel);
        currentLevel = nextLevel;
    }
    return levels;
}

export function isDefinition(node: SyntaxNode): boolean {
    if (node.type !== "variable_name") {
        return false;
    }
    if (!node.parent || node.parent.type !== "variable_assignment") {
        return false;
    }
    return true;
}

export function backtrackDepthFirstSearch(
    startNode: SyntaxNode,
    selector: (node: SyntaxNode) => boolean,
    {
        limit,
    }: {
        limit: number;
    } = { limit: 0 }
): SyntaxNode[] {
    const found: SyntaxNode[] = [];
    if (selector(startNode)) {
        found.push(startNode);
    }

    for (
        let curNode = startNode.parent, exploredChild = startNode;
        curNode !== null;
        exploredChild = curNode, curNode = curNode.parent
    ) {
        if (limit > 0 && found.length >= limit) {
            return found;
        }
        doDepthFirstSearch(curNode, exploredChild, selector, { limit }, found);
    }
    return found;
}

export function depthFirstSearch(
    node: SyntaxNode,
    exclude: SyntaxNode | null,
    selector: (node: SyntaxNode) => boolean,
    { limit }: { limit: number } = { limit: 0 }
): SyntaxNode[] {
    const found: SyntaxNode[] = [];
    doDepthFirstSearch(node, exclude, selector, { limit }, found);
    return found;
}

function doDepthFirstSearch(
    node: SyntaxNode,
    exclude: SyntaxNode | null,
    selector: (node: SyntaxNode) => boolean,
    { limit }: { limit: number },
    found: SyntaxNode[]
): void {
    if (limit > 0 && found.length >= limit) {
        return;
    }
    if (selector(node)) {
        found.push(node);
    }
    for (const child of node.children) {
        if (limit > 0 && found.length >= limit) {
            return;
        }
        if (child === exclude) {
            continue;
        }
        doDepthFirstSearch(child, null, selector, { limit }, found);
    }
}

export function findDefinitionNode(
    varName: string,
    refNode: SyntaxNode
): SyntaxNode | null {
    if (isDefinition(refNode)) {
        return refNode;
    }
    let curNode: SyntaxNode | null = refNode.parent;
    let exploredChild: SyntaxNode | null = refNode;
    while (curNode != null) {
        const found = dfs(varName, curNode, exploredChild);
        if (found) {
            return found;
        }

        exploredChild = curNode;
        curNode = curNode.parent;
    }
    return null;
}

function dfs(
    varName: string,
    node: SyntaxNode,
    exclude: SyntaxNode | null
): SyntaxNode | null {
    if (
        node.type === "variable_assignment" &&
        node.firstChild?.text === varName
    ) {
        return node;
    }

    for (const child of node.children) {
        if (child === exclude) {
            continue;
        }
        const found = dfs(varName, child, null);
        if (found) {
            return found;
        }
    }
    return null;
}

export function printPath(node: SyntaxNode | null) {
    for (let n = node; n !== null; n = n.parent) {
        console.log(n.type, ":", n.text.substr(0, 50));
    }
}
