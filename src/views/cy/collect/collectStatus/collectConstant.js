const status = {
  notFillIn: 0,
  edit: 1,
  save: 2,
  submit: 3,
  check: 4,
  sendBack: 5,
  submitAudit: 6,
  submitSendBack: 7
}

const CollectStatus = {
  notFillIn: 0,
  edit: 1,
  save: 2,
  submit: 3,
  check: 4,
  sendBack: 5,
  submitAudit: 6,
  submitSendBack: 7
}

const CollectStatusStr = {
  notFillIn: '0',
  edit: '1',
  save: '2',
  submit: '3',
  check: '4',
  sendBack: '5',
  submitAudit: '6',
  submitSendBack: '7'
}

const type = {
  day: 'day',
  month: 'month',
  year: 'year'
}

const opType = {
  view: 'view',
  edit: 'edit'
}

const tableId = {
  gantryFlow: "10",
  gantryFee: "20",
  stationFlow: "30",
  stationFee: "40",
  weatherEmergencies: "50",
  gantryFlowPrediction: "60",
  gantryFeePrediction: "70",
  actualSplitIncome: "80",
  dispatchingStationSum: "90",
  stationFlowIncome: "100",
  itemizedCharges: "110",
  cyGantryFlow: "120",
  actGetFee: "130",
  actColFee: "140",
  interestAmountSum: "150",
  cyStationFlowSum: "160",
  fractureSurfaceSum:"170",
  tjGantrySum: "210",
  tjStationSum: "220",
  adjustmentFee: "230",
  colHoliday: "240"
}

export default {CollectStatus,CollectStatusStr,status, type, opType, tableId}
