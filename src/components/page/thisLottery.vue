<template>
    <div class="thisLottery">
    <el-button class="btn-add" type="primary" @click="addList()">添加即开彩</el-button>
    <el-table
      :data="queryData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      style="width: 100%;border-top: 1px solid #d1d1d5;">
      <el-table-column
        prop="region"
        label="发行区域"
        width="100px">
        <template slot-scope="scope">
          {{scope.row.region == 'bj' ? '北京' : (scope.row.region == 'hb' ? '河北' : (scope.row.region == 'hn' ? '海南' : (scope.row.region == 'cq' ? '重庆' : (scope.row.region == 'sxbj' ? '陕西宝鸡' : (scope.row.region == 'gx' ? '广西' : (scope.row.region == 'sd' ? '山东' : (scope.row.region == 'zj' ? '浙江' : (scope.row.region == 'gs' ? '甘肃' : '江苏'))))))))}}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="price"
        label="面值(元)"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="num"
        label="张数(包)"
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
                @click="handleProblem(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block pages">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[12, 24, 36, 48]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryData.length">
      </el-pagination>
    </div>

      <!--添加list弹窗-->
      <el-dialog title="添加" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="区域" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择区域" style="width: 100%;">
              <el-option
                v-for="item in key"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="面值(元)" :label-width="formLabelWidth">
            <el-input v-model="form.price" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="张数(每包)" :label-width="formLabelWidth">
            <el-input v-model="form.num" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="简介" :label-width="formLabelWidth">
            <el-input v-model="form.summary" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="游戏规则" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.detail" :rows=6></el-input>
          </el-form-item>

          <el-form-item label="封面" :label-width="formLabelWidth">
            <div class="avatar-uploader">
              <ul class="uploader_files">
                <li v-if="cdn_url" class="avatar" :style="'backgroundImage:url('+cdn_url+')'"></li>
              </ul>
              <div v-if="!cdn_url" class="uploader_input_wrp">
                <span class="fileStyle2">+</span>
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
      <el-dialog title="编辑" :visible.sync="dialogFormEdit">
        <el-form>
          <el-form-item label="区域" :label-width="formLabelWidth">
            <el-select v-model="row.region" placeholder="请选择区域" style="width: 100%;">
              <el-option
                v-for="item in key"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="row.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="面值(元)" :label-width="formLabelWidth">
            <el-input v-model="row.price" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="张数(每包)" :label-width="formLabelWidth">
            <el-input v-model="row.num" auto-complete="off" :disabled="true" class="bgColor">{{row.num}}</el-input>
          </el-form-item>
          <el-form-item label="简介" :label-width="formLabelWidth">
            <el-input v-model="row.summary" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="游戏规则" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="row.detail" :rows=6></el-input>
          </el-form-item>
          <el-form-item label="商品封面" :label-width="formLabelWidth">
            <div :class="!row.thumb?'uploader_files2':'avatar-uploader2'">
              <div>
                <img class="avatar2" :src="row.thumb">
              </div>
              <div :class="!row.thumb?'float':'uploader_input_wrp2'">
                <span class="fileStyle2">+</span>
                <input class="el-icon-plus2 avatar-uploader-icon2" type="file" accept="image/*"  @change="uploadThumbTwo"/>
              </div>
            </div>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormEditNo()">取 消</el-button>
          <el-button type="primary" @click="dialogFormEditYes()">确 定</el-button>
        </div>
      </el-dialog>

      <!--list详情弹窗-->
      <el-dialog title="详情" :visible.sync="dialogDetailOpen">
        <el-form>
          <el-form-item label="区域" :label-width="formLabelWidth">
              <el-select v-model="row.region" placeholder="请选择区域" :disabled="true" style="width: 100%;">
                  <el-option
                      v-for="item in key"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="row.name" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="面值(元)" :label-width="formLabelWidth">
            <el-input v-model="row.price" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="张数(每包)" :label-width="formLabelWidth">
            <el-input v-model="row.num" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="简介" :label-width="formLabelWidth">
            <el-input v-model="row.summary" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="游戏规则" :label-width="formLabelWidth">
            <el-input v-model="row.detail" auto-complete="off" :disabled="true"></el-input>
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
          <el-button type="primary" @click="dialogDetailOpen = false">关 闭</el-button>
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
  import { utils } from '../../utils/api'

  export default {
    data(){
      return{
        centerDialogVisible:false,
        cdn_url:"",
        edit_url:"",
        queryData:[],//查询的数据
        addData:[],//添加的数据
        editData:[],
        dialogFormVisible: false,
        dialogFormEdit: false,
        dialogDetailOpen: false,
        form: {
          name: '',
          region: '',
          faceValue:'',
          price:'',
          summary:'',
          detail:'',
          integral:'',
          num:'',
          thumb:'',
        },
        key: [{
          value: 'bj',
          label: '北京'
        },{
          value: 'cq',
          label: '重庆'
        },{
          value: 'hn',
          label: '海南'
        },{
          value: 'hb',
          label: '河北'
        },{
          value: 'sxbj',
          label: '陕西宝鸡'
        },{
            value: 'gx',
            label: '广西'
        },{
            value: 'sd',
            label: '山东'
        },{
            value: 'zj',
            label: '浙江'
        },{
            value: 'gs',
            label: '甘肃'
        },{
            value: 'js',
            label: '江苏'
        }],
        formLabelWidth: '80px',
        index:'',
        type:'',
        row:[],
        pageSize:12,
        currentPage:1,
        detailed:'',
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
        this.$http.get('/intant/list').then(function (res) {
          if(res.data.status===10000){
            _this.queryData = res.data.data;
            console.log(_this.queryData);
//            _this.editGetDatas();
          }
        },(err)=> {
          console.log(err);
        })
      },

      //图片上传
      uploadThumb:function(event){
        var that = this;
        if(event.target.files[0]){
          var file = event.target.files[0];
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
      //编辑图片
        uploadThumbTwo:function(event){
            var that = this;
            if(event.target.files[0]){
                var file = event.target.files[0];
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
                        that.row.thumb = policy.cdn + "/" + key;
                        console.log(that.row.thumb);
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
        this.form.region = '';
        this.form.price = '';
        this.form.summary = '';
        this.form.detail = '';
        this.form.num = '';
        this.cdn_url = '';
      },
      dialogFormVisibleYes(){
        let _this = this;
        this.dialogFormVisible = false;
        let params = {
          name:_this.form.name,
          thumb:_this.cdn_url,
          summary:_this.form.summary,
          price:_this.form.price,
          num:_this.form.num,
          detail:_this.form.detail,
          region:_this.form.region,
        };
        if(!_this.form.name == ''&&
          !_this.cdn_url == ''&&
          !_this.form.summary == ''&&
          !_this.form.price == ''&&
          !_this.form.num == ''&&
          !_this.form.detail == ''&&
          !_this.form.region == ''){
            this.$http.post('/intant/save',params).then((res)=>{
              console.log(res.data);
              if(res.data.status == 10001){
                _this.open8();
              }else {
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
      //已有相同地区、面值、名字彩种
      open8() {
        this.$message({
            showClose: true,
            message: '已有相同地区、面值、名字的彩种',
            type: 'warning'
        });
      },
      //此彩种有库存不能删除
      open9() {
        this.$message({
            showClose: true,
            message: '此彩种有库存不能删除',
            type: 'warning'
        });
      },
      //删除成功
      open10() {
        this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
        });
      },

      //修改
      handleEdit(index, row) {
        console.log(index, row);
        this.dialogFormEdit = true;
        this.row = row;
      },
      dialogFormEditNo(){
          this.dialogFormEdit = false;
          this.getData();
      },
      dialogFormEditYes(){
        let _this = this;
        this.dialogFormEdit = false;
        let params = {
          id:_this.row._id,
          name:_this.row.name,
          thumb:_this.row.thumb,
          summary:_this.row.summary,
          price:_this.row.price,
          num:_this.row.num,
          detail:_this.row.detail,
          region:_this.row.region,
        };
        console.log(params.thumb);
        this.$http.post('/intant/update',params).then((res)=>{
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
        this.queryData.splice(this.index, 1);
        let params = {
          id:this.row._id,
        };
        this.$http.post('/intant/delete',params).then((res)=>{
            if(res.data.status == 10001){
                _this.open9();
            }else {
                _this.open10();
            }
        },(err)=>{
          console.log(err);
        })
      },

      //详情
      handleProblem(index, row){
        this.index = index;
        this.row = row;
        this.dialogDetailOpen = true;
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
      cursor: pointer;
      overflow: hidden;
  }
  .avatar{
      width: 70px;
      height: 70px;
      border-radius: 4px;
      background-size: 100%;
  }
  .el-icon-plus{
      position: absolute;
      width: 70px;
      height: 70px;
      line-height: 70px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      opacity: 0;
  }
  .el-icon-plus:before {
      content: "\E61C";
      margin-left: 26px;
  }
  .avatar-uploader-icon {
      font-size: 16px;
      color: #8c939d;
      width: 68px;
      height: 68px;
      line-height: 68px;
      text-align: center;
      cursor: pointer;
  }
  .uploader_files,.uploader_input_wrp{
      width: 68px;
      height: 68px;
  }

  .avatar-uploader2{
      position: relative;
      border-radius: 4px;
  }
  .uploader_files2{
      position: relative;
      border-radius: 4px;
      width: 70px;
      height: 70px;
  }
  .avatar2{
      width: 70px;
      height: 70px;
      border-radius: 4px;
      display: inline-block;
      margin-right: 10px;
  }
  .fileStyle2{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-size: 26px;
      color: #8c939d;
      width: 68px;
      height: 68px;
      line-height: 68px;
      text-align: center;
      cursor: pointer;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
  }
  .el-icon-plus2{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 70px;
      height: 70px;
      line-height: 70px;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      opacity: 0;
  }
  .float{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 70px;
      height: 70px;
  }
  /*.el-icon-plus2:before {
      content: "\E61C";
      margin-left: 26px;
  }*/
  .avatar-uploader-icon2 {
      font-size: 16px;
      color: #8c939d;
      outline: none;
      width: 70px;
      height: 70px;
      line-height: 70px;
      text-align: center;
      cursor: pointer;
  }
  .uploader_input_wrp2{
      position: relative;
      width: 70px;
      height: 70px;
      margin-top: 10px;
  }
  .el-form-item:last-child{
      margin-bottom: 0;
  }
</style>
