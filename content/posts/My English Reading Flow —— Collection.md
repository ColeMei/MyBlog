---
title: "My English Reading Flow —— Collection"
slug: "my-english-reading-flow--collection"
date: 2023-04-13T09:58:24+08:00
draft: false
toc: true
description: 'The third in a series'
pin: false
scrolltotop: true
ShowLastmod: false
images:
  - https://picsum.photos/1920/1080/?random
tags: 
  - Expierence Sharing
---

这是My Reading Flow （For English Source）系列博客的第三篇

讲完了如何阅读，下面来聊聊整条flow的最后一个环节，**Collection** — 对读过的文章进行收录。其实在第二部分Read中，我当时就谈及了一些关于收录的事情。

但是必须要说的是，Collection**并不是**一个阅读流中必不可少的环节。像有很多朋友觉得这些不过是伪需求，疲于形式。但就像我在之前的Q&A中谈到的一点我的理解（很主观）：纵使你真的不会再想起这些你收录的内容（当然，你有很大的可能会有用得到它们的时候，它相当于为你读过的信息加上索引，方便你回顾、引用，这是它的**实际意义**），收录行为也会为你的阅读带来完整性，完整性又带来仪式感，这些都潜移默化地强化着你的阅读体验，帮助你日复一日养成阅读的习惯，明晰阅读的意义（算是种**精神意义**吧）。

而特别对于像我本人这种有点[收藏癖](https://zh.wikipedia.org/zh-tw/%E8%97%8F%E4%B9%A6%E7%99%96)的情况，看着被填得满满当当的database，真的很爽啊拜托！

在明确了Collection并不是一项可有可无的工作后，来聊聊我是怎样做收录的。

对于前文谈到的两种不同的阅读模式，我分别在**Notion**中建了两个不同的**Database**来实现信息的收录。大名鼎鼎的[Notion](https://www.notion.so/product?fredir=1)自然不必多介绍，它特有的database功能很适合完成这项工作：选择为数据库添加不同种类的view可以清晰地展示信息，利用好Filter和Sort两种工具可以帮助我很好的完成对信息的检索和二次利用。

当设计并部署好适合自己阅读的数据库后，这其实算是件**一劳永逸**的事情，你后期需要做的只是把文章填加进来就好。

{{< youtube O8qdvSxDYNY >}}

## Database1  (For Reading Type1)

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog5/01.png" alt="image" caption="Database1 TableView" class="" >}}

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog5/02.png" alt="image" caption="Database1 BoardView" class="" >}}

如图所示，在Database 1 "Jornal List" 中，我作了如下设计：

* *Property*
  1. *Title：文章标题*
  2. *From：文章出处*
  3. *Date：开始阅读的日期*
  4. *Category：文章分类*
  5. *Words：link单词汇总的pdf文件（由Eudic的生词本自动生成）*

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog5/03.png" alt="image" caption="Words PDF" class="" >}}

* *View*
  1. *Table*
     * *Sort by Date*
     * *Filter by Category & From*
  2. *Board* 
     * *Group by Category*

### 一些说明

总的来说，Database1设计的比较简单，仅保留了一些便于Filter和Sort的Properties。其中Category Board可以将自己阅读涉猎的领域作简单可视化，看看自己对哪些领域比较感兴趣，又对哪些方面的信息比较抗拒。

而阅读中对于语料的积累，都以pdf文件的方式将文章本体存档在对应文件夹内：

* *标注过的文章本体，裁切后以统一格式命名（收录在文件夹：外刊精读）*

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog5/04.png" alt="image" caption="对文章本体的收录" class="" >}}

* *生词（收录在文件夹：生词本）*

## Database2  (For Reading Type2)

如图所示，在Database 2 "Reading List" 中，我作了如下设计：

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog5/05.png" alt="image" caption="Database2 TableView 01" class="" >}}

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog5/06.png" alt="image" caption="Database2 TableView 02" class="" >}}

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog5/07.png" alt="image" caption="Database2 Gallery for Articles" class="" >}}

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog5/08.png" alt="image" caption="Database2 Gallery for News" class="" >}}

* *Property*

  1. *Type：文章类型（Articles、News、Film&TV）*
  2. *Title：文章标题*
  3. *Status：阅读状态（按时态分为三种）*
  4. *Score/5：评价打分*
  5. *Author：作者*
  6. *Publisher：出版社*
  7. *Publishing/Release Date：发行日期*
  8. *Link：链接*
  9. *Summary：文章内容总结（一般是直接摘抄文章的Subtitle）*

* *View*

  1. *Table for All*
  2. *Gallery for Articles*
  3. *Gallery for News*
  4. *Gallery for Film&TV*

  > 三种Gallery分别对应上面三种Type

### 一些说明

特别要强调的是，因为我也会阅读很多**中文信息**，所以本质上Reading List是我阅读**各类信息**的收录库，并不局限于英文信息。

可以看到，区别database 1，我对Property作了比较细致的划分，并增加了一些**新的元素**，像是比较主观的Score（对于不同的文章类型适用不同的打分标准）；考虑到有的文章（像是某篇Essay或是项目的Document）不能一天读完，我引入了Status这一概念，由Ready to Start、Reading、Finished三个选项组成；还有像是Summary，它可以加速我完成对于信息的索引构建。

另外对于这一类阅读，将文章收录进数据库时，我还会将阅读时的一些摘录（在第二节的Type 2中讲到，由Paste实现）也一并誊抄进来，用quote block，并且用简短的一个或几个单词总结一下这段文字是在讲什么，像是这样：

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog5/09.png" alt="image" caption="Outlook" class="" >}}

{{< figure src="https://raw.githubusercontent.com/ColeMei/Picgo/master/blog5/10.png" alt="image" caption="Excerpt" class="" >}}

相信我，搭配Gallery View可以将你的Collection打造得**井然有序且质感十足**。

## 小结

其实很多阅读工具中都自带一些类似的收录功能，像是Apple News+中的Saved Story和Hisroty、Reeder中的Star和Add to Read Later，甚至是Chrome中的Bookmark，Mail中的Flag。但是我还是更喜欢将不同平台，不同种类篇幅的信息作统一的收录，像是我在Notion的database中做的这样，毕竟术业有专攻嘛。



# 完结撒花～🎉

