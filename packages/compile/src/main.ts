import { readFileSync } from 'fs'
import { analyse, nodeParser, setConfigPath, clearModule } from 'dist'

setConfigPath({ nestDir: '../api/src/', webDir: '../web/src/' })

const source = readFileSync('../../sources/model.wks').toString()
const { data, error } = analyse(source)
if (!error) {
	nodeParser(data).then(res => {
		clearModule(res)
	})
}
