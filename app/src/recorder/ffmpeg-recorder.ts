
import { join as joinPath } from "path";
import * as fs from "fs";

import * as tmp from "tmp";

import * as execa from "execa";

import  * as child  from "child_process";

const ffmpegPath = joinPath(__dirname, '..', '..', 'vendor', 'ffmpeg');

export class FFMpegRecorder {

    private _process: child.ChildProcess;
    private _folderPath: string
    private _outputPath: string

    public constructor() {

        this._folderPath = tmp.dirSync().name;
        if (!fs.existsSync(this._folderPath)) {
            fs.mkdirSync(this._folderPath);
        }

    }

    public startRecording(
        bounds: Electron.Rectangle,
        opts: any,
    ): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            let tempName = tmp.tmpNameSync({
                dir: this._folderPath
            });
            let outputFilePath = `${tempName}.mp4`;
            this._outputPath = outputFilePath;

            console.log(outputFilePath);
            
            let command = `${ffmpegPath} -f gdigrab -framerate 6 ` + 
                `-offset_x ${bounds.x.toString()} ` +
                `-offset_y ${bounds.y.toString()} ` +
                `-video_size ${bounds.width}x${bounds.height} ` +
                `-i desktop ${outputFilePath}`;

            console.log("record command => ", command.split(" "));

            this._process = child.exec(command, function (error, stdout) {

                console.log("exec callback => ", arguments);

            });

            console.log(this._process);

            this._process.stdout.on("error", (d) => {
                console.log("stdout error => ", d);
                reject();
            });
            this._process.stdout.on("end", code => {
                console.info("process exit");
            });

            this._process.stdout.on("message", code => {
                console.info("process message");
            });

            this._process.on("readable", () => {
                console.log("readable");
            });

            this._process.stdout.on("data", code => {
                console.info("process data");
                if (!code) {
                    resolve(outputFilePath);
                } else {
                    reject(code);
                }
            });

            resolve(outputFilePath);

        });

    }

    public stopRecording(): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            let end = () => {
                this._process.kill();
                this._process = null;
                this._outputPath = null;
            }

            try {
                this._process.stdin.write("q", (err) => {
                    if (err) {
                        console.error(err);
                        reject(err);

                        end();
                        return;
                    }

                    resolve(this._outputPath);
                    end();
                })
            } catch (err) {
                console.error(err);
                reject(err);

                end();
            }

        });

    }
    
}