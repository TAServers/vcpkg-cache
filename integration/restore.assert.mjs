import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as core from "@actions/core";

const actualPath = process.env.ACTUAL_PATH;
const expectedPath = path.resolve(process.env.ARCHIVE_PATH);

if (actualPath !== expectedPath) {
  core.setFailed(`Action's path output '${actualPath}' did not match expected path '${expectedPath}'`);
  return;
}

const file = path.join(process.env.ARCHIVE_PATH, "00", `${process.env.EXPECTED_RESTORED_ABI}.zip`);

try {
  const info = await fs.stat(file);

  if (!info.isFile()) {
    core.setFailed(`Cache was restored but output is not a file: ${info.toString()}`);
  }
} catch (error) {
  core.setFailed(`Failed to stat file: ${error.message}`);
}
