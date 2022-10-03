"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsrpcConf = {
    // Generate ServiceProto
    proto: [
        {
            ptlDir: "src/shared/protocols",
            output: "src/shared/protocols/serviceProto.ts",
            apiDir: "src/api", // API dir
        },
    ],
    // Sync shared code
    sync: [
        {
            from: "src/shared",
            to: "../frontend/src/shared",
            type: "symlink", // Change this to 'copy' if your environment not support symlink
        },
    ],
    // Dev server
    dev: {
        autoProto: true,
        autoSync: true,
        autoApi: true,
        watch: "src/api",
        entry: "src/index.ts", // Dev server command: node -r ts-node/register {entry}
    },
    // Build config
    build: {
        autoProto: true,
        autoSync: true,
        autoApi: true,
        outDir: "dist", // Clean this dir before build
    },
};
exports.default = tsrpcConf;
