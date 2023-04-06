const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
run();

async function run(){
    console.log('Please, write your command!');
    readLine(processCommand);
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    [command, arg] = command.split(' ');
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(tableInfo(showToDo()));
            break;
        case 'important':
            console.log(tableInfo(showImportantToDo()));
            break;
        case `user`:
            console.log(tableInfo(showUserComments(arg)));
            break;
        case 'sort':
            console.log(tableInfo(showSortedByArg(arg)));
            break;
        case 'date':
            console.log(tableInfo(showSortedByDate(arg)));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function findLongest(arr){
    let longestMsg = ''
    let longestName = ''
    for (let msg of arr){
        msg = msg.split('; ')
        if (msg.length <= 1){
            if (msg[0].length > longestMsg){
                longestMsg = msg[0]
            }
            continue
        }

        if (msg[2].length > longestMsg.length){ longestMsg = msg[2] }
        else if (msg[0].length > longestName.length){ longestName = msg[0] }
    }
    return {longestMsg, longestName}
}

function tableInfo(arr){
    let nameMaxLen = 10
    let msgMaxLen = 50
    let dateMaxLen = 10
    let pathMaxLen = 20
    let {longestMsg, longestName} = findLongest(arr)
    if (longestMsg.length < msgMaxLen) {msgMaxLen = longestMsg.length}
    else if (longestName.length < nameMaxLen) {nameMaxLen = longestName.length}

    let res = ''
    for (let msg of arr){

        msg = msg.split('; ')

        if (msg.length <= 1){
            if (msg[0].slice(-1) === '!'){
                res += '  !  |'
            }
            else {
                res += '     |'
            }
            res += ''.padEnd(nameMaxLen+4)+'|'.padEnd(15)+`|  ${msg[0]}`.padEnd(msgMaxLen+5)+'|\n'
            continue;
        }

        //importance
        if (msg[2].slice(-1) === '!'){
            res += '  !  |'
        }
        else {
            res += '     |'
        }

        //name
        if (msg[0].length <= nameMaxLen){
            res += `  ${msg[0]}`.padEnd(nameMaxLen+4)+'|'
        }
        else{
            res += `  ${msg[0].slice(0, nameMaxLen-3)}...  |`
        }

        //date
        res += `  ${msg[1]}  |`

        //message
        if (msg[2].length <= msgMaxLen){
            res += `  ${msg[2]}`.padEnd(msgMaxLen+4)+'|'
        }
        else{
            res += `  ${msg[2].slice(0, msgMaxLen-3)}...  |`
        }

        //path
        const path = require('node:path');
        res += '\n'
    }

    let header = ''
    header += '  !  '+'|'
        +'  user'.padEnd(nameMaxLen+4)+'|'
        +'  date'.padEnd(dateMaxLen+4)+'|'
        +'  comment'.padEnd(msgMaxLen+4)
        +'  path'.padEnd(pathMaxLen+4)
        +'\n'.padEnd(nameMaxLen+12+dateMaxLen+msgMaxLen+8+pathMaxLen+4, '-')
        +'\n'

    return header + res+ ''.padEnd(nameMaxLen + 12 + dateMaxLen + msgMaxLen + 8 + pathMaxLen + 4, '-')
}

function showToDo(){
    let res = files.map(str => str.split('\r\n'));
    res = res.flat(Infinity).filter(a => a.includes('// TODO') && !a.includes('res ='));
    res = res.map(a => a.slice(a.indexOf('/') + 8));
    return res;
}

function showImportantToDo(){
    return showToDo().filter(a => a.includes('!'));
}

function showUserComments(name){
    let file = showToDo().map(str => str.split('; '));
    return file.filter(el => el[0].toLowerCase() === name.toLowerCase());
}

function showSortedByArg(arg){
    let arr = showToDo();
    let namedUser = arr.map(str => str.split('; ')).filter(a => a.length === 3);
    let unnamedUser = arr.map(str => str.split('; ')).filter(el => el.length === 1);
    switch (arg){
        case 'importance':
            return arr.sort((a,b) => b.split("!").length - a.split("!").length);
        case 'user':
            return namedUser.concat(unnamedUser);
        case 'date':
            return namedUser
                .sort((a,b) => new Date(b[1]) - new Date(a[1]))
                .concat(unnamedUser)
        default:
            return 'wrong argument'
    }
}

function showSortedByDate(arg){
    let arr = showSortedByArg('date')
    let filteredArray = []
    for (let msg of arr){
        if (msg.length === 3){
            if (new Date(msg[2]) <= new Date(arg)){
            }
            else if (new Date(msg[1]) > new Date(arg)){
                filteredArray.push(msg)
            }
        }
    }
    return filteredArray
}
// TODO you can do it!