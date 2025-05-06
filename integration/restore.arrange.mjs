import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as cache from "@actions/cache";

const folder = path.join(process.env.ARCHIVE_PATH, "00");
const file = path.join(folder, `${process.env.EXPECTED_RESTORED_ABI}.zip`);
const cacheKey = `${process.env.EXPECTED_CACHE_KEY_PREFIX}${process.env.EXPECTED_RESTORED_ABI}`;

await fs.mkdir(folder, { recursive: true });
await fs.writeFile(file, "");

await cache.saveCache([file.split(path.sep).join("/")], cacheKey, undefined, true);

await fs.rm(process.env.ARCHIVE_PATH, { recursive: true });
