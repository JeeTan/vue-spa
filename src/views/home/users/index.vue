<template>
  <div class="users">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索区域  -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table border :data="users" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 使用作用域插槽  方式传递数据给父组件，然后可以通过父组件控制子组件的状态 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="mg_state" label="操作" width="175">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger "
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning "
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户区域 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialog">
      <el-form :model="addUsers" :rules="addUsersRules" ref="addUsersRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUsers.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUsers.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUsers.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUsers.mobile" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户区域 -->
    <el-dialog title="添加用户" :visible.sync="editDialogVisible" width="50%" @close="editDialog">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱的规则
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };

    // 验证手机号的规则
    const checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };

    return {
      // 控制添加用户层的显示隐藏
      addDialogVisible: false,
      // 控制编辑用户层的显示隐藏
      editDialogVisible: false,
      users: [],
      total: 0,
      // 获取用户列表的参数对象
      queryInfo: { query: "", pagenum: 1, pagesize: 3 },
      //添加用户的表单数据
      addUsers: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //编辑用户的表单数据
      editForm: {},
      // 添加表单的验证规则对象
      addUsersRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //编辑用户表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      const {
        data: { data, meta }
      } = await this.$http.get("users", { params: this.queryInfo });
      if (meta.status !== 200) return this.$Message.error(meta.msg);
      this.users = data.users;
      this.total = data.total;
      // console.log(data);
      // console.log(meta);
    },
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUsers();
    },
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUsers();
    },
    async userStateChanged(userinfo) {
      const {
        data: { data, meta }
      } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$Message.error(meta.msg);
      }
      this.$Message.success(meta.msg);
    },
    //关闭添加用户对话框并重置表单
    addDialog() {
      this.$refs.addUsersRef.resetFields();
    },
    //添加用户
    addUser() {
      this.$refs.addUsersRef.validate(async valid => {
        if (!valid) return;
        const {
          data: { data, meta }
        } = await this.$http.post("users", this.addUsers);
        if (meta.status !== 201) return this.$Message.error(meta.msg);
        this.$Message.success(meta.msg);
        this.addDialogVisible = false;
        this.getUsers();
      });
    },
    //展示编辑用户的对话框
    async showEditDialog(id) {
      this.editDialogVisible = true;
      const {
        data: { data, meta }
      } = await this.$http.get("users/" + id);
      if (meta.status !== 200) return this.$Message.error(meta.msg);
      this.editForm = data;
    },
    //关闭编辑用户对话框并重置表单
    editDialog() {
      this.$refs.editFormRef.resetFields();
    },
    //编辑用户
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const {
          data: { data, meta }
        } = await this.$http.put("users/" + this.editForm.id, this.editForm);
        if (meta.status !== 200) return this.$Message.error(meta.msg);
        //成功后弹出成功提示
        this.$Message.success(meta.msg);
        //关闭编辑用户对话框
        this.editDialogVisible = false;
        //调用 getUsers 重新渲染页面
        this.getUsers();
      });
    },
    //删除用户
    async removeUserById(id) {
      try {
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })

        const {
          data: { data, meta }
        } = await this.$http.delete("users/" + id);
        if (meta.status !== 200) return this.$Message.error(meta.msg);
        //成功后弹出成功提示
        this.$Message.success(meta.msg);
        //调用 getUsers 重新渲染页面
        this.getUsers();

      } catch (error) {
        this.$Message.info("已取消删除操作");
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>