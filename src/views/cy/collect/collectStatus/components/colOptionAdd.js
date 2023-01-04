import collectConstant from "@/views/cy/collect/collectStatus/collectConstant";

/**
 * 唐津门架
 */
const tjGantryCols = [
    {
      field: "gantryName",
      title: "收费单元名称",
      align: 'center',
      fixed: 'left',
      minWidth: 180,
      showOver: true
    },
    {
      field: "gantryId",
      title: "收费单元编码",
      fixed: 'left',
      align: 'center',
      minWidth: 180,
      showOver: true
    },
    {
        field: "direction",
        title: "方向",
        fixed: 'left',
        align: 'center',
        minWidth: 100
      },
    {
      field: "mediaTypeName",
      title: "类型",
      fixed: 'left',
      align: 'center',
      minWidth: 100
    },
    {
      title: "客车",
      align: 'center',
      headerAlign: 'center',
      children: [
        {
            title: "一类",
            align: 'center',
            headerAlign: 'center',
            children:[ 
                {
                    field: "vehType1TollFlow", 
                    title: "车流",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type: 'integer', min: 0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType1TollRoadIncome", 
                    title: "路段收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType1TollRate", 
                    title: "车费率",
                    headerAlign: 'center',
                    editRender: {name: '$input',  props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                }
            ] 
        },
        {
            title: "二类",
            align: 'center',
            headerAlign: 'center',
            children:[
                {
                    field: "vehType2TollFlow", 
                    title: "车流",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type: 'integer', min: 0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType2TollRoadIncome", 
                    title: "路段收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType2TollRate", 
                    title: "车费率",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                }
            ] 
        },
        {
            title: "三类",
            align: 'center',
            headerAlign: 'center',
            children:[
                {
                    field: "vehType3TollFlow", 
                    title: "车流",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type: 'integer', min: 0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType3TollRoadIncome", 
                    title: "路段收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType3TollRate", 
                    title: "车费率",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                }
            ] 
        },
        {
            title: "四类",
            align: 'center',
            headerAlign: 'center',
            children:[
                {
                    field: "vehType4TollFlow", 
                    title: "车流",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type: 'integer', min: 0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType4TollRoadIncome", 
                    title: "路段收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType4TollRate", 
                    title: "车费率",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                }
            ] 
        }
      ]
    },
    {
        title: "客车小计",
        align: 'center',
        headerAlign: 'center',
        children: [
            {
                field: "vehType5TollFlow", 
                title: "车流",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type: 'integer', min: 0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehType5TollRoadIncome", 
                title: "路段收入",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehType5TollRate", 
                title: "车费率",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                align: 'right',
                minWidth: 100
            }
        ]  
    },
    {
        title: "货车",
        align: 'center',
        headerAlign: 'center',
        children: [
          {
              title: "一类",
              align: 'center',
              headerAlign: 'center',
              children:[
                  {
                      field: "vehType11TollFlow", 
                      title: "车流",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type: 'integer', min: 0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehType11TollRoadIncome", 
                      title: "路段收入",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehType11TollRate", 
                      title: "车费率",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  }
              ] 
          },
          {
              title: "二类",
              align: 'center',
              headerAlign: 'center',
              children:[
                  {
                      field: "vehType12TollFlow", 
                      title: "车流",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type: 'integer', min: 0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehType12TollRoadIncome", 
                      title: "路段收入",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehType12TollRate", 
                      title: "车费率",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  }
              ] 
          },
          {
              title: "三类",
              align: 'center',
              headerAlign: 'center',
              children:[
                  {
                      field: "vehType13TollFlow", 
                      title: "车流",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type: 'integer', min: 0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehType13TollRoadIncome", 
                      title: "路段收入",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehType13TollRate", 
                      title: "车费率",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  }
              ] 
          },
          {
              title: "四类",
              align: 'center',
              headerAlign: 'center',
              children:[
                  {
                      field: "vehType14TollFlow", 
                      title: "车流",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type: 'integer', min: 0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehType14TollRoadIncome", 
                      title: "路段收入",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehType14TollRate", 
                      title: "车费率",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  }
              ] 
          },
          {
              title: "五类",
              align: 'center',
              headerAlign: 'center',
              children:[
                  {
                      field: "vehType15TollFlow", 
                      title: "车流",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type: 'integer', min: 0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehType15TollRoadIncome", 
                      title: "路段收入",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehType15TollRate", 
                      title: "车费率",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  }
              ] 
          },
          {
              title: "六类",
              align: 'center',
              headerAlign: 'center',
              children:[
                  {
                      field: "vehType16TollFlow", 
                      title: "车流",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type: 'integer', min: 0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehType16TollRoadIncome", 
                      title: "路段收入",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehType16TollRate", 
                      title: "车费率",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  }
              ] 
          },
          {
              title: "集装箱",
              align: 'center',
              headerAlign: 'center',
              children:[
                  {
                      field: "vehClass24Flow", 
                      title: "车流",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type: 'integer', min: 0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehClass24RoadIncome", 
                      title: "路段收入",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehClass24Rate", 
                      title: "车费率",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  }
              ] 
          },
          {
              title: "大件运输",
              align: 'center',
              headerAlign: 'center',
              children:[
                  {
                      field: "vehClass25Flow", 
                      title: "车流",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type: 'integer', min: 0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehClass25RoadIncome", 
                      title: "路段收入",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  },
                  {
                      field: "vehClass25Rate", 
                      title: "车费率",
                      headerAlign: 'center',
                      editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                      align: 'right',
                      minWidth: 100
                  }
              ] 
          }
        ]
      },
      {
          title: "货车小计",
          align: 'center',
          headerAlign: 'center',
          children: [
              {
                  field: "vehType17TollFlow", 
                  title: "车流",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehType17TollRoadIncome", 
                  title: "路段收入",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehType17TollRate", 
                  title: "车费率",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              }
          ]  
      },
      {
          title: "免费车",
          align: 'center',
          headerAlign: 'center',
          children: [
              {
                  field: "vehClass212Flow", 
                  title: "绿通",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehClass22Flow", 
                  title: "收割机",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehClass8Flow", 
                  title: "军警",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehClass23Flow", 
                  title: "抢险救灾",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "holidayFreeFlow", 
                  title: "节假日",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehClass10Flow", 
                  title: "其它",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehClassFlow", 
                  title: "小计",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0}},
                  align: 'right',
                  minWidth: 100
              }
          ]  
      },
      {
          title: "总计",
          align: 'center',
          headerAlign: 'center',
          children: [
              {
                  field: "vehTypeTollFlowSum", 
                  title: "车流",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehTypeTollRoadIncomeSum", 
                  title: "路段收入",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehTypeTollRateSum", 
                  title: "车费率",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              }
          ]  
      }
  ];

