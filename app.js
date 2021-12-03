const { MessageEmbed, WebhookClient } = require('discord.js');
const axios = require('axios');
const { webhookUrl, healthUrl, timeout, interval, statusPageUrl, errorMessage, successMessage } = process.env;
let downState = false;
// console.log('ENV SETTINGS: ', JSON.stringify(process.env, null, 2))

if(!webhookUrl &&
    !healthUrl &&
    !timeout && 
    !interval &&
    !errorMessage &&
    !statusPageUrl &&
    !successMessage &&
    !successMessageLink
    ) throw new Error('No ENV Values set');


// Start WebhookClient
const webhookClient = new WebhookClient({ url: webhookUrl });

// INITIALIZE MESSAGE

axios.get(healthUrl, { timeout: timeout })
.then(async res => {
    console.log(`Status Code ${res.status} OK`);

    const onlineEmbed = new MessageEmbed()
    .setTitle(successMessage)
    .setURL(statusPageUrl)
    .setColor('#00ff00')
    .setFooter('Powered by Kubernetes!')
    .setTimestamp();
    
    webhookClient.send({
        embeds: [onlineEmbed],
    })
})
.catch(async (err) => {
    console.log('OFFLINE - ERROR');
    downState = true;
    const offlineEmbed = new MessageEmbed()
        .setTitle(errorMessage)
        .setURL(statusPageUrl)
        .setColor('#ff0000')
        .setFooter('Powered by Kubernetes!')
        .setTimestamp();

    webhookClient.send({
        embeds: [offlineEmbed],
    });
})

// Interval Checking
setInterval( async () => {
    axios.get(healthUrl, { timeout: timeout })
    .then(async res => {
        console.log(`Status Code ${res.status} OK`);
        const onlineEmbed = new MessageEmbed()
        .setTitle(successMessage)
        .setURL(statusPageUrl)
        .setColor('#00ff00')
        .setFooter('Powered by Kubernetes!')
        .setTimestamp();
        if(downState == true){
            webhookClient.send({ embeds: [onlineEmbed], });
            downState = false;
        }
    })
    .catch(async () => {
        console.log('OFFLINE - ERROR');
        downState = true;
        const offlineEmbed = new MessageEmbed()
            .setTitle(errorMessage)
            .setURL(statusPageUrl)
            .setColor('#ff0000')
            .setFooter('Powered by Kubernetes!')
            .setTimestamp();
    
        webhookClient.send({ embeds: [offlineEmbed], });
    })
}, interval * 60000);