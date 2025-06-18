import * as cache from "@actions/cache";
import * as core from "@actions/core";
import {
  getCacheKeyPrefix,
  getCachePath,
  getExistingCacheEntries,
  resolvedCacheFolder,
  getCurrentBranchRef,
  getDefaultBranchRef,
} from "./helpers.js";

const token = core.getInput("token", { required: true });
const ref = getCurrentBranchRef();
const prefix = getCacheKeyPrefix();
core.setOutput("path", resolvedCacheFolder());

await core.group("Restoring vcpkg cache", async () => {
  const defaultBranchRef = await getDefaultBranchRef(token);
  const defaultActionsCaches = await getExistingCacheEntries(token, prefix, defaultBranchRef);
  core.info(`Found ${defaultActionsCaches.length} caches for default branch ref '${defaultBranchRef}'`);

  const actionsRefCaches = await getExistingCacheEntries(token, prefix, ref);
  core.info(`Found ${actionsRefCaches.length} caches for current branch ref '${ref}'`);

  const actionsCaches = new Set(defaultActionsCaches ?? []);

  if (actionsRefCaches)
    actionsCaches.push(...actionsRefCaches);
  
  if (actionsCaches.length < 1) {
    core.info(`No cache entries found with prefix '${prefix}'`);
    return;
  }

  await Promise.all(
    actionsCaches.map(async (cacheKey) => {
      const cacheRestorePath = await getCachePath(cacheKey, prefix);
      core.info(`Restoring '${cacheKey}' to '${cacheRestorePath}'`);

      await cache.restoreCache([cacheRestorePath], cacheKey, undefined, undefined, true);
    })
  );
});
