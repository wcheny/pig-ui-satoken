<template>
  <div class="mod-config">
    <basic-container>
      <el-form :inline="true" @keyup.enter.native="getDataList()">
        <el-form-item label="短信渠道">
          <el-select clearable style="width: 100%" v-model="queryData.channelId" placeholder="请选择">
            <el-option v-for="item in channels" :key="item.id" :label="channelFormat(item)"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-row style="margin-bottom: 10px;">
        <el-button v-if="permissions.smstemplate_add" icon="el-icon-plus" type="primary"
                   @click="addOrUpdateHandle()">新增
        </el-button>
      </el-row>
      <div class="avue-crud">
        <el-table
                :data="dataList"
                border
                v-loading="dataListLoading">
            <el-table-column
                    prop="code"
                    header-align="center"
                    show-overflow-tooltip=""
                    align="center"
                    label="模板编码">
            </el-table-column>
            <el-table-column
                    prop="name"
                    header-align="center"
                    show-overflow-tooltip=""
                    align="center"
                    label="模板名称">
            </el-table-column>
            <el-table-column
                    prop="content"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip=""
                    label="模板内容">
            </el-table-column>
            <el-table-column
                    prop="apiTemplateId"
                    header-align="center"
                    show-overflow-tooltip=""
                    align="center"
                    label="API模板编号">
            </el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            label="短信类型">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_sms_template_type" :value="scope.row.type"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="开启状态">
            <template slot-scope="scope" >
              <el-tag :type="scope.row.status==0?'primary':''">{{scope.row.status==0?'正常':'关闭'}}</el-tag>
            </template>
          </el-table-column>
            <el-table-column
                    prop="channelCode"
                    header-align="center"
                    align="center"
                    label="短信渠道">
              <template slot-scope="scope">
                {{channelMap[scope.row.channelId].signature}}
                <dict-tag :options="dict.type.system_sms_channel_code" :value="scope.row.channelCode"/>
              </template>
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    header-align="center"
                    align="center"
                    width="150"
                    label="创建时间">
            </el-table-column>
          <el-table-column
                  header-align="center"
                  align="center"
                  label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button v-if="permissions.smstemplate_edit" type="text" size="small" icon="el-icon-share" @click="handleSendSms(scope.row)">测试</el-button>
              <el-button v-if="permissions.smstemplate_edit" type="text" size="small" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
              <el-button v-if="permissions.smstemplate_del" type="text" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>
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
      <!-- 对话框(发送短信) -->
      <el-dialog title="测试发送短信" :visible.sync="sendSmsOpen" width="500px" append-to-body>
        <el-form ref="sendSmsForm" :model="sendSmsForm" :rules="sendSmsRules" label-width="140px">
          <el-form-item label="模板内容" prop="content">
            <el-input v-model="sendSmsForm.content" type="textarea" placeholder="请输入模板内容" readonly />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="sendSmsForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item v-for="param in sendSmsForm.params" :key="param" :label="'参数 {' + param + '}'" :prop="'templateParams.' + param">
            <el-input v-model="sendSmsForm.templateParams[param]" :placeholder="'请输入 ' + param + ' 参数'" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitSendSmsForm">确 定</el-button>
          <el-button @click="cancelSendSms">取 消</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import {fetchList, delObj,sendSms} from '@/api/syssmstemplate'
  import {fetchSimpleList} from '@/api/syssmschannel'
  import TableForm from './syssmstemplate-form'
  import {mapGetters} from 'vuex'
  export default {
    dictTypes: ['system_sms_channel_code','sys_sms_template_type'],
    data () {
      return {
        queryData: {
        },
        channels:[],
        channelMap:{},
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        sendSmsForm: {
          params: [], // 模板的参数列表
          templateParams:{}
        },
        sendSmsRules: {
          mobile: [{ required: true, message: "手机不能为空", trigger: "blur" }],
          templateParams: { }
        },
        dataListLoading: false,
        addOrUpdateVisible: false,
        sendSmsOpen: false
      }
    },
    components: {
      TableForm
    },
    created () {
      this.getSmsChannel();
      this.getDataList()
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      channelFormat(item){
        return item.signature+"【"+this.selectDictLabel(this.dict.type.system_sms_channel_code, item.code)+"】";
      },
      /** 发送短信按钮 */
      handleSendSms(row) {
        // 设置参数
        let params=JSON.parse(row.params);
        console.log(params)
        this.sendSmsForm.content = row.content;
        this.sendSmsForm.params = params;
        this.sendSmsForm.templateCode = row.code;
        this.sendSmsForm.templateParams = params.reduce(function(obj, item) {
          obj[item] = undefined;
          return obj;
        }, {});
        // 根据 row 重置 rules
        this.sendSmsRules.templateParams = params.reduce(function(obj, item) {
          obj[item] = { required: true, message: '参数 ' + item + " 不能为空", trigger: "change" };
          return obj;
        }, {});
        console.log(this.sendSmsForm)
        // 设置打开
        this.sendSmsOpen = true;
      },
      /** 取消发送短信 */
      cancelSendSms() {
        this.sendSmsOpen = false;
      },
      /** 提交按钮 */
      submitSendSmsForm() {
        this.$refs["sendSmsForm"].validate(valid => {
          if (!valid) {
            return;
          }
          // 添加的提交
          sendSms(this.sendSmsForm).then(response => {
            this.$message.success("提交发送成功！发送结果，见发送日志编号：" + response.data.data);
            this.sendSmsOpen = false;
          });
        });
      },
      getSmsChannel(){
        fetchSimpleList().then(response=>{
          let data=response.data.data;
          this.channels=data;
          let channelMap={};
          data.map(item=>{
            channelMap[item.id]=item;
          })
          this.channelMap=channelMap;
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
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
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm('是否确认删除ID为' + id, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(id)
        }).then(data => {
          this.$message.success('删除成功')
          this.getDataList()
        }).catch(() => {})
      }
    }
  }
</script>
