<template>
  <el-dialog
    :model-value="visible"
    title="创建分组"
    @close="dialogClose"
    width="30%"
  >
    <el-form :model="form" ref="formRef" :rules="formRules" label-width="100px">
      <el-form-item label="分组名称：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
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
  name: "ServerGroupCreate",
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
        name: [
          { required: true, message: "请输入分组名称", trigger: "blur" },
          { min: 2, message: "分组名称长度应不小于2个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    dialogClose() {
      this.$emit("update:visible", false); // 当对话框关闭，通过父组件更新为false
    },
    submit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$http.post("/cmdb/server_group/", this.form).then((res) => {
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
  },
};
</script>

<style scoped></style>
