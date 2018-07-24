/**
 * Find the distance between 2 points
 * @param {mousePoint} point1
 * @param {mousePoint} point2
 * @return {number}
 */
const distanceBetween = (point1, point2) => Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);

export default distanceBetween;