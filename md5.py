#coding:utf-8
import os, sys, glob, hashlib, random

myhash = hashlib.md5()
charPool = ['!','@','#','$','%','^']
allFilePath = []

# 初始化注入文件夹
def initPaths(sourcePath):
    files = os.listdir(sourcePath)
    for fi in files:
        fi_d = os.path.join(sourcePath, fi)
        if os.path.isdir(fi_d):
            initPaths(fi_d)
        else:
            if (".json" in fi_d):
                continue
            allFilePath.append(fi_d)

# 查看MD5值
def readAppend(filePath, str):
    myfile = open(filePath,'rb')
    md5 = hashlib.md5(myfile.read()).hexdigest()
    print(os.path.basename(filePath) + " " + str + md5)
    myfile.close()

# 注入值
def fileAppend(filePath):
    myfile = open(filePath,'a')
    len1 = random.randint(10, random.randint(15, 20))
    result = ''
    while len(result) < len1:
        result += charPool[random.randint(0, len(charPool) - 1)]
    print('随机注入:' + result)
    myfile.write(result)
    myfile.close()

    
if __name__ == '__main__':
    # cmd: python md5.py ./testDir
    dirname = sys.argv[1]
    initPaths(dirname)
    for filePath in allFilePath:
        # MD5比较
        readAppend(filePath, "before MD5: ")
        # MD5修改
        fileAppend(filePath)
        # MD5比较
        readAppend(filePath, "after MD5: ")
