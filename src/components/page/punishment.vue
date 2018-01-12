<template>
    <div class="punishment">

        <el-button class="btn-add" type="primary" @click="addList()">添加惩罚</el-button>
        <div class="daoru">
            <el-button class="btn-add" icon="document">导入excel</el-button><span class="excel_name">{{excelFileName}}</span>
            <input id="upload" class="importExcel" type="file" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        </div>
        <el-table
            :data="queryData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            stripe
            border
            style="width: 100%;border-top: 1px solid #d1d1d5;">
            <el-table-column
                prop="content"
                label="惩罚内容">
                <template slot-scope="scope">
                    <p class="item_content" v-for="item in scope.row.content">{{item}}</p>
                </template>
            </el-table-column>

            <el-table-column
                label="操作"
                width="150">
                <template slot-scope="scope">
                    <!--<el-button size="small" type="primary"
                               @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block pages">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="queryData.length">
            </el-pagination>
        </div>

        <!--添加list弹窗-->
        <el-dialog title="添加" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="问题一" :label-width="formLabelWidth">
                    <el-input v-model="form.content1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="问题二" :label-width="formLabelWidth">
                    <el-input v-model="form.content2" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="问题三" :label-width="formLabelWidth">
                    <el-input v-model="form.content3" auto-complete="off"></el-input>
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
                <el-form-item label="问题一" :label-width="formLabelWidth">
                    <el-input v-model="row.content1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="问题二" :label-width="formLabelWidth">
                    <el-input v-model="row.content2" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="问题三" :label-width="formLabelWidth">
                    <el-input v-model="row.content3" auto-complete="off"></el-input>
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
                content:[],
                editProblemData:[],//修改的数据
                dialogFormVisible: false,
                dialogFormEdit: false,
                form: {
                    content1:'',
                    content2:'',
                    content3:'',
                },
                formLabelWidth: '70px',
                index:'',
                type:'',//收费类别
                groupId: '',//组类别
                row:[],
                pageSize:5,
                currentPage:1,
                _id:'',//收费类别id
                excelFileName:'',//导入Excel文件名
                threeData:[],
            }
        },
        mounted(){
            this.$nextTick(function () {
                this.getData();
            })
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },

            handleSizeChange(val) {
                this.pageSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
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
//                        console.log(outdata);
                        _this.threeData = _this.split_array(outdata,3);
                        console.log(_this.threeData);
                        let params = {
                            PunishmentArr:_this.threeData,
                        };
                        _this.$http.post('/game/dirty/Punishment/batch',params).then((res)=>{
                            console.log(res);
                            _this.getData();
                        },(err)=>{
                            console.log(err);
                        });
//                        _this.queryData = _this.queryData.concat(_this.threeData);
                    };
                    reader.readAsArrayBuffer(f);
                };
                if(rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
            },

            split_array(arr, len){
                var a_len = arr.length;
                var result = [];
                for(var i=0;i<a_len;i+=len){
                    result.push(arr.slice(i,i+len));
                }
                return result;
            },

            /*查询*/
            getData(){
                let _this = this;
                this.$http.get('/game/dirty/Punishment/list').then(function (res) {
                    if(res.data.status===10000){
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
            },
            dialogFormVisibleYes(){
                let _this = this;
                this.dialogFormVisible = false;
                this.content.push(this.form.content1);
                this.content.push(this.form.content2);
                this.content.push(this.form.content3);
                let params = {
                    content:this.content,
                };
                if(!this.content === ''){
                    this.$http.post('/game/dirty/Punishment/save',params).then((res)=>{
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

            //添加失败
            open8() {
                this.$message({
                    showClose: true,
                    message: '添加惩罚失败',
                    type: 'error'
                });
            },
            //添加成功
            open6() {
                this.$message({
                    showClose: true,
                    message: '添加惩罚成功',
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
                this.dialogFormEdit = true;
                this.row = row;
                console.log(this.row.content[0]);
                this.index = index;
            },
            dialogFormEditNo(){
                this.dialogFormEdit = false;
                this.getData();
            },
            dialogFormEditYes(){
                let _this = this;
                this.dialogFormEdit = false;
                this.content.push(this.row.content1);
                this.content.push(this.row.content2);
                this.content.push(this.row.content3);
                let params = {
                    id:this.row._id,
                    content:this.content,
                };
                this.$http.post('/game/dirty/Punishment/update',params).then((res)=>{
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
                this.centerDialogVisible = false;
                this.queryData.splice(this.index, 1);
                let params = {
                    id:this.row._id,
                };
                this.$http.post('/game/dirty/Punishment/delete',params).then((res)=>{
                    console.log(res.data.data);
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
    .item_content{
        padding: 8px 0;
        border-bottom: 1px solid #dfe6ec;
    }
    .item_content:last-child{
        border-bottom: none;
    }
</style>

