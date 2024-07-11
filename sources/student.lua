local nameField = FieldNew('name', 'string', '姓名')
local scoreField = FieldNew('score', 'number', '成绩')
local ageField = FieldNew('age', 'number', '年龄')

local entity = {
	ORM.new(nameField, ORM.cType('varchar'), ORM.column('length', 100)),
	ORM.new(scoreField, ORM.cType('int'), ORM.column('nullable', true)),
	ORM.new(ageField, ORM.cType('int'))
}

local dto = {
	DTO.new(nameField, DTO.rule('isOptional', true), DTO.limit("姓名长度在1-10之间", 1, 10)),
	DTO.new(scoreField, DTO.rule('notEmpty', '成绩不能为空'), DTO.limit("成绩在0-100之间", 0, 100)),
	DTO.new(ageField, DTO.rule('isInt', '年龄应该为数字'), DTO.limit("年龄应该小于100岁", nil, 100))
}

local service = {
	API.new('update'), API.new('get', true, true), API.new('delete'), API.new('add'), API.new('all')
}

local config = {
	name = 'student', comment = '学生'
}
NestRender(config, entity, dto, service)
VueRender(config, {
	path = '/student',
	icon = 'student',
	title = '学生信息'
}, { nameField, scoreField, ageField }, service)
