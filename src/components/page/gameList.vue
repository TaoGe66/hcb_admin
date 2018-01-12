<template>
  <div class="gamesList">
      <el-button class="btn-add" type="primary" @click="addList()">添加</el-button>
      <el-table
        :data="queryData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        stripe
        style="width: 100%;border-top: 1px solid #d1d1d5;">
        <el-table-column
          prop="name"
          label="名称"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="num"
          label="数量"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="summary"
          label="简介">
        </el-table-column>

        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
              <el-button size="small" type="primary"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              <el-button size="small"
                  @click="handleProblem(scope.$index, scope.row)">问题</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block pages">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[14, 20, 25, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryData.length">
        </el-pagination>
      </div>

    <!--添加list弹窗-->
    <el-dialog title="添加游戏类型" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="form.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input v-model="form.num" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input v-model="form.summary" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="type" placeholder="请选择类型" style="width: 100%;">
            <el-option
              v-for="item in key"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="封面" :label-width="formLabelWidth">
          <div class="avatar-uploader">
            <ul class="uploader_files">
              <li v-if="cdn_url" class="avatar" :style="'backgroundImage:url('+cdn_url+')'"></li>
            </ul>
            <div v-if="!cdn_url" class="uploader_input_wrp">
              <input class="el-icon-plus avatar-uploader-icon" type="file" accept="image/*"  @change="uploadThumb"/>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleYes()">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑list弹窗-->
    <el-dialog title="编辑游戏" :visible.sync="dialogFormEdit">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="row.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="row.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input v-model="row.num" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input v-model="row.summary" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="row.type" placeholder="请选择类型" style="width: 100%;">
            <el-option
              v-for="item in key"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="封面" :label-width="formLabelWidth">
          <div class="avatar-uploader">
            <ul class="uploader_files">
              <li v-if="row.thumb" class="avatar" :style="'backgroundImage:url('+row.thumb+')'"></li>
            </ul>
            <div v-if="!row.thumb" class="uploader_input_wrp">
              <input class="el-icon-plus avatar-uploader-icon" type="file" accept="image/*"  @change="uploadThumb"/>
            </div>
          </div>
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
        key: [{
            value: '1',
            label: '千万'
        },{
            value: '2',
            label: '十亿'
        },{
            value: '3',
            label: '百亿'
        },{
            value: '4',
            label: '千亿'
        },{
            value: '5',
            label: '万亿'
        }],
        cdn_url:"",
        imageUrl:"",
        fileList2: [],
        queryData:[],//查询的数据
        addData:[],//添加的数据
        editData:[],
        dialogFormVisible: false,
        dialogFormEdit: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: '',
          resource: '',
          desc: '',
          thumb:'',
          summary:'',
          price:'',
          num:'',
        },
        formLabelWidth: '70px',
        index:'',
        type:'',
        row:[],
        typeData:'',
        pageSize:14,
        currentPage:1,
      }
    },
    mounted(){
      this.$nextTick(function () {
        this.getData();
      })
    },
    methods: {
      /*查询*/
      getData(){
        let _this = this;
        this.$http.get('/game/dirty/group/list').then(function (res) {
          if(res.data.status===10000){
            _this.queryData = res.data.data;
            console.log(_this.queryData);
          }
        },(err)=> {
          console.log(err);
        })
      },

      //图片上传
      uploadThumb:function(event){
        var that = this;
        if(event.srcElement.files[0]){
          var file = event.srcElement.files[0];
          this.$http.get("http://api.hecaibao88.com/oss/policy").then(function(response){
            var policy = response.data;
            console.log(policy);
            function guid() {
              return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
              });
            }
            guid();
            var unionkey = guid();
//            var unionkey = parseInt(Math.random()*1000000) ;
            var key = policy.dir + "/" + unionkey + "." + file.name.split(".")[file.name.split(".").length -1 ];
            var request = new FormData();
            request.append('OSSAccessKeyId', policy.accessid);
            request.append('policy', policy.policy);
            request.append('signature', policy.signature);
            request.append('key', key);
            request.append('file', file);
            request.append('submit', "Upload to oss");

            console.log(policy.host);
            that.$http.post(policy.host,request).then(function(res){
              that.cdn_url = policy.cdn + "/" + key;
            });
          });
        }
      },

      handleOpen(key, keyPath) {
//        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
//        console.log(key, keyPath);
      },

      //分页显示
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },

      //添加
      addList(){
        this.dialogFormVisible = true;
          this.form.name = '';
          this.form.price = '';
          this.form.summary = '';
          this.type = '';
          this.form.num = '';
          this.cdn_url = '';
      },
      dialogFormVisibleYes(){
        let _this = this;
        this.dialogFormVisible = false;
        let params = {
          name:_this.form.name,
          thumb:_this.cdn_url,
          type:_this.type,
          summary:_this.form.summary,
          price:_this.form.price,
          num:_this.form.num,
          status:true,
        };
        if(!_this.form.name == ''&&
          !_this.cdn_url == ''&&
          !_this.type == ''&&
          !_this.form.summary == ''&&
          !_this.form.price == ''&&
          !_this.form.num == ''){
          this.$http.post('/game/dirty/group/save',params).then((res)=>{
            console.log(res.data.data);
            _this.getData();
            _this.open6();
          },(err)=>{
            console.log(err);
          })
          }else {
          _this.open7();
        }
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
        console.log(index, row);
        this.dialogFormEdit = true;
        this.row = row;
//        this.dialogFormEditYes(index,row)
      },
      dialogFormEditNo(){
        this.dialogFormEdit = false;
        this.getData();
      },
      dialogFormEditYes(){
        let _this = this;
        this.dialogFormEdit = false;
        let params = {
          dirtyId:_this.row._id,
          name:_this.row.name,
          thumb:_this.cdn_url,
          summary:_this.row.summary,
          type:_this.row.type,
          price:_this.row.price,
          num:_this.row.num,
        };
        console.log(params);
        this.$http.post('/game/dirty/group/revise',params).then((res)=>{
          _this.editData = res.data.data;
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
        console.log(this.index);
        console.log(this.row);
        this.centerDialogVisible = false;
        this.queryData.splice(this.index, 1);
        let params = {
          dirtyId:this.row._id,
        };
        this.$http.post('/game/dirty/group/delete',params).then((res)=>{
          console.log(res.data.data);
        },(err)=>{
          console.log(err);
        })
      },

      //问题
      handleProblem(index, row){
        this.index = index;
        this.$router.push({path: '/gameProblem' + row.type + '?_id=' + row._id});
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
  }
  .avatar-uploader{
    position: relative;
    width: 70px;
    height: 70px;
    border-radius: 4px;
    /*cursor: pointer;*/
    overflow: hidden;
  }
  .avatar{
    width: 72px;
    height: 70px;
    border-radius: 4px;
    background-size: 100%;
  }
  .el-icon-plus{
    position: absolute;
    width: 66px;
    height: 68px;
    line-height: 68px;
    top: 0;
    left: 1px;
    right: 0;
    bottom: 0;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    font-size: 16px;
    text-align: center;
    color: #8c939d;
    z-index: 10;
  }
  .el-icon-plus:before {
    content: "\E61c";
    margin-left: 26px;
  }
  .avatar-uploader-icon {
    /*font-size: 16px;
    color: #8c939d;
    width: 68px;
    height: 68px;
    line-height: 68px;
    text-align: center;
    cursor: pointer;*/
  }
  .uploader_files,.uploader_input_wrp{
    width: 70px;
    height: 68px;
  }
</style>
