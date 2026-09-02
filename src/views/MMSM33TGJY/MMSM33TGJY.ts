import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import MMSM33TGJYPOP from '../MMSM33TGJYPOP/MMSM33TGJYPOP.vue';
import xrEfDialog from 'EFX/xrEfDialog';

export default defineComponent({
  name: 'MMSM33TGJY',
  components: { MMSM33TGJYPOP, xrEfForm, xrEfPanel, erLayout, xrEfDialog, erGrid },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let i_form_ename = ''; // 低代码配置画面布局名
    let formPartition: string;
    let formName: '';
    let PROGRAM_NAME: string;
    //let LayoutGroupFilter = 'LayoutGroupFilter';
    let LayoutGroupFilter1 = 'layoutControlGroup1';
    const grid_view_1 = ref('GridView1');
    const grid_view_2 = ref('GridView2');
    const gridToolbar: Ref<any[]> = ref([]);
    const tabActiveKey = ref('tab1');
    let gridView1!: any;
    let gridView2!: any;
    let grid_chemi_std!: any;
    let str: any = ''; // 画面跳转传递的参数
    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({}); // 给弹出画面传入数据
    let proc_div = ''; // 'I'新增，'U'修改
    let query_div = '';

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
    

    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    // 变量定义
    const initializeFlag = ref(0);
    const initializeService = '';
    const flag = ref('T');
    let pagePara: any; // 炼钢配置表页面参数

    // 自定义工具栏按钮功能
    const InitialToolbar = () => {
      erFormHelper.initialGridToolbar(grid_view_1.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false }
      });
      erFormHelper.initialGridToolbar(grid_view_2.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false }
      });
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, i_form_ename, initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        //初始化工具栏
        InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          //设置grid不可编辑
          //erFormHelper.setGridEditable(grid_view_1.value, false);
          //erFormHelper.setGridColumnEditable(grid_view_2, false);
          erFormHelper.setControlEnable(LayoutGroupFilter1, false);
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid(grid_view_1.value);
      erFormHelper.setGridEditable(grid_view_1.value, false); // 设置grid不可编辑
    };
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid(grid_view_2.value);
      erFormHelper.setGridEditable(grid_view_2.value, false); // 设置grid不可编辑
    };
    onMounted(() => {
      //initializePage();
      //handleEfDialogMessage(); // 接收弹出画面传入的数据
    });

    //查询铸坯信息
    const getSubGridLine = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock : EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter1);
      eiBlock.addColumn('QUERY_DIV', 'TMMSM01'); //传表名
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('mmsm35f2_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_view_1.value);
      }
    };
    
    //查询碳钢检验信息
    const getGridViewLine = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter1);
      //eiBlock.addColumn('QUERY_DIV', 'TMMSM33TGJY'); //传表名
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('mmsm33tgjy_inq', eiInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_view_2.value);


      }
    };

    const handleTabChange = (activeKey: string) => {
      if (activeKey === 'tab1') {
        getSubGridLine();
      } else if (activeKey === 'tab2') {
        getGridViewLine();
      } 
    };
    const F2_DO = async (e: any) => {
      getSubGridLine();
    };
    const F3_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(grid_view_1.value).length === 0) {
        erFormHelper.messageWarning('未选择铸坯信息！');
      } else {
        const GridCheckedRow = erFormHelper.getGridCheckedRows(grid_view_1.value, true)[0];
        //GridCheckedRow['DATE_TIME'] = new Date();
        open1ADDUDialog(GridCheckedRow);
      }
    };
    const F4_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(grid_view_2.value).length === 0) {
        erFormHelper.messageWarning('未选择碳钢检验修改信息！');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(grid_view_2.value, true)[0];
        console.log('mainGridCheckedRow', mainGridCheckedRow);
        openADDUDialog(mainGridCheckedRow);
      }
    };
    // 打开新增弹出画面
    const open1ADDUDialog = (currentRow: any) => {
      console.log('跳转新增画面');
      const MAT_NO = currentRow.MAT_NO;
      const PRINT_NO = currentRow.PRINT_NO;

      const data = {
        PROC_DIV: 'I',
        //QUERY_DIV: 'TMMSM01',
        MAT_NO: MAT_NO,
        PRINT_NO: PRINT_NO,
      };
      console.log('开始读取');
      dialogFormName.value = 'MMSM33TGJYPOP'; // 读配置表获取画面名
      console.log('data', dialogFormName.value);
      parentInfo.value = data;
      openXrEfDialog('I');
    };
    // 打开修改弹出画面
    const openADDUDialog = (currentRow: any) => {
      console.log('跳转修改画面');
      const MAT_NO = currentRow.MAT_NO;
      const PRINT_NO = currentRow.PRINT_NO;

      const data = {
        PROC_DIV: 'U',
        DIV: '1',
        MAT_NO: MAT_NO,
        PRINT_NO: PRINT_NO
      };
      console.log('开始读取');
      dialogFormName.value = 'MMSM33TGJYPOP'; // 读配置表获取画面名
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
      //dialogVisible.value = false; // 关闭弹框
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
      if (proc_div === 'U') {
        const currentRow = erFormHelper.getGridCurrentRow(grid_view_2.value, true);
        getGridViewLine();

      } else if (proc_div === 'I') {
        getGridViewLine(); // 关闭弹框后查询主表
      }
    };

    const F5_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(grid_view_2.value).length === 0) {
        erFormHelper.messageWarning('请选择一条信息再删除');
      } else {
        // 删除提示
        const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
        if (confirm) {
          const eiInfo = new EI.EIInfo();
          const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock(grid_view_2.value, {
            PROC_DIV: 'D'
          });
          const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
          const outInfo = await erFormHelper.callService('mmsm33tgjy_pro', eiInfo);
          if (outInfo.sys.status < 0) {
            erFormHelper.messageError('删除失败:' + outInfo.sys.msg);
          } else {
            erFormHelper.messageSuccess('删除成功');
            getGridViewLine();
          }
        }
      }
    };

    return {
      erFormHelper,
      initializeFlag,
      gridToolbar,
      xrEfDialogRef,
      tabActiveKey,
      handleTabChange,
      xrEfDialogClose,
      getChildInfo,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      erGrid1Ready,
      erGrid2Ready,
      efFormReady,
      grid_view_1,
      grid_view_2,
      LayoutGroupFilter1,
      dialogVisible,
      dialogFormName,
      openXrEfDialog,
      parentInfo,
      closeXrEfDialog
    };
  }
});
