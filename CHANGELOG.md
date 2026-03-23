# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-23

### Added
- New settings system with `settings.json` and boolean values
- "Open Settings" command for quick access
- Support for 30+ popular file extensions
- Automatic settings file creation on first run
- New header format `######### File: [name] #########`

### Changed
- Complete redesign of ignore system (folders, files, extensions)
- Improved performance and code optimization
- Updated command interface
- Fixed extra spacing and line breaks

### Removed
- Old regex-based ignore system

## [0.1.0] - Previous Version

### Added
- Basic project scanning functionality
- Collect files into a single text file
- Simple ignore system using regular expressions

[1.0.0]: https://github.com/somenmi/Copy-Project-to-TXT/releases/tag/v1.0.0
[0.1.0]: https://github.com/somenmi/Copy-Project-to-TXT/releases/tag/v0.1.0