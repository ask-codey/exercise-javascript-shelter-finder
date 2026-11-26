// Tests for finder.js, and for taking jQuery off the page. Run them with: node --test
// They never ask for a real location or load Google Charts: each test hands your function a fake
// geolocation or a fake google object, small stand-ins that answer the way the real ones would, so the
// tests run the same on any computer, with or without the internet.
// You don't need to change this file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { currentPosition, nearestShelter, chartRows, loadCharts, drawAdoptionChart } from './finder.js';
import { shelters } from './shelters.js';

// A fake geolocation. Its getCurrentPosition remembers the options it was given, then answers a moment
// later, the way a browser does: answer(success, error) decides which callback it calls.
function fakeGeolocation(answer) {
  const geolocation = {
    options: undefined,
    getCurrentPosition(success, error, options) {
      geolocation.options = options;
      setTimeout(() => answer(success, error), 5);
    },
  };
  return geolocation;
}

// An error shaped like the browser's, with its code and the names for the three codes.
function locationError(code) {
  return { code, message: "The browser's own wording", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 };
}

const here = { coords: { latitude: 39.7392, longitude: -104.9903, accuracy: 35 }, timestamp: 1764079200000 };

test('currentPosition: an allowed request resolves with { latitude, longitude }', async () => {
  const geolocation = fakeGeolocation((success) => success(here));
  assert.deepEqual(await currentPosition(geolocation), { latitude: 39.7392, longitude: -104.9903 },
    'Resolve with the two numbers from position.coords, and nothing else.');
});

test('currentPosition: hands on its options, { timeout: 10000 } when none are given', async () => {
  const geolocation = fakeGeolocation((success) => success(here));
  await currentPosition(geolocation);
  assert.deepEqual(geolocation.options, { timeout: 10000 },
    'Pass the options to getCurrentPosition as its third argument.');
  const custom = fakeGeolocation((success) => success(here));
  await currentPosition(custom, { timeout: 5000 });
  assert.deepEqual(custom.options, { timeout: 5000 });
});

test('currentPosition: a "no" (error code 1) rejects with the kind message', async () => {
  const geolocation = fakeGeolocation((success, error) => error(locationError(1)));
  await assert.rejects(currentPosition(geolocation),
    { message: 'No problem: pick your nearest shelter from the list.' });
});

test("currentPosition: a device that can't tell (error code 2) rejects with its message", async () => {
  const geolocation = fakeGeolocation((success, error) => error(locationError(2)));
  await assert.rejects(currentPosition(geolocation),
    { message: "We couldn't tell where you are. Pick your nearest shelter from the list." });
});

test('currentPosition: a timeout (error code 3) rejects with its message', async () => {
  const geolocation = fakeGeolocation((success, error) => error(locationError(3)));
  await assert.rejects(currentPosition(geolocation),
    { message: 'Finding your location took too long. Try again, or pick your nearest shelter from the list.' });
});

test('currentPosition: a browser with no Geolocation API (null) rejects at once', async () => {
  await assert.rejects(currentPosition(null),
    { message: "This browser can't share its location. Pick your nearest shelter from the list." });
});

test('nearestShelter: at 39.7392, -104.9903, Eastside Adoption Center is 2.3 miles away', () => {
  assert.deepEqual(nearestShelter({ latitude: 39.7392, longitude: -104.9903 }, shelters),
    { name: 'Eastside Adoption Center', miles: 2.3 },
    'Find the closest shelter with milesBetween, and round its miles to one decimal place.');
});

test('nearestShelter: at 39.82, -104.97, Northgate Pet Rescue is 0.9 miles away', () => {
  assert.deepEqual(nearestShelter({ latitude: 39.82, longitude: -104.97 }, shelters),
    { name: 'Northgate Pet Rescue', miles: 0.9 });
});

test('nearestShelter: with no shelters, null', () => {
  assert.equal(nearestShelter({ latitude: 39.7392, longitude: -104.9903 }, []), null);
});

test('chartRows: the header row, then one row per month', () => {
  assert.deepEqual(chartRows([{ month: 'Jan', dogs: 7, cats: 5 }, { month: 'Feb', dogs: 5, cats: 4 }]),
    [['Month', 'Dogs', 'Cats'], ['Jan', 7, 5], ['Feb', 5, 4]],
    'The first row is the column labels; each month is [month, dogs, cats], numbers kept as numbers.');
});

test('chartRows: no months gives the header row only', () => {
  assert.deepEqual(chartRows([]), [['Month', 'Dogs', 'Cats']]);
});

test("loadCharts: loads 'corechart', and resolves only once setOnLoadCallback's function runs", async () => {
  const calls = [];
  let whenLoaded;
  const google = {
    charts: {
      load: (version, settings) => calls.push(['load', version, settings]),
      setOnLoadCallback: (callback) => {
        calls.push(['setOnLoadCallback']);
        whenLoaded = callback;
      },
    },
  };
  let resolved = false;
  const loading = loadCharts(google).then(() => { resolved = true; });
  assert.deepEqual(calls, [['load', 'current', { packages: ['corechart'] }], ['setOnLoadCallback']],
    "Call google.charts.load('current', { packages: ['corechart'] }), then google.charts.setOnLoadCallback.");
  await new Promise((wait) => setTimeout(wait, 5));
  assert.equal(resolved, false, "Don't resolve before the chart code has loaded.");
  whenLoaded();
  await loading;
  assert.equal(resolved, true, 'Resolve when the function handed to setOnLoadCallback runs.');
});

test('drawAdoptionChart: a ColumnChart in the element, drawn from chartRows with the title and the legend', () => {
  const asked = [];
  const google = {
    visualization: {
      arrayToDataTable: (rows) => {
        asked.push(['table', rows]);
        return { rows };
      },
      ColumnChart: function (element) {
        asked.push(['ColumnChart', element.id]);
        this.draw = (data, options) => asked.push(['draw', data.rows, options]);
      },
    },
  };
  const element = { id: 'adoptions-chart' };
  const months = [{ month: 'Mar', dogs: 9, cats: 6 }];
  drawAdoptionChart(google, element, months);
  const rows = [['Month', 'Dogs', 'Cats'], ['Mar', 9, 6]];
  assert.deepEqual(asked, [
    ['table', rows],
    ['ColumnChart', 'adoptions-chart'],
    ['draw', rows, { title: 'Adoptions by month', legend: { position: 'bottom' } }],
  ], 'Build the DataTable, make a ColumnChart in the element, then draw it with the options.');
});

test("index.html no longer loads jQuery", async () => {
  const page = await readFile(new URL('./index.html', import.meta.url), 'utf8');
  assert.ok(!/jquery/i.test(page), "Take jQuery's <script> tag out of index.html once app.js doesn't use $.");
});

test('app.js no longer uses jQuery', async () => {
  const code = await readFile(new URL('./app.js', import.meta.url), 'utf8');
  assert.ok(!/\$\(|\$\.|jQuery/.test(code),
    'Rewrite the opening-hours button with querySelector, addEventListener, textContent and classList, with no $( or $. left.');
});
