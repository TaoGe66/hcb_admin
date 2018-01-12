<template>
    <div class="mall">
        <div class="handle-box">
            <el-select v-model="select_cate1" placeholder="上下架" class="handle-select mr10">
                <el-option key="0" value="" placeholder="上下架">全部</el-option>
                <el-option key="1" label="上架" value="1"></el-option>
                <el-option key="2" label="下架" value="0"></el-option>
            </el-select>
            <el-select v-model="select_cate2" placeholder="类型" class="handle-select mr10">
                <el-option key="0" value="" placeholder="类型">全部</el-option>
                <el-option key="1" label="实体商品" value="e"></el-option>
                <el-option key="2" label="虚拟商品" value="v"></el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="用户名称/ID" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" @click="add" style="float: right"><i class="el-icon-plus"></i>新增</el-button>
        </div>
        <el-table :data="data.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%">
            <el-table-column type="index" width="60" header-align="center" align="center"></el-table-column>
            <el-table-column prop="serial" label="商品ID" width="180" :formatter="formatter2" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="150" :formatter="formatter" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="recommand" label="是否推荐" width="100" header-align="center" align="center">
                <template slot-scope="scope">
                    {{scope.row.recommand == true ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column prop="new" label="是否新品" width="100" header-align="center" align="center">
                <template slot-scope="scope">
                    {{scope.row.news == true ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column prop="prefer" label="是否特价" width="100" header-align="center" align="center">
                <template slot-scope="scope">
                    {{scope.row.prefer == true ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="100" :formatter="formatter4" header-align="center" align="center">
                <template slot-scope="scope">
                    {{scope.row.type == 'e' ? '实体商品' : '虚拟商品'}}
                </template>
            </el-table-column>
            <el-table-column prop="num" label="库存" width="80" header-align="center" align="center">
            </el-table-column>
            <el-table-column label="商品价格" header-align="center">
                <el-table-column prop="bean" label="菜豆" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        {{scope.row.bean == '' ? '/' : scope.row.bean}}
                    </template>
                </el-table-column>
                <el-table-column prop="point" label="积分" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        {{scope.row.point == '' ? '/' : scope.row.point}}
                    </template>
                </el-table-column>
                <el-table-column prop="gold" label="金币" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        {{scope.row.gold == '' ? '/' : scope.row.gold}}
                    </template>
                </el-table-column>
                <el-table-column prop="coupon" label="奖金" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        {{scope.row.coupon == '' ? '/' : scope.row.coupon}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column prop="costs" label="运费" width="80" header-align="center" align="center">
            </el-table-column>

            <el-table-column prop="shelves" label="上下架" width="80" :formatter="formatter3" header-align="center" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small"
                        @click="shelve(scope.$index, scope.row)">
                        {{scope.row.shelves == true ? '下架' : '上架'}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" header-align="center" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" type="primary"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
                select_cate1: '',
                select_cate2: '',
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
                        if(d.shelves.indexOf(self.select_cate1) > -1&&
                           d.type.indexOf(self.select_cate2) > -1&&
                          (d.serial.indexOf(self.select_word) > -1 ||
                           d.name.indexOf(self.select_word) > -1)
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
                _this.$http.get("/shop/goods/alllist",{params:{limit:this.msg.limit,skip:(this.msg.skip-1)*10}}).then((res) => {
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

            search(){
                this.is_search = true;
            },
            formatter(row, column) {
                return row.name;
            },
            formatter2(row, column) {
                return row.serial;
            },
            formatter3(row, column) {
                return row.shelves;
            },
            formatter4(row, column) {
                return row.type;
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
