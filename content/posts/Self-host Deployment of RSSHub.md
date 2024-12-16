---
title: "Self-host Deployment of RSSHub"
slug: "self-host-deployment-of-rsshub"
date: 2023-09-11T23:50:36+08:00
draft: false
toc: true
description: 
pin: false
scrolltotop: true
ShowLastmod: false
images:
  - https://picsum.photos/1920/1080/?random
tags: 
  - Tutorial
---

## 引言

说起来，我采用「RSS信息源 + 一款心仪的多平台阅读器」这样的方式获取信息已经有一年多的时间了。总的来说，它带给了我很不错体验，有效的缓解了我在Daily Input过程中的一些无奈与焦虑：一方面，它使筛选过的优质信息源尽量常驻，另一方面，它使阅读信息的过程尽量纯粹。

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog10/Feed-icon.svg.png" alt="image" caption="RSS (Stand For Really Simple Syndication)" class="">}}

其实，RSS背后是由一套挺反商业的逻辑在支持，也因此，很多平台和媒体都并不提供官方的RSS订阅链接，毕竟如果每个人都在自己的一隅空间内，不去访问门户网站页面，那么用户的数据偏好从哪里得到？铺天盖地的广告往哪里投送？

这样的协议无疑站在了消费主义的对立面。所以，刚才提到的一切想法得以实现的一个理论基底，就是[RSSHub](https://github.com/DIYgod/RSSHub)这个伟大的开源项目的存在。关于RSSHub，官方docs中作了如下介绍:

> RSSHub 是一个开源、简单易用、易于扩展的 RSS 生成器，可以给任何奇奇怪怪的内容生成 RSS 订阅源。RSSHub 借助于开源社区的力量快速发展中，目前已适配数百家网站的上千项内容
>
> {{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog10/CleanShot%202023-09-12%20at%2003.08.36%402x.png" alt="image" caption="RSSHub" >}}

一言以蔽之，很多并没有提供RSS功能的平台与媒体，通过RSSHub的Route(路由)，或者更简单的，利用其Radar插件，可以很方便的生成订阅源。

更多关于RSS以及RSSHub的介绍就不在这里展开了，下面切入正题：

---

## 无尽的折腾

### 1. 需求

这次折腾之旅的起因是这样的：我经常阅读的一个RSS订阅源-[端传媒](https://theinitium.com/)，由于网站的改版与代码重构，原本的源不能获取到文章的全部内容了，需要跳转到原链接去阅读。而网站上的文章文字显示为繁体，且字体看起来不顺眼不说，文章周围还夹杂着很多乱七八糟的内容，很是无奈。

花着高昂的订阅费，却得不到称心如意的阅读体验，这还得了(也不得不感叹这些对于体验的改造工作居然要消费者来承担)？于是遂至RSSHub docs的相关路由路径下查看，发现如下字样：

> 付费内容全文可能需要登陆获取，详情见部署页面的配置模块。

也是我第一次了解到原来RSSHub的一整套服务还可以自己部署，至于自建的原因，我是这样理解的：

1. 由RSSHub的官方域名路径构成的源多数都因被污染、被反制、被滥用等等原由而无法使用。
2. 随着很多网站的政策更新，获取其内容所需要的条件越来越苛刻，像是API、Cookies、Token等信息需要预配置。

好在RSSHub的生态还算完整，对于自建这样一个相对小众的需求也有比较详细（当然还不够！不然我也不写这篇blog了）的文档支持。

# {{< align center "折腾开始！" >}}

### 2. 基本部署

官方提供的Guideline中有很多种部署方式，我尝试了三种：Docker-Compose部署、HeroKu部署、Vercel部署。最后顺利完成自建是使用的Vercel。

* #### Docker-compose

9月5日，我开始了第一次尝试。

由于我这一阵子刚刚学完Mosh的[Ultimate Docker Course](https://www.bilibili.com/video/BV1pf4y1W7YA/)，而古人云：一个人刚刚掌握了一项新的工具后，当他发现能将它立马用到解决自己遇到的实际问题，这无疑是一件很令人激动的事情。于是当我看到支持中有Docker字样的instance时，眼睛放出的光芒四射，我毫不犹豫的优先选择了它。

部署的过程不算困难，只需要在Terminal中零星敲上几个指令，就能在本地端口1200下看到“Welcome to RSSHub”的字样，还蛮顺利的。

运行docker的相关命令，发现：images成功运行在本地，volumes也没有忘记创建，（嗯，我Docker学的没问题！）但是不知道是不是部署在本地的原因，真正将自建的服务用到订阅源的构建时，基本全是报错。只有少数的一些静态page或是比较简单的网页能够成功的解析。碍于我在网络方面的知识储备相当匮乏，在持续扑腾了两个小时以后，我还是像一只沮丧的旱鸭子一样放弃了，并不甘心的在我的LogSeq的Daily Journal中作了如下记录：

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog10/CleanShot%202023-09-12%20at%2001.33.24%402x.png" alt="image" caption="LogSeq-Journal Page-Sep 5th" >}}

* #### HeroKu

时间来到了9月7日，这天我也是经历了挺疯狂的一晚。

我千方百计的想要疯狂榨干Github Student Package中的每一滴价值，从下午三点开始把自己埋在电脑前一直到了凌晨三点：从零开始完成了两个Vps的部署（这个有机会也可以另起一篇记录下），申请并注册了个人的第二个domain，学习了使用Termius、浏览了上百个webpage……

我将在自己身上时有发生的这种好像进入了某种Zone的状态戏称为“Geeky Time”，也算是另一种比较nerd的“Kenja Taimu”吧。

哈哈哈，好像跑题了。

话说回来，在Student Package中，我瞥见了Heroku的字样，它也是RSSHub官方支持的一种自建方式，且支持一键部署，但无奈其不提供免费服务，每月的额度也十分有限。这不是和我的学生包中提供的条目完美匹配吗？于是我尝试了注册Heroku，但是倒在了最后一步：没能添加正确的Payment methods，也真是挺奇怪的，我的这张Monai卡陪我注册和订阅过大大小小很多个境外服务，怎么到你这就不行了，无奈作罢。

后来分析了下，可能Heroku需要的是国外的本地卡作为支付方式吧，而不是我这样一张简单的Mastercard外币卡。

* #### Vercel

最后是Vercel，俗话说好饭不怕晚。其实早在部署我的blog时，我就有体验过Vercel的托管服务，但因为一些原因（一切从简与轻量化）还是选择了Github Pages。基于Vercel的部署过程体验下来还算简单，RSSHub的官方Docs中提供了和Heroku一样的一键部署功能，但这里我还是选择了（也更推荐）带有自动更新的部署方式：

1. 在Github中：将RSSHubFork到自己的repo中。
2. 在Vercel中：
   1. 完成对Github Account的绑定。
   2. 新建Project，关联Github中的对应repo并导入。
   3. 按需自定义修改相关设置，等待Build完成

更详细的部署教程（step by step）可以参考这篇Guide：[RssHub + Vercel ：在 Vercel 上免费部署你的RssHub](https://www.cnblogs.com/QiuSYan/p/RssHub.html)。

至此，专属于我自己的RSSHub就已经部署在了Vercel为我提供的Domain下，点击visit即可看到Welcome Page。

# {{< align center "Bingo！" >}}

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog10/CleanShot%202023-09-12%20at%2003.40.54%402x.png" alt="image" caption="部署成功！" >}}

### 3. 自定义配置

但是到此我只实现了刚才提到的“为什么要自建”的第一个理由，我获得了一个没有那么多人同时使用的相对私人的带有RSSHub功能的域名服务，可以把相关路由都迁移过来，生成对应的大部分订阅源。但我还是没有办法获取那些需要特定登陆信息才能完成信息提取的网站，像是Youtube、Bilibili、Pixiv、Instagram等等，当然也包括我的issue：端传媒。

* #### 配置Environment variables

参考RSSHub的[docs](https://docs.rsshub.app/zh/install#%E9%83%A8%E5%88%86-rss-%E6%A8%A1%E5%9D%97%E9%85%8D%E7%BD%AE)和[code](https://github.com/DIYgod/RSSHub/blob/master/lib/config.js)，我得知我需要为路由指定那些所需的特殊values。基于我选择的托管服务Vercel，这里可以采取两种方法：

1. 在Github的repo中的根目录下新建一个 `.env` 文件，每行以 `NAME=VALUE` 格式添加环境变量，例如：

   ```env
   CACHE_TYPE=redis
   CACHE_EXPIRE=600
   ```

2. 在Vercel的Dashboard中，点击settings，在左侧栏目中选择Enviroment variables，填入对应的Keys和Values并Save。

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog10/CleanShot%202023-09-12%20at%2002.20.58%402x.png" alt="image" caption="成对存在的环境变量-1" >}}

{{< figure src="https://github.com/ColeMei/Picgo/blob/master/blog10/CleanShot%202023-09-12%20at%2002.21.21@2x.png?raw=true" alt="image" caption="成对存在的环境变量-2" >}}

这里我选择的是第二种方法。另外值得注意的是，在每次添加新的或是修改现有的Variables后，都要Redeploy该Project才能使这些参数得以在路由中生效。

* #### 配置Custom Domains

如果你觉得Vercel给你分配的域名不太顺眼（且这个xxx.vercel.app好像是被默认墙的），那么你可以将它部署到自己的域名中。上文提到我手里正好有一个闲置的域名（也是从Github Student Package中薅的羊毛 ^o^，来自Name.com的免费一年的.live域名），于是就将Vercel的服务redirect到了我的这个域名上。相关操作非常简单，按部就班follow好vercel上的引导即可：

1. 添加域名
2. 在域名的DNS解析服务商（我的是Cloudflare）处添加相应的DNS记录
3. 等待redirect成功

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog10/CleanShot%202023-09-12%20at%2002.32.09%402x.png" alt="image" caption="自定义域名" >}}

### 4. 成果

至此，已经实现了Self-Host的全部步骤，此时，可以在RSSHub中的官方路由随意挑选几个，将其中域名 `https://rsshub.app` 的部分替换为我刚才成功自部署的域名，添加到阅读器中看看是否可以正常使用。如果你也同样和我一样使用**RSSHub Radar**的话，别忘了在设置中修改自定义RSSHub域名，像是这样：

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog10/CleanShot%202023-09-12%20at%2002.37.38%402x.png" alt="image" caption="RSSHub Radar" >}}

回到我心爱的阅读器Reeder中验证一下，在新的订阅源中，看看端传媒的文章能否完整输出呢？

{{< figure src="https://github.com/ColeMei/Picgo/blob/master/blog10/CleanShot%202023-09-12%20at%2002.43.21.gif?raw=true" alt="video" caption="最后的验证" >}}

可以看到，上面的GIF中，我先点击的是自建域名下生成的新订阅中的文章（全文），后点击的是老的订阅源中的文章（部分）

# {{< align center "Perfect！" >}}

---

## 结语

这篇blog算是对又一次的折腾之旅的一次小记录，并不能称之为一篇正经的教程，所以更多的记录的是我的一些思辨过程，写一些我想写的而不是简单的step by step的tracking。

最近这段时间日子过的比较清闲，在做出了可能是人生中的又一个Big Decision后，短暂结束了自己的迷茫与百无聊赖，折腾的频率就也又上来了。

今天难得心血来潮，洋洋洒洒写成此篇，就借此以最美好的祝愿许给RSS（Really Simple Syndication）这一古老朴素而余温无限的协议和其繁盛的生态以最高的敬意吧！
