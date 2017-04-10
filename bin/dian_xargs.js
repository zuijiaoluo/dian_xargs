#!/usr/bin/env node

var userArgv = process.argv.slice(2)
var exec = require('child_process').exec

var dianXargs = function(config) {
    this.config = config
}

process.stdin.on('end', function() {
    // process.stdout.write('执行完毕')
})

/**
 * 获取输入流
 *
 * @param {Function} Callback
 */

function gets(cb) {
    process.stdin.setEncoding('utf8')
    process.stdin.resume()
    process.stdin.on('data', function(chunk) {
        process.stdin.pause()
        cb(chunk)
    })
}

/**
 * 输出异常错误
 *
 * @param {value} value
 */

dianXargs.prototype.sendErr = function(value) {
    process.stderr.write(value)
    process.exit(-1)
}

/**
 * 整理参数
 *
 */

dianXargs.prototype.getArgv = function() {
    var cmd = ''
    var options = {}
    for (var i = 0; i < userArgv.length; i += 2) {
        var value = this.getOptions(userArgv[i], userArgv[i + 1])
        if (!value) {
            this.sendErr('没有用于处理' + userArgv[i] + '的方法', i)
        } else if (typeof(value) != 'boolean') {
            options[userArgv[i]] = userArgv[i + 1]
        } else {
            var newArray = userArgv.slice(i)
            for (var i = 0; i < newArray.length; i++) {
                cmd += `${newArray[i]} `
            }
            options.cmd = cmd
            return options
        }
    }
}

/**
 * 获取参数
 * @param {string} option
 * @param {string} value
 */

dianXargs.prototype.getOptions = function(option, value) {
    switch (option) {
        case '-n':
            var val = Number(value)
            if (!isNaN(val)) {
                return val
            } else {
                this.sendErr("Error: -n 参数错误，必须是数字")
            }
        case '-P':
            var val = Number(value)
            if (!isNaN(val)) {
                return val
            } else {
                this.sendErr("Error: -P 参数错误，必须是数字")
            }
        default:
            return !(option.indexOf('-') != -1)
    }
}

/**
 * 整理cmd
 *
 */

dianXargs.prototype.getCmd = function(cmdArray) {
    var cmd = ''
    cmdArray.forEach(function(value, index, array) {
        cmd += `${value} `
    })
    return cmd
}

/**
 * 获取其他参数
 *
 */

dianXargs.prototype.gets = function(options) {
    let _this = this
    gets(function(reuslt) {
        var cmdArray = []
        var arr = reuslt.replace(/\n/g, ' ').split(" ")
        arr = arr.slice(0, arr.length - 1)
        var n = Number(options['-n']) || 1
        for (let i = 0; i < arr.length; i += n) {
            cmdArray.push(getN(arr, i, n, options.cmd))
        }
        var pNumber = Number(options['-P']) || 1

        function startExec(i) {
            var start = async function() {
                var reuslt = await _this.execPut(cmdArray, i, pNumber)
                if (reuslt && i + pNumber < cmdArray.length) {
                    startExec(i + pNumber)
                }
            }
            start()
        }
        startExec(0)
    })
}

/**
 * 拼接命令行
 *
 */

function getN(arr, a, n, cmd) {
    var string = ''
    for (var i = 0; i < n; i++) {
        if (arr[a + i]) {
            if (i < n - 1) {
                string += `${arr[a+i]} `
            } else {
                string += `${arr[a+i]}`
            }
        }
    }
    return cmd + string
}

/**
 * 异步执行命令
 *
 */

dianXargs.prototype.execPut = function(cmd, a, n) {
    let _this = this
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < n; i++) {
            exec(cmd[a + i], function callback(error, stdout, stderr) {
                if (error) {
                    return _this.sendErr(error)
                }
                if (n - i <= 0) {
                    resolve(true)
                }
                process.stdout.write(stdout)
            })
        }
    })
}
var begin = new dianXargs()
begin.gets(begin.getArgv())
