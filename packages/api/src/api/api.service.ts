import { Injectable } from '@nestjs/common'
import { CreateApiDto } from './dto/create-api.dto'
import { UpdateApiDto } from './dto/update-api.dto'

@Injectable()
export class ApiService {
	create(createApiDto: CreateApiDto) {
		return 'This action adds a new api'
	}

	findAll() {
		return `This action returns all api`
	}

	findOne(id: number) {
		return `This action returns a #${id} api`
	}

	update(id: number, updateApiDto: UpdateApiDto) {
		return `This action updates a #${id} api`
	}

	remove(id: number) {
		return `This action removes a #${id} api`
	}
}
