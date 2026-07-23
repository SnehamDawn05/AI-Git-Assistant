# AI Git Assistant

## Overview

AI Git Assistant is a powerful, AI-driven platform designed to streamline repository management and code quality assurance. By leveraging advanced LLMs (Gemini), it provides automated insights, documentation generation, and intelligent pull request reviews, helping developers maintain high standards and improve productivity.

## Features

- **Automated Repository Summaries:** Get high-level architectural overviews and tech stack analysis for any GitHub repository.
- **Intelligent README Generation:** Automatically generate professional, comprehensive README files based on repository structure and content.
- **Pull Request Reviews:** Receive automated, senior-engineer-level feedback on pull requests, focusing on bugs, security, performance, and best practices.
- **Caching Layer:** Built-in Redis caching ensures fast retrieval of previous analyses.
- **Queue-based Processing:** Robust job management using BullMQ to handle intensive AI analysis tasks asynchronously.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Better Auth
- **AI Engine:** Google Gemini (via `@google/genai`)
- **Task Queue:** BullMQ & Redis
- **Styling:** Tailwind CSS & Shadcn UI
- **Monorepo Management:** Turborepo & pnpm

## Folder Structure

- `apps/web`: Next.js frontend application.
- `apps/worker`: Background worker service for processing AI analysis jobs.
- `packages/ai`: Core AI logic, including chunking, prompting, and Gemini integration.
- `packages/db`: Shared Prisma schema and database client.
- `packages/github`: Utilities for cloning, scanning, and fetching GitHub PR data.
- `packages/queue`: Shared queue definitions and Redis cache logic.

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd ai-git-assistant
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory (and relevant sub-directories) with the following:

   ```env
   DATABASE_URL=...
   REDIS_URL=...
   GEMINI_API_KEY=...
   BETTER_AUTH_SECRET=...
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. **Database Setup:**
   ```bash
   pnpm prisma migrate dev
   ```

## Usage

1. **Start the development environment:**
   ```bash
   pnpm dev
   ```
2. **Access the Dashboard:** Open `http://localhost:3000` to log in and start analyzing your repositories.
3. **Queue Analysis:** Provide a GitHub repository or Pull Request URL in the dashboard to trigger an analysis job.
4. **View Results:** Monitor the status in the "Analysis" section; the UI will automatically update once the worker completes the task.

## Scripts

- `pnpm dev`: Starts the entire monorepo in development mode.
- `pnpm build`: Builds all applications and packages.
- `pnpm lint`: Runs linting across the project.
- `pnpm typecheck`: Runs TypeScript type validation.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

## License

This project is licensed under the ISC License.
