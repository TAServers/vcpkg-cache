import * as cache from "@actions/cache";
import * as core from "@actions/core";
import { CACHE_KEY_PREFIX, deleteCacheEntry, getCacheRestorePath, getExistingCacheEntries } from "./helpers.js";

const token = core.getInput("token");
const vcpkgArchivePath = core.getInput("archive-path");

await core.group("Restoring vcpkg cache", async () => {
  const actionsCaches = await getExistingCacheEntries(token);

  if (actionsCaches.length < 1) {
    core.info(`No cache entries found with prefix '${CACHE_KEY_PREFIX}'`);
    return;
  }

  await Promise.all(
    actionsCaches.map(async (cacheKey) => {
      const archivePath = getCacheRestorePath(vcpkgArchivePath, cacheKey);
      core.info(`Restoring '${cacheKey}' to '${archivePath}'`);

      const savedCacheKey = await cache.restoreCache([archivePath], cacheKey, undefined, undefined, true);
      if (!savedCacheKey) {
        core.warning(
          "Cache failed to restore (likely due to a version mismatch from using a different archive path). Deleting old entry"
        );

        await deleteCacheEntry(token, cacheKey);
      }
    })
  );
});
