import {
	createSSRApp
} from "vue";
import App from "./App.vue";
// 直接导入uni-icons组件
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

export function createApp() {
	const app = createSSRApp(App);
	// 全局注册uni-icons组件
	app.component('uni-icons', UniIcons);
	return {
		app,
	};
}
