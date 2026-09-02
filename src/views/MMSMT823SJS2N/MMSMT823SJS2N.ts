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
import ErPopFree from "ERX/ErPopFree";
import ErPopQuery from "ERX/ErPopQuery";
import { PopQueryReturnInfo, PopFreeReturnInfo } from "ERX/er-type";

export default defineComponent({
  name: "MMSMT823SJS2N",
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    ErPopFree,
    ErPopQuery,
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: "";
    let PROGRAM_NAME: string;
    let i_form_ename = ""; // 低代码配置画面布局名
    let popFreeEdit: ER.PopFreeHelper;
    let gridView1: any;
    let gridView2: any;
    let gridView3: any;
    const grid_View_1 = ref("GridView1");
    const grid_View_2 = ref("GridView2");
    const grid_View_3 = ref("GridView3");

    const initializeService = "";

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      console.log("efFormInfo", formName);
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams["PROGRAM_NAME"];
      }
      initializePage();
    };
    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    // 变量定义
    const initializeFlag = ref(0);
    let dt_key = new EI.EiBlock();
    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(
        formPartition,
        formName,
        i_form_ename,
        initializeService
      );
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {});
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
            initialResult.msg +
            "]!"
        );
      }
    };

    onMounted(() => {});
    //grid实例
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid(grid_View_1.value);
      erFormHelper.setGridToolbarVisible(grid_View_1.value, {
        addrow: false,
        copyrow: false,
        excel: true,
      });
    };
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid(grid_View_2.value);
      erFormHelper.setGridToolbarVisible(grid_View_2.value, {
        addrow: false,
        copyrow: false,
        excel: true,
      });
    };
    const erGrid3Ready = () => {
      gridView2 = erFormHelper.getGrid(grid_View_3.value);
      erFormHelper.setGridToolbarVisible(grid_View_3.value, {
        addrow: false,
        copyrow: false,
        excel: true,
      });
    };
    const popFreeEdit_pars = async () => {
      popFreeEdit = new ER.PopFreeHelper(
        formPartition,
        "MMSMCF_DIALOG",
        "MMSMCF_LAYOUT_DIALOG"
      );
    };

    const F2_DO = async () => {
      query_tmmsm31();
    };
    //数据区
    const query_tmmsm31 = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock =
        erFormHelper.getAllControlValueAsEiBlock("LayoutGroupFilter");
      inInfo.addBlock(eiBlock);
      const CFBlock = inInfo.addBlock(new EI.EiBlock(), "H");
      CFBlock.addColumns("DIV");
      CFBlock.addRow({
        DIV: "H",
      });
      const outInfo = await erFormHelper.callService("mmsm31zh_inq", inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_View_1.value);
      }
    };
    const queryDetailInfo1 = async (currentRowInfo: any) => {
      queryTmmsm2a(currentRowInfo);
      queryTmmsm2a1(currentRowInfo);
    };
    // 主表焦点行事件-查询子表明细信息
    const gridView1FocusChanged = async (e: any) => {
      if (!e.data) {
        erFormHelper.clearGridData(gridView2, gridView3); // 清空子表数据
        return;
      }
      if (e && e.rowChanged) {
        if (e.data) {
          queryDetailInfo1({
            HEAT_NO: e.data.get("HEAT_NO"),
          });
        }
      }
    };
    // 查询子表明细信息-智慧质量加料
    const queryTmmsm2a = async (currentRowInfo: any) => {
      const eiInfo1 = new EI.EIInfo();
      const eiBlock1 = eiInfo1.addBlock(new EI.EiBlock());
      eiBlock1.pushData({ ...currentRowInfo, TABLE_TYPE: "TMMSM2A" }, true);
      const CFBlock = eiInfo1.addBlock(new EI.EiBlock(), "H");
      CFBlock.addColumns("DIV");
      CFBlock.addRow({
        DIV: "H",
      });
      const outInfo = await erFormHelper.callService("mmsmt823sj_inq", eiInfo1);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_View_3.value);
      }
    };
    //数据区
    const queryTmmsm2a1 = async (currentRowInfo: any) => {
      const eiInfo1 = new EI.EIInfo();
      const eiBlock1 = eiInfo1.addBlock(new EI.EiBlock());
      eiBlock1.pushData({ ...currentRowInfo, TABLE_TYPE: "TMMSM2A" }, true);
      const CFBlock = eiInfo1.addBlock(new EI.EiBlock(), "T");
      CFBlock.addColumns("DIV");
      CFBlock.addRow({
        DIV: "T",
      });
      const outInfo = await erFormHelper.callService("mmsmt823sj_inq", eiInfo1);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_View_2.value);
      }
    };

    return {
      erFormHelper,
      initializeFlag,
      grid_View_1,
      grid_View_2,
      grid_View_3,
      efFormReady,
      F2_DO,
      erGrid1Ready,
      erGrid2Ready,
      erGrid3Ready,
      gridView1FocusChanged,
    };
  },
});
