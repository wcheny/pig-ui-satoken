<template>
  <el-dialog
    :title="!dataForm.id ? '添加短信模板' : '修改短信模板'"
    :close-on-click-modal="false"
    @close="closeDialog()"
    width="500px"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="短信渠道" prop="channelId">
        <el-select style="width: 100%" v-model="dataForm.channelId" placeholder="请选择">
          <el-option v-for="item in channels" :key="item.id" :label="channelFormat(item)"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="短信类型" prop="type">
        <el-select style="width: 100%" v-model="dataForm.type" placeholder="请选择">
          <el-option v-for="item in dict.type.sys_sms_template_type" :key="item.value" :label="item.label"
                     :value="parseInt(item.value)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开启状态" prop="status">
        <el-radio v-model="dataForm.status" :label="0">开启</el-radio>
        <el-radio v-model="dataForm.status" :label="1">关闭</el-radio>
      </el-form-item>
      <el-form-item label="模板编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="模板编码"></el-input>
      </el-form-item>
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="模板名称"></el-input>
      </el-form-item>
      <el-form-item label="模板内容" prop="content">
        <el-input v-model="dataForm.content" placeholder="模板内容"></el-input>
      </el-form-item>
      <el-form-item label="API模板编号" prop="apiTemplateId">
        <el-input v-model="dataForm.apiTemplateId" placeholder="短信 API 的模板编号"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="canSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getObj, addObj, putObj} from '@/api/syssmstemplate'
import {fetchSimpleList} from '@/api/syssmschannel'

export default {
  dictTypes:['sys_sms_template_type','system_sms_channel_code'],
  data() {
    return {
      visible: false,
      canSubmit: false,
      channels:[],
      dataForm: {
        status: 0,
        code: '',
        type:'',
        name: '',
        content: '',
        params: '',
        remark: '',
        apiTemplateId: '',
        channelId: '',
        channelCode: '',
      },
      dataRule: {
        status: [
          {required: true, message: '开启状态不能为空', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '模板编码不能为空', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '模板名称不能为空', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '模板内容不能为空', trigger: 'blur'}
        ],
        apiTemplateId: [
          {required: true, message: '短信 API 的模板编号不能为空', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    channelFormat(item){
      return item.signature+"【"+this.selectDictLabel(this.dict.type.system_sms_channel_code, item.code)+"】";
    },
    getSmsChannel(){
      fetchSimpleList().then(response=>{
        this.channels=response.data.data;
      })
    },
    init(id) {
      this.visible = true;
      this.canSubmit = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        this.getSmsChannel();
        if (id) {
          getObj(id).then(response => {
            this.dataForm = response.data.data
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.canSubmit = false;
          if (this.dataForm.id) {
            putObj(this.dataForm).then(data => {
              this.$notify.success('修改成功')
              this.visible = false
              this.$emit('refreshDataList')
            }).catch(() => {
              this.canSubmit = true;
            });
          } else {
            addObj(this.dataForm).then(data => {
              this.$notify.success('添加成功')
              this.visible = false
              this.$emit('refreshDataList')
            }).catch(() => {
              this.canSubmit = true;
            });
          }
        }
      })
    },
    //重置表单
    closeDialog() {
      this.$refs["dataForm"].resetFields()
    }
  }
}
</script>
