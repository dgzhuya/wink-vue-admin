import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'

export const toast = (msg: string) => {
	ElMessage.error(msg)
}
