"use strict";

const fs = require("fs");
const path = require("path");
var eol = require("os").EOL;

module.exports = function(config) {
    if(config.engine) {
        try {
            fs.mkdir("consoles", () => {});
        } catch(e) {
        }

        var oldSendConsoleMessages = config.engine.driver.sendConsoleMessages;
        config.engine.driver.sendConsoleMessages = function(userId, messages) {
            config.common.storage.pubsub.publish("console-thief/logs", {
                id: userId,
                messages: messages
            });
            return oldSendConsoleMessages(userId, messages);
        }
    }

    if(config.cronjobs) {
        var logs = {};

        setTimeout(() => {
            config.common.storage.pubsub.subscribe("console-thief/logs", log => {
                if(!logs[log.id]) {
                    logs[log.id] = "";
                }

                logs[log.id] += JSON.stringify(log.messages) + eol;
            });
        }, 100);

        config.cronjobs.saveConsoleLogs = [
            60,
            function saveConsoleLogs() {
                var oldLogs = logs;
                logs = {};

                for(let userid in oldLogs) {
                    fs.appendFile(path.join("consoles", userid), oldLogs[userid], () => {});
                }
            }
        ];
    }
}
