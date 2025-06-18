import * as github from "@actions/github";
import * as core from "@actions/core";
import * as path from "path";

export const CACHE_FOLDER = ".vcpkg-cache";

export const getCacheKeyPrefix = () => core.getInput("prefix") || "vcpkg/";

export const getDefaultBranchRef = async (token) => {
  try {
    const octokit = github.getOctokit(token);

    const repo = await octokit.rest.repos.get({
      ...github.context.repo,
    });

    return `refs/heads/${repo.data.default_branch || "main"}`; // Fallback to 'main' if default branch is not set
  } catch (error) {
    throw new Error(
      `Failed to fetch default branch from the repository. Please ensure you've granted the 'repo: read' permission to your workflow\n${error.message}`
    );
  }
};

export const getCurrentBranchRef = () => process.env.GITHUB_REF;

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

    if (core.isDebug()) {
      const debugAllCacheEntries = await octokit.paginate(octokit.rest.actions.getActionsCacheList, {
        ...github.context.repo,
        key: prefix,
        per_page: 100,
      });

      core.debug("All cache entries:");
      core.debug(JSON.stringify(debugAllCacheEntries, null, 2));

      core.debug(`Cache entries filtered by ref '${ref}'`);
      core.debug(JSON.stringify(cacheEntries, null, 2));
    }

    return cacheEntries.map((c) => c.key);
  } catch (error) {
    throw new Error(
      `Failed to fetch caches from the REST API. Please ensure you've granted the 'actions: read' permission to your workflow\n${error.message}`
    );
  }
};

export const getExistingCacheEntriesForCurrentBranch = async (token, prefix) => {
  const defaultBranchRef = await getDefaultBranchRef(token);
  const defaultActionsCaches = await getExistingCacheEntries(token, prefix, defaultBranchRef);
  core.info(`Found ${defaultActionsCaches.length} caches for default branch ref '${defaultBranchRef}'`);

  const actionsCaches = new Set(defaultActionsCaches ?? []);

  const currentBranchRef = getCurrentBranchRef();
  if (currentBranchRef !== defaultBranchRef) {
    const refActionsCaches = await getExistingCacheEntries(token, prefix, currentBranchRef);
    core.info(`Found ${refActionsCaches.length} caches for current branch ref '${currentBranchRef}'`);

    actionsCaches.add(...refActionsCaches);
  }

  return actionsCaches;
};
