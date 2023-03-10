import path from 'path';

export const webpackConfig = {
    // ...
    resolve: {
        fallback: {
            "fs": false,
            "path": path.resolve("path-browserify"),
            "os": require.resolve("os-browserify/browser"),
        }
    },
    // ...
};
