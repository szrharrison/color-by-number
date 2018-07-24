/**
 * Find the angle between 2 points (in radians)
 * @param {mousePoint} point1
 * @param {mousePoint} point2
 * @return {number}
 */
const angleBetween = (point1, point2) => Math.atan2(point2.x - point1.x, point2.y - point1.y);

export default angleBetween;