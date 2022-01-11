# Node.js Health Check Monitor

This package uses Discord.js Webhook#send and Webhook#edit functions to monitor and endpoint, this cna be useful for montioring a health check, please read through the code if you have any questions.



## Requirements:
```
Node.js ^17.1.0
Discord.js ^13.0.0
Axios ^0.24.0
``` 

## Installation:
```
npm install
```

## Environment Variables
This package requires you to have the following environment variables

| Variable              | Example                                   |
|-----------------------|-------------------------------------------|
| webhookUrl            | https://discord.com/api/webhooks/.../.../ |
| healthUrl             | https://google.com/                       |
| timeout (type: ms)    | 2500                                      |
| interval (type: mins) | 10                                        |
| statusPageUrl         | https://my.status.page/link               |
| errorMessage          | My Server is DOWN!                        |
| successMessage        | My Server is ONLINE!                      |
