---
title: Kindle 5.x 软件越狱（PW2 / PW3 / KT2 / KT3 / KV / KOA）
original_title: "5 x Jailbreak"
source_url: https://wiki.mobileread.com/wiki/5_x_Jailbreak
original_author: MobileRead Wiki 贡献者（Coplate、NiLuJe、DaleDe、Monguin、Ilovejedd、Ttx、Katadelos、Nhgbslik 等；原页面 Credits 另致谢 knc1、Branch Delay、Geekmaster、eschwartz、Ryccardo、eeeee、ktwombley、kindlefere）
translated_at: 2026-11-10
order: 1
description: Kindle 触屏机型（PW2/PW3/KT2/KT3/KV/KOA）软件越狱的完整流程：判断固件能否越狱、屏蔽 OTA、准备出厂固件、校验 MD5、安装越狱与 hotfix、升级后保持越狱。
---

> 本文译自 MobileRead Wiki 的《5 x Jailbreak》页面，原文最后修订于 2021-10-04。
> 原文中的论坛帖链接与文件下载链接按原样保留，仅作为出处与下载入口引用，本站不镜像论坛内容。
> 越狱涉及刷写固件，做错会变砖——请按步骤一步一步来，不要跳步。

适用于 Kindle **PW2、PW3(B)、PW3W、KT2、KT3(B)、KT3W、KV、KOA** 的软件越狱。

第 9 代机型（KOA2 / Oasis 2）的软件越狱仍需要继续开发：KOA2 的 hotfix 包不会自动重装越狱，目前没有解决时间表。下面的第 1 步说明了如何根据序列号确定你的设备代号。

## 这个越狱能用在我当前的固件上吗？

看固件版本号的**第三段**：版本 `5.8.`**`7`**`.0.1` 里的三位数字中，如果第三段大于 **7**，这个越狱在你的设备上就不能用。

也就是说，以下版本**不能用**：5.8.8、5.8.9、5.8.10 …… 一直到 5.8.99999999。目前也**不能**先降级再用这个越狱。

同理，比 5.8.x 分支更新的版本（例如 5.9.x 以及之后可能出现的版本）也不能用。这段说明是持续维护的，请不要再来问"这条还有效吗"。

### 特例

