/*
 * @Description:
 * @Author: Edward
 * @Date: 2022-06-02 17:21:37
 * @LastEditors: zhangTing
 * @LastEditTime: 2023-07-19 15:13:06
 */
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  computed,
  nextTick,
  toRaw,
  Ref,
} from "vue";
import { EI, EIManager } from "EIX/ei";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfSearchBox from "EFX/xrEfSearchBox";
import xrEfDialog from "EFX/xrEfDialog";
import EFUtility from "EFX/EFUtility";
import eBFR from "EFX/eBFR";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import { ER } from "ERX/Er";
import { SiUtils } from "ERX/SiUtils";
import { FiUtils } from "ERX/FiUtils";
import { useRoute } from "vue-router";
import ErPopFree from "ERX/ErPopFree";
import ErPopQuery from "ERX/ErPopQuery";
import { PopQueryReturnInfo, PopFreeReturnInfo } from "ERX/er-type";

import MMSMPOPV from "../MMSMPOPV/MMSMPOPV.vue";

export default defineComponent({
  name: "MMSMSJMUS2N",
  components: {
    xrEfForm,
    xrEfPanel,
    xrEfSearchBox,
    xrEfDialog,
    MMSMPOPV,
    erGrid,
    erLayout,
    ErPopFree,
    ErPopQuery,
  },

  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const route = useRoute();
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;
    let popFreeADD: ER.PopFreeHelper;
    let popFreeADDU: ER.PopFreeHelper;
    let popFreeC: ER.PopFreeHelper;

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition;
      formName = efFormInfo.value.formName; // 当前画面名
      if (formName === "MMSM22S2N") {
        popFreeADD = new ER.PopFreeHelper(
          formPartition,
          "MMSM22POPA",
          "MMSM22POP_LAYOUT"
        );
        popFreeADDU = new ER.PopFreeHelper(
          formPartition,
          "MMSM22POPA",
          "MMSM22POPU_LAYOUT"
        );
        popFreeC = new ER.PopFreeHelper(
          formPartition,
          "MMSM22CPOPA",
          "MMSM22CPOP_LAYOUT"
        );
      }
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams["PROGRAM_NAME"];
      }
      // 初始化低代码工具类
      QueryPara();
    };
    const dialogVisible = ref(false);
    let tab1ActiveKey = ref("tab1");
    let tab2ActiveKey = ref("tab1");

    const initializeService = "";
    let gridView1: any;
    let gridView2: any;
    let gridView3: any;
    let gridView4: any;
    let gridView5: any;
    let gridView2Api: any;
    let gridView3Api: any;
    let gridView4Api: any;
    let gridVie5_api: any;

    // 引入EFDialogForm弹出框的相关方法
    // const { openEfDialog, closeEfDialog } = EFDialogForm();
    // const { listenerMessageEvent } = EFDialogFormMessage();

    // 变量定义

    // if (formParams.formParams?.form_name) {
    //   formName = formParams.formParams['form_name'];
    // }
    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    const initializeFlag = ref(0);

    // 定义低代码弹出画面 - 新增、修改等
    /* let popFreeADD: ErPopFreeHelper;
    let popFreeADDU: ErPopFreeHelper;
    let popFreeC: ErPopFreeHelper; // F12底吹氩 */
    /* if (formName === 'MMSM22S2N') {
      popFreeADD = new ErPopFreeHelper(formPartition, 'MMSM22POPA', 'MMSM22POP_LAYOUT');
      popFreeADDU = new ErPopFreeHelper(formPartition, 'MMSM22POPA', 'MMSM22POPU_LAYOUT');
      popFreeC = new ErPopFreeHelper(formPartition, 'MMSM22CPOPA', 'MMSM22CPOP_LAYOUT');
    } */

    // let programName = ''; // 炼钢配置表程序名
    // if (formParams.formParams?.program_name) {
    //   programName = formParams.formParams['program_name'];
    // }
    let pagePara: any; // 炼钢配置表页面参数
    let i_form_ename = ""; // 低代码配置画面布局名
    const isThirdTabShow = ref<boolean>(false); // 是否显示第三个tab页
    const thirdTabName = ref(""); // 第三个tab页的标题名
    const table_type_x = ref(""); // 第三个tab中的表名
    const isJialiaoTabShow = ref<boolean>(true); // 是否显示加料tab页
    const layout_group_filter = ref("");
    const grid_view_1 = ref("");
    const grid_view_2 = ref("");
    const grid_view_3 = ref("");
    const grid_view_4 = ref("");
    const grid_view_5 = ref("");
    const gridToolbar: Ref<any[]> = ref([]);
    //测温
    let tongdianOutInfo: EI.EIInfo;
    //加料
    let cwtongdianOutInfo: EI.EIInfo;
    //获取配置表中table_name的表名
    let table_name1 = ""; //实绩表名
    let table_name2 = ""; //加料表名
    let table_name3 = ""; //测温表名
    let table_name4 = ""; //通电表名
    let v_station = ""; //设备站号
    let proc_div = ""; // 'I'新增，'U'修改
    let cewenOutInfo: EI.EIInfo;
    let touliaoOutInfo: EI.EIInfo;
    let F7_Status = 0; // F7按钮状态，0: 未进入多步，1: 进入多步
    let F6_Status = 0; // F7按钮状态，0: 未进入多步，1: 进入多步
    let F8_Status = 0; // F7按钮状态，0: 未进入多步，1: 进入多步

    const dialogFormName = ref(""); // 弹出画面的画面名
    const parentInfo = ref({}); // 给弹出画面传入数据
    let str: any = ""; // 画面跳转传递的参数
    // 获取url的参数
    if (route.query.HEAT_NO) {
      console.log("路由参数--- ", route.query.HEAT_NO);
      str = route.query.HEAT_NO;
    } else {
      console.log("无路由参数--- ");
    }

    // 获取tab页组件的ref和实例
    const detailTabsRef = ref<any>(null);
    /*  const detailTabsInstance = computed(() => {
      return detailTabsRef.value?.kendoWidget() as kendo.ui.TabStrip;
    }); */

    // 自定义工具栏按钮功能
    const InitialToolbar = () => {
      erFormHelper.initialGridToolbar(grid_view_2.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false },
      });
      erFormHelper.initialGridToolbar(grid_view_3.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false },
      });
    };

    // 自定义grid工具栏按钮是否可用
    const setToolbarVisible = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, {
        addrow: visible,
        copyrow: visible,
        delete: visible,
      });
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      /* const grid_views = pagePara.grid_view ? pagePara.grid_view.split(',') : [];
      const layouts = pagePara.layout_group_filter ? pagePara.layout_group_filter.split(',') : []; */
      const initialResult = await erFormHelper.Initialize(
        formPartition,
        i_form_ename,
        "",
        initializeService
      );
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        //初始化工具栏
        InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          //设置grid不可编辑
          erFormHelper.setGridEditable(grid_view_1.value, false);
          erFormHelper.setGridEditable(grid_view_2.value, false);
          erFormHelper.setGridEditable(grid_view_3.value, false);
          erFormHelper.setGridEditable(grid_view_4.value, false);
          erFormHelper.setGridEditable(grid_view_5.value, false);

          nextTick(() => {
            // 跳转画面的初始查询
            if (str) {
              erFormHelper.clearLayoutData(layout_group_filter.value);
              erFormHelper.setControlValue(
                layout_group_filter.value,
                "HEAT_NO",
                str
              );
              queryMainGrid(true);
            }

            nextTick(() => {
              // 设置实绩区域初始只读
              erFormHelper.setAllControlReadOnly(
                "layoutControlGroupMain",
                true
              );
              erFormHelper.setAllControlReadOnly(
                "layoutControlGroupRemark",
                true
              );
            });
          });
        });
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
            initialResult.msg +
            "]!"
        );
      }
    };

    //通过炼钢配置表，进行模板画面参数查询
    const QueryPara = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      eiBlock.pushData(
        {
          PROGRAM_NAME: formName,
          // PROGRAM_NAME: programName
        },
        true
      );
      EIManager.callService(formPartition, "mmsmpara_inq", eiInfo)
        .then((res: EI.EIInfo) => {
          if (res.status === 0) {
            // const resData: any = res.blocks['MMSMPARA_INQ'].data.map((item) => {
            //   return {
            //     PARA_NAME: item.PARA_NAME,
            //     PARA_DESC: item.PARA_DESC,
            //     PARA: item.PARA
            //   };
            // });
            const resData: any = {};
            res.blocks["MMSMPARA_INQ"].data.forEach((item: any) => {
              resData[item.PARA_NAME] = item.PARA;
            });
            console.log("resData---", resData);
            pagePara = resData;
            i_form_ename = pagePara.windows;
            table_type_x.value = pagePara.table_type_x
              ? pagePara.table_type_x
              : "";
            layout_group_filter.value = pagePara.layout_group_filter;
            grid_view_1.value = pagePara.grid_view.split(",")[0];
            grid_view_2.value = pagePara.grid_view.split(",")[1];
            grid_view_3.value = pagePara.grid_view.split(",")[2];
            grid_view_4.value = pagePara.grid_view.split(",")[3];
            grid_view_5.value = pagePara.grid_view.split(",")[4];

            //获取表名
            table_name1 = pagePara.table_name.split(",")[0];
            table_name2 = pagePara.table_name.split(",")[1];
            table_name3 = pagePara.table_name.split(",")[2];
            table_name4 = pagePara.table_name.split(",")[3];
            console.log("table_name4---", table_name4);
            if (pagePara.func_id_s_c) {
              console.log("pagePara---", pagePara.func_id_s_c);
              isThirdTabShow.value = true;
              thirdTabName.value = pagePara.func_id_s_c;
              console.log("thirdTabName---", thirdTabName.value);
            } else {
              isThirdTabShow.value = false;
            }
            if (formName === "MMSM31S2N") {
              isJialiaoTabShow.value = false;
            }

            nextTick(() => {
              initializePage();
            });
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    };
    //--
    // grid渲染完成事件
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid(grid_view_1.value);
      erFormHelper.setGridEditable(grid_view_1.value, false); // 设置grid不可编辑
    };
    const erGrid2Ready = (e: any) => {
      gridView2 = erFormHelper.getGrid(grid_view_2.value);
      gridView2Api = e.api;
      erFormHelper.setGridEditable(grid_view_2.value, false); // 设置grid不可编辑
      erFormHelper.initialGridToolbar(
        grid_view_2.value,
        {
          excel: { visible: true },
          addrow: {
            visible: false,
            action: () => {
              // 新增行自动填充熔炼号和生产处理号
              const mainGridCurrentRow =
                erFormHelper.getGridCurrentRow(gridView1);
              const gridData = erFormHelper.getGridAllRows(grid_view_2.value);
              const currentRow = gridData[gridData.length - 1]; // 新增行在最后一行
              // const currentRow = gridData[0];
              const currentRowNode = gridView2Api.getRowNode(currentRow.uid);
              currentRowNode.setDataValue(
                "HEAT_NO",
                mainGridCurrentRow.HEAT_NO
              );
              currentRowNode.setDataValue(
                "L2_PROC_NO",
                mainGridCurrentRow.L2_PROC_NO
              );
            },
          },
        },
        {
          showIco: true,
          showText: true,
        }
      );
      if (touliaoOutInfo) {
        erFormHelper.mergeDataToGrid(touliaoOutInfo, grid_view_2.value, true);
      }
      if (F6_Status) {
        // 如果F7处于多步状态
        // 设置工具栏按钮可见
        setToolbarVisible(grid_view_2.value, true);
      }
      if (cwtongdianOutInfo) {
        erFormHelper.mergeDataToGrid(
          cwtongdianOutInfo,
          grid_view_2.value,
          true
        );
      }
    };
    const erGrid3Ready = (e: any) => {
      gridView3 = erFormHelper.getGrid(grid_view_3.value);
      gridView3Api = e.api;
      erFormHelper.setGridEditable(grid_view_3.value, false); // 设置grid不可编辑
      erFormHelper.initialGridToolbar(
        grid_view_3.value,
        {
          excel: { visible: true },
          addrow: {
            visible: false,
            action: () => {
              // 新增行自动填充熔炼号和生产处理号
              const mainGridCurrentRow =
                erFormHelper.getGridCurrentRow(gridView1);
              const gridData = erFormHelper.getGridAllRows(grid_view_3.value);
              const currentRow = gridData[gridData.length - 1]; // 新增行在最后一行
              // const currentRow = gridData[0];
              const currentRowNode = gridView3Api.getRowNode(currentRow.uid);
              currentRowNode.setDataValue(
                "HEAT_NO",
                mainGridCurrentRow.HEAT_NO
              );
              currentRowNode.setDataValue(
                "L2_PROC_NO",
                mainGridCurrentRow.L2_PROC_NO
              );
            },
          },
        },
        {
          showIco: true,
          showText: true,
        }
      );
      if (cewenOutInfo) {
        erFormHelper.mergeDataToGrid(cewenOutInfo, grid_view_3.value, true);
      }
      if (F7_Status) {
        // 如果F7处于多步状态
        // 设置工具栏按钮可见
        setToolbarVisible(grid_view_3.value, true);
      }
      if (tongdianOutInfo) {
        erFormHelper.mergeDataToGrid(tongdianOutInfo, grid_view_3.value, true);
      }
    };

    const erGrid4Ready = (e: any) => {
      gridView4 = erFormHelper.getGrid(grid_view_4.value);
      gridView4Api = e.api;
      erFormHelper.setGridEditable(grid_view_4.value, false); // 设置grid不可编辑
      // grid初始化工具栏
      erFormHelper.initialGridToolbar(
        grid_view_4.value,
        {
          excel: { visible: true },
          addrow: {
            visible: false,
            action: () => {
              // 新增行自动填充熔炼号和生产处理号
              const mainGridCurrentRow =
                erFormHelper.getGridCurrentRow(gridView1);
              const gridData = erFormHelper.getGridAllRows(grid_view_4.value);
              const currentRow = gridData[gridData.length - 1]; // 新增行在最后一行
              // const currentRow = gridData[0];
              const currentRowNode = gridView4Api.getRowNode(currentRow.uid);
              currentRowNode.setDataValue(
                "HEAT_NO",
                mainGridCurrentRow.HEAT_NO
              );
              currentRowNode.setDataValue(
                "L2_PROC_NO",
                mainGridCurrentRow.L2_PROC_NO
              );
            },
          },
        },
        {
          showIco: true,
          showText: true,
        }
      );
      if (tongdianOutInfo) {
        erFormHelper.mergeDataToGrid(tongdianOutInfo, grid_view_4.value, true);
      }
      if (F8_Status) {
        // 如果F8处于多步状态
        setToolbarVisible(grid_view_4.value, true); // 设置工具栏按钮可见
        erFormHelper.setGridEditable(grid_view_4.value, true); // 设置grid可编辑
      }
    };

    const erGrid5Ready = (e: any) => {
      gridView5 = erFormHelper.getGrid(grid_view_5.value);
      gridVie5_api = e.api;
      erFormHelper.getGridApi(grid_view_5.value);
      erFormHelper.setGridToolbarVisible(grid_view_5.value, {
        addrow: false,
        copyrow: false,
        excel: true,
      });
      console.log("11111e", e);
      e.api.expandAll();
    };
    const handleTabChange = (activeKey: string) => {
      const mainGridCurrentRow = erFormHelper.getGridCurrentRow(
        gridView1,
        true
      );
      if (mainGridCurrentRow.length <= 0) {
        return false;
      }
      console.log(activeKey);
      if (activeKey === "tab1") {
        queryTmmsm2a(mainGridCurrentRow);
      } else if (activeKey === "tab2") {
        queryTmmsm2b(mainGridCurrentRow);
      } else if (activeKey === "tab3") {
        queryTmmsm2d(mainGridCurrentRow);
      } else if (activeKey === "tab4") {
        queryTqmts25(mainGridCurrentRow);
      }
    };

    // 查询主表炉次信息
    const queryMainGrid = async (currentRowInfo: any) => {
      const eiInfo = new EI.EIInfo();
      const queryConditionEiBlock: EI.EiBlock =
        erFormHelper.getAllControlValueAsEiBlock(layout_group_filter.value, {
          // FACTORY_DIV: pagePara.factory_div,
          FACTORY_DIV: " ",
          TABLE_TYPE: table_name1,
        });
      eiInfo.addBlock(queryConditionEiBlock);
      const outInfo = await erFormHelper.callService(
        pagePara.service_f21,
        eiInfo,
        true,
        false,
        true
      );
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("查询错误:" + outInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_view_1.value, true);
      }
    };

    // 查询子表明细信息-加料
    const queryTmmsm2a = async (currentRowInfo: any) => {
      const eiInfo1 = new EI.EIInfo();
      const eiBlock1 = eiInfo1.addBlock(new EI.EiBlock());
      eiBlock1.pushData({ ...currentRowInfo, TABLE_TYPE: "TMMSM2A" }, true);
      cwtongdianOutInfo = await erFormHelper.callService(
        pagePara.service_f22,
        eiInfo1,
        true,
        false,
        true
      );
      if (cwtongdianOutInfo.sys.status < 0) {
        erFormHelper.messageError("查询错误:" + cwtongdianOutInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToLayoutOrGrid(
          cwtongdianOutInfo,
          true,
          grid_view_2.value
        );
      }
    };

    //查询子表明细信息-测温信息
    const queryTmmsm2b = async (currentRowInfo: any) => {
      // 测温信息
      const eiInfo2 = new EI.EIInfo();
      const eiBlock2 = eiInfo2.addBlock(new EI.EiBlock());
      eiBlock2.pushData({ ...currentRowInfo, TABLE_TYPE: "TMMSM2B" }, true);
      tongdianOutInfo = await erFormHelper.callService(
        pagePara.service_f22,
        eiInfo2,
        true,
        false,
        true
      );
      if (tongdianOutInfo.sys.status < 0) {
        erFormHelper.messageError("查询错误:" + tongdianOutInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToLayoutOrGrid(
          tongdianOutInfo,
          true,
          grid_view_3.value
        );
      }
    };

    // 查询子表明细信息-通电信息
    const queryTmmsm2d = async (currentRowInfo: any) => {
      // 第三个tab页子表（eg. 通电信息）
      if (isThirdTabShow.value) {
        const eiInfo3 = new EI.EIInfo();
        const eiBlock3 = eiInfo3.addBlock(new EI.EiBlock());
        eiBlock3.pushData(
          { ...currentRowInfo, TABLE_TYPE: table_type_x.value },
          true
        );
        const outInfo3 = await erFormHelper.callService(
          pagePara.service_f22,
          eiInfo3,
          true,
          false,
          true
        );
        if (outInfo3.sys.status < 0) {
          erFormHelper.messageError("查询错误:" + outInfo3.sys.msg);
        } else {
          erFormHelper.mergeDataToLayoutOrGrid(
            outInfo3,
            true,
            grid_view_4.value
          );
        }
      }
    };

    //查询子表明细信息-成分信息
    const queryTqmts25 = async (currentRowInfo: any) => {
      // 成分信息
      console.log("currentRowInfo", gridView5);

      const eiInfo4 = new EI.EIInfo();
      const eiBlock4 = eiInfo4.addBlock(new EI.EiBlock());
      eiBlock4.pushData({ ...currentRowInfo, TABLE_TYPE: table_name1 }, true);
      const outInfo4 = await erFormHelper.callService(
        "mmsmele_inq",
        eiInfo4,
        true,
        false,
        true
      );
      if (outInfo4.sys.status < 0) {
        erFormHelper.messageError("查询错误:" + outInfo4.sys.msg);
      } else {
        erFormHelper.mergeDataToLayoutOrGrid(outInfo4, true, grid_view_5.value);
      }
      gridVie5_api.expandAll();
    };

    // 查询子表明细信息
    const queryDetailInfo = async (currentRowInfo: any) => {
      queryTmmsm2a(currentRowInfo);
      queryTmmsm2b(currentRowInfo);
      queryTmmsm2d(currentRowInfo);
      queryTqmts25(currentRowInfo);
    };

    // 主表行双击事件-弹出修改框
    const GridView1DoubleClick = async (e: any) => {
      if (e && e.data) {
        openADDUDialog(e.data);
      }
    };

    // 弹框ref
    const xrEfDialogRef = ref<any>(null);
    // 点击按钮打开弹框
    const openXrEfDialog = (PROC_DIV: string) => {
      dialogVisible.value = true;
      proc_div = PROC_DIV;
    };
    // 关闭弹框监听
    const xrEfDialogClose = () => {
      queryMainGrid(true); // 关闭弹框后查询主表
    };
    // 获取弹窗画面传递过来的数据
    const getChildInfo = (info: any) => {
      console.log("获取弹窗画面传递过来的信息", info);
      if (info.close) {
        dialogVisible.value = false; // 关闭弹框
        xrEfDialogClose();
      }
    };

    // 打开修改弹出画面
    const openADDUDialog = (currentRow: any) => {
      const HEAT_NO = currentRow.HEAT_NO;
      const L2_PROC_NO = currentRow.L2_PROC_NO;
      const data = {
        PROC_DIV: "U",
        HEAT_NO: HEAT_NO,
        L2_PROC_NO: L2_PROC_NO,
      };
      // dialogFormName.value =
      //   i_form_ename.slice(0, 4).toUpperCase() +
      //   'ADD' +
      //   i_form_ename.slice(4, 6).toUpperCase() +
      //   'UV';
      dialogFormName.value = pagePara.updPopFormName; // 读配置表获取画面名
      dialogVisible.value = true;
      parentInfo.value = data;
      // 打开新增弹出画面
      // openEfDialog(dialogFormName, data, {
      //   height: 800,
      //   width: 1200
      // });
      openXrEfDialog("U");
    };

    // 主表焦点行事件-查询子表明细信息
    const gridView1FocusChanged = async (e: any) => {
      if (!e.data) {
        erFormHelper.clearGridData(gridView2, gridView3, gridView4); // 清空子表数据
        return;
      }
      if (e && e.rowChanged) {
        if (e.data) {
          v_station = e.data.get("STATION_ID");
          console.log("v_station", v_station);
          queryDetailInfo({
            L2_PROC_NO: e.data.get("L2_PROC_NO"),
            HEAT_NO: e.data.get("HEAT_NO"),
            STATION_ID: e.data.get("STATION_ID"),
            DEV_CODE: e.data.get("DEV_CODE"),
          });
        }
      }
    };

    // grid工具栏按钮点击事件自定义
    const toolbarClick = (event: any, configId: string) => {
      if (event.name === "addrow") {
        const mainGridCurrentRow = erFormHelper.getGridCurrentRow(
          gridView1,
          true
        );
        const gridData = erFormHelper.getGridAllRows(configId);
        const currentRow = gridData[gridData.length - 1];
        currentRow.set("HEAT_NO", mainGridCurrentRow.HEAT_NO);
        currentRow.set("L2_PROC_NO", mainGridCurrentRow.L2_PROC_NO);
      }
    };

    // // 接收弹出画面传入的数据-在mounted中调用
    // const handleEfDialogMessage = () => {
    //   listenerMessageEvent((messageData: any) => {
    //     // 根据弹出画面传入的closeEfDialog关闭弹框
    //     if (messageData.closeEfDialog) {
    //       closeEfDialog();
    //       queryMainGrid();
    //     }
    //   });
    // };

    onMounted(() => {
      //QueryPara();
      // handleEfDialogMessage(); // 接收弹出画面传入的数据;
    });

    // 实绩保存-popFree中的确定按钮触发
    const shijiSave = async (dataModel: any, PROC_DIV: string) => {
      const eiInfo = new EI.EIInfo();
      // 将dataModel格式转换为EIBlock
      const eiBlock = erFormHelper.convertModelAsBlock(dataModel, {
        FACTORY_DIV: pagePara.factory_div,
        //STATION_ID: pagePara.station_id,
        PROC_DIV: PROC_DIV,
      });
      eiInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService(
        pagePara.service_f3,
        eiInfo,
        false,
        false,
        true
      );
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("保存错误:" + outInfo.sys.msg);
      } else {
        erFormHelper.messageSuccess("保存成功");
        queryMainGrid(true);
      }
    };

    // 查询
    const F2_DO = async (e: any) => {
      queryMainGrid(true);
    };
    // 新增
    const F3_DO = async (e: any) => {
      if (popFreeADD) {
        // 使用低代码弹窗组件ErPopFree
        // popFreeADD.AllowEidt = true; // 设置为可编辑
        ER.PopUtils.showErPopFree(
          ErPopFree,
          popFreeADD,
          async (event: PopFreeReturnInfo) => {
            //确定按钮回调
            const recMsg = event as PopFreeReturnInfo; //XrErPopFree弹窗组件返回数据
            shijiSave(recMsg.dataModel, "I");
          }
        );
      } else {
        // 使用框架弹窗组件EFDialogForm
        const data = {
          PROC_DIV: "I",
        };
        // dialogFormName.value =
        //   i_form_ename.slice(0, 4).toUpperCase() +
        //   'ADD' +
        //   i_form_ename.slice(4, 6).toUpperCase() +
        //   'V';
        dialogFormName.value = pagePara.addPopFormName; // 读配置表获取画面名

        parentInfo.value = data;
        // 打开新增弹出画面
        // openEfDialog(dialogFormName, data, {
        //   height: 800,
        //   width: 1200
        // });
        openXrEfDialog("I");
      }
    };
    // 修改
    const F4_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(grid_view_1.value).length === 0) {
        erFormHelper.messageWarning("请选择一条信息进行操作");
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(
          grid_view_1.value,
          true
        )[0]; // 获取主表勾选行
        if (popFreeADDU) {
          // 使用低代码弹窗组件ErPopFree
          popFreeADDU.ReceiveData(mainGridCheckedRow); // 初始绑值，并设置可编辑
          ER.PopUtils.showErPopFree(
            ErPopFree,
            popFreeADDU,
            async (event: PopFreeReturnInfo) => {
              //确定按钮回调
              const recMsg = event as PopFreeReturnInfo; //XrErPopFree弹窗组件返回数据
              shijiSave(recMsg.dataModel, "U");
            }
          );
        } else {
          // 使用框架弹窗组件EFDialogForm
          openADDUDialog(mainGridCheckedRow);
        }
      }

      /*  if (erFormHelper.getGridCheckedRows(grid_view_1.value).length === 0) {
        erFormHelper.messageWarning('请选择一条信息进行操作');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(grid_view_1.value, true)[0];
        console.log('mainGridCheckedRow', mainGridCheckedRow);

        openADDUDialog(mainGridCheckedRow);
      } */
    };
    // 删除
    const F5_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(grid_view_1.value).length === 0) {
        erFormHelper.messageWarning("请选择一条信息再删除");
      } else {
        // 删除提示
        const confirm = await erFormHelper.messageConfirm(
          "是否将选择的信息进行相关操作？"
        );
        if (confirm) {
          const eiInfo = new EI.EIInfo();
          const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock(
            grid_view_1.value,
            {
              // FACTORY_DIV: pagePara.factory_div,
              // STATION_ID: pagePara.station_id,
              PROC_DIV: "D",
            }
          );
          const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
          const outInfo = await erFormHelper.callService(
            pagePara.service_f5,
            eiInfo,
            true,
            false,
            true
          );
          if (outInfo.sys.status < 0) {
            erFormHelper.messageError("删除失败:" + outInfo.sys.msg);
          } else {
            erFormHelper.messageSuccess("删除成功");
            queryMainGrid(true);
          }
        }
      }
    };

    // 物料维护
    const F6_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      //获取新增行的数据
      const created = erFormHelper.getGridRows(gridView2, "add", true);
      const newcreated = created.map((item) => {
        item.STATION_ID = v_station;
        return item;
      });
      const createdBlock = new EI.EiBlock();
      createdBlock.pushData(toRaw(newcreated), true);
      eiInfo.addBlock(createdBlock, "MMSM_2A_INS");
      //获取修改行的数据
      const modified = erFormHelper.getGridRows(gridView2, "modify", true);
      const newmodified = modified.map((item) => {
        item.STATION_ID = v_station;
        return item;
      });
      const modifiedBlock = new EI.EiBlock();
      modifiedBlock.pushData(toRaw(newmodified), true);
      eiInfo.addBlock(modifiedBlock, "MMSM_2A_UPD");
      //获取删除行的数据
      const deleted = erFormHelper.getGridRows(gridView2, "delete", true);
      const newdeleted = deleted.map((item) => {
        item.STATION_ID = v_station;
        return item;
      });
      const deletedBlock = new EI.EiBlock();
      deletedBlock.pushData(toRaw(newdeleted), true);
      eiInfo.addBlock(deletedBlock, "MMSM_2A_DEL");

      const outInfo = await erFormHelper.callService(
        "mmsm2a_pro",
        eiInfo,
        true,
        false,
        true
      );
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("保存错误:" + outInfo.sys.msg);
        return false;
      } else {
        // 隐藏工具栏按钮
        setToolbarVisible(grid_view_2.value, false);
        //设置grid不可编辑
        erFormHelper.setGridEditable(grid_view_2.value, false);
        const mainGridCurrentRow = erFormHelper.getGridCurrentRow(
          gridView1,
          true
        );
        if (mainGridCurrentRow) {
          queryDetailInfo({
            L2_PROC_NO: mainGridCurrentRow.L2_PROC_NO,
            HEAT_NO: mainGridCurrentRow.HEAT_NO,
            DEV_CODE: mainGridCurrentRow.DEV_CODE,
          });
        }
      }
    };
    const F6_PRE_DO = async (e: any) => {
      /*  detailTabsInstance.value.activateTab(kendo.jQuery('#detailTab1'));
      const mainGridCurrentRow = erFormHelper.getGridCurrentRow(gridView1, true);
      // 主表有选中行时才可进入维护状态
      if (mainGridCurrentRow) {
        // 设置工具栏按钮可见
        setToolbarVisible(grid_view_2.value, true);
        //设置grid可编辑
        erFormHelper.setGridEditable(grid_view_2.value, true);
      } else {
        erFormHelper.messageWarning('请选择一条信息再删除');
        return false;
      } */
      const mainGridCurrentRow = erFormHelper.getGridSelectRows(
        gridView1,
        true
      );
      // 主表有选中行时才可进入维护状态
      if (mainGridCurrentRow.length === 0) {
        erFormHelper.messageWarning("请选择一条信息再维护");
        return 0; //这里return 0 后就需要再点击取消，return;不管用
      } else {
        const mainGridCurrentRow = erFormHelper.getGridSelectRows(
          gridView1,
          true
        );
        // 设置工具栏按钮可见
        setToolbarVisible(grid_view_2.value, true);
        //设置grid可编辑
        erFormHelper.setGridEditable(grid_view_2.value, true);
      }
    };
    //F6加料取消
    const F6_CANCEL = async (e: any) => {
      // 重新绑数据
      if (cwtongdianOutInfo) {
        erFormHelper.mergeDataToGrid(
          cwtongdianOutInfo,
          grid_view_2.value,
          true
        );
      } else {
        erFormHelper.clearGridData(grid_view_2.value);
      }
      // 撤销所有修改
      //gridView2.dataSource.cancelChanges();
      // 隐藏工具栏按钮
      setToolbarVisible(grid_view_2.value, false);
      //设置grid不可编辑
      erFormHelper.setGridEditable(grid_view_2.value, false);
      F6_Status = 0;
    };

    // 测温维护
    const F7_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      //获取增删改行的数据
      const created = erFormHelper.getGridRowsAsBlock(gridView3, "add");
      const modified = erFormHelper.getGridRowsAsBlock(gridView3, "modify");
      const deleted = erFormHelper.getGridRowsAsBlock(gridView3, "delete");
      eiInfo.addBlock(created, "MMSM_2B_INS");
      eiInfo.addBlock(modified, "MMSM_2B_UPD");
      eiInfo.addBlock(deleted, "MMSM_2B_DEL");
      const outInfo = await erFormHelper.callService(
        pagePara.service_f7,
        eiInfo,
        true,
        false,
        true
      );
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("保存错误:" + outInfo.sys.msg);
        return false;
      } else {
        // 隐藏工具栏按钮
        setToolbarVisible(grid_view_3.value, false);
        //设置grid不可编辑
        erFormHelper.setGridEditable(grid_view_3.value, false);
        const mainGridCurrentRow = erFormHelper.getGridCurrentRow(
          gridView1,
          true
        );
        if (mainGridCurrentRow) {
          queryDetailInfo({
            L2_PROC_NO: mainGridCurrentRow.L2_PROC_NO,
            HEAT_NO: mainGridCurrentRow.HEAT_NO,
            DEV_CODE: mainGridCurrentRow.DEV_CODE,
          });
        }
      }
    };
    const F7_PRE_DO = async (e: any) => {
      /*  detailTabsInstance.value.activateTab(kendo.jQuery('#detailTab2'));
      const mainGridCurrentRow = erFormHelper.getGridCurrentRow(gridView1, true);
      // 主表有选中行时才可进入维护状态
      if (mainGridCurrentRow) {
        // 设置工具栏按钮可见
        setToolbarVisible(grid_view_3.value, true);
        //设置grid可编辑
        erFormHelper.setGridEditable(grid_view_3.value, true);
      } */
      const mainGridCurrentRow = erFormHelper.getGridSelectRows(
        gridView1,
        true
      );
      // 主表有选中行时才可进入维护状态
      if (mainGridCurrentRow.length === 0) {
        erFormHelper.messageWarning("请选择一条信息再维护");
        return 0; //这里return 0 后就需要再点击取消，return;不管用
      } else {
        const mainGridCurrentRow = erFormHelper.getGridSelectRows(
          gridView1,
          true
        );
        // 设置工具栏按钮可见
        setToolbarVisible(grid_view_3.value, true);
        //设置grid可编辑
        erFormHelper.setGridEditable(grid_view_3.value, true);
      }
    };
    const F7_CANCEL = async (e: any) => {
      // 重新绑数据
      if (tongdianOutInfo) {
        erFormHelper.mergeDataToGrid(tongdianOutInfo, grid_view_3.value, true);
      } else {
        erFormHelper.clearGridData(grid_view_3.value);
      }
      // 撤销所有修改
      //gridView3.dataSource.cancelChanges();
      // 隐藏工具栏按钮
      setToolbarVisible(grid_view_3.value, false);
      //设置grid不可编辑
      erFormHelper.setGridEditable(grid_view_3.value, false);
      F7_Status = 0;
    };

    // 通电维护
    const F8_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      //获取增删改行的数据
      const created = erFormHelper.getGridRowsAsBlock(gridView4, "add");
      const modified = erFormHelper.getGridRowsAsBlock(gridView4, "modify");
      const deleted = erFormHelper.getGridRowsAsBlock(gridView4, "delete");
      eiInfo.addBlock(created, "MMSM_2D_INS");
      eiInfo.addBlock(modified, "MMSM_2D_UPD");
      eiInfo.addBlock(deleted, "MMSM_2D_DEL");
      const outInfo = await erFormHelper.callService(
        pagePara.service_f8,
        eiInfo,
        true,
        false,
        true
      );
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("保存错误:" + outInfo.sys.msg);
        return false;
      } else {
        // 隐藏工具栏按钮
        setToolbarVisible(grid_view_4.value, false);
        F8_Status = 0;
        //设置grid不可编辑
        erFormHelper.setGridEditable(grid_view_4.value, false);
        const mainGridCurrentRow = erFormHelper.getGridCurrentRow(
          gridView1,
          true
        );
        if (mainGridCurrentRow) {
          queryDetailInfo({
            L2_PROC_NO: mainGridCurrentRow.L2_PROC_NO,
            HEAT_NO: mainGridCurrentRow.HEAT_NO,
            DEV_CODE: mainGridCurrentRow.DEV_CODE,
          });
        }
      }
    };
    const F8_PRE_DO = async (e: any) => {
      /* detailTabsInstance.value.activateTab(kendo.jQuery('#detailTab3'));
      const mainGridCurrentRow = erFormHelper.getGridCurrentRow(gridView1, true);
      // 主表有选中行时才可进入维护状态
      if (mainGridCurrentRow) {
        // 设置工具栏按钮可见
        setToolbarVisible(grid_view_4.value, true);
        //设置grid可编辑
        erFormHelper.setGridEditable(grid_view_4.value, true);
      } */
      F8_Status = 1;
      const mainGridCurrentRow = erFormHelper.getGridSelectRows(
        gridView1,
        true
      );
      // 主表有选中行时才可进入维护状态
      if (mainGridCurrentRow.length === 0) {
        erFormHelper.messageWarning("请选择一条信息再维护");
        return 0; //这里return 0 后就需要再点击取消，return;不管用
      } else {
        const mainGridCurrentRow = erFormHelper.getGridSelectRows(
          gridView1,
          true
        );
        // 设置工具栏按钮可见
        setToolbarVisible(grid_view_4.value, true);
        //设置grid可编辑
        erFormHelper.setGridEditable(grid_view_4.value, true);
      }
    };
    const F8_CANCEL = async (e: any) => {
      // 重新绑数据
      if (tongdianOutInfo) {
        erFormHelper.mergeDataToGrid(tongdianOutInfo, grid_view_4.value, true);
      } else {
        erFormHelper.clearGridData(grid_view_4.value);
      }
      // 撤销所有修改
      //gridView4.dataSource.cancelChanges();
      // 隐藏工具栏按钮
      setToolbarVisible(grid_view_4.value, false);
      //设置grid不可编辑
      erFormHelper.setGridEditable(grid_view_4.value, false);
      F8_Status = 0;
    };

    // 底吹氩
    const F12_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(grid_view_1.value).length === 0) {
        erFormHelper.messageWarning("请选择一条信息进行操作");
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(
          grid_view_1.value,
          true
        )[0]; // 获取主表勾选行
        if (popFreeC) {
          // 使用低代码弹窗组件ErPopFree
          popFreeC.ReceiveData({
            HEAT_NO: mainGridCheckedRow.HEAT_NO,
            LADLE_NO: mainGridCheckedRow.LADLE_NO,
            BLOW_AR_RESULT: mainGridCheckedRow.BLOW_AR_RESULT,
          }); // 初始绑值，并设置可编辑
          ER.PopUtils.showErPopFree(
            ErPopFree,
            popFreeC,
            async (event: PopFreeReturnInfo) => {
              //确定按钮回调

              const recMsg = event as PopFreeReturnInfo; //XrErPopFree弹窗组件返回数据
              const eiInfo = new EI.EIInfo();
              const eiBlock = eiInfo.addBlock(new EI.EiBlock());
              const main2CheckedRow = erFormHelper.getGridCheckedRows(
                grid_view_1.value,
                true
              )[0];
              eiBlock.pushData(
                {
                  FACTORY_DIV: main2CheckedRow.FACTORY_DIV,
                  HEAT_NO: main2CheckedRow.HEAT_NO,
                  LADLE_NO: main2CheckedRow.LADLE_NO,
                  BLOW_AR_RESULT: recMsg.dataModel?.get("BLOW_AR_RESULT"),
                },
                true
              );
              const outInfo = await erFormHelper.callService(
                "mmsm22_bar",
                eiInfo,
                true,
                false,
                true
              );
              // 判断调后台是否失败
              if (outInfo.sys.status < 0) {
                erFormHelper.messageError("查询错误:" + outInfo.sys.msg);
              } else {
                erFormHelper.messageSuccess("保存成功");
                queryMainGrid(true);
              }
            }
          );
        }
      }
    };

    return {
      erGrid5Ready,
      erGrid4Ready,
      erGrid3Ready,
      erGrid2Ready,
      erGrid1Ready,
      tab1ActiveKey,
      tab2ActiveKey,
      handleTabChange,
      dialogVisible,
      efFormReady,
      erFormHelper,
      initializeFlag,
      isThirdTabShow,
      isJialiaoTabShow,
      thirdTabName,
      detailTabsRef,
      layout_group_filter,
      grid_view_1,
      grid_view_2,
      grid_view_3,
      grid_view_4,
      grid_view_5,
      gridToolbar,
      xrEfDialogRef,
      dialogFormName,
      parentInfo,
      getChildInfo,
      toolbarClick,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      F6_DO,
      F6_PRE_DO,
      F6_CANCEL,
      F7_DO,
      F7_PRE_DO,
      F7_CANCEL,
      F8_DO,
      F8_PRE_DO,
      F8_CANCEL,
      F12_DO,
      xrEfDialogClose,
      gridView1FocusChanged,
      openXrEfDialog,
      GridView1DoubleClick,
    };
  },
});
