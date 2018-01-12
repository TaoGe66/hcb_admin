<template>
  <div class="gamesProblem">
    <el-button class="btn-add" type="primary" @click="addList()">添加问题</el-button>
    <div class="daoru">
      <el-button class="btn-add" icon="document">导入excel</el-button><span class="excel_name">{{excelFileName}}</span>
      <input id="upload" class="importExcel" type="file" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
    </div>
    <el-table
      :data="queryData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      style="width: 100%;border-top: 1px solid #d1d1d5;">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        prop="content"
        label="内容">
      </el-table-column>
      <el-table-column
        prop="answer"
        label="答案">
      </el-table-column>

      <el-table-column
        label="操作"
        width="150">
          <template slot-scope="scope">
            <el-button size="small" type="primary"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <div class="block pages">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="dataLength">
      </el-pagination>
    </div>

    <!--添加list弹窗-->
    <el-dialog title="添加" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="问题" :label-width="formLabelWidth">
          <el-input v-model="form.content" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案" :label-width="formLabelWidth">
          <el-input v-model="form.answer" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="组数" :label-width="formLabelWidth">
          <el-select v-model="groupId" placeholder="请选择类型" style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleYes()">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑list弹窗-->
    <el-dialog title="编辑" :visible.sync="dialogFormEdit">
      <el-form :model="form">
        <el-form-item label="问题" :label-width="formLabelWidth">
          <el-input v-model="row.content" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案" :label-width="formLabelWidth">
          <el-input v-model="row.answer" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEditNo()">取 消</el-button>
        <el-button type="primary" @click="dialogFormEditYes()">确 定</el-button>
      </div>
    </el-dialog>

    <!--删除弹窗提示-->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>确定永久删除此条数据吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogShow()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        centerDialogVisible:false,
        options: [{
          value: 1,
          label: '第一组'
        }, {
          value: 2,
          label: '第二组'
        }, {
          value: 3,
          label: '第三组'
        }, {
          value: 4,
          label: '第四组'
        }, {
          value: 5,
          label: '第五组'
        }],
        cdn_url:"",
        imageUrl:"",
        fileList2: [],
        queryData:[],//查询的数据
        answer:'',
        content:'',
        editProblemData:[],//修改的数据
        dialogFormVisible: false,
        dialogFormEdit: false,
        form: {
          content:'',
          answer:'',
          id:'',
        },
        formLabelWidth: '70px',
        index:'',
        type:'',//收费类别
        groupId: '',//组类别
        row:[],
        pageSize:14,
        currentPage:1,
        _id:'',//收费类别id
        excelFileName:'',//导入Excel文件名
        dataLength:0,//表单总长度
        msg:{
          skip: '',
          limit: '',
        },
      }
    },
    created(){
      this.msg.limit = this.pageSize;
      this.msg.skip = this.currentPage;
      this.getData();
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },

      //分页
      handleSizeChange(val) {
        this.pageSize = val;
        this.msg.limit = this.pageSize;
        this.getData();
      },
      handleCurrentChange(val) {
        this.msg.skip = val;
        this.getData();
      },

        //导入
        importfxx(obj) {
            let _this = this;
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx1");
            let inputDOM = this.$refs.inputer;
// 通过DOM取文件数据

            this.file = event.currentTarget.files[0];
            this.excelFileName = this.file.name;

            var rABS = false; //是否将文件读取为二进制字符串
            var f = this.file;

            var reader = new FileReader();
//if (!FileReader.prototype.readAsBinaryString) {
            FileReader.prototype.readAsBinaryString = function(f) {
                var binary = "";
                var rABS = false; //是否将文件读取为二进制字符串
                var pt = this;
                var wb; //读取完成的数据
                var outdata;
                var reader = new FileReader();
                reader.onload = function(e) {
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for(var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    var XLSX = require('xlsx');
                    if(rABS) {
                        wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                            type: 'base64'
                        });
                    } else {
                        wb = XLSX.read(binary, {
                            type: 'binary'
                        });
                    }
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是要的东西
                    let params = {
                        type:_this.type,
                        questionArr:outdata,
                        problemgroup:_this._id,
                    };
                    _this.$http.post('/game/dirty/qustion/batch',params).then((res)=>{
                        console.log(res);
                    },(err)=>{
                        console.log(err);
                    });
                    _this.queryData = _this.queryData.concat(outdata);
                };
                reader.readAsArrayBuffer(f);
            };
            if(rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
        },

      /*查询*/
      getData(){
        let _this = this;
        this.type = parseInt(this.$route.params.type);
        this._id = this.$route.query._id;
//        console.log(this.type);
//        console.log(this._id);
        this.$http.get('/game/dirty/qustion/list',{
          params:{
            type:this.type,
            problemgroup:this._id,
            limit:this.msg.limit,
            skip:(this.msg.skip-1)*14
          }}).then(function (res) {
          if(res.data.status===10000){
            _this.dataLength = res.data.count;
            _this.queryData = res.data.data;
            console.log(_this.queryData);
          }
        },(err)=> {
          console.log(err);
        })
      },

      //添加
      addList(){
        this.dialogFormVisible = true;
        this.form.content = '';
        this.form.answer = '';
        this.groupId = '';
      },
      dialogFormVisibleYes(){
        let _this = this;
        this.dialogFormVisible = false;
//        console.log(this.groupId);
        let params = {
          type:this.type,
          content:this.form.content,
          answer: this.form.answer,
          groupId:this.groupId,
          problemgroup:this._id,
        };
        if(!_this.form.content == ''&&
          !_this.type == ''&&
          !_this.form.answer == ''){
          this.$http.post('/game/dirty/qustion/save',params).then((res)=>{
            console.log(res.data.code);
            if(res.data.code === 1){
              _this.open8();
            }
            if(res.data.code === 0){
              _this.getData();
              _this.open6();
            }
          },(err)=>{
            console.log(err);
          })
        }else {
          _this.open7();
        }
      },

      //添加失败
      open8() {
        this.$message({
          showClose: true,
          message: '数据已满，请更换组数添加',
          type: 'error'
        });
      },
      //添加成功
      open6() {
        this.$message({
          showClose: true,
          message: '添加数据成功',
          type: 'success'
        });
      },
      //填写不完整
      open7() {
        this.$message({
            showClose: true,
            message: '填写不完整，请重新填写',
            type: 'warning'
        });
      },

      //修改
      handleEdit(index, row) {
//        console.log(row);
        this.dialogFormEdit = true;
        this.row = row;
        this.index = index;
      },
      dialogFormEditNo(){
        this.dialogFormEdit = false;
        this.getData();
      },
      dialogFormEditYes(){
        let _this = this;
        this.dialogFormEdit = false;
        let params = {
          id:this.row._id,
          content:this.row.content,
          answer: this.row.answer,
        };
        this.$http.post('/game/dirty/qustion/update',params).then((res)=>{
          console.log(res.data.data);
          _this.getData();
        },(err)=>{
          console.log(err);
        })
      },

      //删除
      handleDelete(index, row) {
        this.index = index;
        this.row = row;
        this.centerDialogVisible = true;
      },
      centerDialogShow(){
        let _this = this;
        this.centerDialogVisible = false;
        let params = {
          id:this.row._id,
        };
        console.log(params.id);
        this.$http.post('/game/dirty/qustion/delete',params).then((res)=>{
          console.log(res.data.data);
          _this.getData();
        },(err)=>{
          console.log(err);
        })
      },
    }
  }
</script>

<style scoped>
  .pages{
    margin-top: 20px;
    text-align: right;
  }
  .btn-add{
      margin-bottom: 20px;
      margin-right: 20px;
      float: left;
  }
  .daoru{
      position: relative;
      float: left;
  }
  .excel_name{
      height: 37px;
      line-height: 37px;
      font-size: 14px;
  }
  .importExcel{
      position: absolute;
      top: 0;
      left: 0;
      font-size: 14px;
      transform: translate(0px, 0px) scale(1);
      height: 37px;
      opacity: 0;
      filter: alpha(opacity=0);
  }
</style>
