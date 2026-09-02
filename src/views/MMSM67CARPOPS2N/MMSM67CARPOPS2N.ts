import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  toRaw,
  nextTick,
  Ref,
} from "vue";
import { EI, EIManager } from "EIX/ei";
import { ER } from "ERX/Er";
import { SiUtils } from "ERX/SiUtils";
import { FiUtils } from "ERX/FiUtils";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import { useRoute } from "vue-router";
import { DateStringCellEditor } from "@ag-grid-community/core";

export default defineComponent({
  name: "MMSM67CARPOPS2N",
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
  },
  props: {
    openInDialog: {
      type: Boolean,
      default: false,
    },
    dialogFormName: {
      type: String,
      default: "",
    },
    parentInfo: {
      type: Object,
    },
  },
  // 向父画面传递数据-注册emit监听事件
  emits: ["getChildInfo"],
  setup: (props, { emit }) => {
    // 获取画面的分区信息及设置画面初始化service
    let formPartition: string;
    const initializeService = "";
    // 获取tab页组件的ref和实例
    const detailTabsRef = ref<any>(null);
    let now = new Date();
    // let year = now.getDate();
    // console.log("sw");
    // console.log(year);
    // 变量定义
    const formName = "MMSM67CARPOPS2N";

    const erFormHelper: ER.FormHelper =  new ER.FormHelper();
    const efFormInfo = ref<{ [key: string]: any }>({});

    const initializeFlag = ref(0);
    const gridToolbar: Ref<any[]> = ref([]);
    let gridView1!: any;
    let gridView1Api: any;
    let currentDate = "";
    const editable = ref(false);

    const parentInfo = ref(props.parentInfo); // 获取父画面传入参数
    //物料代码
    const PLAN_NO = parentInfo.value?.PLAN_NO;
    // const MAT_CODE = "";
    // 画面相关数据初始化
    const Initialize = async () => {
      const initialResult = await erFormHelper.Initialize(
        formPartition,
        formName,
        "",
        initializeService
      );
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        // 回调函数获取控件信息及设置定义事件等操作
        setTimeout(() => {
          // 获取画面上的主要控件信息
          // handleEfDialogMessage();
          queryMainGrid();
        }, 5);
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
            initialResult.msg +
            "]!"
        );
      }
    };
    // 获取画面相关配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      formPartition = efFormInfo.value.formPartition; // 分区
      gridView1 = erFormHelper.getGrid("GridView1");
      Initialize();
    };
    const efFormInitialized = (formInfo: any) => {
      nextTick(() => {
        Initialize();
      });
    };
    const erGrid2Ready = (e: any) => {
      gridView1Api = e.api;
      // erFormHelper.initialGridToolbar(
      //   "gridView1",
      //   {
      //     excel: { visible: true },
      //     addrow: {
      //       visible: false,
      //       action: () => {
      //         // 新增行自动填充熔炼号和生产处理号
      //         const mainGridCurrentRow =
      //           erFormHelper.getGridCurrentRow(gridView1);
      //         const gridData = erFormHelper.getGridAllRows("gridView1");
      //         const currentRow = gridData[gridData.length - 1]; // 新增行在最后一行
      //         const currentRowNode = gridView1Api.getRowNode(currentRow.uid);
      //         currentRowNode.setDataValue("MAT_CODE", MAT_CODE);
      //         currentRowNode.setDataValue("QUALITY_BATCH_NO", QUALITY_BATCH_NO);
      //       },
      //     },
      //   },
      //   {
      //     showIco: true,
      //     showText: true,
      //   }
      // );
    };

    // const handleEfDialogMessage = () => {
    //   erFormHelper.setControlValue("layoutControlGroup1", "MAT_CODE", MAT_CODE);
    //   erFormHelper.setControlValue(
    //     "layoutControlGroup1",
    //     "QUALITY_BATCH_NO",
    //     QUALITY_BATCH_NO
    //   );
    //   erFormHelper.setControlValue("layoutControlGroup1", "WEIGH_NO", WEIGH_NO);
    // };

    const queryMainGrid = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(
        "layoutControlGroup",
        {
          PLAN_NO: PLAN_NO,
        }
      );
      eiInfo.addBlock(eiBlock, "");

      if (
        eiBlock.data[0]["PLAN_NO"]?.toString() === "" 
       
      )
        return;
      const outInfo = await erFormHelper.callService(
        "mmsm67carpop_inq",
        eiInfo,
        true,
        false,
        true
      );
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("查询错误:" + outInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToGrid(outInfo, "GridView1");
      }
    };
    onMounted(() => {
      Initialize();
    });

    const F3_DO = async (e: any) => {
      // closeEfDialog();
      // return;
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridSelectRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条信息再操作');
        return false;
      }
      inInfo.addBlock(
        erFormHelper.getGridSelectRowsAsBlock('GridView1', { PLAN_NO: PLAN_NO }),
        'MMSM67_CAR'
      );
      const outInfo = await erFormHelper.callService('mmsm67loadcar_pro', inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        
        closeEfDialog();
      }
      else
      {
        erFormHelper.messageError(outInfo.sys.msg);
      
      }
     

    };
    // const F2_PRE_DO = async (e: any) => {
    //   editable.value = true;
    //   erFormHelper.setGridToolbarVisible("gridView1", {
    //     addrow: true,
    //     copyrow: true,
    //     delete: true,
    //   });
    //   //设置grid可编辑
    //   erFormHelper.setGridEditable("gridView1", true);
    // };
    // const F2_CANCEL = async (e: any) => {
    //   editable.value = false;
    //   erFormHelper.setGridToolbarVisible("gridView1", {
    //     addrow: false,
    //     copyrow: false,
    //     delete: false,
    //   });
    //   //设置grid不可编辑
    //   erFormHelper.setGridEditable("gridView1", false);
    //   // 判断调后台是否失败
    //   erFormHelper.messageSuccess("保存成功");
    //   closeEfDialog();
    // };
    const F2_DO = async (e: any) => {
      queryMainGrid();
    };

    // 点击关闭按钮，绑定事件closeEfDialog
    // 向父画面传递数据-触发emit方法向父传递数据，并在emits中注册事件名
    const closeEfDialog = () => {
      console.log('edtyuhb')
      const data1 = {
        // name: formName,
        PLAN_NO: PLAN_NO,
        close: true,
      };
      emit("getChildInfo", data1);
    };
    const getGurrentTime = () => {
      var day = new Date();
      
      let time = '';
    
      return time;
    };
    return {
      erFormHelper,
      initializeFlag,
      gridToolbar,
      editable,
      F3_DO,
      F2_DO,
      efFormInitialized,
      closeEfDialog,
      efFormReady,
      erGrid2Ready,
    };
  },
});
