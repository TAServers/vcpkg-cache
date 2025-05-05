import {expect} from "@std/expect";
import {getCacheKey, getCacheRestorePath} from "../src/helpers.js";

Deno.test("getCacheRestorePath should return binary archive path", () => {
    const vcpkgArchivePath = "/foo/bar";
    const cacheKey = "vcpkg-0cf4d6a517d4d8a3014b4f7e3ff721677c12f9bf443ce894521db388d8f2506b";

    const path = getCacheRestorePath(vcpkgArchivePath, cacheKey);

    expect(path).toBe(`${vcpkgArchivePath}/0c/0cf4d6a517d4d8a3014b4f7e3ff721677c12f9bf443ce894521db388d8f2506b.zip`);
});

Deno.test("getCacheKey should return key for filename", () => {
    const filename = "0cf4d6a517d4d8a3014b4f7e3ff721677c12f9bf443ce894521db388d8f2506b.zip";

    const key = getCacheKey(filename);

    expect(key).toBe("vcpkg-0cf4d6a517d4d8a3014b4f7e3ff721677c12f9bf443ce894521db388d8f2506b");
});
