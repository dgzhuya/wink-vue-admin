# wink-vue-admin

> 这是一个使用 vue3+ts+nestjs 开发的后台管理系统,可通过`vscode`下`codegen-lua`插件使用`lua`快速生成代码

## 项目启动

> 本项目使用pnpm管理,请提前安装 [pnpm](https://pnpm.io/)

### 1. 安装依赖
- 通用依赖

  ```sh
  pnpm i
  ```
- 后端依赖(server目录)
  ```sh
  pnpm i
  ```
- 前端依赖(web目录)
  ```sh
  pnpm i
  ```
### 2. 初始化数据库
- 设置数据库类型
  - 进入`server`目录找到`.config.toml`文件
  - 查看数据库配置如下，默认为`sqlite`数据库，可修改为`mysql`数据库
  ```toml
	[database]
	type = "sqlite"   # 配置数据库类型 mysql,sqlite
	path = "admin.db" # sqlite数据库文件位置
	# host = ""       # 配置mysql地址
	# port = ""       # 端口
	# username = ""   # 用户名
	# password = ""   # 密码
	# database = ""   # 数据库
  ```
   - 建议在`server`目录下创建`.config.local.toml`文件(不会被`git`记录),使用此文件配置数据库,会优先读取该文件配置
- 进入根目录,执行`npm`命令
	```sh
	pnpm run database
	```
### 3. 启动项目
- 启动服务端
  进入`server`目录下直接运行命令
  ```sh
  pnpm run start:dev
  ```
- 启动`Web`端
  ```sh
  pnpm run dev
  ```
### 4. 代码部署
- `Nginx`部署前端代码
  - 构建生产包[点击查看](https://cn.vitejs.dev/guide/build.html)
  - 上传到服务器，配置`nginx`,参考配置文件如下
    ```conf
	server {
		# 服务器端口使用443，开启ssl, 这里ssl就是上面安装的ssl模块
		listen       443 ssl;
		# 域名，多个以空格分开
		server_name  example.com; # 设置为自己的域名

		# ssl证书地址
		# path-to修改为实际的地址
		ssl_certificate     path-to/ssl.crt;  # pem文件的路径
		ssl_certificate_key  path-to/ssl.key; # key文件的路径

		# ssl验证相关配置
		ssl_session_timeout  5m;    #缓存有效期
		ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;    #加密算法
		ssl_protocols TLSv1 TLSv1.1 TLSv1.2;    #安全链接可选的加密协议
		ssl_prefer_server_ciphers on;   #使用服务器端的首选算法

		# 配置实际的地址
		location / {
			root path-to/dist;
			try_files $uri $uri/ /index.html;
			index  index.html index.htm;
		}

		# 配置后端服务代理
		# address-to修改为实际的后端服务地址
		location /server {
			proxy_pass http://address-to;
			rewrite  ^/server/(.*)$  /$1  break;
		}
	}
	```
- `pm2`部署后端代码
  - 安装配置`pm2`[点进查看](https://pm2.fenxianglu.cn/docs/start)
  - `nestjs`项目打包,进入`server`目录,执行
	```sh
	pnpm run build
	``` 
  - 退出`server`目录,进入根目录,执行
    ```sh
	pm2 start
	```
	
## 代码生成
### 1. 安装插件，搜索`codegen-lua`插件安装
### 2. 生成代码
- 创建配置文件(存在此文件可跳过)
  - 在根目录下创建文件`.luagenrc`填入信息
    ```json
	{
		"apiDir": "server/src",
		"webDir": "web/src/modules"
	}
	``` 
    - `apiDir`: 后端代码生成位置
    - `webDir`: 前端代码生成位置
- 修改`lua`代码
  - 在`vscode`选中`.luagenrc`,点击右键,在菜单最下方,点击生成`lua类型文件`选项
  - 进入`sources`目录下，打开`student.lua`文件，根据注释信息修改文件
  - 修改完成后,在编辑页面右键菜单,点击`使用lua生成代码`或`通过lua清理代码`选项即可完成`代码生成/已生成代码清理`操作
### 3. 执行数据库插入命令
> 如果生成/清理操作中包含对于前端页面的操作，需要按照插件提示，复制命令到项目根目录执行
