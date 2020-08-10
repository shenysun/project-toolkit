/* 为项目添加干扰代码，主要做这几件事：
1、修改每个类里面的私有方法，添加一个随机数
2、在代码里面随机一行插入一个随机命名的方法体
3、在代码里面随机一行插入一行没有意义的代码
*/

const LINENUM = 30;
const LINENUM_RADOM = 5;
var fs = require("fs");
var path = require("path");
var filterFils = ["Base64", "ThemeAdapter", "AssetAdapter", "Platform", "GamePlatform", "wxmini"]; //忽略文件
var filterDirs = ["codes"]; //忽略目录
var traceName = "ConfuseAsset.ins.pJqqqMyPlugsGame"; //添加的干扰代码
var funString = '() {'; //添加的方法体
var root_Url = "../myGames/RoomRunGame_Copy1/src"; //项目diam路径
var funcArr = [
    'let self = this;',
    'var self = this;',
    'window["egret"]["sys"] || window["eui"];'
]

fileDisplay(path.resolve(root_Url));

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function(err, files) {
        if (err) {
            console.warn(err)
        } else {
            //遍历读取到的文件列表
            files.forEach(function(filename) {
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir, function(eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        var isFile = stats.isFile(); //是文件
                        var isDir = stats.isDirectory(); //是文件夹
                        if (isFile) {
                            let onlyName = filename.split(".")[0];
                            if (filename.indexOf(".ts") != -1 && filterFils.indexOf(onlyName) == -1) {
                                changeDode(filedir);
                            }
                        }
                        if (isDir) {
                            if (!filterDirs || filterDirs.indexOf(filename) == -1) {
                                fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                            }
                        }
                    }
                })
            });
        }
    });
}

