import * as cache from "@actions/cache";
import * as core from "@actions/core";
import * as path from "path";
import * as fs from "fs/promises";
import { CACHE_FOLDER, getCacheKey, getExistingCacheEntries, resolvedCacheFolder } from "./helpers.js";

const token = core.getInput("token", { required: true });
const vcpkgArchivePath = resolvedCacheFolder();

await core.group("Saving vcpkg cache", async () => {
  const actionsCaches = new Set(await getExistingCacheEntries(token));

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
        // Relative path to avoid mismatched cache versions across environments
        const archivePath = path.join(CACHE_FOLDER, subfolderPath, file.name);

        if (!file.isFile() && !file.name.endsWith(".zip")) {
          core.info(`Skipping '${archivePath}' as not a file with the '.zip' extension`);
          continue;
        }

        const cacheKey = getCacheKey(file.name);

        if (actionsCaches.has(cacheKey)) {
          core.info(`Skipping '${cacheKey}' as already present in cache`);
          continue;
        }

        core.info(`Saving '${archivePath}' as '${cacheKey}'`);

        await cache.saveCache([archivePath], cacheKey, undefined, true);
      }
    }
  } catch (error) {
    core.setFailed(error);
  }
});
