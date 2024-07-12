-- 生成代码的字段信息
local nameField = FieldNew('name', 'string', '姓名')
local scoreField = FieldNew('score', 'number', '成绩')
local ageField = FieldNew('age', 'number', '年龄')

-- 生成代码的数据实体信息
local entity = {
	ORM.new(nameField, ORM.cType('varchar'), ORM.column('length', 100)),
	ORM.new(scoreField, ORM.cType('int'), ORM.column('nullable', true)),
	ORM.new(ageField, ORM.cType('int'))
}

-- 代码的DTO参数校验信息
local dto = {
	DTO.new(nameField, DTO.rule('isOptional', true), DTO.limit("姓名长度在1-10之间", 1, 10)),
	DTO.new(scoreField, DTO.rule('notEmpty', '成绩不能为空'), DTO.limit("成绩在0-100之间", 0, 100)),
	DTO.new(ageField, DTO.rule('isInt', '年龄应该为数字'), DTO.limit("年龄应该小于100岁", nil, 100))
}

-- 需要生成的api
-- all 分页查询数据请求
-- get 查询单次数据请求
-- update 更新数据请求
-- delete 删除数据请求
-- add 添加数据请求
local service = {
	API.new('update'), API.new('get', true, true), API.new('delete'), API.new('add'), API.new('all')
}

-- name 表示模块名
-- comment 表示模块中文名
-- path 表示模块的生成目录位置
local config = {
	name = 'student', comment = '学生', path = ''
}
-- 生成后端代码
NestRender(config, entity, dto, service)

-- 路由信息
local route = {
	path = '/student', -- 路由路径
	icon = 'student', -- 路由图标
	title = '学生信息' -- 路由标题
}
VueRender(config, route, { nameField, scoreField, ageField }, service)
