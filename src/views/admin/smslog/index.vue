<template>
  <div class="mod-config">
    <basic-container>
      <el-form :inline="true" @keyup.enter.native="getDataList()">
        <el-form-item label="手机号">
          <el-input v-model="queryData.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="短信渠道">
          <el-select clearable style="width: 100%" v-model="queryData.channelId" placeholder="请选择">
            <el-option v-for="item in channels" :key="item.id" :label="channelFormat(item)"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板编号">
          <el-input v-model="queryData.templateId" placeholder="模板编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
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
            prop="createTime"
            header-align="center"
            align="center"
            width="150"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            width="120"
            label="手机号">
            <template slot-scope="scope">
              <div>{{scope.row.mobile}}</div>
              <el-tag :type="scope.row.userType==1?'success':''">{{scope.row.userType==1?"会员":"管理员"}}{{scope.row.userId?":"+scope.row.userId:""}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="templateContent"
            header-align="center"
            align="center"
            label="短信内容">
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
            prop="templateId"
            header-align="center"
            align="center"
            label="模板编号">
          </el-table-column>
          <el-table-column
            prop="templateType"
            header-align="center"
            align="center"
            label="短信类型">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_sms_template_type" :value="scope.row.templateType"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="sendStatus"
            header-align="center"
            align="center"
            width="150"
            label="发送状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.sendStatus==0" >初始化</el-tag>
              <el-tag v-else-if="scope.row.sendStatus==10" type="success">发送成功</el-tag>
              <el-tag v-else-if="scope.row.sendStatus==20" type="danger">发送失败</el-tag>
              <el-tag v-else-if="scope.row.sendStatus==30" type="info">忽略</el-tag>
              <div>{{scope.row.sendTime}}</div>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="permissions.smslog_get" type="text" size="small" icon="el-icon-view"
                         @click="form=scope.row;open=true">详情
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
    </basic-container>
    <el-dialog top="5vh" title="短信日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form style="max-height: 500px;overflow: auto" ref="form" class="modal" v-if="form" :model="form" label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="日志主键：">{{ form.id }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="短信渠道：">
              {{channelMap[form.channelId].signature}}
              <dict-tag style="display: inline" :options="dict.type.system_sms_channel_code" :value="form.channelCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="短信模板：">
              {{ form.templateId }} | {{ form.templateCode }}
              <dict-tag style="display: inline;" :options="dict.type.sys_sms_template_type" :value="form.templateType"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="API 的模板编号：">{{ form.apiTemplateId }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户信息：">{{ form.mobile }}
              <el-tag :type="form.userType==1?'success':''">{{form.userType==1?"会员":"管理员"}}{{form.userId?":"+form.userId:""}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="短信内容：">{{ form.templateContent }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="短信参数：">{{ form.templateParams }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发送状态：">
              <el-tag v-if="form.sendStatus==0" >初始化</el-tag>
              <el-tag v-else-if="form.sendStatus==10" type="success">发送成功</el-tag>
              <el-tag v-else-if="form.sendStatus==20" type="danger">发送失败</el-tag>
              <el-tag v-else-if="form.sendStatus==30" type="info">忽略</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发送时间：">{{ form.sendTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发送结果：">{{ form.sendCode }} | {{ form.sendMsg }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="API 发送结果：">{{ form.apiSendCode }} | {{ form.apiSendMsg }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="API 短信编号：">{{ form.apiSerialNo }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="API 请求编号：">{{ form.apiRequestId }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="接收状态：">
              <el-tag v-if="form.receiveStatus==0" >初始化</el-tag>
              <el-tag v-else-if="form.receiveStatus==10" type="success">成功</el-tag>
              <el-tag v-else-if="form.receiveStatus==20" type="danger">失败</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="接收时间：">{{ form.receiveTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="API 接收结果：">{{ form.apiReceiveCode }} | {{ form.apiReceiveMsg }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {fetchList} from '@/api/syssmslog'
import {fetchSimpleList} from '@/api/syssmschannel'
import {mapGetters} from 'vuex'

export default {
  dictTypes: ['system_sms_channel_code','sys_sms_template_type'],
  data() {
    return {
      queryData: {
        mobile: undefined
      },
      dataList: [],
      pageIndex: 1,
      channels:[],
      channelMap:{},
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      open: false,
      form:undefined
    }
  },
  components: {
  },
  created() {
    this.getSmsChannel();
    this.getDataList();
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    channelFormat(item){
      return item.signature+"【"+this.selectDictLabel(this.dict.type.system_sms_channel_code, item.code)+"】";
    },
    // 获取数据列表
    getDataList() {
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
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog .el-dialog__body{
  padding: 20px!important;
}
 .modal{
   .el-dialog__body{
     padding: 20px!important;
   }
   .el-form-item{
     margin-bottom: 0!important;
   }
}
</style>
