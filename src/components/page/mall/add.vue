<template>
    <div class="add">
        <div class="form-box">
            <el-form :model="form" label-width="80px">
                <el-form-item label="商品名称">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品类型">
                    <el-select v-model="form.type" placeholder="实体商品/虚拟商品" style="width: 100%;">
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
                        <el-input v-model="form.url" auto-complete="off"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="商品原价">
                    <el-input v-model="form.origin" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品库存">
                    <el-input v-model="form.num" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品运费">
                    <el-input v-model="form.costs" auto-complete="off"></el-input>
                </el-form-item>
                <div style="margin-bottom: 15px;">
                    <el-input placeholder="请输入价格" v-model="form.priceNum" class="input-with-select">
                        <el-select v-model="form.tag" slot="prepend" placeholder="售价">
                            <el-option v-model="price[0].value" label="菜豆" value="1"></el-option>
                            <el-option v-model="price[1].value" label="金币" value="2"></el-option>
                            <el-option v-model="price[2].value" label="积分" value="3"></el-option>
                            <el-option v-model="price[3].value" label="奖金" value="4"></el-option>
                        </el-select>
                    </el-input>
                </div>
                <el-form-item label="商品推荐">
                    <el-checkbox-group v-model="form.check">
                        <el-checkbox v-model="form.news" label="新品" name="news"></el-checkbox>
                        <el-checkbox v-model="form.recommand" label="推荐" name="recommand"></el-checkbox>
                        <el-checkbox v-model="form.prefer" label="特价" name="prefer"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="商品内容">
                    <el-input type="textarea" v-model="form.summary" :maxlength=200 :rows=6 placeholder="最多输入两百字"></el-input>
                </el-form-item>
                <el-form-item label="商品封面">
                    <div :class="!cdn_url?'uploader_files':'avatar-uploader'">
                        <div>
                            <img class="avatar" :src="item" v-for="item in imagelist">
                        </div>
                        <div :class="!cdn_url?'float':'uploader_input_wrp'">
                            <input class="el-icon-plus avatar-uploader-icon" type="file" accept="image/*"  @change="uploadThumb"/>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="上下架">
                    <el-switch on-text="" off-text="" v-model="form.shelves" :on-value="1" :off-value="0"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addFormYes">提交</el-button>
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
                btn_show:true,
                btn_hide:false,
                imagelist: [],
                cdn_url:'',
            }
        },
        created(){
//            this.getData();
        },
        computed: {
            proStatus(){//上传状态
                if(this.pass){
                    return 'success'
                }else if(this.pass == false){
                    return 'exception'
                }else{
                    return ''
                }
            }
        },
        methods: {
            //新增次数
            addFormYes(){
                let _this = this;
                let params = {
                    name: this.form.name,
                    type: this.form.type,
                    url: this.form.url,
                    origin: this.form.origin,
                    num:this.form.num,
                    costs:this.form.costs,
                    priceNum: this.form.priceNum,
                    tag: this.form.tag,
                    check: this.form.check,
                    summary:this.form.summary,
                    thumb:this.imagelist,
                    shelves:this.form.shelves,
                 };
                if(!this.form.name == ''&&
                    !this.form.type == ''&&
                    !this.form.url == ''&&
                    !this.form.origin == ''&&
                    !this.form.num == ''&&
                    !this.form.costs == ''&&
                    !this.form.priceNum == ''&&
                    !this.form.tag == ''&&
                    !this.form.check == ''&&
                    !this.form.summary == ''&&
                    !this.imagelist == ''&&
                    !this.form.shelves == ''){
                    this.$http.post('/shop/goods/save',params).then((res)=>{
                        console.log(res.data.data);
                        _this.open10();
                        setTimeout(()=>{
                            _this.$router.push('/mall');
                        },3000);
                    },(err)=>{
                        console.log(err);
                    })
                }else {
                    _this.open7();
                }
            },
            //添加成功
            open10() {
                this.$message({
                    showClose: true,
                    message: '新增数据成功',
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
                            that.imagelist.push(that.cdn_url);
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
