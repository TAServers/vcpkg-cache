import { expect, test, vi } from "vitest";
import { getCacheKey, getCacheRestorePath } from "../src/helpers";
import { resolve } from "path";

vi.mock("path", async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    resolve: vi.fn().mockReturnValue("/foo/bar"),
  };
});

test("getCacheRestorePath should return binary archive path", () => {
  const cacheKey = "vcpkg/0cf4d6a517d4d8a3014b4f7e3ff721677c12f9bf443ce894521db388d8f2506b";

  const path = getCacheRestorePath(cacheKey);

  expect(path).toBe("/foo/bar/0c/0cf4d6a517d4d8a3014b4f7e3ff721677c12f9bf443ce894521db388d8f2506b.zip");
  expect(resolve).toHaveBeenCalledWith(".vcpkg-cache");
});

test("getCacheKey should return key for filename", () => {
  const filename = "0cf4d6a517d4d8a3014b4f7e3ff721677c12f9bf443ce894521db388d8f2506b.zip";

  const key = getCacheKey(filename);

  expect(key).toBe("vcpkg/0cf4d6a517d4d8a3014b4f7e3ff721677c12f9bf443ce894521db388d8f2506b");
});
