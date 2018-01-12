<template>
  <div class="stock">
      <el-table
        :data="queryData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        stripe
        style="width: 100%;border-top: 1px solid #d1d1d5;">
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column prop="store" label="商家" width="150px">
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="150px">
        </el-table-column>
        <el-table-column prop="price" label="面值" width="100px">
        </el-table-column>
        <el-table-column prop="num" label="每包(张)" width="100px">
        </el-table-column>
        <el-table-column prop="max" label="库存(张)" width="100px">
        </el-table-column>
        <el-table-column prop="send" label="补货状态" width="150px">
          <template slot-scope="scope">
            {{scope.row.send == true ? '补货中' : '未补货'}}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间">
            <template slot-scope="scope">
                {{scope.row.createdAt | formDate}}
            </template>
        </el-table-column>

        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
              <el-button size="small" type="primary"
                  @click="handleEdit(scope.$index, scope.row)">修改库存</el-button>
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

    <!--修改库存弹窗-->
    <el-dialog title="编辑" :visible.sync="dialogFormEdit">
      <el-form>
        <el-form-item label="修改数量" :label-width="formLabelWidth">
          <el-input v-model="row.max" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEditNo()">取 消</el-button>
        <el-button type="primary" @click="dialogFormEditYes()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        queryData:[],//查询的数据
        addData:[],//添加的数据
        editData:[],
        dialogFormEdit: false,
        form: {
          num:'',
        },
        formLabelWidth: '70px',
        index:'',
        type:'',
        row:[],
        pageSize:12,
        currentPage:1,
        detailed:'',
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
      /*查询*/
      getData(){
        let _this = this;
        this.$http.get('/intant/merchant/allstore',{params:{limit:this.msg.limit,skip:(this.msg.skip-1)*12}}).then(function (res) {
          if(res.data.status===10000){
            _this.dataLength = res.data.count;
            _this.queryData = res.data.data;
          }
        },(err)=> {
          console.log(err);
        })
      },

      //分页显示
      handleSizeChange(val) {
        this.pageSize = val;
        this.msg.limit = this.pageSize;
        this.getData();
      },
      handleCurrentChange(val) {
        this.msg.skip = val;
        this.getData();
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
          num:_this.row.max,
        };
        console.log(params);
        this.$http.post('/intant/merchant/update/store',params).then((res)=>{
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
</style>

