import * as cache from "@actions/cache";
import * as core from "@actions/core";
import { getExistingCacheEntries } from "./helpers.js";

const token = core.getInput("token");
const vcpkgArchivePath = core.getInput("archive-path");

await core.group("Restoring vcpkg cache", async () => {
  const actionsCaches = await getExistingCacheEntries(token, vcpkgArchivePath);

  if (actionsCaches.length < 1) {
    core.info(`No cache entries found with prefix '${vcpkgArchivePath}'`);
    return;
  }

  await Promise.all(
    actionsCaches.map(async (cacheKey) => {
      core.info(`Restoring '${cacheKey}'`);

      await cache.restoreCache([cacheKey], cacheKey, undefined, undefined, true);
    })
  );
});
