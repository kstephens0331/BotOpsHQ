{
  "name": "__BOT_PKG__",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "embed:kb": "tsx src/embed.ts"
  },
  "dependencies": {
    "@aeon/bot-core": "workspace:*",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "tsx": "^4.7.0",
    "typescript": "^5.4.5"
  }
}
