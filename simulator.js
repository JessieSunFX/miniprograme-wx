const automater = require('miniprogram-automator');
const path = require('path');

const miniprogram = automater.launch({
    projectPath: path.resolve(__dirname)
});