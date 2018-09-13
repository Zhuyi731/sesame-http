#!/usr/bin/env node

const inquirer = require("inquirer"); //a tool for cli interaction with questions
const program = require("commander"); //a tool to parse command interface arguments
const sesame = require("../src/server");
const path = require("path");

HelloSesame();

program.version(require('../package').version)
    .usage('<command> [options],use order(open-sesame -h) for help information')
    .option("-p,--port", "set a port which the http-server will listen to")
    .option("-w,--where", "set the path you want to listen")
    .parse(process.argv);

sesame.openLocal(program.port, path.join(process.cwd(), (program.where || "./")));

function HelloSesame() {
    console.log("");
    console.log("Welcome to use open-sesame");
    console.log("Current Vertion:" + require('../package').version);
    console.log("If you like this project,please give me a star at https://github.com/Zhuyi731/open-sesame");
    console.log("Thanks for your support");
    console.log("");
}