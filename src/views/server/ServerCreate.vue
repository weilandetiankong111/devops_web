<template>
  <el-dialog
    :model-value="visible"
    title="创建主机"
    @close="dialogClose"
    width="40%"
  >
    <el-form :model="form" ref="formRef" :rules="formRules" label-width="100px">
      <el-form-item label="IDC机房：" prop="idc">
        <el-select
          class="m-2"
          v-model="form.idc"
          @click="getIdc"
          placeholder="请选择"
        >
          <el-option
            v-for="row in idc"
            :key="row.id"
            :label="row.name"
            :value="row.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主机分组：" prop="server_group">
        <el-select
          class="m-2"
          multiple
          v-model="form.server_group"
          @click="getServerGroup"
          placeholder="请选择"
        >
          <el-option
            v-for="row in serverGroup"
            :key="row.id"
            :label="row.name"
            :value="row.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机器名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="例如：测试机"
        ></el-input> </el-form-item
      >主机分组
      <el-form-item label="主机名称：" prop="hostname">
        <el-input v-model="form.hostname"></el-input>
        <el-tag class="ml-2" type="warning"
          ><el-icon><InfoFilled /></el-icon>必须与实际主机名一致</el-tag
        >
      </el-form-item>
      <el-form-item label="SSH连接：" required>
        <el-col :span="1.5">
          <el-tag size="large" type="info">IP</el-tag>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="ssh_ip">
            <el-input v-model="form.ssh_ip"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1.5">
          <el-tag size="large" type="info">端口</el-tag>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="ssh_port">
            <el-input v-model="form.ssh_port"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="SSH凭据：" prop="credential">
        <el-select
          class="m-2"
          v-model="form.credential"
          @click="getCredential"
          placeholder="请选择"
        >
          <el-option
            v-for="row in credential"
            :key="row.id"
            :label="`${row.name}-${row.username}`"
            :value="row.id"
          >
          </el-option>
        </el-select>
        <el-col :span="3" :offset="1">
          <el-button
            type="primary"
            plain
            @click="this.$router.push('/config/credential')"
            >新建</el-button
          >
        </el-col>
      </el-form-item>
      <el-form-item label="备注：" prop="note">
        <el-input v-model="form.note" type="textarea"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "ServerCreate",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        name: "",
        note: "",
      },
      formRules: {
        idc: [{ required: true, message: "请选择IDC机房", trigger: "blur" }],
        server_group: [
          { required: true, message: "请选择主机分组", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入机器名称", trigger: "blur" },
          { min: 2, message: "主机名长度应不小于2个字符", trigger: "blur" },
        ],
        hostname: [
          { required: true, message: "请输入主机名称", trigger: "blur" },
          { min: 4, message: "主机名长度不小于4个字符", trigger: "blur" },
        ],
        ssh_ip: [
          { required: true, message: "请输入SSH IP地址", trigger: "blur" },
          { min: 7, message: "主机名长度不小于8个字符", trigger: "blur" },
        ],
        ssh_port: [
          { required: true, message: "请输入SSH端口", trigger: "blur" },
          { min: 2, message: "SSH端口长度不小于2个数字", trigger: "blur" },
        ],
        credential: [
          { required: true, message: "请选择SSH连接凭据", trigger: "change" },
        ],
      },
      idc: "",
      serverGroup: "",
      credential: "",
    };
  },
  methods: {
    dialogClose() {
      this.$emit("update:visible", false); // 当对话框关闭，通过父组件更新为false
    },
    submit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$http.post("/cmdb/create_host/", this.form).then((res) => {
            if (res.data.code == 200) {
              this.$message.success("创建成功");
              this.$parent.getData(); // 调用父组件方法，重新获取数据
              this.dialogClose(); // 关闭窗口
            } else {
              this.$message.success(res.data.msg);
            }
          });
        } else {
          this.$message.error("格式错误！");
        }
      });
    },
    getIdc() {
      this.$http.get("/cmdb/idc/?page_size=50").then((res) => {
        this.idc = res.data.data;
      });
    },
    getServerGroup() {
      this.$http.get("/cmdb/server_group/?page_size=50").then((res) => {
        this.serverGroup = res.data.data;
      });
    },
    getCredential() {
      this.$http.get("/config/credential/?page_size=50").then((res) => {
        this.credential = res.data.data;
      });
    },
  },
};
</script>

<style scoped></style>
