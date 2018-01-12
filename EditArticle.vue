<template>
  <div class="row">
    <div class="col-md-12 col-sm-12 col-xs-12">
      <div class="new-article-tips">
        <span class="new-aticle-title">文章管理／</span>
        <span class="new-article-a">新建文章</span>
      </div>
      <div class="col-md-3 new-aticle-l">
        <div class="new-aticle-l1">
          <p class="new-aticle-tip">封面</p>
          <div class="fengmian-box">
            <img :src="imgUrls" alt="" class="fenmian-img" v-show="isPhoto">
          </div>
          <VueBase64FileUpload   accept="image/png,image/jpeg"
                               image-class="v1-image"
                               input-class="v2-image"
                               placeholder="选择封面"
                               :max-size="customImageMaxSize"
                               @size-exceeded="onSizeExceeded"
                               @file="onFile"
                               @load="onLoad"
                               v-show="source===''"
          >

          </VueBase64FileUpload>
          <a class="v2-image"  v-show="source!==''">封面</a>
        </div>
      <!--  <input type="text" placeholder="文章标题" class="v2-image" width="100%" v-model="articleTitle" :disabled="source!==''">
        <input type="text" placeholder="作者名" class="v2-image" width="100%" v-model="author_name" v-show="source===''">-->
      </div>
      <div class="col-md-9 new-aticle-r">
        <div class="new-aticle-r1">
          <div class="m-article-title">
            <input type="text" class="ma-article-title" placeholder="请输入标题" v-model="articleTitle" :disabled="source!==''">
          </div>
          <div class="m-article-author">
            <input type="text" class="ma-article-author" placeholder="请输入作者" v-model="author_name" v-show="source===''">
          </div>
          <div class="m-editor" id="editor1">

          </div>
          <!--<quillEditor></quillEditor>-->
          <div class="article-source" v-show="source!==''">
            来源：{{source}}
          </div>
          <div class="article-abstract">
            <p class="article-abstract-tip" v-model="abstract">摘要</p>
            <textarea class="form-control article-abstract-content" rows="3" id="article-abstract-content" v-model="abstract" :disabled = "source!==''"></textarea>
            <p class="abstract-font-num">{{abstract.length}}/120</p>
          </div>
          <div class="adv-xuanxhuan">
            <p class="adv-xuanxhuan-tip">广告推广</p>
            <div class="adv-xuanxhuan-btns">
              <a  class="select-from-adv" data-toggle="modal" data-target="#myModal">
                从广告库选择
              </a>
              <img :src="adImage" alt="" style="display: block;width: 200px;height: 200px">
            <!--  <a href="#" class="build-adv pull-left">
                创建广告
              </a>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 col-sm-12 col-xs-12 bottom-btns">
      <div class="bottom-btns1 col-md-12 col-sm-12 col-xs-12 ">
        <a @click="save()" class="bottom-save-btn">
          保存
        </a>
        <a href="#" class="bottom-btn-preview" style="display: none">
          预览
        </a>
          <a  class="bottom-send-btn bottom-btn-preview"  id="bottom-send-btn" @click="sendArticle">
            分享
        </a>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">选择广告</h4>
          </div>
          <div class="modal-body">
           <div class="new-adv-c clearfix">
             <a href="#" class="btn-create-adv pull-right">
               创建广告
             </a>
             <div class="adv-choice-container">
              <!-- <table class="table table-hover">
                 <thead class="adv-choice-thead">
                 <tr>
                   <th style="text-align: center">广告图片</th>
                   <th style="text-align: center">到期日</th>
                   <th style="text-align: center">关联文章数</th>
                 </tr>
                 </thead>
                 <tbody>
                 <tr>
                   <td style="text-align: center;">
                      <i class="choice-advv"></i>
                     <img src="" alt="" class="choice-advv-img">
                   </td>
                   <td style="text-align: center">2018－02－19</td>
                   <td style="text-align: center">0</td>
                 </tr>
                 <tr>
                   <td style="text-align: center;">
                     <i class="choice-advv"></i>
                     <img src="" alt="" class="choice-advv-img">
                   </td>
                   <td style="text-align: center">2018－02－19</td>
                   <td style="text-align: center">0</td>
                 </tr>
                 <tr>
                   <td style="text-align: center;">
                     <i class="choice-advv"></i>
                     <img src="" alt="" class="choice-advv-img">
                   </td>
                   <td style="text-align: center">2018－02－19</td>
                   <td style="text-align: center">0</td>
                 </tr>
                 </tbody>
               </table>-->
                 <el-table :data="advDatas"  border fit highlight-current-row style="width: 100%"
                           ref="singleTable"
                           @current-change="handleCurrentChange1"
                 >
                 <el-table-column
                   label="广告图片"
                   width="180"
                 >
                   <template scope="scope">
                     <i class="choice-advv"></i>
                     <img :src="scope.row.ad_image" alt="" class="choice-advv-img">
                   </template>
                 </el-table-column>
                 <el-table-column
                   label="到期日"
                   align="center"
                 >
                   <template scope="scope">
                     <span>{{scope.row.end_date}}</span>
                   </template>
                 </el-table-column>
                 <el-table-column
                   label="关联文章数"
                   align="center"
                 >
                   <template scope="scope">
                     <span>{{scope.row.articles_count}}</span>
                   </template>
                 </el-table-column>
               </el-table>
               <div class="block">
                 <el-pagination
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-size=pageSize
                   layout="total, prev, pager, next, jumper"
                   :total=totalCount>
                 </el-pagination>
               </div>
             </div>
           </div>
          </div>
          <div class="modal-footer">
            <a data-dismiss="modal" class="modal-footer-ok">确定</a>
            <a data-dismiss="modal" class="modal-footer-cancle">取消</a>
          </div>
        </div>
      </div>
    </div>
    <div class="weixin-share-container" v-show="isShowQRCode">
      <div class="qrcode-close" @click="closeQrCode()">

      </div>
      <p class="weixin-share-title">请扫描</p>
      <div id="qrcode">
        <div class="qr-code-center" id="qr-code-center">
          <img src="../../assets/images/qrtest.png" alt="">
        </div>
      </div>
      <p class="weixin-scan-tip">微信扫码，获取文章</p>
      <div class="qr-c-container">
        <a  class="qr-c-btn" @click="closeQrCode()">
          关闭
        </a>
      </div>
    </div>
    <div class="weixin-share-layer" v-show="isShowQRCode">

    </div>
  </div>
