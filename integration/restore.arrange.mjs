import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import * as cache from "@actions/cache";
import * as core from "@actions/core";

const folder = path.join(process.env.ARCHIVE_PATH, "00");
const file = path.join(folder, `${process.env.EXPECTED_RESTORED_ABI}.zip`);
const cacheKey = `${os.type()}-${process.env.EXPECTED_CACHE_KEY_PREFIX}${process.env.EXPECTED_RESTORED_ABI}`;

await fs.mkdir(folder, { recursive: true });
await fs.writeFile(file, "");

const cachePath = file.split(path.sep).join("/");
core.info(`Saving cache entry '${cacheKey}' using path '${cachePath}'`);

await cache.saveCache([cachePath], cacheKey, undefined, true);

await fs.rm(process.env.ARCHIVE_PATH, { recursive: true });
