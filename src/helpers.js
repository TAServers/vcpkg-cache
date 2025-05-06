import * as github from "@actions/github";
import * as core from "@actions/core";
import * as path from "path";

export const CACHE_FOLDER = ".vcpkg-cache";

export const CACHE_KEY_PREFIX = "vcpkg/";

export const resolvedCacheFolder = () => path.resolve(CACHE_FOLDER);

export const getCacheRestorePath = (cacheKey) => {
  const abiHash = cacheKey.slice(CACHE_KEY_PREFIX.length);
  const filename = `${abiHash}.zip`;
  const directory = abiHash.slice(0, 2);

  return path.join(resolvedCacheFolder(), directory, filename);
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

    octokit.rest.actions.deleteActionsCacheByKey;
    return actionsCaches.map((c) => c.key);
  } catch (error) {
    core.setFailed(
      `Failed to fetch caches from the REST API. Please ensure you've granted the 'actions: read' permission to your workflow\n${error.message}`
    );
  }
};
