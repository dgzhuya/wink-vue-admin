import { readFileSync } from 'fs'
import { analyse, nodeParser, setConfigPath, clearModule } from 'dist'

setConfigPath({ nestDir: '../api/src/', webDir: '../web/src/' })

const source = readFileSync('/Users/pinktu/Desktop/wink-scripts/field.wks').toString()
const { data, error } = analyse(source)
if (!error) {
	nodeParser(data).then(res => {
		clearModule(res)
	})
}
