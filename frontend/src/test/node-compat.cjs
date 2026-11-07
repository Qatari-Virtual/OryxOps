// Compatibility shim for Node.js runtimes < 22.15.0
// Node 22.15.0+ introduces zlib.createZstdDecompress natively.
// Undici (used by jsdom) calls .bind on zlib.createZstdDecompress at module initialization.
const zlib = require("node:zlib");

if (typeof zlib.createZstdDecompress !== "function") {
  zlib.createZstdDecompress = function createZstdDecompressShim() {
    throw new Error("zstd decompression stream requires Node.js >= 22.15.0");
  };
}