/**
 * 唐津收费站
 */
const tjStationCols = [
  {
    field: "stationName",
    title: "收费站名称",
    align: 'center',
    fixed: 'left',
    minWidth: 180,
    showOver: true
  },
  {
    field: "stationId",
    title: "收费站编码",
    fixed: 'left',
    align: 'center',
    minWidth: 150,
    showOver: true
  },
  {
      field: "direction",
      title: "方向",
      fixed: 'left',
      align: 'center',
      minWidth: 100
    },
  {
    field: "mediaTypeName",
    title: "类型",
    fixed: 'left',
    align: 'center',
    minWidth: 100
  },
  {
    title: "客车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
          title: "一类",
          align: 'center',
          headerAlign: 'center',
          children:[
              {
                  field: "vehType1TollFlow", 
                  title: "车流",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0,fraction:0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                field: "vehType1TollAllIncome", 
                title: "拆前收入",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                align: 'right',
                minWidth: 100
            },
              {
                  field: "vehType1TollRoadIncome", 
                  title: "路段收入",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehType1TollRate", 
                  title: "车费率",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              }
          ] 
      },
      {
          title: "二类",
          align: 'center',
          headerAlign: 'center',
          children:[
              {
                  field: "vehType2TollFlow", 
                  title: "车流",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehType2TollAllIncome", 
                  title: "拆前收入",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehType2TollRoadIncome", 
                  title: "路段收入",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehType2TollRate", 
                  title: "车费率",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              }
          ] 
      },
      {
          title: "三类",
          align: 'center',
          headerAlign: 'center',
          children:[
              {
                  field: "vehType3TollFlow", 
                  title: "车流",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehType3TollAllIncome", 
                  title: "拆前收入",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehType3TollRoadIncome", 
                  title: "路段收入",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehType3TollRate", 
                  title: "车费率",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              }
          ] 
      },
      {
          title: "四类",
          align: 'center',
          headerAlign: 'center',
          children:[
              {
                  field: "vehType4TollFlow", 
                  title: "车流",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type: 'integer', min: 0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehType4TollAllIncome", 
                  title: "拆前收入",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehType4TollRoadIncome", 
                  title: "路段收入",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              },
              {
                  field: "vehType4TollRate", 
                  title: "车费率",
                  headerAlign: 'center',
                  editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                  align: 'right',
                  minWidth: 100
              }
          ] 
      }
    ]
  },
  {
      title: "客车小计",
      align: 'center',
      headerAlign: 'center',
      children: [
          {
              field: "vehType5TollFlow", 
              title: "车流",
              headerAlign: 'center',
              editRender: {name: '$input', props: {type: 'integer', min: 0}},
              align: 'right',
              minWidth: 100
          },
          {
              field: "vehType5TollAllIncome", 
              title: "拆前收入",
              headerAlign: 'center',
              editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
              align: 'right',
              minWidth: 100
          },
          {
              field: "vehType5TollRoadIncome", 
              title: "路段收入",
              headerAlign: 'center',
              editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
              align: 'right',
              minWidth: 100
          },
          {
              field: "vehType5TollRate", 
              title: "车费率",
              headerAlign: 'center',
              editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
              align: 'right',
              minWidth: 100
          }
      ]  
  },
  {
      title: "货车",
      align: 'center',
      headerAlign: 'center',
      children: [
        {
            title: "一类",
            align: 'center',
            headerAlign: 'center',
            children:[
                {
                    field: "vehType11TollFlow", 
                    title: "车流",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type: 'integer', min: 0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType11TollAllIncome", 
                    title: "拆前收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType11TollRoadIncome", 
                    title: "路段收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType11TollRate", 
                    title: "车费率",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                }
            ] 
        },
        {
            title: "二类",
            align: 'center',
            headerAlign: 'center',
            children:[
                {
                    field: "vehType12TollFlow", 
                    title: "车流",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type: 'integer', min: 0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType12TollAllIncome", 
                    title: "拆前收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType12TollRoadIncome", 
                    title: "路段收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType12TollRate", 
                    title: "车费率",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                }
            ] 
        },
        {
            title: "三类",
            align: 'center',
            headerAlign: 'center',
            children:[
                {
                    field: "vehType13TollFlow", 
                    title: "车流",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type: 'integer', min: 0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType13TollAllIncome", 
                    title: "拆前收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType13TollRoadIncome", 
                    title: "路段收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType13TollRate", 
                    title: "车费率",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                }
            ] 
        },
        {
            title: "四类",
            align: 'center',
            headerAlign: 'center',
            children:[
                {
                    field: "vehType14TollFlow", 
                    title: "车流",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type: 'integer', min: 0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType14TollAllIncome", 
                    title: "拆前收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType14TollRoadIncome", 
                    title: "路段收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType14TollRate", 
                    title: "车费率",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                }
            ] 
        },
        {
            title: "五类",
            align: 'center',
            headerAlign: 'center',
            children:[
                {
                    field: "vehType15TollFlow", 
                    title: "车流",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type: 'integer', min: 0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType15TollAllIncome", 
                    title: "拆前收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType15TollRoadIncome", 
                    title: "路段收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType15TollRate", 
                    title: "车费率",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                }
            ] 
        },
        {
            title: "六类",
            align: 'center',
            headerAlign: 'center',
            children:[
                {
                    field: "vehType16TollFlow", 
                    title: "车流",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type: 'integer', min: 0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType16TollAllIncome", 
                    title: "拆前收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType16TollRoadIncome", 
                    title: "路段收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehType16TollRate", 
                    title: "车费率",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                }
            ] 
        },
        {
            title: "集装箱",
            align: 'center',
            headerAlign: 'center',
            children:[
                {
                    field: "vehClass24Flow", 
                    title: "车流",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type: 'integer', min: 0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehClass24AllIncome", 
                    title: "拆前收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehClass24RoadIncome", 
                    title: "路段收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehClass24Rate", 
                    title: "车费率",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                }
            ] 
        },
        {
            title: "大件运输",
            align: 'center',
            headerAlign: 'center',
            children:[
                {
                    field: "vehClass25Flow", 
                    title: "车流",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type: 'integer', min: 0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehClass25AllIncome", 
                    title: "拆前收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehClass25RoadIncome", 
                    title: "路段收入",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                },
                {
                    field: "vehClass25Rate", 
                    title: "车费率",
                    headerAlign: 'center',
                    editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                    align: 'right',
                    minWidth: 100
                }
            ] 
        }
      ]
    },
    {
        title: "货车小计",
        align: 'center',
        headerAlign: 'center',
        children: [
            {
                field: "vehType17TollFlow", 
                title: "车流",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type: 'integer', min: 0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehType17TollAllIncome", 
                title: "拆前收入",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehType17TollRoadIncome", 
                title: "路段收入",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehType17TollRate", 
                title: "车费率",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                align: 'right',
                minWidth: 100
            }
        ]  
    },
    {
        title: "免费车",
        align: 'center',
        headerAlign: 'center',
        children: [
            {
                field: "vehClass212Flow", 
                title: "绿通",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type: 'integer', min: 0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehClass22Flow", 
                title: "收割机",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type: 'integer', min: 0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehClass8Flow", 
                title: "军警",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type: 'integer', min: 0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehClass23Flow", 
                title: "抢险救灾",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type: 'integer', min: 0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "holidayFreeFlow", 
                title: "节假日",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type: 'integer', min: 0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehClass10Flow", 
                title: "其它",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type: 'integer', min: 0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehClassFlow", 
                title: "小计",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type: 'integer', min: 0}},
                align: 'right',
                minWidth: 100
            }
        ]  
    },
    {
        title: "总计",
        align: 'center',
        headerAlign: 'center',
        children: [
            {
                field: "vehTypeTollFlowSum", 
                title: "车流",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type: 'integer', min: 0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehTypeTollAllIncomeSum", 
                title: "拆前收入",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehTypeTollRoadIncomeSum", 
                title: "路段收入",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                align: 'right',
                minWidth: 100
            },
            {
                field: "vehTypeTollRateSum", 
                title: "车费率",
                headerAlign: 'center',
                editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
                align: 'right',
                minWidth: 100
            }
        ]  
    }
];

