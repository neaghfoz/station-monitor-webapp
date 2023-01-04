import tiUserApi from "@/views/pro/common/tiApi/tiUser/tiUserApi";
import {getOrgTreeData} from "@/views/pro/common/util/dataUtil"


export  default {
  result:{},
  async getUserAuth (sysOrg){
    let result = {
      level:'',
      roadIdStr:'',
      stationIdStr:''
    }
    //用户level
   let userNodeData = await tiUserApi.getUserNodeLevel();
    let userNode =userNodeData.data||{};

    let userNodeLevel = Number(userNode.nodeLevel);
    if(userNode.fullName === '超级管理员')
    {
      userNodeLevel = 0;
    }

    // let userOrgConfData = await tiUserApi.isUserOrgConf();
    // todo 默认没有单独的数据权限配置，这个方法后面要改造，作废。
     let userOrgConfData = 0;

    let userOrgConf = Number(userOrgConfData.data);

    let roadIds = [];
    let stationIds = [];
    let selectNodeLevel  = Number(sysOrg.nodeLevel);

    if(selectNodeLevel === 0 && userNodeLevel === 0)
    {
      result.level = 0;
      return result;
    }else if(selectNodeLevel <=2 &&  userNodeLevel<=2)
    {
      result.level = 2;
      if(sysOrg.roadId != '0'){
        result.roadIdStr = sysOrg.roadId;
      }else{
        getOrgTreeData(sysOrg.children,'roadId',roadIds,2);
        // result.roadIdStr = roadIds.join(',');
      }
    }else
    {
      result.level = 4;
      if(sysOrg.stationId != '0'){
        result.stationIdStr = sysOrg.stationId;
      }else{
        getOrgTreeData(sysOrg.children,'stationId',stationIds,4);
        console.log("stationIds:",stationIds);
        result.stationIdStr = stationIds.join(',');
      }
    }
    this.result = result;
    return result;
  }
}





