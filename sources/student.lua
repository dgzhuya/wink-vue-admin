Nest.render({ name = 'student', path = 'test/' }, {
	Nest.entity('name', 'string', Nest.cType('varchar'),
		Nest.column('length', 100), Nest.column('comment', '学生姓名')),
	Nest.entity('score', 'number', Nest.column('comment', '学生成绩'),
		Nest.cType('int'), Nest.column('nullable', true)),
	Nest.entity('age', 'number', Nest.column('name', 'age_s'),
		Nest.cType('int'), Nest.column('comment', '学生年龄'))
}, {
	Nest.dto('name', 'string', Nest.rule('isOptional', true),
		Nest.limit("姓名长度在2-100之间", 2, 100)),
	Nest.dto('score', 'number', Nest.rule('notEmpty', '成绩不能为空'),
		Nest.limit("成绩在0-100之间", 0, 100)),
	Nest.dto('age', 'number', Nest.rule('isInt', '年龄应该为数字'),
		Nest.limit("年龄应该小于100岁", nil, 100)
	)
}, {
	Nest.service('update'), Nest.service('add'), Nest.service('get'),
	Nest.service('all'), Nest.service('delete')
})
