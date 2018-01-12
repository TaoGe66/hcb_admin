<template>
  <div class="merchantOrders">
      <el-button class="btn-add" type="primary" icon="document" @click="handleDownload" v-model="filename">导出excel</el-button>
      <el-table
        :data="queryData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        stripe
        style="width: 100%;border-top: 1px solid #d1d1d5;">
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column prop="region" label="地区" width="80px">
            <template slot-scope="scope">
                {{scope.row.region | newRegion}}
            </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="100px">
        </el-table-column>
        <el-table-column prop="num" label="数量(包)" width="100px">
            <template slot-scope="scope">
                {{scope.row.num/scope.row.intnum}}
            </template>
        </el-table-column>
        <el-table-column prop="face" label="面值(元)" width="100px">
        </el-table-column>
        <el-table-column label="订单金额(元)" width="120px">
            <template slot-scope="scope">
                {{scope.row.face*scope.row.num}}
            </template>
        </el-table-column>
        <el-table-column prop="store" label="下单商家" width="120px">
        </el-table-column>
        <el-table-column prop="consignee" label="收件人" width="100px">
        </el-table-column>
        <el-table-column label="收件地址" width="350px">
            <template slot-scope="scope">
                {{scope.row.region+scope.row.address | Space}}
            </template>
        </el-table-column>
        <el-table-column prop="tel" label="手机号码" width="150px">
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" width="150px">
            <template slot-scope="scope">
                {{scope.row.createdAt | formDate}}
            </template>
        </el-table-column>
        <el-table-column prop="step" label="订单状态" width="100px">
          <template slot-scope="scope">
              {{scope.row.step == '1000' ? '待审核' : (scope.row.step == '4000' ? '待收货' : '已收货')}}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="110px" fixed="right">
          <template slot-scope="scope">
              <el-button size="small" type="primary" plain v-if="scope.row.step == '4000' ? btn_hide : (scope.row.step == '5000' ? btn_hide : btn_show)"
                  @click="handleShip(scope.$index, scope.row)">审核发货</el-button>
              <el-button size="small" type="primary" v-if="scope.row.step == '1000' ? btn_hide : (scope.row.step == '5000' ? btn_hide : btn_show)"
                  @click="handleReceiving(scope.$index, scope.row)">确认收货</el-button>
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

    <!--审核发货弹窗提示-->
    <el-dialog
      title="提示"
      :visible.sync="Dialog1"
      width="30%"
      center>
      <span>确定审核发货吗？</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="Dialog1 = false">取 消</el-button>
          <el-button type="primary" @click="centerDialogShow()">确 定</el-button>
        </span>
    </el-dialog>

    <!--确认收货弹窗提示-->
    <el-dialog
      title="提示"
      :visible.sync="Dialog2"
      width="30%"
      center>
      <span>确定收货吗？</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="Dialog2 = false">取 消</el-button>
          <el-button type="primary" @click="centerDialogShow2()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data(){
      return{
        queryData:[],//查询的数据
        addData:[],//添加的数据
        editData:[],
        Dialog1: false,
        Dialog2: false,
        form: {
          name: '',
          region: '',
          faceValue:'',
          price:'',
          summary:'',
          detail:'',
          integral:'',
          num:'',
        },
        formLabelWidth: '70px',
        index:'',
        type:'',
        row:[],
        pageSize:12,
        currentPage:1,
        detailed:'',
        filename:'',
        btn_show:true,
        btn_hide:false,
        btn_show1:true,
        btn_hide1:false,
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
        //导出
      handleDownload() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel');
          const tHeader = ['地区','商品名称','数量(张)','面值','下单商家','收件人','收件地址','电话号码','时间','订单状态'];
          const filterVal = ['region','name','num','face','store','consignee','address','tel','createdAt','step'];
          const list = this.queryData;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, this.filename);
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },

      /*查询*/
      getData(){
        let _this = this;
        this.$http.get('/intant/merchant/allorder',{params:{limit:this.msg.limit,skip:(this.msg.skip-1)*12}}).then(function (res) {
          if(res.data.status===10000){
            _this.dataLength = res.data.count;
            _this.queryData = res.data.data;
            console.log(_this.queryData);
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

      //添加成功tips
      open6() {
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        });
      },

      //审核发货
      handleShip(index, row) {
        console.log(index, row);
        this.Dialog1 = true;
        this.row = row;
      },
      centerDialogShow(){
        let _this = this;
        this.Dialog1 = false;
        let params = {
          id:_this.row._id,
        };
        this.$http.post('/intant/merchant/order/send',params).then((res)=>{
          console.log(res.data.data);
          _this.open6();
          _this.getData();
        },(err)=>{
          console.log(err);
        })
      },

      //确认收货
      handleReceiving(index, row) {
        console.log(index, row);
        this.Dialog2 = true;
        this.row = row;
      },
      centerDialogShow2(){
        let _this = this;
        this.Dialog2 = false;
        let params = {
          id:_this.row._id,
        };
        this.$http.post('/intant/merchant/order/complete',params).then((res)=>{
          console.log(res.data.data);
          _this.open6();
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
  }
</style>
