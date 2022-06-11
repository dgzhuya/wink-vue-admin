import { readFileSync } from 'fs'
import { analyse, nodeParser, setConfigPath, translate, clearModule } from 'dist'

setConfigPath({ nestDir: '../api/src/', webDir: '../web/src/' })

const source = readFileSync('../../sources/model.wks').toString()
const { data, error } = analyse(source)
if (!error) {
	nodeParser(data).then(res => {
		translate(res)
		clearModule(res)
	})
}
