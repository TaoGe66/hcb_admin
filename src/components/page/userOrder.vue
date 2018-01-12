<template>
  <div class="userOrder">
      <el-button class="btn-add" type="primary" icon="document" @click="handleDownload" v-model="filename">导出excel</el-button>
      <el-table
        :data="queryData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        stripe
        style="width: 100%;border-top: 1px solid #d1d1d5;">
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column prop="intant" label="商品名称" width="100px">
        </el-table-column>
        <el-table-column prop="num" label="订单数量" width="100px">
        </el-table-column>
        <el-table-column prop="price" label="订单金额" width="100px">
        </el-table-column>
        <el-table-column prop="check" label="订单状态" width="100px">
          <template slot-scope="scope">
            {{scope.row.check == false ? '已下单' : '已收货'}}
          </template>
        </el-table-column>

        <el-table-column prop="name" label="下单用户" width="120px">
        </el-table-column>

        <el-table-column prop="store" label="来源商家" width="120px">
        </el-table-column>

        <el-table-column prop="deviceName" label="设备名称" width="200px">
        </el-table-column>

        <el-table-column prop="deviceNo" label="来源设备">
        </el-table-column>

        <el-table-column prop="createdAt" label="时间" width="150px">
            <template slot-scope="scope">
                {{scope.row.createdAt | formDate}}
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
  </div>
</template>

<script>
  export default {
    data(){
      return{
        queryData:[],//查询的数据
        addData:[],//添加的数据
        editData:[],
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
          const tHeader = ['商品名称', '订单数量', '订单金额', '下单用户', '来源商家', '设备名称', '来源设备', '时间'];
          const filterVal = ['intant', 'num', 'price', 'name', 'store', 'deviceName', 'deviceNo', 'createdAt'];
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
        this.$http.get('/intant/merchant/alluorder',{params:{limit:this.msg.limit,skip:(this.msg.skip-1)*12}}).then(function (res) {
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

