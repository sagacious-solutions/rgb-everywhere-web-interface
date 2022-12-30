/**
 * Takes in a color, if its already an array, returns it. Otherwise assumes its a color
 * object from React-Color and converts it to an array.
 * @param {*} ObjectOrArray array or React-Color object
 * @returns A 3 integer array for RGB
 */
function getRgb(color) {
    if (Array.isArray(color)) {
        return color;
    }

    const r = color.rgb.r;
    const g = color.rgb.g;
    const b = color.rgb.b;
    return [r, g, b];
}

/**
 * A pattern could as an Array of Combinations of Color objects or [r,g,b] integer
 * arrays. This makes sure its all integers for Database consumption
 *
 * @param {Array} pattern An array of Arrays or Color objects from React-Color
 * @returns {Array} An array of 3 Integer Arrays representing RGB
 */
function patternToRgbArray(pattern) {
    let rgbArr = [];

    pattern.forEach((color) => {
        rgbArr.push(getRgb(color));
    });

    return rgbArr;
}

/**
 * Takes a color as an Array or Color object and returns the CSS color string
 * @param {*} color
 * @returns a CSS compatible color string
 */
function colorToCssRgb(color) {
    if (Array.isArray(color)) {
        return `rgb(${color[0]},${color[1]},${color[2]})`;
    }
    return `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`;
}

/**
 *
 * @param {*} value The drop down list label to be parsed
 * @returns The first part of the label which is the device name
 */
function getNameFromDropDownLabel(value) {
    if (value) {
        return value.split(" - ")[0];
    }
    return null;
}

export { getRgb, patternToRgbArray, colorToCssRgb, getNameFromDropDownLabel };
