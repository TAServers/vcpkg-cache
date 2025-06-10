import * as github from "@actions/github";
import * as core from "@actions/core";
import * as path from "path";

export const CACHE_FOLDER = ".vcpkg-cache";

export const getCacheKeyPrefix = () => core.getInput("prefix") || "vcpkg/";

export const getCurrentBranchRef = () => core.process.env.GITHUB_REF;

export const resolvedCacheFolder = () => path.resolve(CACHE_FOLDER);

export const getCacheKey = (filename, prefix) => {
  const abiHash = filename.slice(0, filename.length - ".zip".length);

  return `${prefix}${abiHash}`;
};

export const getCachePath = (cacheKey, prefix) => {
  const abiHash = cacheKey.slice(prefix.length);
  const filename = `${abiHash}.zip`;
  const directory = abiHash.slice(0, 2);

  // Relative path to avoid mismatched cache versions across environments
  return path.join(CACHE_FOLDER, directory, filename).split(path.sep).join("/");
};

export const getExistingCacheEntries = async (token, prefix, ref) => {
  const octokit = github.getOctokit(token);

  try {
    const cacheEntries = await octokit.paginate(octokit.rest.actions.getActionsCacheList, {
      ...github.context.repo,
      key: prefix,
      per_page: 100,
      ref,
    });

    return cacheEntries.map((c) => c.key);
  } catch (error) {
    core.setFailed(
      `Failed to fetch caches from the REST API. Please ensure you've granted the 'actions: read' permission to your workflow\n${error.message}`
    );
  }
};
