import * as github from "@actions/github";
import * as core from "@actions/core";

export const getExistingCacheEntries = async (token, prefix) => {
  const octokit = github.getOctokit(token);

  try {
    const {
      data: { actions_caches: actionsCaches },
    } = await octokit.rest.actions.getActionsCacheList({
      ...github.context.repo,
      key: prefix,
      per_page: 100, // TODO: Handle pagination
    });

    return actionsCaches.map((c) => c.key);
  } catch (error) {
    core.setFailed(
      `Failed to fetch caches from the REST API. Please ensure you've granted the 'actions: read' permission to your workflow\n${error.message}`
    );
  }
};
