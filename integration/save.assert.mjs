import * as github from "@actions/github";
import * as core from "@actions/core";

const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

const {
  data: { actions_caches: cacheEntries },
} = await octokit.rest.actions.getActionsCacheList({
  ...github.context.repo,
  key: process.env.EXPECTED_CACHE_KEY_PREFIX,
});

const expectedCacheEntries = [
  `${process.env.EXPECTED_CACHE_KEY_PREFIX}${process.env.EXPECTED_SAVED_ABI_1}`,
  `${process.env.EXPECTED_CACHE_KEY_PREFIX}${process.env.EXPECTED_SAVED_ABI_2}`,
  `${process.env.EXPECTED_CACHE_KEY_PREFIX}${process.env.EXPECTED_SAVED_ABI_3}`,
];
const actualCacheEntries = new Set(cacheEntries.map((c) => c.key));

const missingCacheEntries = expectedCacheEntries.filter((entry) => !actualCacheEntries.has(entry));
if (missingCacheEntries.length > 0) {
  core.setFailed(`The following cache entries were missing: ${Array.from(missingCacheEntries).join(", ")}`);
}
