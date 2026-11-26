// Connects the Visit Us page to the functions in finder.js.
// The three TODOs are for you to finish: the checklist in README.md says what the page should do.
import { currentPosition, nearestShelter, loadCharts, drawAdoptionChart } from './finder.js';
import { shelters, adoptions } from './shelters.js';

const findButton = document.querySelector('#find-me');
const findMessage = document.querySelector('#find-message');
const shelterList = document.querySelector('#shelter-list');
const chartMessage = document.querySelector('#chart-message');
const chartElement = document.querySelector('#adoptions-chart');
const hoursToggle = document.querySelector('#hours-toggle');
const hours = document.querySelector('#hours');

// TODO 1: Find my nearest shelter.
// When findButton is clicked:
//   - disable the button, and set findMessage to:
//       Your browser will ask to share your location, to find the shelter nearest you.
//   - await currentPosition(), then find nearestShelter(position, shelters), and set findMessage to, for example:
//       Your nearest shelter is Eastside Adoption Center, 2.3 miles away.
//   - if currentPosition rejects, set findMessage to the error's message, and show shelterList (hidden = false);
//   - either way, enable the button again.


// TODO 2: The adoptions chart.
// Write an async function, showChart, and call it once, here:
//   - when the loader script couldn't load (no internet), there's no global named google, so
//     typeof google is 'undefined': set chartMessage to
//       The chart couldn't load, so here are the numbers in a table.
//     and stop there;
//   - otherwise, await loadCharts(google), then drawAdoptionChart(google, chartElement, adoptions),
//     then empty chartMessage.


// TODO 3: The opening-hours button, still written the older way. Rewrite it in today's JavaScript, with
// hoursToggle and hours (found above), addEventListener, textContent, classList and setAttribute, so it
// works exactly as it does now. Then take the first <script> tag, jQuery's, out of index.html.
let hoursOpen = false;

$('#hours-toggle').on('click', function () {
  hoursOpen = !hoursOpen;
  $('#hours').toggleClass('hidden');
  $(this).text(hoursOpen ? 'Hide opening hours' : 'Show opening hours');
  $(this).attr('aria-expanded', String(hoursOpen));
});
