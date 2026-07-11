/**
 * Maximum number of source files to include in the repository context.
 *
 * This prevents extremely large repositories (e.g. React, Kubernetes)
 * from consuming too much memory or exceeding the AI model's context window.
 */
export const MAX_FILES = 500;

/**
 * Maximum size of a single file that will be included.
 *
 * Files larger than this are skipped.
 */
export const MAX_FILE_SIZE = 500 * 1024; // 500 KB

/**
 * Maximum combined size of all files included in the RepositoryContext.
 *
 * Once this limit is reached, no more files are added.
 */
export const MAX_REPOSITORY_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Number of files to read concurrently.
 *
 * Reading files concurrently is much faster than sequential reads,
 * but limiting concurrency avoids exhausting system resources.
 */
export const CONCURRENT_READS = 20;

/**
 * Repository files and directories that should always be ignored.
 */
export const IGNORED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
  ".cache",
  ".idea",
  ".vscode",
]);

/**
 * Binary or non-source file extensions that should never be sent to the AI.
 */
export const IGNORED_EXTENSIONS = new Set([
  // Images
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".webp",
  ".svg",
  ".ico",

  // Videos
  ".mp4",
  ".avi",
  ".mov",
  ".mkv",
  ".webm",

  // Audio
  ".mp3",
  ".wav",
  ".ogg",

  // Archives
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",

  // Documents
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",

  // Fonts
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".eot",

  // Executables
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".class",
  ".jar",

  // Lock files
  ".lock",

  // Database
  ".sqlite",
  ".db",

  // Logs
  ".log",
]);

/**
 * Files that should always be prioritized because they provide
 * high-level project context to the AI.
 */
export const HIGH_PRIORITY_FILES = new Set([
  "README.md",
  "package.json",
  "tsconfig.json",
  "next.config.ts",
  "next.config.js",
  "vite.config.ts",
  "vite.config.js",
  "tailwind.config.ts",
  "tailwind.config.js",
  "docker-compose.yml",
  "docker-compose.yaml",
  "Dockerfile",
  ".env.example",
  ".gitignore",
  "LICENSE",
]);

/**
 * Directories that usually contain the application source code.
 */
export const SOURCE_DIRECTORIES = new Set([
  "src",
  "app",
  "pages",
  "components",
  "lib",
  "server",
  "client",
]);
