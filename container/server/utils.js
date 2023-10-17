
function showLog(title, data) {
    // Show log with timestamp and color
    const date = new Date();
    const timestamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const color = '\x1b[36m%s\x1b[0m';
    console.log(color, `[${timestamp}] ${title}: ${data}`);
}

function showErr(title, data) {
    // Show error log with timestamp and color
    const date = new Date();
    const timestamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const color = '\x1b[31m%s\x1b[0m';
    console.log(color, `[${timestamp}] ${title}: ${data}`);
}

function showWarn(title, data) {
    // Show warning log with timestamp and color
    const date = new Date();
    const timestamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const color = '\x1b[33m%s\x1b[0m';
    console.log(color, `[${timestamp}] ${title}: ${data}`);
}

module.exports = {
    showLog,
    showErr,
    showWarn
};