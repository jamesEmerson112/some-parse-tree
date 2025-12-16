# Swift Parse Tree Visualizer

A web-based tool for visualizing Swift code syntax trees. Perfect for Swift beginners who want to understand how their code is structured.

![Swift](https://img.shields.io/badge/Swift-5.9-orange)
![Vapor](https://img.shields.io/badge/Vapor-4.89-blue)
![Docker](https://img.shields.io/badge/Docker-Required-blue)

## Features

- **Paste & Parse**: Enter Swift code and instantly see its parse tree
- **Interactive Tree**: Click nodes to explore their details
- **Zoom & Pan**: Navigate large trees easily
- **Syntax Highlighting**: CodeMirror editor with Swift support
- **Real AST**: Uses Apple's official SwiftSyntax library

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/some-parse-tree.git
   cd some-parse-tree
   ```

2. Start the application with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Open your browser to **http://localhost:3000**

4. Enter Swift code in the editor and click "Parse Code"!

## Usage

### Example Code to Try

```swift
let greeting = "Hello, World!"
let sum = 1 + 2 * 3

if sum > 5 {
    print(greeting)
}
```

### Understanding the Tree

- **Blue nodes**: Syntax nodes (containers for other nodes)
- **Green nodes**: Tokens (leaf nodes like keywords, identifiers, literals)
- **Click a node**: See its type, text content, and source location

## Architecture

```
Frontend (HTML/CSS/JS)     Backend (Swift/Vapor)
┌─────────────────────┐    ┌─────────────────────┐
│  CodeMirror Editor  │───►│  SwiftSyntax Parser │
│  D3.js Tree View    │◄───│  JSON API           │
└─────────────────────┘    └─────────────────────┘
        :3000                      :8080
           │                          │
           └──────── Docker ──────────┘
```

## Project Structure

```
some-parse-tree/
├── docker-compose.yml      # Orchestrates services
├── Dockerfile              # Builds Swift backend
├── nginx.conf              # Frontend server config
├── backend/
│   ├── Package.swift       # Swift dependencies
│   └── Sources/App/
│       ├── Controllers/    # API endpoints
│       ├── Models/         # Data structures
│       └── Services/       # SwiftSyntax parsing
└── frontend/
    ├── index.html          # Main page
    ├── css/                # Styles
    └── js/                 # Application logic
```

## Development

### Rebuilding After Changes

```bash
docker-compose down
docker-compose up --build
```

### Viewing Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stopping

```bash
docker-compose down
```

## Technologies

- **Backend**: Swift 5.9, Vapor 4, SwiftSyntax
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Libraries**: D3.js (visualization), CodeMirror (editor)
- **Infrastructure**: Docker, nginx

## License

MIT License - see [LICENSE](LICENSE) for details.
