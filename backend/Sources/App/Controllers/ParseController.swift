import Vapor

struct ParseController: RouteCollection {
    let syntaxService = SyntaxTreeService()

    func boot(routes: RoutesBuilder) throws {
        let parse = routes.grouped("parse")
        parse.post(use: parseCode)
    }

    @Sendable
    func parseCode(req: Request) async throws -> ParseResponse {
        let parseRequest = try req.content.decode(ParseRequest.self)
        return syntaxService.parse(code: parseRequest.code)
    }
}