function changeDode(phppath) {
    let phpContent = fs.readFileSync(phppath, { encoding: "utf8" });

    //====修改私有方法名==================================================================
    //let arr = phpContent.match(/function\s*(\w+)/);
    let arr = phpContent.match(/private .*?\(/g);
    if (arr) {
        let len = "private ".length;
        for (var i = 0; i < arr.length; i++) {
            let str = arr[i];
            if (str.indexOf("private static") != -1) continue;
            if (str.indexOf("private async") != -1) continue;
            if (str.indexOf("private get") != -1) continue;
            if (str.indexOf("private set") != -1) continue;
            if (str.indexOf("= new ") != -1) continue; //过滤这种：private con:eui.Rect = new eui.Rect();
            let name = str.substr(len, str.length - len - 1);
            let number = Math.floor(Math.random() * 999999);
            let nameRandomStr = getRadomStr(7, 1)
            let name2;
            let lastIndex = nameRandomStr.lastIndexOf("_");
            if (lastIndex == -1) {
                name2 = nameRandomStr + "_" + number;
            } else {
                name2 = nameRandomStr.substr(0, lastIndex) + "_" + number;
            }
            let name2s = name2 + "(";
            //phpContent = phpContent.replace("private "+name + "(", "private " + name2s); //不能直接替换需要用正则，因为一个文件里面可能有多个类，可能存在多个同名方法
            var regExp0 = new RegExp("private " + name + "\\(", 'gi');
            phpContent = phpContent.replace(regExp0, "private " + name2s);

            var regExp = new RegExp("this." + name + "\\(", 'gi');
            phpContent = phpContent.replace(regExp, "this." + name2s);
            regExp = new RegExp("this." + name + "\\,", 'gi');
            phpContent = phpContent.replace(regExp, "this." + name2 + ",");
            regExp = new RegExp("this." + name + "\\)", 'gi');
            phpContent = phpContent.replace(regExp, "this." + name2 + ")");

            var regExp2 = new RegExp("self." + name + "\\(", 'gi');
            phpContent = phpContent.replace(regExp2, "self." + name2s);
        }
    }

    //====增加干扰代码==================================================================
    let arr2 = phpContent.split("\n");
    let isInterFace;
    for (var i = LINENUM; i < arr2.length - 1; i++) {
        if (!arr2[i]) continue;
        let formatStr = Trim(arr2[i], "g");

        if (formatStr == "" || formatStr == "{") continue;
        arr2[i] = String(arr2[i]);

        if (arr2[i].indexOf("return") != -1) continue;
        if (arr2[i].indexOf("class ") != -1) continue;
        if (arr2[i].indexOf("super(") != -1) continue;
        if (arr2[i].indexOf("public constructor") != -1) continue;
        if (arr2[i].indexOf("else") != -1) continue;
        if (arr2[i].indexOf("else if") != -1) continue;
        if (arr2[i].indexOf("//") != -1) continue;
        if (arr2[i].indexOf("/**") != -1) continue;
        if (arr2[i].indexOf("catch(") != -1) continue;
        if (arr2[i].indexOf(",") != -1 && arr2[i].indexOf("(") == -1) continue; //object里面的key value
        if (arr2[i].indexOf("public ") != -1) continue; //属性
        if (arr2[i].indexOf("private ") != -1) continue; //属性
        if (arr2[i].indexOf("protected ") != -1) continue; //属性
        if (arr2[i].indexOf("public ") != -1 && arr2[i].indexOf("{") != -1 && arr2[i].indexOf("=") != -1) continue; //属性
        if (arr2[i].indexOf("private ") != -1 && arr2[i].indexOf("{") != -1 && arr2[i].indexOf("=") != -1) continue; //属性
        if (arr2[i].indexOf("function") != -1 && arr2[i].indexOf(":") != -1) continue; //object里面的key value

        if (!arr2[i - 1]) continue;
        let formatStr2 = Trim(arr2[i - 1], "g");
        arr2[i - 1] = String(arr2[i - 1]);
        if (arr2[i - 1].indexOf("return") != -1) continue;
        if (arr2[i - 1].indexOf("if") != -1 && arr2[i - 1].indexOf("{") == -1) continue;
        if (arr2[i - 1].indexOf("else") != -1 && arr2[i - 1].indexOf("{") == -1) continue;
        if (arr2[i - 1].indexOf("for") != -1 && arr2[i - 1].indexOf("{") == -1) continue;
        if (arr2[i - 1].indexOf(",") != -1 && arr2[i - 1].indexOf("(") == -1) continue; //object里面的key value
        if (formatStr == "})" && formatStr2 == "}") continue;
        if (formatStr == "})" && formatStr2 == "") continue;

        let isFun = (arr2[i].indexOf("private ") != -1 && arr2[i].indexOf("(") != -1) ||
            (arr2[i].indexOf("public ") != -1 && arr2[i].indexOf("(") != -1) ||
            (arr2[i].indexOf("/**") != -1);
        if (isFun && (formatStr2 == "" || formatStr2 == "*/" || arr2[i - 1].indexOf("}") != -1 || arr2[i - 1].indexOf("//") != -1 || arr2[i - 1].indexOf("class") != -1)) continue;
        if (isFun && arr2[i - 1].indexOf("private ") != -1) continue;
        if (isFun && arr2[i - 1].indexOf("public ") != -1) continue;

        if (arr2[i].indexOf("function") != -1 && arr2[i - 1].indexOf(",") != -1) continue; //object里面的key value
        if (arr2[i].indexOf("}") != -1 && arr2[i - 1].indexOf(":") != -1) continue;

        let formatStr3 = Trim(arr2[i + 1], "g");
        arr2[i + 1] = String(arr2[i + 1]);
        if (formatStr == "}" && formatStr3 == "}") continue;
        if (formatStr == "}" && formatStr3 == "") continue;



        let str = getAddSpace(arr2[i]) + traceName + "(\"" + getRadomStr() + "\");";
        arr2.splice(i, 0, str);
        let randomNum = Math.random();
        i = i + LINENUM + (Math.round(randomNum * LINENUM_RADOM) * (randomNum < 0.5 ? 1 : -1)); //随机行数添加
    }

    //====增加干扰代码 增加干扰方法 ==================================================================
    let pbArr = phpContent.match(/public .*?\(/g);
    let count = (arr ? arr.length : 0) + (pbArr ? pbArr.length : 0);
    let rate = 0.5;
    if (count > 5) rate = 0.4;
    if (count > 10) rate = 0.25;
    if (count > 20) rate = 0.15;
    rate *= 0.75
    for (var i = LINENUM; i < arr2.length - 1; i++) {

        let formatStr = Trim(arr2[i], "g");
        arr2[i] = String(arr2[i]);
        let formatStr2 = Trim(arr2[i - 1], "g");
        arr2[i - 1] = String(arr2[i - 1]);
        let formatStr3 = Trim(arr2[i + 1], "g");
        arr2[i + 1] = String(arr2[i + 1]);

        let canInsert = false;
        let isFun = ((arr2[i].indexOf("private ") != -1 || arr2[i].indexOf("public ") != -1) && arr2[i].indexOf("(") != -1) && arr2[i].indexOf("=") == -1;
        var str = '';
        if (isFun && formatStr2 == "}") {
            canInsert = Math.random() < rate;
            str = getAddSpace(arr2[i]) + 'private ' + getRandomFunc() + '\n';
        } else {
            let str3 = arr2[i + 1];
            isFun = ((str3.indexOf("private ") != -1 || str3.indexOf("public ") != -1 || str3.indexOf("/**") != -1) && str3.indexOf("(") != -1) && str3.indexOf("=") == -1;
            if (formatStr == "" && isFun && formatStr2 == "}") {
                canInsert = Math.random() < rate;
                str = getAddSpace(arr2[i - 1]) + 'private ' + getRandomFunc();
            }
        }
        if (canInsert) {
            arr2.splice(i, 0, str);
        }
    }

    phpContent = arr2.join("\n");

    fs.writeFileSync(phppath, phpContent, { encoding: "utf8" });
    console.log("执行完成！--" + phppath);
}

function getAddSpace(str) {
    if (!str) return "";
    let num = str.length - lTrim(str).length;
    let formatStr = Trim(str, "g");
    if (formatStr == "}")
        num += 4;
    let space = "";
    while (num > 0) {
        space += " ";
        num--;
    }
    return space;
}

function getRandomFunc() {
    var random = Math.random() * 100;
    var result = getRadomStr(5, 1) + "_" + getRadomStr(5, 0) + funString + "\n";
    if (random <= 33) {
        var top = Math.random() > 0.5 ? `console.log("${getRadomStr()}")` : `var ${getRadomStr(4, 1)} = ${getRandom()};`
        result += top + "\n" + "}"
    } else {
        result += funcArr[Math.floor(Math.random() * funcArr.length)] + "\n" + "}"
    }
    return result
}

function getRandom() {
    return Math.random() > 0.5 ? `"${getRadomStr()}"` : Math.floor(Math.random() * 1231231);
}

function getRadomStr(len, type) {
    len = len || Math.floor(Math.random() * 32) + 1;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    if (type == 1) $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz'; //非数字
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function Trim(str, is_global) {
    str = String(str);
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global && is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
    }
    return result;
}

function lTrim(str) {
    str = String(str);
    var result = str.replace(/(^\s+)/g, "");
    return result;
}