# Copy Project to TXT [README.ru.md](https://github.com/somenmi/Copy-Project-to-TXT/blob/main/README.ru.md)

An extension for VS Code that copies the entire project into a single text file (`project_content.txt `), ignoring confidential and system files.

## Features
- Copies the project structure with the contents of the files.
- Automatically skips:
- `.env`, `.git`, `node_modules`
  - `package-lock.json`, binary files (.png, .jpg, etc.)
- Support for custom exceptions.

## Installation
1. Install via `.vsix`-file:
   ```bash
   code --install-extension copy-project-to-txt-0.0.1.vsix
