import * as cache from "@actions/cache";
import * as core from "@actions/core";
import * as path from "path";
import * as fs from "fs/promises";
import {
  getCacheKey,
  getCacheKeyPrefix,
  getCachePath,
  getExistingCacheEntries,
  resolvedCacheFolder,
  getCurrentBranchRef,
  getDefaultBranchRef,
} from "./helpers.js";

const token = core.getInput("token", { required: true });
const prefix = getCacheKeyPrefix();
const ref = getCurrentBranchRef();
const vcpkgArchivePath = resolvedCacheFolder();

await core.group("Saving vcpkg cache", async () => {
  const defaultBranchRef = await getDefaultBranchRef(token);
  const defaultActionsCaches = await getExistingCacheEntries(token, prefix, defaultBranchRef);
  core.info(`Found ${defaultActionsCaches.length} caches for default branch ref '${defaultBranchRef}'`);

  const refActionsCaches = await getExistingCacheEntries(token, prefix, ref);
  core.info(`Found ${refActionsCaches.length} caches for current branch ref '${ref}'`);
  
  const actionsCaches = new Set(defaultActionsCaches ?? []);

  if (refActionsCaches)
    actionsCaches.add(...refActionsCaches);

  try {
    const directories = await fs.readdir(vcpkgArchivePath, { withFileTypes: true });
    for (const directory of directories) {
      if (!directory.isDirectory()) {
        core.warning(`Ignoring file '${directory.name}' in top level of vcpkg archive`);
        continue;
      }

      const subfolderPath = path.join(vcpkgArchivePath, directory.name);
      const files = await fs.readdir(subfolderPath, { withFileTypes: true });
      for (const file of files) {
        if (!file.isFile() && !file.name.endsWith(".zip")) {
          core.info(`Skipping '${path.join(subfolderPath, file.name)}' as not a file with the '.zip' extension`);
          continue;
        }

        const cacheKey = getCacheKey(file.name, prefix);
        const cacheSavePath = getCachePath(cacheKey, prefix);

        if (actionsCaches.has(cacheKey)) {
          core.info(`Skipping '${cacheKey}' as already present in cache`);
          continue;
        }

        core.info(`Saving '${cacheSavePath}' as '${cacheKey}'`);

        await cache.saveCache([cacheSavePath], cacheKey, undefined, true);
      }
    }
  } catch (error) {
    core.setFailed(error);
  }
});
