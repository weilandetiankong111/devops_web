<template>
  <el-card class="box-card">
    <div class="table-header">
      <div>
        <el-input
          style="width: 150px"
          v-model="urlParams.search"
          placeholder="请输入分组名称"
          clearable
          @clear="onSearch"
        ></el-input>
        <el-button type="primary" style="margin-left: 5px" @click="onSearch"
          >搜索</el-button
        >
      </div>
      <div>
        <el-button type="primary" @click="createDialogVisible = true"
          >创建</el-button
        >
        <!--展示列弹出框-->
        <el-popover
          placement="left"
          :width="100"
          v-model:visible="columnVisible"
        >
          <template #reference>
            <el-button type="primary" @click="columnVisible = true"
              ><el-icon><setting /></el-icon>&nbsp;展示列</el-button
            >
          </template>
          <el-checkbox v-model="showColumn.name" disabled>分组名称</el-checkbox>
          <el-checkbox v-model="showColumn.note">备注</el-checkbox>
          <el-checkbox v-model="showColumn.create_time">创建时间</el-checkbox>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="text" @click="columnVisible = false"
              >取消</el-button
            >
            <el-button size="small" type="primary" @click="saveColumn"
              >确认</el-button
            >
          </div>
        </el-popover>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      :header-cell-style="{ background: '#F0F2F5' }"
    >
      <el-table-column prop="name" label="分组名称" />
      <el-table-column prop="note" label="备注" v-if="showColumn.note" />
      <el-table-column
        prop="create_time"
        label="创建时间"
        v-if="showColumn.create_time"
      />

      <!--操作拦-->
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 15, 20, 25, 30]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>

  <ServerGroupEdit
    v-model:visible="editDialogVisible"
    :row="row"
  ></ServerGroupEdit>
  <ServerGroupCreate v-model:visible="createDialogVisible"></ServerGroupCreate>
</template>

<script>
import ServerGroupEdit from "./ServerGroupEdit.vue";
import ServerGroupCreate from "./ServerGroupCreate.vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "ServerGroup",
  data() {
    return {
      tableData: [],
      total: 0, // 初始化total为0，后续在getData方法中获取真实值
      pageSize: 10, // 默认每页的数据条数
      currentPage: 1, // 默认开始页码
      urlParams: {
        // url查询参数
        page_num: 1,
        page_size: 10,
        search: "",
      },
      editDialogVisible: false,
      row: "",
      createDialogVisible: false,
      showColumn: {
        name: true,
        note: true,
        create_time: true,
      },
      columnVisible: false, // 展示与隐藏
    };
  },
  mounted() {
    this.getData();
    // 从浏览器本地存储获取历史展示列
    const columnSet = localStorage.getItem(this.$route.path + "-columnSet");
    // 如果本地有存储则使用
    if (columnSet) {
      this.showColumn = JSON.parse(columnSet);
    }
  },
  methods: {
    getData() {
      this.$http
        .get("/cmdb/server_group/", { params: this.urlParams })
        .then((res) => {
          // console.log(res.data);
          this.tableData = res.data.data;
          this.total = res.data.count;
        });
    },
    // 分页：监听【选择每页数量】的事件
    handleSizeChange(pageSize) {
      // console.log(pageSize)
      this.pageSize = pageSize; // 重新设置分页显示
      this.urlParams.page_size = pageSize; // 将最新值设置到数据里，用于下面用新值重新获取数据
      this.getData();
    },
    // 分页：监听【点击页码】的事件
    handleCurrentChange(currentPage) {
      // console.log(currentPage)
      this.currentPage = currentPage; // 重新设置分页显示
      this.urlParams.page_num = currentPage;
      this.getData();
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.editDialogVisible = true;
      this.row = row;
    },
    // eslint-disable-next-line no-unused-vars
    handleDel(index, row) {
      this.$confirm("你确定要删除选中的吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 点击确定
        this.$http.delete("/cmdb/server_group/" + row.id + "/").then((res) => {
          if (res.data.code == 200) {
            this.$message.success("删除成功");
            this.tableData.splice(index, 1); // 根据表格索引临时删除数据
          } else {
            this.$message.error(res.data.msg);
          }
        });
      });
    },
    onSearch() {
      this.getData();
    },
    saveColumn() {
      localStorage.setItem(
        this.$route.path + "-columnSet",
        JSON.stringify(this.showColumn),
        (this.columnVisible = false)
      );
    },
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ServerGroupEdit,
    // eslint-disable-next-line vue/no-unused-components
    ServerGroupCreate,
  },
};
</script>

<style scoped>
.table-header {
  display: flex;
  margin-bottom: 18px;
  justify-content: space-between;
}
</style>
