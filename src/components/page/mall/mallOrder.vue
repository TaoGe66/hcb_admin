<template>
    <div class="mallOrder">
        <div class="handle-box">
            <el-select v-model="select_cate" placeholder="全部地区" class="handle-select mr10">
                <el-option key="0" value="" placeholder="上下架">全部地区</el-option>
                <el-option key="1" label="重庆" value="cq"></el-option>
                <el-option key="2" label="北京" value="bj"></el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="用户名称/ID" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" @click="Router()" style="float: right">发货</el-button>
        </div>
        <el-table :data="data.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
            <el-table-column type="index" width="40" header-align="center" align="center"></el-table-column>
            <el-table-column prop="region" label="地区" width="100" :formatter="formatter" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="serial" label="订单编号" width="180" :formatter="formatter2" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="userId" label="用户账号" width="150" :formatter="formatter3" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="num" label="订单金额" width="100" header-align="center" align="center">
                <template slot-scope="scope">
                    {{scope.row.recommand == true ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column prop="new" label="支付方式" width="100" header-align="center" align="center">
                <template slot-scope="scope">
                    {{scope.row.news == true ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="下单时间" width="200" header-align="center" align="center">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formDate}}
                </template>
            </el-table-column>
            <el-table-column prop="step" label="订单状态" width="100" header-align="center" align="center">
                <template slot-scope="scope">
                    {{scope.row.step == '1000' ? '已付款' : (scope.row.step == '4000' ? '待收货' : (scope.row.step == '5000' ? '已完成' : ''))}}
                </template>
            </el-table-column>

            <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button size="small" type="primary"
                        v-if="scope.row.step == '4000' ? btn_show : btn_hide"
                        @click="handleEdit(scope.$index, scope.row)">确认收货</el-button>
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

        <!--上下架商品弹窗提示-->
        <el-dialog
            title="提示"
            :visible.sync="DialogVisible"
            width="30%"
            center>
            <span>确定上下架商品吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="DialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="DialogShow()">确 定</el-button>
            </span>
        </el-dialog>

        <!--新增list弹窗-->
        <!--<el-dialog title="新增商品" :visible.sync="addForm">
            <el-form :model="form">
                <el-form-item label="商品名称" :label-width="formLabelWidth">
                    <el-input v-model="form.remainNum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品类型" :label-width="formLabelWidth">
                    <el-input v-model="form.remainNum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品原价" :label-width="formLabelWidth">
                    <el-input v-model="form.remainNum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品库存" :label-width="formLabelWidth">
                    <el-input v-model="form.remainNum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品运费" :label-width="formLabelWidth">
                    <el-input v-model="form.remainNum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品推荐" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="form.remainNum">
                        <el-checkbox label="新品" name="type"></el-checkbox>
                        <el-checkbox label="推荐" name="type"></el-checkbox>
                        <el-checkbox label="特价" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="商品售价" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.type">
                        <el-radio label="菜豆" name="type"></el-radio>
                        <el-radio label="金币" name="type"></el-radio>
                        <el-radio label="积分" name="type"></el-radio>
                        <el-radio label="奖金" name="type"></el-radio>
                    </el-radio-group>
                    <el-form-item label="商品类型" :label-width="formLabelWidth">
                        <el-input v-model="form.remainNum" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="菜豆" :label-width="formLabelWidth">
                        <el-input v-model="form.remainNum" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品库存" :label-width="formLabelWidth">
                        <el-input v-model="form.remainNum" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品运费" :label-width="formLabelWidth">
                        <el-input v-model="form.remainNum" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="文本框">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addForm = false">取 消</el-button>
                <el-button type="primary" @click="addFormYes()">确 定</el-button>
            </div>
        </el-dialog>-->

        <!--编辑list弹窗-->
        <el-dialog title="编辑次数" :visible.sync="dialogFormEdit" width="500px">
            <el-form :model="form">
                <el-form-item label="剩余次数" :label-width="formLabelWidth">
                    <el-input v-model="form.remainNum" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormEdit = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormEditYes()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                DialogVisible:false,
                queryData: [],
                addData:[],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                dialogFormEdit: false,
                addForm: false,
                form: {
                    account: '',
                    remainNum:'',
                    region:'',
                },
                formLabelWidth: '70px',
                index:'',
                permission:'',
                row:[],
                pageSize:10,
                currentPage:1,
                btn_show:true,
                btn_hide:false,
                show:false,
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
        computed: {
            data(){
                const self = this;
                return self.queryData.filter(function(d){
                    let is_del = false;
                    for (let i = 0; i < self.del_list.length; i++) {
                        if(d.name === self.del_list[i].name){
                            is_del = true;
                            break;
                        }
                    }
                    if(!is_del){
                        if(d.region.indexOf(self.select_cate) > -1&&
                            (d.serial.indexOf(self.select_word) > -1 ||
                            d.userId.indexOf(self.select_word) > -1)
                        ){
                            return d;
                        }
                    }
                })
            }
        },
        methods: {

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

            getData(){
                let _this = this;
                _this.$http.get("/shop/order/allorder",{params:{limit:this.msg.limit,skip:(this.msg.skip-1)*10}}).then((res) => {
                    _this.dataLength = res.data.count;
                    _this.queryData = res.data.data;
                    console.log(_this.queryData);
                })
            },

            //上下架商品
            shelve(index, row){
                this.index = index;
                this.row = row;
                this.DialogVisible = true;
            },
            DialogShow(){
                let _this = this;
                this.DialogVisible = false;
                let params = {
                    id:this.row._id,
                    shelves:this.row.shelves,
                };
                this.$http.post('/shop/goods/up',params).then((res)=>{
                    console.log(res.data.data);
                    _this.getData();
                },(err)=>{
                    console.log(err);
                })
            },

            //新增商品
            add(index, row) {
                this.index = index;
                this.row = row;
                this.$router.push('/mallAdd');
            },

            //编辑商品
            handleEdit(index, row) {
                this.index = index;
                this.row = row;
                this.$router.push({path: '/mallEdit' + row._id});
            },
            /*dialogFormEditYes(){
             let _this = this;
             this.dialogFormEdit = false;
             let params = {
             id:this.row._id,
             remainNum:this.form.remainNum,
             editor:localStorage.getItem("ms_username"),
             };
             this.$axios.post('/user/update',params).then((res)=>{
             console.log(res.data.data);
             _this.getData();
             _this.open12();
             },(err)=>{
             console.log(err);
             })
             },
             //添加成功
             open12() {
             this.$message({
             showClose: true,
             message: '修改数据成功',
             type: 'success'
             });
             },*/

            //发货跳转
            Router(){
                this.$router.push('/mallShip');
            },

            search(){
                this.is_search = true;
            },
            formatter(row, column) {
                return row.region;
            },
            formatter2(row, column) {
                return row.serial;
            },
            formatter3(row, column) {
                return row.userId;
            },
        }
    }
</script>

<style scoped>
    .handle-box{
        margin-bottom: 20px;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }
    .pages{
        margin-top: 20px;
        text-align: right;
    }
    .el-icon-plus:before {
        content: "\E61C";
        margin-right: 5px;
    }
</style>
