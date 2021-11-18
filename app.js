const { MessageEmbed, WebhookClient } = require('discord.js');
const axios = require('axios');
const { webhookUrl, healthUrl, timeout, interval, statusPageUrl, errorMessage, successMessage } = process.env;
let lastMessage = "";

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
    console.log(`Status Code ${res.status} OK`)

    const onlineEmbed = new MessageEmbed()
    .setTitle(successMessage)
    .setURL(statusPageUrl)
    .setDescription(`Checking again in ${interval} minutes.`)
    .setColor('#00ff00')
    .setFooter('Powered by Kubernetes!')
    .setTimestamp();
    
    if(lastMessage.length < 1 ) {
        webhookClient.send({
            embeds: [onlineEmbed],
        }).then(response => {
            console.log(response.id)
            lastMessage = response.id
        });
    } else {
        await webhookClient.editMessage(lastMessage, {
            embeds: [onlineEmbed],
        });
    }
})
.catch(async (err) => {
    console.log('OFFLINE - ERROR')
    
    const offlineEmbed = new MessageEmbed()
        .setTitle(errorMessage)
        .setURL(statusPageUrl)
        .setDescription(`Checking again in ${interval} minutes.`)
        .setColor('#ff0000')
        .setFooter('Powered by Kubernetes!')
        .setTimestamp();

    if(lastMessage.length < 1) {
        webhookClient.send({
            content: "@everyone",
            embeds: [offlineEmbed],
        }).then(response => { lastMessage = response.id });
    } else {
        await webhookClient.editMessage(lastMessage, {
            content: "@everyone",
            embeds: [offlineEmbed],
        });
    }
})


setInterval( async () => {
    axios.get(healthUrl, { timeout: timeout })
    .then(async res => {
        console.log(`Status Code ${res.status} OK`)

        const onlineEmbed = new MessageEmbed()
        .setTitle(successMessage)
        .setURL(statusPageUrl)
        .setDescription(`Checking again in ${interval} minutes.`)
        .setColor('#00ff00')
        .setFooter('Powered by Kubernetes!')
        .setTimestamp();
        
        if(lastMessage.length < 1 ) {
            webhookClient.send({
                embeds: [onlineEmbed],
            }).then(response => {
                console.log(response.id)
                lastMessage = response.id
            });
        } else {
            await webhookClient.editMessage(lastMessage, {
                embeds: [onlineEmbed],
            });
        }
    })
    .catch(async () => {
        console.log('OFFLINE - ERROR')
        
        const offlineEmbed = new MessageEmbed()
            .setTitle(errorMessage)
            .setURL(statusPageUrl)
            .setDescription(`Checking again in ${interval} minutes.`)
            .setColor('#ff0000')
            .setFooter('Powered by Kubernetes!')
            .setTimestamp();
    
        if(lastMessage.length < 1) {
            webhookClient.send({
                content: "@everyone",
                embeds: [offlineEmbed],
            }).then(response => { lastMessage = response.id });
        } else {
            await webhookClient.editMessage(lastMessage, {
                content: "@everyone",
                embeds: [offlineEmbed],
            });
        }
    })
}, interval * 60000);