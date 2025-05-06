import * as fs from "node:fs/promises";
import * as path from "node:path";

const folder1 = path.join(process.env.ARCHIVE_PATH, "01");
const folder2 = path.join(process.env.ARCHIVE_PATH, "0b");

const file1 = path.join(folder1, `${process.env.EXPECTED_SAVED_ABI_1}.zip`);
const file2 = path.join(folder1, `${process.env.EXPECTED_SAVED_ABI_2}.zip`);
const file3 = path.join(folder2, `${process.env.EXPECTED_SAVED_ABI_3}.zip`);

await fs.mkdir(folder1, { recursive: true });
await fs.mkdir(folder2, { recursive: true });

await fs.writeFile(file1, "");
await fs.writeFile(file2, "");
await fs.writeFile(file3, "");
