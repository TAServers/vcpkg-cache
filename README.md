# `vcpkg` Dependency Caching using GHA

Simple Node-based GitHub action to regain per-package caching using GitHub Actions.

```yaml
- uses: TAServers/vcpkg-cache@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }} # Used by @actions/github to read the cache entries in your repo prefixed with `vcpkg-`. Couldn't see a way with just `@actions/cache` to pull everything without needing a token
    archive-path: "some-path" # Where to restore the cache to
```

Uses the official `@actions/cache` NPM package under the hood to ensure compatibility with any breaking API changes 😉.

## Usage

Add the `actions: read` permission to the workflow token:

```yaml
permissions:
  actions: read
  contents: read # Usually enabled by default. Needed for checkout
```

Configure environment variables:

```yaml
env:
  VCPKG_FEATURE_FLAGS: "binarycaching" # Possibly redundant, but explicitly sets the binary caching feature flag
  VCPKG_ARCHIVE_PATH: "vcpkg-cache" # Can be any path you want. Not required and not used by vcpkg, just to avoid duplication in the workflow
```

Add `TAServers/vcpkg-cache` to your workflow before you run CMake configure (or whatever triggers your `vcpkg install`):

```yaml
- name: Restore vcpkg cache
  uses: TAServers/vcpkg-cache@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    archive-path: ${{ env.VCPKG_ARCHIVE_PATH }}
```

Tell `vcpkg` to write binary caches to your chosen directory:

```yaml
- name: CMake Configure
  env:
    VCPKG_BINARY_SOURCES: "clear;files,${{ env.VCPKG_ARCHIVE_PATH }},readwrite"
  run: # Run cmake configure (or if you install vcpkg packages earlier, add the env var there
```
