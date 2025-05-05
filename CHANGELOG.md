# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The valid change types are:

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

## [2.0.5] - [No PR](#)

### Fixed

- Removed erroneously prefixing `/github/workspace` to archive path (legacy of Docker action)

## [2.0.4] - [No PR](#)

### Fixed

- Fix directory iteration in save action

## [2.0.3] - [No PR](#)

### Fixed

- (Hopefully) fixed imports in `ncc` bundle not working

## [2.0.2] - [No PR](#)

### Fixed

- Updated action entrypoint to `/dist`
- Updated version in readme to `v2`

## [2.0.1] - [No PR](#)

### Fixed

- Bundle dependencies with `ncc` to fix missing imports

## [2.0.0] - [#4](https://github.com/TAServers/vcpkg-cache/pull/4)

### Changed

- **Breaking:** Converted to a regular Node.js action for compatibility with non-Linux runners

## [1.0.3] - [No PR](#)

### Fixed

- Removed now-unused `action` input from config

## [1.0.2] - [No PR](#)

### Added

- Added tag protection rules (dummy release to check permissions)

## [1.0.1] - [No PR](#)

### Fixed

- Fixed release workflow not triggering build and push of image

## [1.0.0] - [#1](https://github.com/TAServers/vcpkg-cache/pull/1)

### Added

- Initial version of the action with support for granular caching of vcpkg dependencies using GitHub Actions Cache
