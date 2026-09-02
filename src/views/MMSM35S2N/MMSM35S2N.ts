import { defineComponent, onMounted, ref, reactive, computed, nextTick, toRaw, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import xrEfSearchBox from 'EFX/xrEfSearchBox';
import xrEfDialog from 'EFX/xrEfDialog';
import EFUtility from 'EFX/EFUtility';
import eBFR from 'EFX/eBFR';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import MMSM35POP from '../MMSM35POP/MMSM35POP.vue';

export default defineComponent({
  name: 'MMSM35S2N',
  components: {
    MMSM35POP,
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    xrEfDialog
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service

    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;

    const initializeService = '';

    const gridToolbar: Ref<any[]> = ref([]);
    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({});

    // 变量定义
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    let gridView1: any;
    let gridView2: any;
    let gridView3: any;
    const grid_view_1 = ref('');
    const grid_view_2 = ref('');
    const grid_view_3 = ref('');
    // 获取tab页组件的ref和实例

    const layoutControlGroup1 = 'layoutControlGroup1';
    const gridView_line1 = ref('GridView1');
    const gridView_line2 = ref('GridView2');
    const tabActiveKey = ref('tab1');
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition;
      formName = efFormInfo.value.formName; // 当前画面名
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      // 初始化低代码工具类
      initializePage();
    };

    const dialogVisible = ref<boolean>(false);

    // 引入EFDialogForm弹出框的相关方法
    /*   const { openEfDialog, closeEfDialog } = EFDialogForm();
    const { listenerMessageEvent } = EFDialogFormMessage(); */
    // 自定义工具栏按钮功能
    /*  const InitialToolbar = () => {
      gridToolbar.value = erFormHelper.getGridToolbar([{ name: 'excel', visible: true }]);
    }; */

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        //InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {
      //handleEfDialogMessage(); // 接收弹出画面传入的数据
    });

    //查询铸坯信息
    const getSubGridLine = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(layoutControlGroup1);
      eiBlock.addColumn('QUERY_DIV', 'TMMSM01'); //传表名
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('mmsm35f2_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_line1.value);
      }
    };

    //查询切废信息
    const getSubGrid2 = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(layoutControlGroup1);
      eiBlock.addColumn('QUERY_DIV', 'TMMSM39'); //传表名
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('mmsm35f2_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, 'GridView3');
      }
    };

    //查询分段实绩
    const getSubGridProd = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(layoutControlGroup1);
      eiBlock.addColumn('QUERY_DIV', 'TMMSM35'); //传表名
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('mmsm35f2_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_line2.value);
      }
    };

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('GridView1');
      console.log('gridView1', gridView1);
      erFormHelper.setGridEditable(grid_view_1.value, false);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid('GridView2');
      erFormHelper.setGridEditable(grid_view_2.value, false);
      erFormHelper.setGridToolbarVisible('GridView2', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const erGrid3Ready = () => {
      gridView3 = erFormHelper.getGrid('GridView3');
      erFormHelper.setGridEditable(grid_view_3.value, false);
      erFormHelper.setGridToolbarVisible('GridView3', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const handleTabChange = (activeKey: string) => {
      if (activeKey === 'tab1') {
        getSubGridLine();
      } else if (activeKey === 'tab2') {
        getSubGridProd();
      } else if (activeKey === 'tab3') {
        getSubGrid2();
      }
    };

    const F2_DO = async (e: any) => {
      getSubGridLine();
      getSubGridProd();
      getSubGrid2();
    };
    const F6_DO = async (e: any) => {
      const params1 = erFormHelper.getAllControlValue('layoutControlGroup2');
      if (erFormHelper.getGridCheckedRows(gridView_line1.value).length === 0) {
        erFormHelper.messageWarning('未选择铸坯信息');
        return;
      } else if (params1.CUT_NUM.trim() === '') {
        erFormHelper.messageWarning('请在查询条件右侧的分切录入区录入分切数!');
        return;
      } else if (params1.CUT_NUM.trim() < 2) {
        erFormHelper.messageWarning('分切数必须大于1!');
        return;
      }/* else if (params1.CUT_NUM.trim() > 5) {
        erFormHelper.messageWarning('分切数不能大于5,最多只能切5块!');
        return;
      } */ else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line1.value, true)[0]; // 获取主表勾选行
        if (mainGridCheckedRow.RCV_MAT_FLAG.trim() !== 'S') {
          erFormHelper.messageWarning('未收货成功!');
        } else {
          // 使用框架弹窗组件EFDialogForm
          openADDialog(mainGridCheckedRow, 'F6');
        }
      }
    };

    //批量分切
    const F7_DO = async (e: any) => {
      const params1 = erFormHelper.getAllControlValue('layoutControlGroup2');
      if (erFormHelper.getGridCheckedRows(gridView_line1.value).length === 0) {
        erFormHelper.messageWarning('未选择铸坯信息');
        return;
      } else if (params1.CUT_NUM.trim() === '') {
        erFormHelper.messageWarning('请在查询条件右侧的分切录入区录入分切数!');
        return;
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line1.value, true)[0]; // 获取主表勾选行
        if (mainGridCheckedRow.RCV_MAT_FLAG.trim() !== 'S') {
          erFormHelper.messageWarning('未收货成功!');
        } else {
          // 使用框架弹窗组件EFDialogForm
          openADDialog(mainGridCheckedRow, 'F7');
        }
      }
    };

    // 打开分切弹出画面
    const openADDialog = (currentRow: any, name: any) => {
      const MAT_NO = currentRow.MAT_NO;
      const params1 = erFormHelper.getAllControlValue('layoutControlGroup2');
      const MAT_ACT_LEN = currentRow.MAT_ACT_LEN;
      const MAT_ACT_WIDTH = currentRow.MAT_ACT_WIDTH;
      const MAT_ACT_THICK = currentRow.MAT_ACT_THICK;
      const MAT_ACT_WT = currentRow.MAT_ACT_WT;
      const MAT_NUM = currentRow.MAT_NUM;
      const BATCH = currentRow.BATCH;
      const PRINT_NO = currentRow.PRINT_NO;
      const SLAB_NO = currentRow.SLAB_NO;
      const HEAT_NO = currentRow.HEAT_NO;
      const ST_NO = currentRow.ST_NO;
      console.log(params1.CUT_NUM.trim(), MAT_NO);
      const data = {
        CUT_NUM: params1.CUT_NUM.trim(),
        MAT_NO: MAT_NO,
        MAT_ACT_LEN: MAT_ACT_LEN,
        MAT_ACT_WIDTH: MAT_ACT_WIDTH,
        MAT_ACT_THICK: MAT_ACT_THICK,
        MAT_ACT_WT: MAT_ACT_WT,
        MAT_NUM: MAT_NUM,
        BATCH: BATCH,
        PRINT_NO: PRINT_NO,
        SLAB_NO: SLAB_NO,
        HEAT_NO: HEAT_NO,
        ST_NO: ST_NO,
        FORMNAME: name
      };
      if (MAT_NO.length > 10) {
        erFormHelper.messageError('该材料已分切，请确认！');
        return false;
      }
      dialogFormName.value = 'MMSM35POP'; // 读配置表获取画面名
      parentInfo.value = data;
      openXrEfDialog();
    };
    // 弹框ref
    const xrEfDialogRef = ref<any>(null);
    console.log('1');

    // 打开弹框事件
    const openXrEfDialog = () => {
      dialogVisible.value = true; //弹窗设置为显示
      console.log('2');

      /*  nextTick(() => {
        xrEfDialogRef.value.open();
      }); */
    };
    // 关闭弹框监听
    const xrEfDialogClose = () => {
      dialogVisible.value = false;
      console.log('11111');
      getSubGridLine();
    };
    // 获取弹窗画面传递过来的数据 新增
    const getChildInfo = (info: any) => {
      if (info.close) {
        dialogVisible.value = false; // 关闭弹框
        xrEfDialogClose();
      }

      console.log('22222');
      /*   if (info.close) {
        xrEfDialogRef.value.close(); // 关闭弹框
      } */
    };

    //分切撤销
    const F9_DO = async (e: any) => {
      const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('GridView2', {});
      if (checkedRowEiBlock.data.length === 0) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        return false;
      } else {
        // 删除提示
        const confirm = await erFormHelper.messageConfirm(
          '是否将该母坯' + checkedRowEiBlock.data[0]['IN_MAT_NO']?.toString() + '下所有子坯进行撤销操作？'
        );
        if (confirm) {
          const eiInfo = new EI.EIInfo();
          //const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('GridView2', {});
          const eiBlock = eiInfo.addBlock(checkedRowEiBlock);

          console.log('eiInfo', eiInfo);
          const outInfo = await erFormHelper.callService('mmsm35f9_del', eiInfo, true, false, true);
          if (outInfo.sys.status < 0) {
            erFormHelper.messageError('处理失败:' + outInfo.sys.msg);
          } else {
            erFormHelper.messageSuccess('处理成功');
            getSubGridProd();
            //erFormHelper.setGridEditable(grid_view_1.value, false);
          }
        }
      }
    };
    const F9_PRE_DO = async (e: any) => {};
    const F9_CANCEL = async (e: any) => {};

    return {
      erGrid3Ready,
      dialogVisible,
      tabActiveKey,
      handleTabChange,
      erGrid1Ready,
      erGrid2Ready,
      efFormReady,
      erFormHelper,
      initializeFlag,
      gridToolbar,
      layoutControlGroup1,
      gridView_line1,
      gridView_line2,
      dialogFormName,
      xrEfDialogRef,
      parentInfo,
      xrEfDialogClose,
      getChildInfo,
      F2_DO,
      F6_DO,
      F7_DO,
      F9_DO,
      F9_PRE_DO,
      F9_CANCEL
    };
  }
});
