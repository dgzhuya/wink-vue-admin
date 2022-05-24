## wink-vue-admin

> 这是一个使用 vue3+ts+nestjs 开发的后台管理系统,可通过内置 dsl 快速生成代码

### 使用 dsl 快速生成模块

1. 创建 dsl 源文件

```txt
#name: "hello"
// api or database
#way: "database"
#model {
	id: @id @number
	name: @dto @string
	score: @dto @number
	isMale: @dto @boolean @nullable
}

#dto {
	name: @string
}

#api {
	@get
	@post
	@delete
	@update
	@all
}

```

2. 使用 dsl 生成模块

-   打开 packages/compile/test/gen.spec.ts 文件
-   修改生成路径配置

```ts
// dsl文件路径配置
const path = resolve(__dirname, '../../../sources/model.txt')
// outDir:输出路径
// appModulePath: nestjs appModule文件路径
setConfigPath({ outDir: '../api/src/', appModulePath: '../api/src/app.module.ts' })
const source = readFileSync(path).toString()
const result = analyse(source)
if (!result.error) {
	nodeParser(result.data).then(node => {
		translate(node)
	})
}
```

-   运行 jest 生成代码

```shell
pnpm jest test/gen.spec.ts -t 'gen module'
```
