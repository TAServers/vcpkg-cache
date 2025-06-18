import * as github from "@actions/github";
import * as core from "@actions/core";

const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

const {
  data: { actions_caches: cacheEntries },
} = await octokit.rest.actions.getActionsCacheList({
  ...github.context.repo,
  key: process.env.EXPECTED_CACHE_KEY_PREFIX,
});

core.info(`Found ${cacheEntries.length} matching prefix '${process.env.EXPECTED_CACHE_KEY_PREFIX}'`);

for (const cacheEntry of cacheEntries) {
  try {
    await octokit.rest.actions.deleteActionsCacheByKey({
      ...github.context.repo,
      key: cacheEntry.key,
    });
    core.info(`Cleaned up cache entry '${cacheEntry.key}'`);
  } catch (error) {
    core.error(`Failed to clean up cache entry '${cacheEntry.key}': ${error.message}`);
  }
}
