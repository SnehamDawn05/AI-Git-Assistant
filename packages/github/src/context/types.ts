/**
 * Supported source code languages.
 */
export enum ProgrammingLanguage {
  TYPESCRIPT = "typescript",
  JAVASCRIPT = "javascript",
  PYTHON = "python",
  JAVA = "java",
  GO = "go",
  RUST = "rust",
  C = "c",
  CPP = "cpp",
  CSHARP = "csharp",
  PHP = "php",
  RUBY = "ruby",
  KOTLIN = "kotlin",
  SWIFT = "swift",
  UNKNOWN = "unknown",
}

/**
 * Represents a single source file that will be sent to the AI.
 */
export interface RepositoryFile {
  /**
   * Relative path inside the repository.
   * Example:
   * src/components/button.tsx
   */
  path: string;

  /**
   * Programming language detected from the extension.
   */
  language: ProgrammingLanguage;

  /**
   * Raw source code.
   */
  content: string;

  /**
   * File size in bytes.
   */
  size: number;
}

/**
 * Represents the complete repository context.
 * This object will later be chunked and sent to Gemini.
 */
export interface RepositoryContext {
  /**
   * Repository name.
   * Example:
   * react
   */
  repositoryName: string;

  /**
   * Total number of source files included.
   */
  totalFiles: number;

  /**
   * Total size (bytes) of all included files.
   */
  totalSize: number;

  /**
   * All source files selected for analysis.
   */
  files: RepositoryFile[];

  /**
   * README.md contents (if present).
   */
  readme?: string;

  /**
   * package.json contents (if present).
   */
  packageJson?: string;

  /**
   * Root folders in the repository.
   */
  folders: string[];
}