/**
 * 调整收入
 */
const adjustmentFeeCols = [{
    title: "调整收入",
    align: 'center',
    headerAlign: 'center',
    children: [
        {
            field: "collectYear",
            title: "年份",
            editRender: { name: '$input', props: { required: true, message: '年份不能为空!' } },
            align: 'center',
            minWidth: 150
        },
        {
            field: "fee1",
            title: "一月",
            editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        },
        {
            field: "fee2",
            title: "二月",
            editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        },
        {
            field: "fee3",
            title: "三月",
            editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        },
        {
            field: "fee4",
            title: "四月",
            editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        },
        {
            field: "fee5",
            title: "五月",
            editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        },
        {
            field: "fee6",
            title: "六月",
            editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        },
        {
            field: "fee7",
            title: "七月",
            editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        },
        {
            field: "fee8",
            title: "八月",
            editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        },
        {
            field: "fee9",
            title: "九月",
            editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        },
        {
            field: "fee10",
            title: "十月",
            editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        },
        {
            field: "fee11",
            title: "十一月",
            editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        },
        {
            field: "fee12",
            title: "十二月",
            editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        },
        {
            field: "feeCnt",
            title: "合计",
            align: 'center',
            //formatter: "integer",
            minWidth: 150
        }
    ]
}];

