

// https://github.com/jprichardson/is-electron-renderer/blob/master/index.js

export function isRenderer() {

    // running in a web browser
    if (typeof process === "undefined") {
        return true;
    }

    // node-integration is disabled
    if (!process) {
        return true;
    }

    // We're in node.js somehow
    if (!process.type) {
        return false;
    }

    return process.type === "renderer";

}

export function isMac() {

    return /^darwin/.test(process.platform);

}

export function isWindows() {

    return /^win/.test(process.platform);

}

export function blobToBuffer(blob): Promise<Buffer> {

    return new Promise((resolve, reject) => {

        try {

            var fileReader = new FileReader();

            var onLoadEnd = function () {
                fileReader.removeEventListener("loadend", onLoadEnd);

                var buffer = new Buffer(this.result, "binary");
                resolve(buffer);
            };

            fileReader.addEventListener("loadend", onLoadEnd, false);
            fileReader.readAsArrayBuffer(blob);

        } catch (error) {
            reject(error);
        }

    });

}
