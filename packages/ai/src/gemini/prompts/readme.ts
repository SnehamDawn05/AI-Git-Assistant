import type { RepositoryContext } from "@repo/github";

import { formatChunkResult, type ChunkResult } from "../../chunk";

export function buildReadmePrompt(
  repository: RepositoryContext,
  chunkResult: ChunkResult,
): string {
  return `
Repository Name:
${repository.repositoryName}

Repository Context:

${formatChunkResult(chunkResult)}

Generate a professional README.md for this repository.

The README should include:

# Project Title

## Overview

## Features

## Tech Stack

## Folder Structure

## Installation

## Usage

## Scripts

## Contributing

## License

Return ONLY markdown.

Do not wrap the markdown in triple backticks.
`;
}
