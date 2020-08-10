#coding:utf-8
import os, sys, random
from PIL import Image,ImageDraw,ImageFont
allFilePath = []

# 初始化加水印文件夹
def initPaths(sourcePath):
    files = os.listdir(sourcePath)
    for fi in files:
        fi_d = os.path.join(sourcePath, fi)
        if os.path.isdir(fi_d):
            initPaths(fi_d)
        else:
            suffix = os.path.splitext(fi_d)[1]
            # if (suffix != ".json")
            if ((".png" in fi_d) | (".jpg" in fi_d)):
                allFilePath.append(fi_d)
            

def watermark(filename, text, pic):
    # 实例化图片对象
    img = Image.open(filename)
    w, h = img.size  # 获取图片的宽、高,以便计算图片的相对位置
    fontSize = int(min(w,h) / 50)
    cterX = w/2 - fontSize * len(text) / 4
    cterY = 0
    print("name:", pic, "size:", (w,h), "fontsize:", fontSize, "fontLength:", len(text))
    print("==========================================")
    # 设置字体、字体大小
    font = ImageFont.truetype("./source/STXINGKA.TTF", fontSize)  
    draw = ImageDraw.Draw(img)
    draw.text(xy=(cterX, cterY), text=text, fill=(0, 255, 255), font=font)
    img.save(filename)

def getRandomStr():
    chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    charLen = len(chars)
    pwd = ''
    resultLen = random.randint(10, 20)
    while len(pwd) < resultLen:
        pwd += chars[random.randint(0,charLen-1)]
    return pwd


if __name__ == '__main__':
    # 正式文件夹
    dirname = sys.argv[1];
    initPaths(dirname)
    for filePath in allFilePath:
        name = os.path.basename(filePath)
        # //Copyright © 2019 lzh. All rights reserved.
        watermark(filePath, getRandomStr(), name)