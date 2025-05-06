import * as cache from "@actions/cache";
import * as core from "@actions/core";
import * as path from "path";
import * as fs from "fs/promises";
import { getExistingCacheEntries, normalisePath } from "./helpers.js";

const token = core.getInput("token", { required: true });
const vcpkgArchivePath = normalisePath(core.getInput("archive-path", { required: true }));

await core.group("Saving vcpkg cache", async () => {
  const actionsCaches = new Set(await getExistingCacheEntries(token, vcpkgArchivePath));

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
        const archivePath = normalisePath(path.join(vcpkgArchivePath, directory.name, file.name));
        path.nor;

        if (!file.isFile() && !file.name.endsWith(".zip")) {
          core.info(`Skipping '${archivePath}' as not a file with the '.zip' extension`);
          continue;
        }

        if (actionsCaches.has(archivePath)) {
          core.info(`Skipping '${archivePath}' as already present in cache`);
          continue;
        }

        core.info(`Saving '${archivePath}'`);

        await cache.saveCache([archivePath], archivePath, undefined, true);
      }
    }
  } catch (error) {
    core.setFailed(error);
  }
});
