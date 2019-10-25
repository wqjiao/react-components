import React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from '../utils/asyncComponent'; // 按需加载处理
import clearSession from '../utils/sessionStorage'; // 清除缓存
import Home from '../pages/App';
import RefsForm from '../pages/RefsForm';
import DragImg from '../pages/DragImg';
import SlickSwiper from '../pages/SlickSwiper';
import GGEditorFlow from '../components/GGEditor/Flow';
import GGEditorKoni from '../components/GGEditor/Koni';
import GGEditorMind from '../components/GGEditor/Mind';

// Route json file(route name、path and component)
// import routeJson from './routeJson'; // 路由数据

const enterRoute = () => {
    // 清除路由产生的缓存
    clearSession();
}

const Routes = (
    <div>
        <Switch>
            <Route exact path="/" component={Home} /> {/* exact 严格匹配'/'路由 */}
			<Route path="/RefsForm" component={RefsForm} />
			<Route path="/DragImg" component={DragImg} />
			<Route path="/flow" component={GGEditorFlow} />
			<Route path="/SlickSwiper" component={SlickSwiper} />
			{/* <Route
				path="/RefsForm"
				component={
					asyncComponent(() => import('../pages/RefsForm'))
				}
			/> */}
			{/* webpackChunkName: "RefsForm" */}
            {/* {
				Object.keys(routeJson).map((item, index) => {
					return (
						routeJson[item].map( (key) => {
							return (
								<Route
									key={ key.name + '-' + index }
									path={ key.path }
									component={asyncComponent(() => import('../pages/' + key.name))}
									onEnter={ key.isEnter ? enterRoute.bind(this) : '' }
								/>
							)
						})
					)
				})
			} */}
        </Switch>
    </div>
);

export default Routes;

// import React from 'react';
// import { Route, Switch } from 'react-router-dom';
// import asyncComponent from '../utils/asyncComponent'; // 按需加载处理

// const routes = [{
// 	name: 'App',
// 	path: '/',
// }, {
// 	name: 'RefsForm',
// 	path: '/RefsForm'
// }];

// const Routes = (
//     <div>
//         <Switch>
// 			{routes.map( item => {
// 				return (
// 					<Route
// 						key={ item.name }
// 						path={ item.path }
// 						component={asyncComponent(() => import(`/* webpackChunkName: ^${item.name}^ */ '@/pages/${item.name}`))}
// 					/>
// 				)
// 			})}
//         </Switch>
//     </div>
// );

// export default Routes;
