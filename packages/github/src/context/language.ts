import path from "path";

import { ProgrammingLanguage } from "./types";

const LANGUAGE_MAP: Record<string, ProgrammingLanguage> = {
  ".ts": ProgrammingLanguage.TYPESCRIPT,
  ".tsx": ProgrammingLanguage.TYPESCRIPT,

  ".js": ProgrammingLanguage.JAVASCRIPT,
  ".jsx": ProgrammingLanguage.JAVASCRIPT,
  ".mjs": ProgrammingLanguage.JAVASCRIPT,
  ".cjs": ProgrammingLanguage.JAVASCRIPT,

  ".py": ProgrammingLanguage.PYTHON,

  ".java": ProgrammingLanguage.JAVA,

  ".go": ProgrammingLanguage.GO,

  ".rs": ProgrammingLanguage.RUST,

  ".c": ProgrammingLanguage.C,

  ".cpp": ProgrammingLanguage.CPP,
  ".cc": ProgrammingLanguage.CPP,
  ".cxx": ProgrammingLanguage.CPP,

  ".cs": ProgrammingLanguage.CSHARP,

  ".php": ProgrammingLanguage.PHP,

  ".rb": ProgrammingLanguage.RUBY,

  ".kt": ProgrammingLanguage.KOTLIN,

  ".swift": ProgrammingLanguage.SWIFT,
};

export function detectLanguage(filePath: string): ProgrammingLanguage {
  const extension = path.extname(filePath).toLowerCase();

  return LANGUAGE_MAP[extension] ?? ProgrammingLanguage.UNKNOWN;
}
