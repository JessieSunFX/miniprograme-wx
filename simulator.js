const automater = require('miniprogram-automator');
const path = require('path');

const miniprogram = automater.launch({//当前路径下启动一下模拟器
    cliPath: 'path/to/cli', // 工具 cli 位置，如果你没有更改过默认安装位置，可以忽略此项 TODO
    projectPath: path.resolve(__dirname)
})
.then(miniprogram => {
    miniprogram
        .currentPage()
        .then(page => {
            return page
                .waitFor(1000)
                .then(() => page);
        })
        .then(page => page.$('multiplepic'))
        .then(element => {
            if (element && element.tagName === 'multiplepic') {
                console.log('测试通过');
            } else {
                console.log('测试不通过');
                console.log('element:::', element);
            }
        });
});