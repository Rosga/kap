
import * as path from "path";
import * as fs from "fs";

import { blobToBuffer } from "../common/utils";

import { desktopCapturer } from "electron";

const RecordRTC = require("recordrtc");

export class Recorder {

    private _recordRTC;

    public constructor() {
        this.handleStream = this.handleStream.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    public startRecording(): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            desktopCapturer.getSources({types: ['window']}, (error, sources) => {

                if (error) {
                    console.error(error);
                    reject(error);
                    return;
                }

                console.log(sources);

                (<any>navigator).webkitGetUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: sources[0].id,
                            minWidth: 1280,
                            maxWidth: 1280,
                            minHeight: 720,
                            maxHeight: 720
                        }
                    }
                }, (stream) => {
                    this.handleStream(stream);
                    resolve("");
                }, this.handleError);

            });

        });


    }

    public stopRecording(): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            this._recordRTC.stopRecording((gifURL) => {

                var blob = this._recordRTC.getBlob();
                blobToBuffer(blob).then((buf) => {
                    console.log("buf => ", buf);

                    var filePath = path.join(__dirname, "test.webm");
                    console.log("filePath => ", filePath);

                    try {
                        fs.writeFileSync(filePath, buf);
                        resolve(filePath);
                    } catch (error) {
                        console.error("cannot write file => ", error);
                        reject(error);
                    }


                }).catch(function (err) {
                    reject(err);
                });

            });

        });


    }

    private handleStream(stream: MediaStream) {

        var options = {
            type: 'video',
            videoBitsPerSecond: 100,
            frameInterval: 5,
            video: {
                width: Math.round(1366 * 0.8),
                height: Math.round(768 * 0.8)
            },
            canvas: {
                width: Math.round(1366 * 0.8),
                height: Math.round(768 * 0.8)
            }
        };
        this._recordRTC = RecordRTC(stream, options);
        this._recordRTC.startRecording();

    }

    private handleError() {

    }


}
