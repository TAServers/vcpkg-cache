import * as path from "path";
import * as github from "@actions/github";
import * as core from "@actions/core";

export const CACHE_KEY_PREFIX = "vcpkg-";

export const getCacheRestorePath = (vcpkgArchivePath, cacheKey) => {
  const abiHash = cacheKey.slice(CACHE_KEY_PREFIX.length);
  const filename = `${abiHash}.zip`;
  const directory = abiHash.slice(0, 2);

  return path.join(vcpkgArchivePath, directory, filename);
};

export const getCacheKey = (filename) => {
  const abiHash = filename.slice(0, filename.length - ".zip".length);

  return `${CACHE_KEY_PREFIX}${abiHash}`;
};

export const getExistingCacheEntries = async (token) => {
  const octokit = github.getOctokit(token);

  try {
    const {
      data: { actions_caches: actionsCaches },
    } = await octokit.rest.actions.getActionsCacheList({
      ...github.context.repo,
      key: CACHE_KEY_PREFIX,
      per_page: 100, // TODO: Handle pagination
    });

    return actionsCaches.map((c) => c.key);
  } catch (error) {
    core.setFailed(
      `Failed to fetch caches from the REST API. Please ensure you've granted the 'actions: read' permission to your workflow\n${error.message}`
    );
  }
};

export const deleteCacheEntry = async (token, cacheKey) => {
  const octokit = github.getOctokit(token);

  try {
    await octokit.rest.actions.deleteActionsCacheByKey({
      ...github.context.repo,
      key: cacheKey,
    });
  } catch (error) {
    core.warning(`Failed to delete cache entry: ${error.message}`);
  }
};
