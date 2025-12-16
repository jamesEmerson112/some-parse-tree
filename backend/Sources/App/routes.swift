import Vapor

func routes(_ app: Application) throws {
    // Health check endpoint
    app.get { req async in
        "Swift Parse Tree API is running!"
    }

    // API routes
    let api = app.grouped("api")
    try api.register(collection: ParseController())
}
