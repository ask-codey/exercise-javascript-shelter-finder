// How far apart two places are, in miles, from their latitudes and longitudes.
// Ready to use: you don't need to change this file.
//
// The earth is round, so the distance between two points on it isn't a straight line on a flat map.
// This is the haversine formula, the usual way to work it out; you don't need to follow the math to use it.
//   milesBetween({ latitude: 39.7392, longitude: -104.9903 }, { latitude: 39.745, longitude: -104.948 })
//     ->  2.2828... (about 2.3 miles)

const EARTH_RADIUS_MILES = 3958.8;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function milesBetween(from, to) {
  const latitudeChange = toRadians(to.latitude - from.latitude);
  const longitudeChange = toRadians(to.longitude - from.longitude);
  const a = Math.sin(latitudeChange / 2) ** 2
    + Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(longitudeChange / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(a));
}
