import request from 'ecip-web/utils/request'

/**
 * ********************************** 广东规则 ***********************************
 * 通讯重构后，fileAccessSys图片存取规则：
 * 主键+“_”+关键名
 *
 * 车道：
 * 车牌识别流水号 + "_frontPic"
 *
 * 门架：
 * 车牌识别流水号 + "_gantryImage"
 * 车牌识别流水号 + "_gantryBinImage"
 * 车牌识别流水号 + "_gantryLicenseImage"
 *
 * 出口超重：
 * passId + "_overloadExFrontPic"
 * passId + "_overloadExLateralPic"
 * passId + "_overloadExTailPic"
 * passId + "_overloadExVehPic"
 * passId + "_overloadExVideo"
 *
 * 入口超重：
 * enTollLaneId + checkTime(yyyyMMddHHmmss) + "_overloadEnFrontPic"
 * enTollLaneId + checkTime(yyyyMMddHHmmss) + "_overloadEnLateralPic"
 * enTollLaneId + checkTime(yyyyMMddHHmmss) + "_overloadEnTailPic"
 * enTollLaneId + checkTime(yyyyMMddHHmmss) + "_overloadEnVehPic"
 * enTollLaneId + checkTime(yyyyMMddHHmmss) + "_overloadEnVideo"
 *
 * *******************************************************************************************
 *
 * @param roadId 路段国标
 * @param stationId 收费站国标
 * @param businessKey 业务id
 */
export const getImgBase64 = (roadId, stationId, businessKey) => {
    return request({
        url: 'api/v1/common/image/getImgBase64',
        method: 'get',
        params: {
            roadId: roadId,
            stationId: stationId,
            businessKey: businessKey,
        }
    })
}

/**
 * 山西图片查询接口
 *
 * @param roadId 路段国标
 * @param stationId 收费站国标
 * @param picId 车牌识别流水号
 */
export const getSxImgBase64 = (params, data) => {
    return request({
        url: '/api/v1/sx/common/image/laneImgBase64',
        method: 'post',
        params: params,
        data: data
    })
}

