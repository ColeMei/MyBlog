---
title: "Running Pentaho Data Integration on Mac bigSur (M1)"
slug: "running-pentaho-data-integration-on-mac-bigsur-m1"
date: 2021-07-10T16:47:33+08:00
draft: false
toc: true
pin: false
scrolltotop: true
ShowLastmod: false
images:
  - https://picsum.photos/1920/1080/?random
tags: 
  - Skillset
---

# 关于在M1 Mac 上安装部署PDI(kettle)

+ ## 前言

  截止我编写这篇笔记之时，Kettle并没有原生支持M1，所以本文大致思路是使用Rosetta转译运行，无需借助任何虚拟机。

  

+ ## 安装步骤

  1. ### 配置Rosetta Terminal（强制在Intel模式下运行shell）

     > 参考 https://cutecoder.org/software/run-command-line-apple-silicon/ 

     1. 打开Terminal终端的 **偏好设置** → **描述文件**

     2. 从左侧选择一个你喜欢的shell → 下方省略号 → **复制描述文件**

     3. 点击新的描述文件 给它起一个好听的名字 就像“Rosetta Shell”

     4. 右侧点击 **窗口** 再给它起一个好听的标题 就像“Terminal (Intel)”

     5. 点击 **shell** 运行命令处写入以下 并取消勾选 **在shell中运行**

        `env` `/usr/bin/arch` `-x86_64 ``/bin/zsh` `--login`

     6. (可选) 将该shell设置为默认

  2. ### 安装 Homebrew

     > 在arm64架构中 我们需要做两种Homebrew的安装
     >
     > > /usr/local/homebrew —— 服务于传统intel安装路径
     > >
     > > /opt/homebrew —— 服务于已原生支持Apple Silicon的包

     1. 打开刚配置好的Rosetta Shell

     2. 输入以下几行命令：

        ```shell
        cd /usr/local
        sudo mkdir homebrew
        sudo chgrp admin homebrew
        sudo chmod g+rwx homebrew
        curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C homebrew
        ```

     3. 在 ～/.zshrc 中加入如下行，来自动选择运行何种homebrew的安装模式

        ```shell
        if [ "$(sysctl -n sysctl.proc_translated)" = "1" ]; then
            local brew_path="/usr/local/homebrew/bin"
        else
            local brew_path="/opt/homebrew/bin"
        fi
        export PATH="${brew_path}:${PATH}"
        ```

        记得 ` source ~/.zshrc` 哦～

  3. ### 配置 java环境

     > 这里需要对应Kettle和JDK 版本的对应关系 非常严格
     >
     > ![](https://raw.githubusercontent.com/ColeMei/Picgo/master/blog2/01.png)
     >
     > 如果已经安装了其他版本JDK 关于mac上的多版本Java管理 
     >
     > 请参考 https://blog.csdn.net/qq_39992641/article/details/117048076

     1. 打开Rosetta shell 输入如下命令

        ```shell
        brew tap AdoptOpenJDK/openjdk
        brew install adoptopenjdk8 
        ```

     2. 安装完成后 查看java版本

     ![查看java版本](https://raw.githubusercontent.com/ColeMei/Picgo/master/blog2/02.png)

        如图就成功了 我采用的是**kettle9.1 + jdk8** 

        所以 version 一定是要 **1.8.xxx**  还请注意自己的版本对应关系

  4. ### 下载Kettle

     > 官方下载地址：https://sourceforge.net/projects/pentaho/files/

     点击选择需要的版本 → client-tools → 点击**pdi-ce-xxxxxx.zip**文件下载解压即可

  5. ### 启动Kettle

     通过终端进入解压后得到的**/data-integration**目录，

     输入命令` sh spoon.sh ` 等待自动启动即可（时间可能较长）

     ![启动Kettle](https://raw.githubusercontent.com/ColeMei/Picgo/master/blog2/03.png)


     看到 **Spoon -欢迎!** 字样 大功告成～ 🎉


​     

+ ## 可能出现的问题

  1. I'm sorry, this Mac platform [arm64] is not yet supported! Please try starting using 'Data Integration 32-bit' or 'Data Integration 64-bit' as appropriate.

     **报错如下**：

     ![问题1-1](https://raw.githubusercontent.com/ColeMei/Picgo/master/blog2/04.png)


     **分析：**
    
     Rosetta Termina并没有配置好 并没有用成功Rosetta转译运行 请重回 **步骤1** 仔细参考 https://cutecoder.org/software/run-command-line-apple-silicon/ 
    
     **另外我这篇笔记默认您安装了Rosetta 如没有安装 请您先自行安装 网上很多教程**

  2. **java相关问题**

     **报错1:**

     endorsed is not supported. Endorsed standards and standalone APIs

     in modular form will be supported via the concept of upgradeable modules.

     Error: Could not create the Java Virtual Machine.

     Error: A fatal exception has occurred. Program will exit.

     **分析：**

     Java JDK 版本不匹配 请下载正确对应版本 请重回 **步骤3**

     ![问题2-1](https://raw.githubusercontent.com/ColeMei/Picgo/master/blog2/05.png)

     **报错2:**

     java.lang.UnsatisfiedLinkError: Could not load SWT library. Reasons: 

     ​	no swt-cocoa-4940r23 in java.library.path

     ​	no swt-cocoa in java.library.path

     **分析：**

     Java JDK是arm64版本的 请下载x86版本 因为很多朋友可能在了解kettle之前就在自己心爱的m1上配置了Java环境 但是oracle并没有原生适配M1 所以一般我们下载的都是arm架构的 Zulu JDK 但是由于我们的Kettle是x86 

     **所以架构体系一定要对应！！！请重回步骤3**

     可以看到 下图 `java -version` 显示的虽然是jdk版本没问题 但是版本架构不对

     ![问题2-2](https://raw.githubusercontent.com/ColeMei/Picgo/master/blog2/06.png)


  3. **Kettle mac 启动失败（闪退）报错 Unknown Source**

     > 参考 https://blog.csdn.net/qq_41066235/article/details/108668423

     ![问题3-1](https://raw.githubusercontent.com/ColeMei/Picgo/master/blog2/07.png)

     **分析：**

     下载最新的eclipse.swt包，替换kettle中的原文件即可  [下载地址](https://mvnrepository.com/artifact/org.eclipse.platform/org.eclipse.swt.cocoa.macosx.x86_64)

     替换路径：data-integration → libswt → osx64

     ![问题3-2](https://raw.githubusercontent.com/ColeMei/Picgo/master/blog2/08.png)


​     

+ ## 结语

  M1可真是个磨人的小妖精～ Rosetta的转译不知道后续还会遇到什么bug

  期待后续的Kettle学习之路～ 💪

  

 



