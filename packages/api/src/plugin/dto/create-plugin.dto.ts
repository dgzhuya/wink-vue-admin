export class CreatePluginDto {
	constructor({ name, description }: CreatePluginDto) {
		if (name) this.name = name
		if (description) this.description = description
	}
	readonly name: string
	readonly description: string
}
