# Exercise: Shelter Finder

Exercise code for the lesson **Exercise: Shelter Finder** in the JavaScript in Depth course on [ask-codey.com](https://www.ask-codey.com).

Riverbend Animal Shelter has three branches, and its **Visit Us** page should help people find the closest one, show donors how adoptions grew this year, and stop loading jQuery. The page is built. You'll write the functions that do the work in `finder.js`: the visitor's location, wrapped in a promise; the nearest shelter; the rows for a chart; and loading and drawing the chart with Google Charts. Then you'll connect them to the page in `app.js`, and rewrite the page's last bit of jQuery in today's JavaScript. Tests check `finder.js` without a real location or the internet, and a checklist covers the page.

## What's here

- `index.html` and `styles.css`: the page and its look. Ready to use, apart from one line you'll delete in step 3.
- `shelters.js`: the three shelters, with their latitudes and longitudes, and the adoptions for January to June. Ready to use.
- `distance.js`: `milesBetween(from, to)`, which works out how many miles apart two places are. Ready to use.
- `finder.js`: five functions, with no page involved. For you to finish.
- `app.js`: connects the page to `finder.js`. Three TODOs are for you to finish.
- `finder.test.js`: the tests. You don't need to change this file.
- `package.json`: tells Node.js that this folder's files are modules, and how to run the tests. Ready to use.

The requirements are in the comment at the top of `finder.js`, and beside each TODO in `app.js`, with examples.

## What to do

Open the folder in VS Code, then open its terminal with **Terminal > New Terminal**.

1. Finish `finder.js`, running the tests as you go.
2. Finish TODO 1 and TODO 2 in `app.js`.
3. Finish TODO 3: rewrite the opening-hours button without jQuery, then delete the `<script>` tag that loads `jquery-3.7.1.min.js` from `index.html`.
4. Open the page with Live Preview (right-click `index.html` and choose **Show Preview**, or **Live Preview: Show Preview (External Browser)** from the Command Palette to use the browser's DevTools), and go through the checklist below. Live Preview serves the page from `127.0.0.1`, your own computer, which the browser counts as a secure page, so it can ask for your location. A page opened straight from its file (an address starting `file://`) can't load modules.
5. Stretch goal: when the nearest shelter is found, show the list too, with the nearest one in bold.

## Check your work

```bash
node --test
```

At first every test fails: that is expected. Each function you finish turns its tests green, and the last two turn green once jQuery is gone from `app.js` and `index.html`. The tests never ask for a real location: they hand `currentPosition` a fake geolocation that answers the way a browser would (a position, a "no", a timeout), and they hand `loadCharts` and `drawAdoptionChart` a fake `google` object that notes what your code asks for. A failing test's message says what it expected, for example *Pass the options to getCurrentPosition as its third argument.*

## Checklist for the page

Use the browser's DevTools to pretend to be somewhere: open DevTools, press **Ctrl+Shift+P** (**Cmd+Shift+P** on a Mac), type `sensors` and choose **Show Sensors**. In its **Location** section, set a custom location of latitude `39.7392` and longitude `-104.9903`.

- [ ] When the page opens, it says *Loading the chart...* for a moment, then a column chart titled *Adoptions by month* appears, with a column for dogs and one for cats in each month from January to June, and a legend at the bottom.
- [ ] Click **Find my nearest shelter**. The browser asks to share your location, and the page says *Your browser will ask to share your location, to find the shelter nearest you.* The button is grayed out while it waits.
- [ ] Click **Allow**: the page says *Your nearest shelter is Eastside Adoption Center, 2.3 miles away.* and the button works again.
- [ ] Change the location in Sensors to latitude `39.82`, longitude `-104.97`, and click the button again: *Your nearest shelter is Northgate Pet Rescue, 0.9 miles away.*
- [ ] Block the location: click the icon at the left of the address bar, set **Location** to **Block**, and reload. Click the button: the page says *No problem: pick your nearest shelter from the list.* and the list of three shelters appears. Set **Location** back to **Ask** or **Allow** when you're done.
- [ ] In Sensors, choose **Location unavailable** and click the button: *We couldn't tell where you are. Pick your nearest shelter from the list.*
- [ ] Click **Show opening hours**: the hours appear and the button says **Hide opening hours**. Click it again: they're hidden and it says **Show opening hours**. Right-click the button and choose **Inspect**: its `aria-expanded` is `true` while the hours show and `false` while they're hidden.
- [ ] In DevTools' **Network** tab, no file named `jquery-3.7.1.min.js` is loaded when you reload the page.
- [ ] In the **Network** tab, change **No throttling** to **Offline** and reload: the chart can't load, the page says *The chart couldn't load, so here are the numbers in a table.*, and the table of numbers is still there. Set it back to **No throttling**.
- [ ] The Console shows no errors, apart from the ones you caused on purpose while offline.

## Tips

- `currentPosition` is the promise wrapper from *Where Am I? Geolocation*: `new Promise((resolve, reject) => ...)`, with `getCurrentPosition` called inside. Its success callback resolves with the two numbers; its error callback rejects with `new Error(message)`.
- Check for a missing `geolocation` first, and `return` after rejecting, so `getCurrentPosition` is never called on `null`.
- In `nearestShelter`, keep the closest so far in a variable and compare each shelter's `milesBetween(position, shelter)` with it. Round once, at the end: `Math.round(miles * 10) / 10` keeps one decimal place.
- `chartRows` is a `map` and a header row, as in *Charts from Your Data with a Library*.
- In `loadCharts`, the function you hand `setOnLoadCallback` can be the promise's own `resolve`.
- For TODO 3, read the jQuery line by line with the table in *Reading jQuery Code*: `.on('click', ...)` is `addEventListener`, `.toggleClass` is `classList.toggle`, `.text(...)` sets `textContent`, `.attr(...)` is `setAttribute`, and `$(this)` is the button.

## Hand it in

When it works, put your solution in a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. You don't need Git: create the repo on GitHub, choose **Add file**, then **Upload files**, and upload everything in this folder. The lesson page shows each step, and the lesson *Put Your Code on GitHub* walks through every screen.
