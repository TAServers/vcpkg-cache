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

## [3.4.1] - [#14](https://github.com/TAServers/vcpkg-cache/pull/14)

### Fixed

- Fixed error when no caches had been generated on the current branch (when distinct from the default)
- Fixed bug where only the first cache from the current branch was used

## [3.4.0] - [#11](https://github.com/TAServers/vcpkg-cache/pull/11)

### Added

- Fetch existing cache entries from the default branch, in addition to those created on derived branches

## [3.3.1] - [#9](https://github.com/TAServers/vcpkg-cache/pull/9)

### Fixed

- Fixed not filtering cache entries by branch ref - Wasn't released previously as /dist needed regenerating

## [3.3.0] - [#8](https://github.com/TAServers/vcpkg-cache/pull/8)

### Fixed

- Fixed not filtering cache entries by branch ref

## [3.2.0] - [#6](https://github.com/TAServers/vcpkg-cache/pull/6)

### Added

- Optional input to override the cache key prefix

## [3.1.0] - [No PR](#)

### Added

- Support for pagination of the cache endpoints to avoid misses after 100 matching entries

## [3.0.1] - [No PR](#)

### Fixed

- Removed no longer used `archive-path` input from `action.yml`

## [3.0.0] - [No PR](#)

### Added

- Added `path` output containing the absolute path of the archive folder to be passed to vcpkg

### Removed

- Removed `archive-path` input to take the burden of GHA cache edge cases off of the user

## [2.2.0] - [No PR](#)

### Changed

- Changed cache key to prefix using the archive path (key is now just the filename). This is needed due to GitHub
  versioning caches with the same key using their file path, causing silently failing cache restores when changing
  `archive-path`

## [2.1.0] - [No PR](#)

### Added

- Handles mismatched cache entry versions (usually due to changing the archive path)

### Fixed

- Removed hardcoded owner and repo strings

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
