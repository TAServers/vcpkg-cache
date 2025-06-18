import * as cache from "@actions/cache";
import * as core from "@actions/core";
import {
  getCacheKeyPrefix,
  getCachePath,
  resolvedCacheFolder,
  getExistingCacheEntriesForCurrentBranch,
} from "./helpers.js";

const token = core.getInput("token", { required: true });
const prefix = getCacheKeyPrefix();
core.setOutput("path", resolvedCacheFolder());

await core.group("Restoring vcpkg cache", async () => {
  const actionsCaches = await getExistingCacheEntriesForCurrentBranch(token);

  if (actionsCaches.size < 1) {
    core.info(`No cache entries found with prefix '${prefix}'`);
    return;
  }

  await Promise.all(
    Array.from(actionsCaches).map(async (cacheKey) => {
      const cacheRestorePath = getCachePath(cacheKey, prefix);
      core.info(`Restoring '${cacheKey}' to '${cacheRestorePath}'`);

      await cache.restoreCache([cacheRestorePath], cacheKey, undefined, undefined, true);
    })
  );
});
