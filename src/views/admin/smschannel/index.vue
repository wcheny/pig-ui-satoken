<template>
  <div class="mod-config">
    <basic-container>
      <el-form :inline="true" @keyup.enter.native="getDataList()">
        <el-form-item label="短信签名">
          <el-input v-model="queryData.signature" placeholder="短信签名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-row style="margin-bottom: 10px;">
        <el-button v-if="permissions.smschannel_add" icon="el-icon-plus" type="primary"
                   @click="addOrUpdateHandle()">新增
        </el-button>
      </el-row>
      <div class="avue-crud">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading">
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="signature"
            header-align="center"
            align="center"
            label="短信签名">
          </el-table-column>
          <el-table-column
            prop="code"
            header-align="center"
            align="center"
            label="渠道编码">
            <template slot-scope="scope" >
              <dict-tag :options="dict.type.system_sms_channel_code" :value="scope.row.code"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="状态">
            <template slot-scope="scope" >
              {{scope.row.status==0?'正常':'关闭'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            header-align="center"
            align="center"
            label="备注">
          </el-table-column>
          <el-table-column
            prop="apiKey"
            header-align="center"
            show-overflow-tooltip
            align="center"
            label="API账号">
          </el-table-column>
          <el-table-column
            prop="apiSecret"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="API秘钥">
          </el-table-column>
          <el-table-column
            prop="callbackUrl"
            header-align="center"
            align="center"
            label="回调 URL">
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            width="170"
            label="创建时间">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="操作" fixed="right" width="200">
            <template slot-scope="scope" >
              <el-button v-if="permissions.smschannel_edit" type="text" size="small" icon="el-icon-edit"
                         @click="addOrUpdateHandle(scope.row.id)">修改
              </el-button>
              <el-button v-if="permissions.smschannel_del" type="text" size="small" icon="el-icon-delete"
                         @click="deleteHandle(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="avue-crud__pagination">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          background
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <table-form v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></table-form>
    </basic-container>
  </div>
</template>

<script>
import {fetchList, delObj} from '@/api/syssmschannel'
import TableForm from './syssmschannel-form'
import {mapGetters} from 'vuex'

export default {
  dictTypes: ['system_sms_channel_code'],
  data() {
    return {
      queryData: {
        signature: undefined
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    TableForm
  },
  created() {
    this.getDataList()
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      let query=this.queryData;
      query.current=this.pageIndex;
      query.size=this.pageSize;
      fetchList(Object.assign(query)).then(response => {
        this.dataList = response.data.data.records
        this.totalPage = response.data.data.total
      })
      this.dataListLoading = false
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      this.$confirm('是否确认删除ID为' + id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(id)
      }).then(data => {
        this.$message.success('删除成功')
        this.getDataList()
      }).catch(() => {
      })
    }
  }
}
</script>
