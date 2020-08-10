const CryptoJS = require('crypto-js')

// 加密
function encrypt(word) {
    var key = CryptoJS.enc.Utf8.parse("46cc793c53dc451b");
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}
// 解密
function decrypt(word) {
    var key = CryptoJS.enc.Utf8.parse("46cc793c53dc451b");
    var decrypt = CryptoJS.AES.decrypt(word, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
// 字符串加密
// var enc = encrypt("./dir1/dir2/dir3/res.json");
var enc = encrypt("疾如风,徐如林");
console.info(enc);
// 字符串解密
console.info(decrypt(enc));