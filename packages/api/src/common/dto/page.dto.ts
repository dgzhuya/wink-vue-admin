import { IsNotEmpty, IsOptional, Matches, MaxLength } from 'class-validator'

export class PageDto {
	@IsNotEmpty({ message: '页数不能为空' })
	@Matches(/^(\d*)$/, { message: '页码不是数字' })
	readonly page?: string

	@IsNotEmpty({ message: '查询数量不能为空' })
	@Matches(/^(\d*)$/, { message: '条目数不是数字' })
	readonly count?: string

	@IsOptional()
	@MaxLength(100, { message: '搜索关键字太长' })
	readonly search?: string

	static setSkipTake(pageDto: PageDto) {
		const take = pageDto.count ? +pageDto.count : 5
		const skip = pageDto.page ? (+pageDto.page - 1) * take : 0
		return {
			take,
			skip
		}
	}
}
