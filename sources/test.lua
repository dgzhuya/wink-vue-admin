Nest.render({
	Nest.entity('name', 'string', Nest.cType('varchar'), Nest.column('comment', '学生姓名')),
	Nest.entity('score', 'number', Nest.cType('int'),
		Nest.column('nullable', true), Nest.column('comment', '学生成绩')),
	Nest.entity('age', 'number', Nest.cType('int'),
		Nest.column('name', 'age_s'), Nest.column('comment', '学生年龄'))
}, {
	Nest.dto('name', 'string', Nest.rule('isOptional', true), Nest.limit("最小长度为10", 10)),
	Nest.dto('score', 'number', Nest.rule('notEmpty', '成绩不能为空'), Nest.limit("成绩在0-100之间", 0, 100)),
	Nest.dto('age', 'number', Nest.rule('isInt', '年龄应该为数字'), Nest.limit("年龄应该小于100岁", nil, 100))
}, {
	Nest.service('update', true), Nest.service('get'), Nest.service('all'),
}, {
	name = 'student', path = 'test/'
})

Nest.render({
	Nest.entity('name', 'string', Nest.cType('varchar'), Nest.column('comment', '学生姓名')),
	Nest.entity('score', 'number', Nest.cType('int'),
		Nest.column('nullable', true), Nest.column('comment', '学生成绩')),
	Nest.entity('age', 'number', Nest.cType('int'),
		Nest.column('name', 'age_s'), Nest.column('comment', '学生年龄'))
}, {
	Nest.dto('name', 'string', Nest.rule('isOptional', true), Nest.limit("最小长度为10", 10)),
	Nest.dto('score', 'number', Nest.rule('notEmpty', '成绩不能为空'), Nest.limit("成绩在0-100之间", 0, 100)),
	Nest.dto('age', 'number', Nest.rule('isInt', '年龄应该为数字'), Nest.limit("年龄应该小于100岁", nil, 100))
}, {
	Nest.service('update', true), Nest.service('get'), Nest.service('all'),
}, {
	name = 'teacher', path = 'test/'
})
