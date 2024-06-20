# wink-vue-admin

> 这是一个使用 vue3+ts+nestjs 开发的后台管理系统,可通过`vscode`下`codegen-lua`插件使用`lua`快速生成代码

### 使用手册

> 本项目使用pnpm管理,请提前安装 [pnpm](https://pnpm.io/)

- 项目依赖

  ```sh
  pnpm i
  ```
- 初始化数据库
  
  进入`packages/api`目录下运行
  ```sh
  pnpm init
  ```

- 安装插件
	vscode插件中心搜索`codegen-lua`安装即可
	![图片信息](./docs/code-gen.png)
- 生成代码
  - 修改`.luggenrc`文件设置文件生成目录
    - [x] apiDir: 后端模块根目录
    - [ ] webdDir: 前端模块根目录(未完成)
  - 打开`sources/student.lua`文件，点击右键即可
    ![图片信息](./docs/gen-ctrl.png) 
  - 修改`lua`文件
    - 鼠标放置到`.luggenrc`文件上,右键点击即可出现生成`lua`类型文件选项，点击即可生成类型文件到`.vscode`目录下
      ![图片信息](./docs/gen-type.png)
