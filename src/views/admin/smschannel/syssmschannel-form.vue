<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="!dataForm.id ? '新增短信渠道' : '修改短信渠道'"
    :visible.sync="visible"
    width="30%"
    @close="closeDialog()">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px"
             @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="短信签名" prop="signature">
        <el-input v-model="dataForm.signature" placeholder="短信签名"></el-input>
      </el-form-item>
      <el-form-item label="渠道编码" prop="code">
        <el-select style="width: 100%" v-model="dataForm.code" placeholder="请选择">
          <el-option v-for="item in dict.type.system_sms_channel_code" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开启状态" prop="status">
        <el-radio v-model="dataForm.status" :label="0">开启</el-radio>
        <el-radio v-model="dataForm.status" :label="1">关闭</el-radio>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="API账号" prop="apiKey">
        <el-input v-model="dataForm.apiKey" placeholder="短信 API 的账号"></el-input>
      </el-form-item>
      <el-form-item label="API秘钥" prop="apiSecret">
        <el-input v-model="dataForm.apiSecret" placeholder="短信 API 的秘钥"></el-input>
      </el-form-item>
      <el-form-item label="回调URL" prop="callbackUrl">
        <el-input v-model="dataForm.callbackUrl" placeholder="短信发送回调 URL"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="canSubmit" type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getObj, addObj, putObj} from '@/api/syssmschannel'

export default {
  dictTypes:['system_sms_channel_code'],
  data() {
    return {
      visible: false,
      canSubmit: false,
      dataForm: {
        signature: '',
        code: '',
        status: 0,
        remark: '',
        apiKey: '',
        apiSecret: '',
        callbackUrl: '',
        createTime: '',
        updateTime: '',
        createBy: '',
        updateBy: '',
        delFlag: '',
      },
      dataRule: {
        signature: [
          {required: true, message: '短信签名不能为空', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '渠道编码不能为空', trigger: 'blur'}
        ],
        apiKey: [
          {required: true, message: '账号不能为空', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    init(id) {
      this.visible = true;
      this.canSubmit = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
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
