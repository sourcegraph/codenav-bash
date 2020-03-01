import * as sourcegraph from 'sourcegraph'

export function activate(ctx: sourcegraph.ExtensionContext): void {
   ctx.subscriptions.add(
       sourcegraph.languages.registerHoverProvider(['*'], {
           provideHover: () => ({
               contents: {
                   value: 'Hello world from codenav-bash! 🎉🎉🎉',
                   kind: sourcegraph.MarkupKind.Markdown
               }
           }),
        })
    )
}

// Sourcegraph extension documentation: https://docs.sourcegraph.com/extensions/authoring
