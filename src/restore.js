import * as cache from "@actions/cache";
import * as core from "@actions/core";
import { getCacheKeyPrefix, getCachePath, getExistingCacheEntries, resolvedCacheFolder } from "./helpers.js";

const token = core.getInput("token", { required: true });
const prefix = getCacheKeyPrefix();
core.setOutput("path", resolvedCacheFolder());

await core.group("Restoring vcpkg cache", async () => {
  const actionsCaches = await getExistingCacheEntries(token, prefix);

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
