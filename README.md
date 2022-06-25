# wink-vue-admin

> 这是一个使用 vue3+ts+nestjs 开发的后台管理系统,可通过内置 dsl 快速生成代码

### 安装依赖

> 本项目使用pnpm管理,请提前安装 [pnpm](https://pnpm.io/)

* 项目依赖

  ```shell
  pnpm i
  ```
* 编译compile，然后再次安装

  ```shell
  pnpm build:compile && pnpm i
  ```

### 运行服务

> 设置环境变量为process.env.NODE_ENV为production用于接受websocket消息(使用pm2运行可跳过)

#### 下载[数据库](https://pinktu.github.io/admin.db),放入packages/api目录下

#### 直接运行

- 运行API服务

  > 在packages/api目录运行命令
  >

  ```sh
  pnpm start:dev
  ```
- 运行build服务

  > 进入packages/build目录运行命令
  >

  ```sh
  pnpm dev
  ```
- 运行前端项目

  > 进入packages/web目录运行命令
  >

  ```sh
  pnpm dev
  ```

#### 使用pm2和vite preview运行(推荐)

> 需要提前安装[pm2](https://pm2.keymetrics.io/docs/usage/quick-start/)

- 编译API文件

  > 进入package/api目录运行
  >

  ```shell
  pnpm build
  ```
- pm2运行后端

  > 在根目录下运行命令
  >

  ```sh
  pm2 start
  ```
- 运行前端项目

  > 进入packages/web目录运行命令
  >

  ```sh
  pnpm preview
  ```

### 项目登录

> 默认用户名为super-admin,密码为123456

### 功能代码生成

> 进入插件管理，点击上传sources/model.wks文件即可生成相关业务代码
