
declare namespace Aperture {

    export interface Aperture {
        startRecording(options: ApertureStartRecordingOpts): Promise<string>;
        stopRecording(): Promise<string>;
    }

    export interface ApertureStartRecordingOpts {
        fps: number;
        cropArea: Electron.Rectangle;
        showCursor: boolean;
        highlightClicks: boolean;
        audioSourceId?: string | number;
        displayId: string | number;
    }

}
