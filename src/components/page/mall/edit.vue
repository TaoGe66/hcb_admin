<template>
    <div class="edit">
        <div class="form-box">
            <el-form :model="form" label-width="80px">
                <el-form-item label="商品名称">
                    <el-input v-model="queryData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品类型">
                    <el-select v-model="queryData.type" placeholder="实体商品/虚拟商品" style="width: 100%;">
                        <el-option
                            v-for="item in key"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div v-if="form.type == 'v' ? btn_show : btn_hide">
                    <el-form-item label="URL">
                        <el-input v-model="queryData.url" auto-complete="off"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="商品原价">
                    <el-input v-model="queryData.origin" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品库存">
                    <el-input v-model="queryData.num" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品运费">
                    <el-input v-model="queryData.costs" auto-complete="off"></el-input>
                </el-form-item>
                <div style="margin-bottom: 15px;">
                    <el-input placeholder="请输入价格" v-model="queryData.priceNum" class="input-with-select">
                        <el-select v-model="queryData.tag" slot="prepend" placeholder="售价">
                            <el-option v-model="price[0].value" label="菜豆" value="1"></el-option>
                            <el-option v-model="price[1].value" label="金币" value="2"></el-option>
                            <el-option v-model="price[2].value" label="积分" value="3"></el-option>
                            <el-option v-model="price[3].value" label="奖金" value="4"></el-option>
                        </el-select>
                    </el-input>
                </div>
                <el-form-item label="商品推荐">
                    <el-checkbox-group v-model="form.check">
                        <el-checkbox label="新品" name="news"></el-checkbox>
                        <el-checkbox label="推荐" name="recommand"></el-checkbox>
                        <el-checkbox label="特价" name="prefer"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="商品内容">
                    <el-input type="textarea" v-model="queryData.summary" :maxlength=200 :rows=6 placeholder="最多输入两百字"></el-input>
                </el-form-item>
                <el-form-item label="商品封面">
                    <div :class="!queryData.thumb?'uploader_files':'avatar-uploader'">
                        <div>
                            <img class="avatar" :src="item" v-for="item in queryData.thumb">
                        </div>
                        <div :class="!queryData.thumb?'float':'uploader_input_wrp'">
                            <input class="el-icon-plus avatar-uploader-icon" type="file" accept="image/*"  @change="uploadThumb"/>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="editFormYes">提交</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                addForm: false,
                form: {
                    name: '',
                    type: '',
                    url: '',
                    origin: '',
                    num:'',
                    costs:'',
                    delivery: true,
                    desc: '',
                    news:'',
                    recommand:'',
                    prefer:'',
                    summary:'',
                    shelves:'1',
                    bean:'',
                    gold:'',
                    point:'',
                    coupon:'',
                    tag:'',
                    check:[],
                    priceNum:'',
                },
                key: [{
                    value: 'e',
                    label: '实体商品'
                }, {
                    value: 'v',
                    label: '虚拟商品'
                }],
                price: [{
                    value: '1',
                    label: '菜豆'
                }, {
                    value: '2',
                    label: '金币'
                }, {
                    value: '3',
                    label: '积分'
                }, {
                    value: '4',
                    label: '奖金'
                }],
                index:'',
                row:[],
                input5: '',
                imagelist: [],
                cdn_url:'',
                _id:'',
                queryData:[],
                btn_show:true,
                btn_hide:false,
            }
        },
        mounted(){
            this.$nextTick(function () {
                this._id = this.$route.params._id;
                this.getData();
            })
        },
        methods: {
            /*查询*/
            getData(){
                let _this = this;
                this.$http.get('/shop/goods/findone',{params:{id:_this._id}}).then(function (res) {
                    _this.queryData = res.data.data;
                    console.log(_this.queryData);
                    if(_this.queryData.news){
                        _this.form.check.push('新品');
                    }
                    if(_this.queryData.recommand){
                        _this.form.check.push('推荐');
                    }
                    if(_this.queryData.prefer){
                        _this.form.check.push('特价');
                    }
                },(err)=> {
                    console.log(err);
                })
            },

            //修改商品详情
            editFormYes(){
                let _this = this;
                let params = {
                    id:this._id,
                    name: this.queryData.name,
                    type: this.queryData.type,
                    url: this.queryData.url,
                    origin: this.queryData.origin,
                    num:this.queryData.num,
                    costs:this.queryData.costs,
                    priceNum: this.queryData.priceNum,
                    tag: this.queryData.tag,
                    check: this.form.check,
                    news: this.queryData.news,
                    recommand: this.queryData.recommand,
                    prefer: this.queryData.prefer,
                    summary:this.queryData.summary,
                    thumb:this.queryData.thumb,
                    shelves:this.form.shelves,
                };
                console.log(this.queryData.thumb);
                this.$http.post('/shop/goods/update',params).then((res)=>{
                    console.log(res.data.data);
                    _this.open10();
                    setTimeout(()=>{
                        _this.$router.push('/mall');
                    },3000);
                },(err)=>{
                    console.log(err);
                });
            },
            //添加成功
            open10() {
                this.$message({
                    showClose: true,
                    message: '修改数据成功',
                    type: 'success'
                });
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
                            that.queryData.thumb.push(that.cdn_url);
                        });
                    });
                }
            },
        }
    }
</script>

<style scoped>
    .el-select{
        width: 80px;
    }
    .input-with-select {
        background-color: #fff;
    }
    .avatar-uploader{
        position: relative;
        border-radius: 4px;
    }
    .uploader_files{
        position: relative;
        border-radius: 4px;
        width: 80px;
        height: 80px;
    }
    .avatar{
        width: 80px;
        height: 80px;
        border-radius: 4px;
        display: inline-block;
        margin-right: 10px;
    }
    .el-icon-plus{
        width: 80px;
        height: 80px;
        line-height: 80px;
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
    }
    .float{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 80px;
        height: 80px;
    }
    .el-icon-plus:before {
        content: "\E61C";
        margin-left: 31px;
    }
    .avatar-uploader-icon {
        font-size: 16px;
        color: #8c939d;
        outline: none;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        cursor: pointer;
    }
    .uploader_input_wrp{
        width: 80px;
        height: 80px;
        margin-top: 10px;
    }
</style>
