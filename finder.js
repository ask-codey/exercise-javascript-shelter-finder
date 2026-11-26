// The Shelter Finder's working parts: the visitor's location, the nearest shelter, and the adoptions chart.
// These functions don't touch the page, so the tests can check them without a browser.
// For you to finish.
//
// Requirements:
//
// - currentPosition(geolocation = navigator.geolocation, options = { timeout: 10000 }) wraps the Geolocation
//   API's getCurrentPosition in a promise, so the page can await it. It calls
//   geolocation.getCurrentPosition(success, error, options), handing on the options it was given.
//   On success, the promise resolves with just the two numbers: { latitude, longitude }, from position.coords.
//     currentPosition()  ->  { latitude: 39.7392, longitude: -104.9903 } (wherever the visitor is)
//   On an error, it rejects with an Error whose message is one of these, word for word, chosen by error.code
//   (compare it with error.PERMISSION_DENIED, error.POSITION_UNAVAILABLE and error.TIMEOUT):
//     1, PERMISSION_DENIED:     No problem: pick your nearest shelter from the list.
//     2, POSITION_UNAVAILABLE:  We couldn't tell where you are. Pick your nearest shelter from the list.
//     3, TIMEOUT:               Finding your location took too long. Try again, or pick your nearest shelter from the list.
//   When geolocation is null (a browser with no Geolocation API), it rejects at once, without asking, with:
//     This browser can't share its location. Pick your nearest shelter from the list.
//   The page calls it with no arguments, so geolocation is the browser's own; the tests hand in a fake one.
//
// - nearestShelter(position, shelters) takes a position, { latitude, longitude }, and the list of shelters
//   (each with a name, a latitude and a longitude), and returns the closest one as { name, miles }: its name,
//   and how far it is in miles, rounded to one decimal place. Use milesBetween from distance.js for the distance.
//   With no shelters at all, it returns null.
//     nearestShelter({ latitude: 39.7392, longitude: -104.9903 }, shelters)
//       ->  { name: 'Eastside Adoption Center', miles: 2.3 }
//     nearestShelter({ latitude: 39.7392, longitude: -104.9903 }, [])  ->  null
//
// - chartRows(adoptions) turns the months' adoptions, [{ month, dogs, cats }, ...], into the array of arrays
//   that google.visualization.arrayToDataTable takes: the header row ['Month', 'Dogs', 'Cats'], then one row
//   per month, in the same order.
//     chartRows([{ month: 'Jan', dogs: 7, cats: 5 }, { month: 'Feb', dogs: 5, cats: 4 }])
//       ->  [['Month', 'Dogs', 'Cats'], ['Jan', 7, 5], ['Feb', 5, 4]]
//     chartRows([])  ->  [['Month', 'Dogs', 'Cats']]
//
// - loadCharts(google) loads Google Charts' core charts and returns a promise that resolves once they have
//   loaded. It calls google.charts.load('current', { packages: ['corechart'] }), then
//   google.charts.setOnLoadCallback with a function that resolves the promise. The page hands it the real
//   google object, which the loader script makes; the tests hand in a fake one.
//
// - drawAdoptionChart(google, element, adoptions) draws the adoptions as a column chart in element: it builds a
//   DataTable with google.visualization.arrayToDataTable(chartRows(adoptions)), makes a
//   google.visualization.ColumnChart in element, and calls its draw with that DataTable and the options
//   { title: 'Adoptions by month', legend: { position: 'bottom' } }. It returns the chart.

import { milesBetween } from './distance.js';

export function currentPosition(geolocation = navigator.geolocation, options = { timeout: 10000 }) {
  return Promise.resolve({ latitude: 0, longitude: 0 });
}

export function nearestShelter(position, shelters) {
  return { name: '', miles: 0 };
}

export function chartRows(adoptions) {
  return [];
}

export function loadCharts(google) {
  return Promise.resolve();
}

export function drawAdoptionChart(google, element, adoptions) {
  return null;
}
