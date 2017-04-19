
import { remote } from "electron";

const aperture: Aperture.Aperture = require('aperture')();

// TODO: create d.ts for Kap object
export function startRecording(
    bounds: Electron.Rectangle,
    display: Electron.Display,
    kap: any
): Promise<string> {

    if (display.id === remote.screen.getPrimaryDisplay().id) {
        // convert the coordinates to cartesian coordinates, which are used by CoreMedia
        bounds.y = screen.height - (bounds.y + bounds.height);
    } else {
        // if the cropper window is placed in a display that it's not the main one,
        // we need to do tome _special_ math to calculate its position
        const displayBounds = display.bounds;

        // when there are more than one display, the bounds that macOS returns for a display
        // that is not the main one are relative to the main display. consequently, the
        // bounds of windows in that display are relative to the main display.
        // we need to make those bounds relative to the display in which the cropper window
        // is placed in order to aperture to work properly
        bounds.x = Math.abs(displayBounds.x - bounds.x);
        bounds.y = Math.abs(displayBounds.y - bounds.y);

        // convert the coordinates to cartesian coordinates, which are used by CoreMedia
        bounds.y = displayBounds.height - (bounds.y + bounds.height);
    }

    // the dashed border is 1px wide
    bounds.x += 1;
    bounds.y += 1;
    bounds.width -= 2;
    bounds.height -= 2;

    // we need the most recent settings
    const {
      fps,
        showCursor,
        highlightClicks,
        recordAudio,
        audioInputDeviceId
    } = kap.settings.getAll();

    const apertureOpts: Aperture.ApertureStartRecordingOpts = {
        fps,
        cropArea: bounds,
        showCursor,
        highlightClicks,
        displayId: display.id
    };

    if (recordAudio === true) {
        apertureOpts.audioSourceId = audioInputDeviceId;
    }

    return aperture.startRecording(apertureOpts);

}

export function stopRecording(): Promise<string> {

    return aperture.stopRecording();

}
