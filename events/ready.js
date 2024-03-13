const { Events } = require('discord.js');
const fs = require('fs');
const moment = require('moment');
module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        // Run the command every minute
        setInterval(updateSchedule, 60000);

        async function updateSchedule() {
            // Read events from file
            let za = "";
            let events = [];
            let edited = false;
            try {
                events = JSON.parse(fs.readFileSync('schedule.json'));
            } catch (err) {
                return;
            } 

            const channel = client.channels.cache.get('1028709539744321637');

            // Load events in array
            let i = 0;
            events.forEach(event => {
                const name = event.name;
                const dateTime = moment(event.dateTime, moment.ISO_8601);
                const user = event.user;
                if(moment() >= dateTime){
                    channel.send('<@' + user + '> ' + name + ' Happening now!');
                    events.splice(i,1);
                    edited = true;
                }
                i++;
            });

            if(edited == true) {
                // Sort events by date
                events.sort((a, b) => moment(a.dateTime) - moment(b.dateTime));

                // Write events back to file
                fs.writeFileSync('schedule.json', JSON.stringify(events, null, 2));
            }

        }

    },
};
