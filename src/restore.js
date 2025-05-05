import cache from "@actions/cache";
import core from "@actions/core";
import * as path from "path";
import { CACHE_KEY_PREFIX, getCacheRestorePath, getExistingCacheEntries } from "./helpers.js";

const token = core.getInput("token");
const vcpkgArchivePath = path.join("/github/workspace", core.getInput("archive-path"));

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

      await cache.restoreCache([archivePath], cacheKey);
    })
  );
});
