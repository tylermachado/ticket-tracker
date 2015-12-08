A Node.js app for scraping Seatgeek's ticket listings for sporting events -- the end goal is to create a dataset tracking the average price of tickets for a given game each day until the event itself.

# Instructions

1. In the console, run `npm install` to install the Node dependencies.

2. Open `script.js` and in options.url, replace "TEAM-HERE" with the name of the team for which you'd like to search the database for tickets, formatted in lowercase and with hyphens replacing spaces, e.g. `boston-celtics` or `new-york-yankees` or `los-angeles-kings`. Save the file when you're done.

3. Return to the console and run `node script.js`.

4. Check `output.json` to see if you've got the beginnings of your data file! Set up a cron job to run `node script.js` every day at the same to build your dataset.