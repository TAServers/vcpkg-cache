# `vcpkg` Dependency Caching using GHA

Simple Docker-based GitHub action to regain per-package caching using GitHub Actions.

```yaml
- uses: TAServers/vcpkg-cache@master # Referencing a branch like this is bad practice, but I haven't set up a proper release pipeline yet
  with:
    token: ${{ secrets.GITHUB_TOKEN }} # Used by @actions/github to read the cache entries in your repo prefixed with `vcpkg-`. Couldn't see a way with just `@actions/cache` to pull everything without needing a token
    archive-path: "some-path" # Where to restore the cache to (relative to GITHUB_WORKSPACE)
```

Uses the official `@actions/cache` NPM package under the hood to ensure compatibility with any breaking API changes 😉.

## Usage

Configure environment variables:

```yaml
env:
  VCPKG_FEATURE_FLAGS: "binarycaching" # Possibly redundant, but explicitly sets the binary caching feature flag
  VCPKG_ARCHIVE_PATH: "vcpkg-cache" # Can be any relative path you want. Not required and not used by vcpkg, just to avoid duplication in the workflow
```

Add `TAServers/vcpkg-cache` to your workflow before you run CMake configure (or whatever triggers your `vcpkg install`):

```yaml
- name: Restore vcpkg cache
  uses: TAServers/vcpkg-cache@master
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    archive-path: ${{ env.VCPKG_ARCHIVE_PATH }}
```

Tell `vcpkg` to write binary caches to your chosen directory in `GITHUB_WORKSPACE`:

```yaml
- name: CMake Configure
  env:
    VCPKG_BINARY_SOURCES: "clear;files,${{ env.GITHUB_WORKSPACE }}/${{ env.VCPKG_ARCHIVE_PATH }},readwrite"
  run: # Run cmake configure (or if you install vcpkg packages earlier, add the env var there
```

> [!NOTE]
> The cache path is relative to `GITHUB_WORKSPACE` as this action is implemented as a Docker container.
> GitHub mounts `GITHUB_WORKSPACE` to `/github/workspace` in the container when run.
