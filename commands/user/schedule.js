const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment');

function addEvent(name, date, time, user) {
    // Read existing events
    let events = [];
    try {
        events = JSON.parse(fs.readFileSync('schedule.json'));
    } catch (err) {
        // File doesn't exist or is empty
    }
    const dateTime = moment(date + " " + time, moment.ISO_8601);
    // Add new event
    events.push({ name: name, dateTime: dateTime, user: user });
    // Sort events by date
    events.sort((a, b) => moment(a.dateTime) - moment(b.dateTime));

    // Write events back to file
    fs.writeFileSync('schedule.json', JSON.stringify(events, null, 2));
}

// Function to read the schedule in date order
function readSchedule() {
    // Read events from file
    let za = "";
    let events = [];
    try {
        events = JSON.parse(fs.readFileSync('schedule.json'));
    } catch (err) {
        return "No events found.";
    } 


    // Print events
    za += "Schedule: \n"
    let i = 1;
    events.forEach(event => {
        const date = moment(event.dateTime).format('MM/DD/YY');
        const time = moment(event.dateTime).format('hh:mm');
        za += i + ". " + event.name + "  " + date + ", Time: " + time + "\n";
        i++;
    });
    return za;
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('Leave input fields blank to view schedule only.')
    .addStringOption(option => option.setName('name').setDescription('Name of Event'))
    .addStringOption(option => option.setName('date').setDescription('Date of Event (MM/DD/YYYY)'))
    .addStringOption(option => option.setName('time').setDescription('Time of Event (hh:mm)')),


    async execute(interaction) {
        const name = interaction.options.getString('name');
        const dateInput = interaction.options.getString('date');
        const timeInput = interaction.options.getString('time');

        const user = interaction.user.id;

        if(!(name == null || dateInput == null || timeInput == null)) {
            // Parse date and time input using moment.js
            const date = moment(dateInput, 'MM/DD/YYYY').format('YYYY-MM-DD');
            const time = moment(timeInput, 'hh:mm').format('hh:mm:ss');

            // Add event
            addEvent(name, date, time, user);
        }
        await interaction.reply(readSchedule());

    }
};