/**
 * 节假日管理
 */
const colHolidayCols = [{
  title: "节假日管理",
  align: 'center',
  headerAlign: 'center',
  children: [
    {
      field: "collectYear",
      title: "年份",
      editRender: { name: '$input', props: { required: true, message: '年份不能为空!' } },
      align: 'center',
      minWidth: 150
    },
    {
      field: "holidayDate",
      title: "节假日日期",
      editRender: { name: '$input', props: { message: '节假日日期不能为空!' } },
      align: 'center',
      minWidth: 150
    },
    {
      field: "holidayName",
      title: "节假日名称",
      editRender: { name: '$input', props: {message: '节假日名称不能为空!' } },
      align: 'center',
      minWidth: 150
    },
    ]
}];



var getColumns = (tableId) => {
    let columns = [];
    switch (tableId) {
      case collectConstant.tableId.tjGantrySum:
        columns = tjGantryCols;
        break;
      case collectConstant.tableId.tjStationSum:
        columns = tjStationCols;
        break;
      case collectConstant.tableId.adjustmentFee:
        columns = adjustmentFeeCols;
        break;
      case collectConstant.tableId.colHoliday:
        columns = colHolidayCols;
        break;
      default:
        ;
    }
    return columns;
  }
  
  export default {
    getColumns
  }