- **PW3**：固件 5.9.6.1 及更早的版本可以越狱，见[这个帖子](https://www.mobileread.com/forums/showthread.php?t=313086)。
- **PW4**：固件 5.10.1.3 及更早的版本可以越狱；更新的固件**也许**同样可行，见[这个回帖](https://www.mobileread.com/forums/showpost.php?p=3956552&postcount=782)。
- **KT4**：固件 5.11.0 可以越狱，见[这个帖子](https://www.mobileread.com/forums/showthread.php?t=320570)。

### 关于降级

确实有人报告说，把固件比 5.8.7.x 更新的 Kindle 降级成功了；但更多人报告的结果是**设备变砖**。固件版本高于 5.8.7 时不建议尝试降级。

更稳妥的做法是**屏蔽更新**（在用户分区的根目录建一个名为 `update.bin.tmp.partial` 的空目录），然后定期回来这里或[论坛](https://www.mobileread.com/forums/forumdisplay.php?f=150)查看你的固件是否已经有越狱方案。

另一个方案是[串口方法](https://www.mobileread.com/forums/showthread.php?t=267541)：如果降级过程中变砖，串口也是唯一能救回来的手段——所以如果你决定在不受支持的设备上尝试降级，就得先做好用串口救砖的准备（再强调一次：风险很高，不建议）。

### 越狱能不能在升级后存活

在较早的固件上完成越狱后，已知升级到 5.8.8、5.8.9、5.8.9.2、5.8.10、5.8.11 都能保住越狱；根据论坛报告，升级到 5.9.2 和 5.9.4 也仍然有效。

它应该能在升级到**任何**固件版本后继续存活——这套机制是刻意设计成"可自我传染"的。

但是：**我们所有的附加组件（add-ins）都不能跨更新存活，每次升级后都必须重装。**

另外，**G090LK、G090LL（黑白屏、PW3、32GB、仅 WiFi）以及对应的两个 WiFi + 3G 型号只获得部分支持**，见[帖子 291336](https://www.mobileread.com/forums/showthread.php?t=291336)。

## 测试越狱是否完整（标题中列出的触屏机型）

下面附了一个"假"安装包，用来检测设备上的越狱是否装好：能跑起来说明越狱完整；跑不起来说明越狱缺失或已损坏。

这个假安装包不会安装任何东西，只在可见 USB 存储的顶层写一份报告文档（`dummy_updatetest.log`，原文另附示例）。

如果这个测试包连报告都写不出来，请**严格且完整地**从第 0 步重做到第 8 步。

1. 下载附件的压缩包并解压。包里只有一个名为 `Dummy` 的目录，所有内容都在其中。
2. 把 `Dummy` 目录里的 `Update_dummy_0.0.N.bin` 移动到 Kindle 的 `/mrpackages` 目录。
   如果你 Kindle 可见根目录下没有 `/mrpackages`，说明越狱已损坏，或者从来没装上过。
3. 触发这个包的安装：可以用 KUAL，也可以在搜索栏输入 `;log mrpi`。
   搜索栏这种方式只在它本来支持的设备（第 8 代机型）上有效。

## PW-2 且固件为 5.4.4.2 或更早

直接看[帖子 186645](https://www.mobileread.com/forums/showthread.php?t=186645)。

## 更早的（灰度屏）Kindle 机型

见[帖子 275881](https://www.mobileread.com/forums/showthread.php?t=275881)。

## 准备（原步骤 #0）

下面这份清单相当于"第 0 步"，执行顺序随意。

- 某些固件版本下，Kindle **必须**在 Amazon 完成注册，才能访问需要的菜单。
  通用规则是：如果还没注册，现在就注册。**联网之前先把本节读完。**
- 较新的固件版本对 OTA（Over The Air，自动更新）非常激进，而它会把设备升到无法越狱的版本。
  目前避免 OTA 最有效的办法，是在可见 USB 存储的顶层放一个"OTA 阻止目录"，目录名必须是：
  `update.bin.tmp.partial`——用完全一致的名字，不加任何扩展名，目录里不放任何内容。
- 移除你设置过的设备密码或家长控制密码。
- 如果是带广告（Special Offers）的机型，考虑在 Kindle 账户里退订。
  退订后要让设备保持足够长的在线时间，好让 Amazon 的服务器更新它本地的状态文件。
- 电量充满了吗？现在就插上墙充，确保电量充足。
- **一次只做一步。** 这些步骤就是按"一次一步"设计的。
  每完成一步，如果上一步放在可见 USB 存储顶层的文件还在，就把它删掉。
- 整个过程中 Kindle 应保持离线（飞行模式）。

## 分步操作

### 1. 确认设备代号

根据序列号**确定**你的 Kindle 机型代号。老款 Kindle 取前六个字符中的四个：`xxxx`xx；
新款取后六个字符中的四个：xx`xxxx`。对照这张表：[序列号与代号对照](https://wiki.mobileread.com/wiki/Kindle_Serial_Numbers)。

**出厂固件镜像不锁定机型，这一步的谨慎是你设备唯一的保护！** 如果表里查不到你的序列号，
**停在这里**，把序列号发出来问。

### 2. 为更早的固件版本做准备

先让 Kindle 具备运行更早版本固件的条件。

Kindle 有两个用户存储区域：一个是通过 USB 线能看到的，另一个是隐藏的。

擦除隐藏分区的过程，也会把 USB 可见区域里的东西一起擦掉。

- 备份 `/documents` 的内容。

你马上要把它们全清掉。如果这些书已经同步到 Kindle 云端，那就已经有备份了。

`/system` 的内容不需要备份——系统会自己重建。

**在把设备恢复到当初拷贝文件时的同一固件版本之前，不要把 `/documents` 的内容拷回 Kindle。**
除了"回到同一个地方、跑同一个版本"，其他做法都可能让索引器发疯。

你还会丢掉 Kindle 上的所有个性化设置。

那个隐藏目录你访问不到，而正是其中的数据库导致了大部分问题，所以它**必须**被清掉：
`主页 → 菜单 → 设置 → 菜单 →` **`重置`**（或你当前固件版本里对应的路径）。

这就是那个声名狼藉的"重置（恢复出厂设置）"菜单项，但在这个流程里它是**必须**执行的。

这也是设备整个生命周期里**唯一一次**应该使用"重置"菜单项——因为它会擦掉第 6 步即将写入的**越狱存活代码**。

**以后永远不要再使用"重置"菜单项**，除非你确实想清掉越狱存活代码（而你非常需要它）。

万一你不小心触发了"重置"（读完上面这段应该没人会故意这么做），可以在
[coplate 的快照帖](https://www.mobileread.com/forums/showthread.php?t=289215) 里找到一个包，用来恢复刚被清掉的越狱存活代码。
这个专用包放在可见 USB 存储的根目录，通过 UYK 菜单项运行；它设计上可以在官方固件（包括 5.8.10 这样的较新版本）上不经 MrPI 直接安装。

### 3. 把出厂固件下载到电脑

从下面的来源把**你机型对应的出厂固件镜像**下载到电脑（链接仅支持 IPv4）。

`.md5` 校验文件可以用来确认下载是否完整正确。

原先托管这些文件的论坛成员认为文件已经流传得够广，不再愿意继续支付托管费用，所以原来那些 `.bin` 下载链接现在指向 Google 搜索。

| 代号 | 出厂固件 | 文件名 | MD5 |
| --- | --- | --- | --- |
| KOA2 | 5.9.0.6 | `update_kindle_oasis_9th_factory_5.9.0.6.bin` | `18624db8c1838ec2b5b8bfb3406ac041` |
| KOA | 5.7.4 | `update_KOA_5.7.4_initial.bin` | `8f1e7c9124a2b12e643b15447d80feae` |
| KV | 5.5.0 | `update_KV_5.5.0_initial.bin` | `f7c8905ea993fef902be82b70a98542a` |
| KT4 | 5.11.0 | `update_kt4_5.11.0_factory.bin` | `fd3e7ed8ebea59432163a5e713cd90c5` |
| KT3 | 5.8.0 | `update_KT3_5.8.0_initial.bin` | `3f1a5294e1bca8c4fa7ca2762c5b4505` |
| KT2 | 5.6.0 | `update_KT2_5.6.0_initial.bin` | `d85a86f5c75b4b9d43648f3b6afd2e84` |
| PW4 | 5.10.1.3 | `update_pw4_5.10.1.3_factory.bin` | `538d939c2cb4f05c7952d33d5348f010` |
| PW3 | 5.9.6.1 | `update_pw3_5.9.6.1_factory.bin` | `a5460e698a531c7770ba2b1ac31667b0` |
| PW2 | 5.4.3.2 | `update_PW2_5.4.3.2_initial.bin` | `3cbac0b4821cec03432b9ed382744f41` |

原文为每个型号给出了多组镜像（Google 搜索、Primary、Baidu Yun、Mega.nz、Yandex Drive 各一套，
百度云还附提取码和 SHA1）。镜像地址变动频繁，这里只保留文件名与校验值，具体下载地址请回到
[原文页面](https://wiki.mobileread.com/wiki/5_x_Jailbreak) 对应小节取用。

### 4. 校验镜像并传到 Kindle

**先用 md5sum 校验**下载到的文件，再把出厂镜像从电脑传到 Kindle。

如果你是从[这个帖子](https://www.mobileread.com/forums/showthread.php?t=291336)（PW3-4、PW3-32、固件 5.8.9.0.1 软件越狱）过来的，
这一步要改用 `update_pw3_factory_5.8.9.0.1.bin`（原文给了分卷 ZIP 的两个 part）。
解压多分卷 ZIP 后，`.bin` 的文件大小应为 776814880 字节，MD5 为 `5d38744bd01f4cbf457dae4499c3c32a`。

**不要慌**：如果更新没有立刻开始，是正常的，通常要等 10 分钟甚至更久。

如果**没有出现明显延迟**，而检查 USB 存储时文件已经消失了，说明这个方法在你 Kindle 当前的固件版本上不管用。

1. 用 USB 线把 Kindle 连到电脑。
2. 把下载的 `update_*.bin` 放到可见 USB 存储的**最顶层**（和 `/documents` 同级）。
3. 弹出／安全移除（叫法取决于操作系统）Kindle 的 USB 存储。
4. 拔掉 USB 线。
5. `主页 → 菜单 → 设置 → 菜单 → 更新你的 Kindle`。
6. 确认。
7. 等待。

**PW-2 在这里是个特例**：改用[这个帖子](https://www.mobileread.com/forums/showthread.php?t=186645)里的旧版"通用越狱"，
按那里的说明做完后，跳过下面两步，直接进入第 7 步和第 8 步。

### 5. 下载并安装固件越狱

下载并安装 Branch Delay 出厂固件越狱的当前版本。**这一步会安装两个文件：我们的签名证书，以及一份 "Jail Broken" 文档。**

如果这一步做完后，Kindle 的 `/documents` 目录里没有 "Jail Broken" 那份文档，那证书也一定没装上。
**遇到这种情况就停在这里，把问题发出来**——越狱已经丢了，没有任何理由继续往下走。

当前版本附在它的发布帖里，见[出厂镜像越狱](https://www.mobileread.com/forums/showthread.php?t=275887)。

1. 用 USB 线把 Kindle 连到电脑。
2. 把下载的文件（压缩包，**保持原样**）放到可见 USB 存储的最顶层（和 `/documents` 同级）。
3. 弹出／安全移除 Kindle 的 USB 存储。
4. 拔掉 USB 线。
5. 回到主页。
6. 在搜索栏输入 `;installHtml` 后回车。对，分号也是这条搜索栏命令的一部分。

### 6. 下载并安装 hotfix

下载并安装当前的 hotfix（越狱存活代码）。

当前版本附在它的发布帖里，见[越狱存活代码](https://www.mobileread.com/forums/showthread.php?p=3004892&postcount=1597)。

如果你是从[PW3-4、PW3-32、固件 5.8.9.0.1 那个帖子](https://www.mobileread.com/forums/showthread.php?t=291336)过来的，
改用[这个](https://www.mobileread.com/forums/showpost.php?p=3562968&postcount=4)。

1. 解压发布包。
2. 用 USB 线把 Kindle 连到电脑。
3. 把 `Update_jailbreak_hotfix_*_install.bin` 放到可见 USB 存储的最顶层（和 `/documents` 同级）。
4. 弹出／安全移除 Kindle 的 USB 存储。
5. 拔掉 USB 线。
6. `主页 → 菜单 → 设置 → 菜单 → 更新你的 Kindle`。
7. 确认。
8. 等待。

### 7. 升级到更新的固件版本

现在你可以把 Kindle 升级到更新的固件，越狱会存活下来。

- **通过 OTA 升级到当前版本**：让 Kindle 联网并等待，它会自动更新到当前固件版本。
- **或者**：从 Amazon 手动下载指定固件版本并安装。
  - 要阻止 OTA 更新，就在可见 USB 存储顶层放那个阻止目录 `update.bin.tmp.partial`（用完全一致的名字，不加扩展名，目录里不放内容）。
  - 已发布的固件版本都能从 Amazon 的下载服务器拿到。下面给出部分版本在 Amazon 美国下载服务器的直链。
    注意：某些国家（例如德国）的旧版本使用的是与本列表不同的 build，这种情况下请用你平时会用的下载链接；
    只改 URL 里的版本号来选旧版本，这个技巧在美国服务器上同样适用。
    另外，最近的版本已经不再区分地区——这个变化**可能**发生在 Amazon 调整下载组织结构的前后（本列表里对应 fw-5.8.5）。

  **Amazon 直链**：

  - **KOA**：[5.7.4](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_oasis_5.7.4.bin)、
    [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_oasis_5.8.1.bin)、
    [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_oasis_5.8.2.bin)、
    [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_oasis_5.8.5.bin)、
    [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_oasis_5.8.7.0.1.bin)
  - **KV**：[5.7.4](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_voyage_5.7.4.bin)、
    [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_voyage_5.8.1.bin)、
    [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_voyage_5.8.2.bin)、
    [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_voyage_5.8.5.bin)、
    [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_voyage_5.8.7.0.1.bin)
  - **KT3**：[5.8.1.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_8th_5.8.1.1.bin)、
    [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_8th_5.8.2.bin)、
    [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_8th_5.8.5.bin)、
    [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_8th_5.8.7.0.1.bin)
  - **KT2**：[5.7.4](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_5.7.4.bin)、
    [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_5.8.1.bin)、
    [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_5.8.2.bin)、
    [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_5.8.5.bin)、
    [5.8.7.0.1](https://s3.amazonaws.com/firmwaredownloads/update_kindle_5.8.7.0.1.bin)
  - **PW3**：[5.7.4.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_all_new_paperwhite_5.7.4.1.bin)、
    [5.8.1](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_all_new_paperwhite_5.8.1.bin)、
    [5.8.2](https://s3.amazonaws.com/G7G_FirmwareUpdates_WebDownloads/update_kindle_all_new_paperwhite_5.8.2.bin)、
    [5.8.5](https://s3.amazonaws.com/firmwaredownloads/update_kindle_all_new_paperwhite_5.8.5.bin)

  原文还列出了 PW2、KT4 以及 PW3 更多版本的直链，完整清单见原文对应小节。

### 8. update_*.bin 格式的包

本文涉及的所有机型**都必须**用下面两种安装方式之一来处理 `update_*.bin` 格式的包。

KOA 和 KT3 用户**必须**用新的安装方式；其他机型新旧两种方式都可以。

我们所有的附加组件，只要文件名是 `update_*.bin` 格式，就必须用 **MrPI**（MobileRead Package Installer）安装。

MrPI 可以从[帖子 225030](https://www.mobileread.com/forums/showthread.php?t=225030) 的 "KUAL and KUAL extensions" 小节获取。

这是一个"解压到可见 USB 存储顶层"的包——注意你用的解压工具必须设置了**创建目录**的选项。

KOA 和 KT3 用户：必须用搜索栏命令 `;log mrpi` 运行安装器。
本文涉及的其他机型也可以这样做，或者从 KUAL 里运行。

几乎所有附加组件都需要一个应用启动器（application launcher）。可以从同一个帖子的
"KUAL and KUAL extensions" 小节获取 KUAL 包。

从 2.6.40 版开始，压缩包里包含 KUAL 的三个不同 build：`keyboard` 版、`(old) touchscreen` 版，
以及新的 `KOA, KT3` 版。这不是读包里 `README.txt` 的替代品，不过……

KOA 和 KT3 用户：必须用 `update_*.bin` 格式的 KUAL 包，并且必须用 MrPI 安装。

其他设备：压缩包里仍然包含旧的"文档"形态 KUAL，把（正确的）KUAL 文档放进 USB 存储的
`/documents` 目录即可。

**注意**：新的 `update_*.bin` 格式的 KUAL 可以在所有固件 5.1.2 及更新的触屏设备上运行。

"几乎所有应用都需要一个启动器"——KUAL 正是**不需要**启动器的应用之一：
它关联了一个 MIME 类型，系统在被选中时就知道该怎么运行它。

`update_*.bin` 格式的包在每次固件更新后都必须重装。

MrPI 可以同时处理多个 `update_*.bin` 包：把它们都放进 `/mrpackages`，然后触发 MrPI 即可。

## 致谢

- **NiLuJe**：发现出厂更新包可以被恢复（PW-2）。
- **knc1**：发布 HowTo，并恢复了 KT-2 与 PW-3 的出厂包。
- **论坛成员**：多位成员恢复并提供了 KV 的出厂镜像。
- **knc1**：认识到出厂初始更新可以在任何（匹配的）零售机型上重装。
- **Branch Delay**：5.6.5 版本的原始软件越狱，以及针对出厂镜像的通用越狱。
- **Branch Delay、NiLuJe、Geekmaster**：该方法的初始测试。
- **Geekmaster**：站外 Kindle 救援资源的存档者。
- **knc1、Geekmaster、NiLuJe、kindlefere**：服务器资源。
- **NiLuJe、Ryccardo、eschwartz**：定位并测试了 Kindle 卡死问题的根源。
- **某位论坛成员**：恢复了制作 Oasis 支持所需的镜像。
- **eeeee**：恢复了制作 PW-3 与 PW-3W 支持所需的更新镜像。
- **ktwombley**：恢复了制作 KT3 支持所需的镜像。
- **eschwartz**：目前是 Branch Delay 出厂镜像越狱的维护者。
- **eschwartz、NiLuJe 等**：为 Oasis（KOA）及其他机型开发新的菜单启动器。
- 首次公开发布由 Hackaday 完成，见 [Hackaday 报道](https://hackaday.com/2016/07/09/a-jailbreak-for-every-kindle/)，
  这个帖子的大量浏览也应记在它头上。

以上是一年多时间里持续投入的大量工作，而且仍在继续。这次降级攻击不是一夜之间发生的，也不是任何一个人的功劳。

## 发布策略

我们的策略是对已发布的项目采用"单一维护点"模式，只有一个例外：

- NiLuJe 的 snapshots：使用时请按前缀 `tools` 过滤并查看主题列表。用户应始终到 snapshot 帖查看我们第三方附加组件的最新构建。

## 附件（原文）

| 类型 | 文件 | 说明 |
| --- | --- | --- |
| zip | `install_test_dummy.zip`（11.9 KB） | 越狱完整性测试包 |
| txt | `dummy_testupdate.txt`（13.5 KB） | 测试包写出的报告示例 |
| zip | `adrive_md5_all.zip`（1.6 KB） | 出厂固件的 MD5 清单 |

这三个附件挂在原文页面底部，下载入口见[原文](https://wiki.mobileread.com/wiki/5_x_Jailbreak)。
