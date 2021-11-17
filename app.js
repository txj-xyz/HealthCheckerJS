const { Webhook, MessageBuilder } = require('discord-webhook-node');
const axios = require('axios');
const { webhookUrl, healthUrl, timeout, interval, errorMessage } = process.env;
const envObject = {
    webhookUrl: webhookUrl,
    healthUrl: healthUrl,
    timeout: timeout,
    interval: interval,
    errorMessage: errorMessage
};

if(!webhookUrl || !healthUrl || !timeout || !interval || !errorMessage) throw new Error('No ENV Values set');

console.log('ENV SETTINGS: ', JSON.stringify(envObject, null, 2))


// When the script intially runs we need to fire off the Check event to alert immediately upon deployment.
const webhookClient = new Webhook(webhookUrl);
axios.get(healthUrl, { timeout: Number(timeout) * 1000 })
.then(res => {
    console.log(`Status Code ${res.status} OK`)
    const initialEmbed = new MessageBuilder()
    .setTitle("Lavalink Server is ONLINE.")
    .setURL("https://statuspage.freshping.io/58439-txbroxannebot")
    .setDescription(`Checking again in ${interval} minutes.`)
    .setColor('#00ff00')
    .setFooter('Powered by Kubernetes!')
    .setTimestamp();
    webhookClient.send(initialEmbed);
})
.catch(err => {
    console.log('DOWN: ', err.message);
    // Send out the embed when the page is at an error
    const embedDown = new MessageBuilder()
    .setTitle(errorMessage)
    .setURL(healthUrl)
    .setDescription(`Checking again in ${interval} minutes.`)
    .setColor('#ff0000')
    .setFooter('Powered by Kubernetes!')
    .setTimestamp();
    webhookClient.send(embedDown);
})

// Start the timer based on ENV options for uptime check.
setInterval(() => {
    axios.get(healthUrl, { timeout: Number(timeout) * 1000 })
    .then(res => console.log(`Status Code ${res.status} OK`))
    .catch(err => {
        console.log('DOWN: ', err.message);

        // Send out the embed when the page is at an error
        const embed = new MessageBuilder()
        .setTitle(errorMessage)
        .setURL(healthUrl)
        .setDescription(`Checking again in ${interval} minutes.`)
        .setColor('#ff0000')
        .setFooter('Powered by Kubernetes!')
        .setTimestamp();
        webhookClient.send(embed);
    })
}, Number(interval) * 60000);