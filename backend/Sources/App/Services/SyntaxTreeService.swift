import Foundation
import SwiftSyntax
import SwiftParser

class SyntaxTreeService {

    func parse(code: String) -> ParseResponse {
        // Parse the Swift code
        let sourceFile = Parser.parse(source: code)

        // Create source location converter for position tracking
        let converter = SourceLocationConverter(fileName: "input.swift", tree: sourceFile)

        // Convert to our JSON-friendly structure
        let rootNode = convertToSyntaxNode(Syntax(sourceFile), converter: converter)

        // Collect any diagnostics/errors
        let errors = collectDiagnostics(sourceFile, converter: converter)

        return ParseResponse(
            success: errors.isEmpty,
            tree: rootNode,
            errors: errors.isEmpty ? nil : errors
        )
    }

    private func convertToSyntaxNode(_ syntax: Syntax, converter: SourceLocationConverter) -> SyntaxNode {
        // Get children, filtering out nil values
        let children: [SyntaxNode] = syntax.children(viewMode: .sourceAccurate).map { child in
            convertToSyntaxNode(child, converter: converter)
        }

        // Determine if this is a token (leaf node)
        let isToken = syntax.as(TokenSyntax.self) != nil

        // Get text for tokens only
        let text: String? = isToken ? syntax.description.trimmingCharacters(in: .whitespacesAndNewlines) : nil

        // Get the type name, removing "Syntax" suffix for cleaner display
        let typeName = String(describing: type(of: syntax.asProtocol(SyntaxProtocol.self)))

        // Extract source range
        let range = extractRange(syntax, converter: converter)

        return SyntaxNode(
            id: UUID().uuidString,
            type: typeName,
            text: text,
            range: range,
            children: children,
            isToken: isToken
        )
    }

    private func extractRange(_ syntax: Syntax, converter: SourceLocationConverter) -> SourceRange {
        let startLocation = syntax.startLocation(converter: converter)
        let endLocation = syntax.endLocation(converter: converter)

        return SourceRange(
            startLine: startLocation.line,
            startColumn: startLocation.column,
            endLine: endLocation.line,
            endColumn: endLocation.column
        )
    }

    private func collectDiagnostics(_ sourceFile: SourceFileSyntax, converter: SourceLocationConverter) -> [ParseErrorInfo] {
        // SwiftParser doesn't produce diagnostics directly in the same way
        // For now, we'll return an empty array
        // In a more complete implementation, you could use SwiftDiagnostics
        return []
    }
}
