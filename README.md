# screeps-console-thief
Server mod for Screeps that saves players' console logs to a folder.

[![NPM](https://nodei.co/npm/screeps-console-thief.png)](https://npmjs.org/package/screeps-console-thief)

Please note that this is rather unfinished. It only saves to files once every 60 seconds, and might miss some logs when the server shuts down.

Logs are saved in the `consoles` directory. Each file is a user ID and contains the output for each tick, one per line. Each line is a JSON object containing two arrays: `log` and `results`. `log` is for output from the program, and `results` is for the results of any console input.
