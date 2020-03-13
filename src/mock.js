import Mock from 'mockjs'
// 将所有的mock文件引入
import listAPI from './listmock'

export default {
	startMock(){
		// 设置所有ajax请求的超时时间，模拟网络传输耗时
		Mock.setup({
		    timeout: 0-300
		})
		//在index.js中引入数据
		Mock.mock('/list/index', 'get', listAPI.listData);
	}
}
