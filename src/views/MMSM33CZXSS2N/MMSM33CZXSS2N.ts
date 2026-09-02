import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import MMSM33CZXSPOP from '../MMSM33CZXSPOP/MMSM33CZXSPOP.vue';
import xrEfDialog from 'EFX/xrEfDialog';

export default defineComponent({
  name: 'MMSM33CZXSS2N',
  components: { MMSM33CZXSPOP, xrEfForm, xrEfPanel, erLayout, xrEfDialog, erGrid },

  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let i_form_ename = ''; // 低代码配置画面布局名
    let formPartition: string;
    let formName: '';
    let PROGRAM_NAME: string;
    let layoutControlGroup1 = 'layoutControlGroup1';
    let gridView1!: any;
    const grid_view_1 = ref('GridView1');
    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({}); // 给弹出画面传入数据
    let proc_div = ''; // 'I'新增，'U'修改

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      console.log('efFormInfo', formName);
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      initializePage();
    };

    // 变量定义
    const initializeFlag = ref(0);
    const initializeService = '';
    const flag = ref('T');
    let tab1ActiveKey = ref('tab1');
    let pagePara: any; // 炼钢配置表页面参数
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const gridToolbar: Ref<any[]> = ref([]);

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, i_form_ename, initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    // 自定义工具栏按钮功能
    const InitialToolbar = () => {
      erFormHelper.initialGridToolbar(grid_view_1.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false }
      });
    };

    onMounted(() => {});

    //grid实例
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid(grid_view_1.value);
      erFormHelper.setGridEditable(grid_view_1.value, false); // 设置grid不可编辑
      //B系数超过上下限时改颜色
      gridView1.gridOptions.getRowStyle = (params: any) => {
        if (params.data.COE_B < params.data.COE_B_LOWER_LIMIT || params.data.COE_B > params.data.COE_B_UPPER_LIMIT) {
          return {
            fontweight: 'bold',
            background: '#F78084'
          };
        }
      };
    };

    const getGridViewLine = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(layoutControlGroup1);
      eiBlock.addColumn('QUERY_DIV', 'TMMSM33CZXS'); //传表名
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('mmsm33czxs_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_view_1.value);
      }
    };

    const F2_DO = async (e: any) => {
      getGridViewLine();
    };

    const F3_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(grid_view_1.value).length === 0) {
        erFormHelper.messageWarning('未选择修改信息');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(grid_view_1.value, true)[0];
        console.log('mainGridCheckedRow', mainGridCheckedRow);

        openADDUDialog(mainGridCheckedRow);
      }
    };
    // 打开修改弹出画面
    const openADDUDialog = (currentRow: any) => {
      console.log('跳转修改画面');
      const CC_MACH_NO = currentRow.CC_MACH_NO;
      const STRAND_NO = currentRow.STRAND_NO;
      const ST_NO = currentRow.ST_NO;

      const data = {
        PROC_DIV: 'U',
        CC_MACH_NO: CC_MACH_NO,
        STRAND_NO: STRAND_NO,
        ST_NO: ST_NO
      };
      console.log('开始读取');
      dialogFormName.value = 'MMSM33CZXSPOP'; // 读配置表获取画面名
      console.log('data', dialogFormName.value);
      parentInfo.value = data;
      openXrEfDialog('U');
    };
    const dialogVisible = ref<boolean>(false);
    // 弹框ref
    const xrEfDialogRef = ref<any>(null);
    // 打开弹框事件
    const openXrEfDialog = (PROC_DIV: string) => {
      dialogVisible.value = true;
      proc_div = PROC_DIV;
    };
    // 关闭弹框监听
    const xrEfDialogClose = () => {
      getGridViewLine();
    };
    // 获取弹窗画面传递过来的数据 新增
    const getChildInfo = (info: any) => {
      if (info.close) {
        proc_div = info.PROC_DIV;
        dialogVisible.value = false; // 关闭弹框
        closeXrEfDialog();
      }
    };
    // 关闭弹窗事件
    const closeXrEfDialog = () => {
      // 如果是修改，则不做主表查询，只做子表查询，保持主表焦点行不变
      // if (proc_div === "U") {
      //   const currentRow = erFormHelper.getGridCurrentRow(
      //     grid_view_1.value,
      //     true
      //   );
      getGridViewLine();
      // }
      // else if (proc_div === "I") {
      //   getGridViewLine(); // 关闭弹框后查询主表
      // }
    };

    return {
      erFormHelper,
      initializeFlag,
      gridToolbar,
      xrEfDialogRef,
      xrEfDialogClose,
      getChildInfo,
      F2_DO,
      F3_DO,
      erGrid1Ready,
      efFormReady,
      grid_view_1,
      tab1ActiveKey,
      dialogVisible,
      dialogFormName,
      openXrEfDialog,
      parentInfo,
      closeXrEfDialog
    };
  }
});
