import { expect, test } from "vitest";
import { getCacheKey, getCachePath } from "../src/helpers";

test("getCachePath should return binary archive path", () => {
  const cacheKey = "vcpkg/0cf4d6a517d4d8a3014b4f7e3ff721677c12f9bf443ce894521db388d8f2506b";

  const path = getCachePath(cacheKey);

  expect(path).toBe(".vcpkg-cache/0c/0cf4d6a517d4d8a3014b4f7e3ff721677c12f9bf443ce894521db388d8f2506b.zip");
});

test("getCacheKey should return key for filename", () => {
  const filename = "0cf4d6a517d4d8a3014b4f7e3ff721677c12f9bf443ce894521db388d8f2506b.zip";

  const key = getCacheKey(filename);

  expect(key).toBe("vcpkg/0cf4d6a517d4d8a3014b4f7e3ff721677c12f9bf443ce894521db388d8f2506b");
});
