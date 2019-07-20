<template>
  <div class="home">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="./heima.png" alt />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="width">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="menu.id + ''" v-for="menu in menus" :key="menu.id">
              <template slot="title">
                <!-- 图标 -->
                <i :class="icon[menu.id]"></i>
                <!-- 文本 -->
                <span>{{menu.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+stuItem.path"
                v-for="stuItem in menu.children"
                :key="stuItem.id"
                @click="getActivePath('/'+stuItem.path)"
              >
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{stuItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { setTimeout } from "timers";
import { log } from "util";
export default {
  data: () => ({
    menus: [],
    icon: {
      "125": "iconfont icon-user",
      "103": "iconfont icon-tijikongjian",
      "101": "iconfont icon-shangpin",
      "102": "iconfont icon-danju",
      "145": "iconfont icon-baobiao"
    },
    isCollapse: false,
    activePath: sessionStorage.getItem("activePath") || ""
  }),
  created() {
    this.getMenu();
  },
  methods: {
    logout() {
      sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenu() {
      const {
        data: { data, meta }
      } = await this.$http.get("menus");
      //  console.log(meta);
      if (meta.status !== 200) return this.$Message.error(meta.msg);
      // console.log(data);
      this.menus = data;
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    getActivePath(activePath) {
      // console.log(activePath);
      this.activePath = activePath;
      //通过本地存储地址
      sessionStorage.setItem("activePath", activePath);
    }
  },
  computed: {
    width() {
      return this.isCollapse ? "64px" : "200px";
    }
  }
};
</script>
<style lang="less" scoped>
.home {
  height: 100%;
}
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>