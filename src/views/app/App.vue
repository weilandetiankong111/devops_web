<template>
  <el-card class="box-card">
    <div class="table-header">
      <div>
        <el-input
          style="width: 150px"
          v-model="urlParams.search"
          placeholder="请输入关键字"
          clearable
          @clear="onSearch"
        ></el-input>
        <el-button type="primary" style="margin-left: 5px" @click="onSearch"
          ><el-icon><search /></el-icon>&nbsp;搜索</el-button
        >
      </div>
      <div>
        <el-button type="primary" @click="createDialogVisible = true"
          ><el-icon><plus /></el-icon>&nbsp;创建</el-button
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
          <el-checkbox v-model="showColumn.name" disabled>应用名称</el-checkbox>
          <el-checkbox v-model="showColumn.english_name" disabled
            >英文名称</el-checkbox
          >
          <el-checkbox v-model="showColumn.project">项目名称</el-checkbox>
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

    <!--数据表格-->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      :header-cell-style="{ background: '#F0F2F5' }"
    >
      <el-table-column
        prop="name"
        label="应用名称"
        fixed="left"
        sortable
        v-if="showColumn.name"
      />
      <el-table-column
        prop="english_name"
        label="英文名称"
        fixed="left"
        sortable
        v-if="showColumn.english_name"
      />
      <el-table-column
        prop="project"
        label="项目名称"
        fixed="left"
        sortable
        v-if="showColumn.project"
      >
        <template #default="scope">
          {{ scope.row.project.name }}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" v-if="showColumn.note" />
      <el-table-column
        prop="create_time"
        label="创建时间"
        sortable
        v-if="showColumn.create_time"
      />
      <!--操作栏-->
      <el-table-column fixed="right" label="操作" width="320">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="createReleaseConfig(scope.$index, scope.row)"
            >新建发布</el-button
          >
          <el-button
            type="info"
            size="small"
            @click="releaseConfig(scope.$index, scope.row)"
            >发布配置</el-button
          >
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
    <div style="margin-top: 20px">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-sizes="[10, 15, 20, 25, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </el-card>

  <AppEdit v-model:visible="editDialogVisible" :row="row"></AppEdit>
  <AppCreate v-model:visible="createDialogVisible"></AppCreate>
  <CreateReleaseConfig
    v-model:visible="createConfigVisible"
    :rowId="rowId"
  ></CreateReleaseConfig>
  <ReleaseConfig
    v-model:visible="releaseConfigVisible"
    :rowId="rowId"
  ></ReleaseConfig>
</template>

<script>
import AppEdit from "./AppEdit";
import AppCreate from "./AppCreate";
import CreateReleaseConfig from "./CreateReleaseConfig";
import ReleaseConfig from "./ReleaseConfig";
export default {
  data() {
    return {
      tableData: [],
      total: 0, // 总数据条数
      pageSize: 10, // 默认每页的数据条数
      currentPage: 1, // 默认开始页码
      urlParams: {
        // URL查询参数
        page_num: 1,
        page_size: 10,
        search: "",
      },
      editDialogVisible: false,
      row: "",
      createDialogVisible: false,
      showColumn: {
        name: true,
        english_name: true,
        project: true,
        note: true,
        create_time: false,
      },
      columnVisible: false, // 展示与隐藏
      createConfigVisible: false,
      rowId: "",
      releaseConfigVisible: false,
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
        .get("/app_release/app/", { params: this.urlParams })
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
      // console.log(index,row);
      this.editDialogVisible = true;
      this.row = row;
    },
    handleDel(index, row) {
      this.$confirm("你确定要删除选中的吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 点击确定
        this.$http.delete("/app_release/app/" + row.id + "/").then((res) => {
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
        JSON.stringify(this.showColumn)
      );
      this.columnVisible = false;
    },
    // 新建发布
    createReleaseConfig(index, row) {
      this.createConfigVisible = true;
      this.rowId = row.id;
    },
    // 发布配置
    releaseConfig(index, row) {
      this.releaseConfigVisible = true;
      this.rowId = row.id;
    },
  },
  components: {
    CreateReleaseConfig,
    AppEdit,
    AppCreate,
    ReleaseConfig,
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
