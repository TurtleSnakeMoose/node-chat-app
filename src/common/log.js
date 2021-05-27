const chalk = require('chalk');
const _log = console.log;

const error = (title, content) => {
    _log(`${ chalk.bgRed.blackBright.bold(title) }  ${chalk.red(content)}`);
}

const success = (title, content) => {
    _log(`${ chalk.bgGreenBright.white.bold(title) }  ${chalk.greenBright(content)}`);
}

const info = (title, content) => {
    _log(`${ chalk.bgYellowBright.black.bold(title) }  ${chalk.yellowBright(content)}`);
}

const misc = (content) => {
    _log(`${chalk.cyanBright.bold(content)}`);
}
const plain = (content) => { _log(content) };

module.exports = {
    error,
    success,
    info,
    misc,
    plain
}

