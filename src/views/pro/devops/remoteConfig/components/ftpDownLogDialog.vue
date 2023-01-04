<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body
  >
    <div class="app-container" :key="hackReset">
      <el-row :gutter="24">
        <el-col :span="6">
            <el-card ref="dirTreeInput" shadow="never" :max-height="this.tableHeight">
              <el-tree
                ref="dirTree"
                :props="{ label: 'name', children: 'children'} "
                :expand-on-click-node="false"
                :load = "loadNode"
                highlight-current
                lazy
                @node-click="dirTableClick"
                />
            </el-card>
        </el-col>
        <el-col id="paramInfoId" :span="18">
          <el-card shadow="never">
            <el-form ref="searchForm"  inline :label-width="'100px'">
              <vxe-grid
                ref="vxe"
                highlight-hover-row
                show-overflow
                show-header-overflow
                resizable
                sync-resize
                auto-resize
                class="vxe-table-element"
                :loading="loading"
                :columns="columns"
                :data="dataList"
                :toolbar="tableToolbar"
                :checkbox-config="{checkMethod:checkMethod,highlight: true}"
                @checkbox-all="({ selection }) => { selections = selection }"
                @checkbox-change="({ selection }) => { selections = selection }"
              >
                <template v-slot:toolbar_buttons>
                  <el-button  @click="down()">下载</el-button>
                </template>
              </vxe-grid>
            </el-form>

          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
  import {lsFtpFiles} from './ftpDownApi'
  import store from "@/store";
  import {download} from "ecip-web/utils"

  export default {
    name: "devops.remoteConfig.components.ftpDownLogDialog",
    components: {},
    data() {
      return {
        node:{},
        hackReset:1,
        dirLoading:false,
        loading: false,
        visible:false,
        title:'文件',
        tableHeight:null,
        formItem: {},
        dataList:[],
        dirList:[],
        dirTreeList:[],
        fileData:[],
        selections: [],
        queryParams:{},
        nodePathArray:[],
        initDirNodeName:[],
        tableToolbar: {
          id:"devops.remoteConfig.components.ftpDownLogDialog-toolbar",
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          },
          zoom: true, // 最大化按钮
          // 列宽操作记录
          resizable: {
            storage: true
          },
          // 列操作记录
          setting: {
            storage: true
          }
        },
        columns:[
          {type: 'checkbox', width: 40, fixed: 'left', align: 'center'},
          {title: '名称', field: 'name', minWidth: 150, showOverflow: true},
          {title: '修改时间', field: 'time', minWidth: 150, showOverflow: true},
          {title: '类型', field: 'type', minWidth: 150, showOverflow: true,
            slots:{
            default: ({row}, h) => {
              if(row.isFile){
                return 'FILE'
              }else if(row.isDirectory){
                return 'DIR'
              }else{
                return 'OTHER'
              }
            }
          }},
          {title: '大小', field: 'size', minWidth: 100, showOverflow: true,
            slots:{
              default: ({row}, h) => {
                if(row.size){
                  return (row.size/1024).toFixed(2) + 'KB';
                }
              }
            }},
        ]
      }
    },
    created() {
    },
    methods:{
      init(val){
       this.visible = true;
       ++this.hackReset;
       this.dataList = [];
       this.queryParams = {};
       this.dirList=[];
       this.dirTreeList = [];
       Object.assign(this.queryParams,val);
       this.initDirNodeName = this.queryParams.ftpLogPath || '/';
       if(this.initDirNodeName.length>1 && this.initDirNodeName.substr(this.initDirNodeName.length-1,1)==='/'){
         this.initDirNodeName = this.initDirNodeName.substring(0,this.initDirNodeName.length-1);
       }
       if(this.initDirNodeName.substr(0,1) != '/'){
         this.initDirNodeName = '/' + this.initDirNodeName;
       }
        this.queryParams.ftpLogPath = this.initDirNodeName;
      },
      async getFiles(){
        // 每次查询初始化checkbox selections
        this.loading = true;
        this.selections = []

          //构造请求参数
        let params={
          ftpIp:this.queryParams.serverIp,
          ftpUser:this.queryParams.ftpUser,
          ftpPwd:this.queryParams.ftpPwd,
          ftpPort:this.queryParams.ftpPort,
          path:this.queryParams.ftpLogPath,
          // ftpId:this.$store.state.user.id+this.queryParams.serverIp
          ftpId:'11112191'
        }
        // console.log("params:",params);
        const {data} = await lsFtpFiles({},params);
        this.dataList = data;
        this.dirList = this.getDirList(this.dataList);
        this.loading = false;
      },
      loadNode(node, resolve){
        // console.log("node:",node);
         if(node.level === 0){
           this.node = node;
           return  resolve([{ name: this.initDirNodeName }]);
         }
         //获取路径
          this.getNodePath(node);
         this.getFiles();
         setTimeout(() => {
           resolve(this.dirList);
         },800);
       },
      getNodePath(node){
        //获取路径
        let pathList = [];
        this.getPathByNode(node,pathList);
        this.queryParams.ftpLogPath = pathList.reverse().join("/");
        if(pathList.length>1 && pathList[0]==="/")
        {
          this.queryParams.ftpLogPath = this.queryParams.ftpLogPath.substring(1);
        }

      },
       getPathByNode(node,pathList){
        if(node.data.name){
          pathList.push(node.data.name);
        }
        if(node.parent.data){
          this.getPathByNode(node.parent,pathList);
        }
       },
      dirTableClick(node,Node){
        //获取路径
        this.getNodePath(Node);
        this.getFiles();
      },
      checkMethod({ row }){
          return row.isFile;
      },
     async down(){
        if (this.selections.length == 0) {
          this.$notify.warning("至少选择一条记录!");
          return;
        }
        let fileNameList = this.selections.map((x) => x.name);
        let filePathList = [];

        if(fileNameList && fileNameList.length>0){
          fileNameList.forEach(name =>{
            if(this.queryParams.ftpLogPath === '/'){
              filePathList.push(this.queryParams.ftpLogPath  + name);
            }else{
              filePathList.push(this.queryParams.ftpLogPath + '/' + name);
            }
          })
        }

        let params = {
          ftpIp:this.queryParams.serverIp,
          ftpUser:this.queryParams.ftpUser,
          ftpPwd:this.queryParams.ftpPwd,
          ftpPort:this.queryParams.ftpPort,
          path:filePathList.join(','),
          // ftpId:this.$store.state.user.id+this.queryParams.serverIp
          ftpId:'11112191'
        }
        await download({url:'api/v1/devops/ftp/download',method:'post',data:params});
      },
      getDirList(dataList){
        let dirList = [];
        if(dataList && dataList.length>0){
          dataList.forEach(item=>{
            if(item.isDirectory){
              dirList.push({name:item.name});
            }
          })
        }
        return dirList;
      },
    }
  }
</script>

<style scoped>

</style>
