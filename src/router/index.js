import { createRouter, createWebHistory } from "vue-router"; // 1.导入路由
import Layout from "../views/Layout.vue";
// import * as path from "path"; // 导入组件方式1：先导入，下面引用

// 2.定义路由对象
const routes = [
  {
    path: "/login/",
    component: () => import("../views/Login"),
  },
  {
    path: "/", // URL
    name: "首页",
    component: Layout, // 引用组件
    redirect: "/dashboard", // 访问首页跳转到仪表盘
    children: [
      {
        path: "/dashboard",
        name: "仪表盘",
        icon: "HomeFilled",
        component: () => import("../views/dashboard/Dashboard"),
      },
    ],
  },
  {
    path: "/host",
    name: "主机管理",
    icon: "Platform",
    // 导入组件方式2：当路由被访问时才会加载组件（惰性）
    component: Layout,
    children: [
      {
        path: "/host/idc",
        name: "机房管理",
        component: () => import("../views/idc/Idc.vue"),
      },
      {
        path: "/host/server_group",
        name: "主机分组",
        component: () => import("../views/servergroup/ServerGroup.vue"),
      },
      {
        path: "/host/server",
        name: "主机管理",
        component: () => import("../views/server/Server"),
      },
    ],
  },
  {
    path: "/config",
    name: "系统配置",
    icon: "Setting",
    component: Layout,
    children: [
      {
        path: "/config/credential",
        name: "凭据管理",
        component: () => import("../views/credential/Credential.vue"),
      },
    ],
  },
];

// 3.创建路由实例并传递上面定义的路由对象
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // 路由模式
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(to.path, from.path, next);
  // 如果用户访问登录页，直接放行
  if (to.path == "/login/") {
    return next();
  }
  const token = window.sessionStorage.getItem("token");
  if (token) {
    next(); // 正常跳转
  } else {
    return next("/login/"); // 跳转转到登录页
  }
});

export default router;