</template>
<script>
  import VueBase64FileUpload from 'vue-base64-file-upload';
  import {editArticle} from '../../api/article'
  import {getArticleById} from '../../api/article'
  import {getSignInfo} from '../../api/article'
  import {getAllArticle} from '../../api/adv'
  import QRCode from '../../assets/js/jquery.qrcode.min'
  import wx from 'weixin-js-sdk';
  export default{
      components:{
        VueBase64FileUpload
      },
      data(){
        return{
          abstract:"",
          imgUrls:"",
          isPhoto: true,
          customImageMaxSize:5,
          body:"",
          ad_id:"",
          articleTitle:"",
          pageSize:10,
          advDatas:[],
          totalCount:0,
          currentPage:1,
          currentRow:null,
          articleId:-1,
          adImage:"",
          redirect_url:"",
          article:"",
          realarticleId:-1,
          author_name:'',
          isShowQRCode:false,
          source:"",
          isWeiXinBrowser:false
        }
      },
    watch:{
      $route(to){
        //对传递的id进行验证(防止篡改)
        let reg=/editarticle\/\d+/;
        const _this = this;
        if(reg.test(to.path)){
          let newsId=this.$route.params.articleId || 0;
          this.isWeiXinBrowser = this.isWeiXin();
          this.realarticleId = newsId;
          if(this.isWeiXin()){
            this.getAsign();
          }

//          this.getArticleInfos();
          this.initEditor();
          this.initChangeEvent();
          this.getAllArticles(1,this.pageSize);
        }
      }
    },
      mounted(){
        this.realarticleId =this.$route.params.articleId || 0;
        if(this.isWeiXin()){
          this.getAsign();
        }
        this.initEditor();
        this.initChangeEvent();
        this.getAllArticles(1,this.pageSize);
      },
      methods:{
        getAsign(){
          const _this = this;
          //将这个动态的url传递给后端(便于后端进行签名操作)
          let url1 = encodeURIComponent(window.location.href.split('#')[0]);
          //请求分享获取到的签名信息
          let urlObj = {
              url:url1
          };
          getSignInfo(`/v1/tool/shares/`,urlObj).then((res)=>{
            _this.initAsign(res);
          },(err)=>{
          });
        },
        /**
         * 初始化签名信息
         * */
        initAsign(res){
          const _this = this;
          console.log("获取到的签名信息是:",res);
          if(res.status === 200){
            //从服务器端获取到必要的参数,将必要的信息进行初始化赋值
            let sinObj = res.data.data.detail;
            wx.config({
              debug: true,
              appId: sinObj.appId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
              timestamp:sinObj.timestamp.toString(), // 必填，生成签名的时间戳
              nonceStr: sinObj.nonceStr, // 必填，生成签名的随机串
              signature: sinObj.signature,// 必填，签名，见附录1
              //需要分享的列表项:发送给朋友，分享到朋友圈，分享到QQ，分享到QQ空间
              jsApiList: [
               'checkJsApi',
               'scanQRCode'
              ]
            });
            wx.error(function(res) {
              alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
            });
            wx.ready(function () {
              wx.checkJsApi({
                jsApiList : ['scanQRCode'],
                success : function(res) {
                }
              });
              wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                  var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                  console.log("result:aaaaaaa",result);
                  //                    window.location.href = result;//因为我这边是扫描后有个链接，然后跳转到该页面
                }
              });
            });
          }
        },
        /**
         * 判断是否是微信浏览器打开
         * */
        isWeiXin(){
          //判断是否是微信浏览器
          let ua = window.navigator.userAgent.toLowerCase();
          if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
          } else {
            return false;
          }
        },
        closeQrCode(){
          this.isShowQRCode = false;
        },
        sendArticle(){
            this.isShowQRCode = true;
          /*  const target_url = `http://192.168.0.102:8787/#/article/${this.realarticleId}`;
            $('#qr-code-center').html('');//避免重复生成二维码
            $('#qr-code-center').qrcode({width: 180,height: 180,text: target_url});*/


        },

        getArticleInfos(){
          getArticleById(`v1/article/articles/${this.realarticleId}/`).then((res)=>{
            console.log("获取到文章的信息是:",res);
            this.article= res.data.data.detail;
            this.redirect_url = this.article.ad_infos.redirect_url;
            this.adImage = this.article.ad_infos.ad_image;
            this.imgUrls = this.article.image;
            this.articleTitle = this.article.title;
            this.body = this.article.body;
            this.abstract = this.article.abstract;
            this.articleId = this.article.ad_id;
            this.author_name = this.article.author_name;
            this.source = this.article.source;
            CKEDITOR.instances['editor1'].setData(this.body);
            if(this.source!==""){
              CKEDITOR.instances['editor1'].setReadOnly(true);
            }
            this.filterData(this.body,this.source);
          },(err)=>{
            console.log("出现的错误是:",err);
          });
        },
        filterData(content,source){
          $(function () {
            if(source !==""){
              $("#editor1").html(content).find("img").each(function (index,item) {
                if($(item).data("src")){
                  let getImgs = $(item).data("src").split("?")[0];
                  $(item).attr("src",getImgs);
                }else{

                }
                /* $(this)[0].src =`http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=${getImgs}?=&${Math.random()}`;*/

              })
            }
          })
        },
        handleCurrentChange1(val) {
          this.currentRow = val;
          console.log("this.currentRow:",this.currentRow);
          this.articleId = this.currentRow.id;
          this.adImage = this.currentRow.ad_image;
        },
        handleCurrentChange(val) {
          this.getAllArticles(val,this.pageSize);
        },
        getAllArticles(page,pageSize){
          getAllArticle(`v1/advertisement/users/${localStorage.getItem("userId")}/ads/`,page,pageSize).then((res)=>{
            this.advDatas = res.data.data.detail;
            this.totalCount = res.data.data.total;
          },(err)=>{

          })
        },
        /**
         * 显示Toast信息
         * */
        showMsg(str){
          this.$toast.center(str);
        },
        onFile(file) {
          console.log(file); // file object
        },

        onLoad(dataUri) {
          console.log(dataUri); // data-uri string
          this.imgUrls = dataUri;
        },

        onSizeExceeded(size) {
          alert(`Image ${size}Mb size exceeds limits of ${this.customImageMaxSize}Mb!`);
        },
          initChangeEvent(){
            const _this = this;
            $('#article-abstract-content').on('keyup', function () {
              if($('#article-abstract-content').val().trim() === '') {
                console.log('text is empty');
              }
              console.log("abstract:",_this.abstract.length);
            });

          },
          initEditor(){
            CKEDITOR.replace( 'editor1',{
              extraPlugins: 'uploadimage',
                height: 300,
              // Upload images to a CKFinder connector (note that the response type is set to JSON).
              uploadUrl: 'https://ckeditor.com/apps/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',

              // Configure your file manager integration. This example uses CKFinder 3 for PHP.
              filebrowserBrowseUrl: 'https://ckeditor.com/apps/ckfinder/ckfinder.html',
              //浏览图片的url
              filebrowserImageBrowseUrl: 'https://ckeditor.com/apps/ckfinder/ckfinder.html?type=Images',
              filebrowserUploadUrl: 'https://ckeditor.com/apps/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
              //上传图片的url
              filebrowserImageUploadUrl: `http://192.168.0.200:90/v1/article/images/`,
              //上传视频的url
              filebrowserFlashUploadUrl : 'https://ckeditor.com/apps/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
              stylesSet: [
              { name: 'Narrow image', type: 'widget', widget: 'image', attributes: { 'class': 'image-narrow' } },
              { name: 'Wide image', type: 'widget', widget: 'image', attributes: { 'class': 'image-wide' } }
            ],
              // Configure the Enhanced Image plugin to use classes instead of styles and to disable the
              // resizer (because image size is controlled by widget styles or the image takes maximum
              // 100% of the editor width).
              image2_alignClasses: [ 'image-align-left', 'image-align-center', 'image-align-right' ],
              image2_disableResizer: true,

              // Define the toolbar groups as it is a more accessible solution.
              toolbarGroups: [
                {"name":"basicstyles","groups":["basicstyles","cleanup"]},
                {"name":"links","groups":["links"]},
                {"name":"clipboard","groups":["undo"]},
                {"name":"paragraph","groups":["list","blocks","align"]},
                {"name":"insert","groups":["insert"]},
                {"name":"styles","groups":["styles"]},
                {"name":"colors","groups":["colors"]},
              ],
              // Remove the redundant buttons from toolbar groups defined above.
              removeButtons: 'Strike,Subscript,Superscript,Anchor,Specialchar,Iframe,CreateDiv,Styles'
            } );
//            CKEDITOR.instances['editor1'].setData("<h1>哈哈</h1>")
            this.getArticleInfos();
          },
          save(){
            if(CKEDITOR.instances['editor1'].getData()==""){
              alert("内容不能为空！");
              return false;
            }else {
              this.body =  CKEDITOR.instances['editor1'].getData();
            }
            if(this.abstract === ""){
                this.showMsg("文章摘要不能为空!");
                return;
            }
            if(this.body === ""){
                this.showMsg("文章内容!");
                return;
            }
            if(this.imgUrls === ""){
              this.showMsg("请选择文章封面!");
              return;
            }
            if(this.articleTitle === ""){
              this.showMsg("文章标题不能为空!");
              return;
            }
           /* if(this.author_name === ""){
              this.showMsg("作者名不能为空!");
              return;
            }*/
            let option = {

            };
            if(this.articleId === -1){
              option.abstract = this.abstract;
              option.body = this.body;
              option.cover_image = this.imgUrls;
              option.title = this.articleTitle;
              if(this.author_name!==""){
                option.author_name = this.author_name;
              }
              if(this.source!==""){
                option.source = this.source;
              }
            }
            if(this.articleId!==-1 && this.imgUrls.indexOf("http")===-1){
              option.abstract = this.abstract;
              option.body = this.body;
              option.cover_image = this.imgUrls;
              option.title = this.articleTitle;
              option.ad_id = this.articleId;
              if(this.author_name!==""){
                option.author_name = this.author_name;
              }
              if(this.source!==""){
                option.source = this.source;
              }
            }
            if(this.imgUrls.indexOf("http")!==-1){//包含
              option.abstract = this.abstract;
              option.body = this.body;
              option.title = this.articleTitle;
              option.ad_id = this.articleId;
              option.author_name = this.author_name;
            }
            editArticle(`v1/article/users/${localStorage.getItem("userId")}/articles/${this.realarticleId}/`,option).then((res)=>{
              this.showMsg("上传成功!");
              console.log("返回的数据是:",res);
            },(err)=>{

            })
          }
      }

  }
</script>
<style>
  @import "../../assets/css/newarticle.css";
  .vue-base64-file-upload img,.v1-image{
    display: none!important;
  }
  .v2-image{
    background:#ffffff;
    border:1px solid #e4e8eb;
    border-radius:2px;
    width:200px;
    height:28px;
    font-size:12px;
    color:#353535;
    text-align: center;
    line-height: 28px;
    display: block;
    margin: 0 auto;
    margin-top: 18px;
  }
  .el-pager li.active{
    background: #2cb42c;
    border-color: #2cb42c;
  }
</style>
