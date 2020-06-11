#!/usr/bin/env node
const debounce = require('lodash.debounce')
const chokidar = require('chokidar')
const prog = require('caporal')
const fs = require('fs')
const { spawn } = require('child_process')
const chalk = require('chalk')

prog
.version('0.0.1')
.argument('[filename]', 'Name of the file to execute')
.action(async ({filename}) =>{
    const file = filename || 'index.js'
    try{
    await fs.promises.access(file)
    } catch(err){
        throw new Error(`Could not find file ${file}`)
    }

    let proc;
    const start = debounce(() => {
        if (proc){
            proc.kill()
        }
        console.log(chalk.magentaBright.bold('>>>>>Starting process...'))
        proc = spawn('node',[file],{ stdio: 'inherit'})
    }, 100)
    
    chokidar.watch('.')
    .on('add', start)
    .on('change',start)
    .on('unlink', start)    
})

prog.parse(process.argv)