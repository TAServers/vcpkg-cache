# `vcpkg` Dependency Caching using GHA

Simple Node-based GitHub action to regain per-package caching using GitHub Actions.

```yaml
- uses: TAServers/vcpkg-cache@v3
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
```

Inputs:

- `token`: GitHub workflow token used by `@actions/github` to get the list of cache entries for the given prefix
- (optional) `prefix`: Prefix added to cache keys to determine which cache entries to restore. Defaults to
  `vcpkg/`

Outputs:

- `path`: Absolute path to the restored cache (to be passed to vcpkg)

Uses the official `@actions/cache` NPM package under the hood to ensure compatibility with any breaking API changes 😉.

## Usage

Add the `actions: read` permission to the workflow token:

```yaml
permissions:
  actions: read
  contents: read # Usually enabled by default. Needed for checkout
```

Add `TAServers/vcpkg-cache` to your workflow before you run CMake configure (or whatever triggers your `vcpkg install`):

```yaml
- name: Restore vcpkg cache
  id: vcpkg-cache
  uses: TAServers/vcpkg-cache@v3
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
```

Tell `vcpkg` to use the restored directory for binary caching:

```yaml
- name: CMake Configure
  env:
    VCPKG_FEATURE_FLAGS: "binarycaching" # Possibly redundant, but explicitly sets the binary caching feature flag
    VCPKG_BINARY_SOURCES: "clear;files,${{ steps.vcpkg-cache.outputs.path }},readwrite"
  run: # Run cmake configure (or if you install vcpkg packages earlier, add the env var there
```
