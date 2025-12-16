import Vapor

struct ParseResponse: Content {
    let success: Bool
    let tree: SyntaxNode?
    let errors: [ParseErrorInfo]?
}

struct SyntaxNode: Content {
    let id: String
    let type: String
    let text: String?
    let range: SourceRange
    let children: [SyntaxNode]
    let isToken: Bool
}

struct SourceRange: Content {
    let startLine: Int
    let startColumn: Int
    let endLine: Int
    let endColumn: Int
}

struct ParseErrorInfo: Content {
    let message: String
    let line: Int
    let column: Int
}
