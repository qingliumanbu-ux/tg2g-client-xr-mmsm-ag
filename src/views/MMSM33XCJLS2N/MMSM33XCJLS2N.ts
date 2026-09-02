import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import { CellValueChangedEvent, Logger } from '@ag-grid-community/core';
import ErPopFree from 'ERX/ErPopFree';
import ErPopQuery from 'ERX/ErPopQuery';
import { PopFreeReturnInfo } from 'ERX/er-type';

export default defineComponent({
  name: 'MMSM33XCJLS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    ErPopFree,
    ErPopQuery
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let gridView1: any;
    let gridView2: any;
    let formName: '';
    let PROGRAM_NAME: string;
    let i_form_ename = ''; // 低代码配置画面布局名
    let grid_main!: any;
    const gridView_main = ref('gridView_main');
    const gridView_fama = ref('GridView_fama');
    let i_proc_div = '';
    const initializeService = '';
    let gridApi: any;
    let popFreeEdit: ER.PopFreeHelper;

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
    let dt_key = new EI.EiBlock();
    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, i_form_ename, initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          erFormHelper.setGridEditable('GridView1', false);
          erFormHelper.setGridEditable('GridView2', false);
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {});
    //grid实例
    const erGrid1Ready = (e: any) => {
      gridApi = e.api;
      gridApi.addEventListener('cellValueChanged', cellValueChangedHandler);
      grid_main = erFormHelper.getGrid(gridView_main.value);
      console.log('gridView_main', gridView_main);
      erFormHelper.setGridToolbarVisible(gridView_main.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
      erFormHelper.setGridEditable(gridView_main.value, false); // 设置grid不可编辑
    };

    const erGrid2Ready = (e: any) => {
      grid_main = erFormHelper.getGrid(gridView_fama.value);
      console.log('gridView_main', gridView_fama);
      erFormHelper.setGridToolbarVisible(gridView_fama.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
      erFormHelper.setGridEditable(gridView_fama.value, false); // 设置grid不可编辑
    };

    //修改时事件回调的函数
    const cellValueChangedHandler = (e: CellValueChangedEvent) => {
      gridApi.removeEventListener('cellValueChanged', cellValueChangedHandler);

      //e.node.setDataValue('', '');
      // e.oldValue为旧值
      // e.newValue为新值
      // e.colDef.field为当前点击单元格的列名
      // e.rowIndex为当前点击单元格的行号
      // e.type为当前点击的类型
      //const toolbarPanel = gridApi.value.getStatusPanel('');
      if (e.colDef.field == 'PROOFREAD_FIRST_WT_0') {
        e.node.setDataValue('ERROR_FIRST_WT_0', e.newValue - e.node.data['COUNTERWEIGH_S']);
      }
      if (e.colDef.field == 'PROOFREAD_SECOND_WT_0') {
        e.node.setDataValue('ERROR_SECOND_WT_0', e.newValue - e.node.data['COUNTERWEIGH_S']);
      }
      if (e.colDef.field == 'PROOFREAD_FIRST_WT_1') {
        e.node.setDataValue('ERROR_FIRST_WT_1', e.newValue - e.node.data['COUNTERWEIGH_S']);
      }
      if (e.colDef.field == 'PROOFREAD_SECOND_WT_1') {
        e.node.setDataValue('ERROR_SECOND_WT_1', e.newValue - e.node.data['COUNTERWEIGH_S']);
      }
      if (e.colDef.field == 'PROOFREAD_FIRST_WT_2') {
        e.node.setDataValue('ERROR_FIRST_WT_2', e.newValue - e.node.data['COUNTERWEIGH_S']);
      }
      if (e.colDef.field == 'PROOFREAD_SECOND_WT_2') {
        e.node.setDataValue('ERROR_SECOND_WT_2', e.newValue - e.node.data['COUNTERWEIGH_S']);
      }
      if (e.colDef.field == 'PROOFREAD_ACT_WT_6') {
        e.node.setDataValue('ERROR_ACT_WT_6', e.newValue - e.node.data['COUNTERWEIGH_S']);
      }
      if (e.colDef.field == 'PROOFREAD_ACT_WT_7') {
        e.node.setDataValue('ERROR_ACT_WT_7', e.newValue - e.node.data['COUNTERWEIGH_S']);
      }
      if (e.colDef.field == 'PROOFREAD_FIRST_WT_3') {
        e.node.setDataValue('ERROR_FIRST_WT_3', e.newValue - e.node.data['COUNTERWEIGH_C']);
      }
      if (e.colDef.field == 'PROOFREAD_SECOND_WT_3') {
        e.node.setDataValue('ERROR_SECOND_WT_3', e.newValue - e.node.data['COUNTERWEIGH_C']);
      }
      if (e.colDef.field == 'PROOFREAD_FIRST_WT_4_BC') {
        e.node.setDataValue('ERROR_FIRST_WT_4_BC', e.newValue - e.node.data['COUNTERWEIGH_C']);
      }
      if (e.colDef.field == 'PROOFREAD_SECOND_WT_4_BC') {
        e.node.setDataValue('ERROR_SECOND_WT_4_BC', e.newValue - e.node.data['COUNTERWEIGH_C']);
      }
      if (e.colDef.field == 'PROOFREAD_ACT_WT_4_AB') {
        e.node.setDataValue('ERROR_ACT_WT_4_AB', e.newValue - e.node.data['COUNTERWEIGH_C']);
      }

      gridApi.addEventListener('cellValueChanged', cellValueChangedHandler);
    };

    const setToolbarVisible = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, {
        addrow: visible,
        copyrow: visible,
        delete: visible
      });
    };

    const F2_DO = async () => {
      query();
    };
    const query = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      inInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService('mmsm33xcjl_inq', inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_main.value);
      }
      query_fama_wt();
    };

    const query_fama_wt = async () => {
      const inInfo = new EI.EIInfo();
      //const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      //inInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService('mmsm33xcjlfm_inq', inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_fama.value);
      }
    };

    //自定义模板参数
    const popFreeEdit_pars = async () => {
      popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM33XCJL_LAYOUT_DIALOG');
    };
    //弹出界面OK按钮点击事件
    const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();

      inInfo.addBlock(
        erFormHelper.convertModelAsBlock(e.dataModel, {
          PROC_DIV: i_proc_div
        })
      );
      console.log('11111', e.dataModel);

      outInfo = await erFormHelper.callService('mmsm33xcjl_pro', inInfo, false, true, true);
      console.log('8888', inInfo);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query();
    };

    const GridView1dblclick = (e: any) => {
      gridView1 = erFormHelper.getGridCurrentRow(gridView_main.value);
      erFormHelper.checkGridRow('gridView1', gridView1);
    };

    const GridView2dblclick = (e: any) => {
      gridView2 = erFormHelper.getGridCurrentRow(gridView_fama.value);
      erFormHelper.checkGridRow('gridView2', gridView2);
    };

    //新增
    const F3_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows('gridView_main').length === 0) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        return false;
      } else {
        const eiInfo = new EI.EIInfo();
        const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('gridView_main', { PROC_DIV: 'U' });
        const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
        console.log('checkedRowEiBlock', checkedRowEiBlock);
        const outInfo = await erFormHelper.callService('mmsm33xcjl_pro', eiInfo, true, false, true);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('处理失败:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('处理成功');
          erFormHelper.setGridEditable(gridView_main.value, false);
          query();
        }
      }
    };

    const F3_PRE_DO = async (e: any) => {
      erFormHelper.setGridEditable(gridView_main.value, true);
    };
    const F3_CANCEL = async (e: any) => {
      erFormHelper.setGridEditable(gridView_main.value, false);
    };
    // 修改
    const F4_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows('GridView_fama').length === 0) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        return false;
      } else {
        const eiInfo = new EI.EIInfo();
        const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('GridView_fama', { PROC_DIV: 'FAMA' });
        const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
        console.log('checkedRowEiBlock', checkedRowEiBlock);
        const outInfo = await erFormHelper.callService('mmsm33xcjl_pro', eiInfo, true, false, true);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('处理失败:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('处理成功');
          erFormHelper.setGridEditable(gridView_fama.value, false);
          query();
        }
      }
    };

    const F4_PRE_DO = async (e: any) => {
      erFormHelper.setGridEditable(gridView_fama.value, true);
    };
    const F4_CANCEL = async (e: any) => {
      erFormHelper.setGridEditable(gridView_fama.value, false);
    };

    //删除
    const F5_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView_main.value).length === 0) {
        erFormHelper.messageWarning('请选择一条信息再删除');
      } else {
        // 删除提示
        const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
        if (confirm) {
          const eiInfo = new EI.EIInfo();
          const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock(gridView_main.value, {
            PROC_DIV: 'D'
          });
          const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
          const outInfo = await erFormHelper.callService('mmsm33xcjl_pro', eiInfo, true, false, true);
          if (outInfo.sys.status < 0) {
            erFormHelper.messageError('删除失败:' + outInfo.sys.msg);
          } else {
            erFormHelper.messageSuccess('删除成功');
            query();
          }
        }
      }
    };

    const F5_PRE_DO = async (e: any) => {};
    const F5_CANCEL = async (e: any) => {};

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      F2_DO,
      F3_DO,
      F3_PRE_DO,
      F3_CANCEL,
      F4_DO,
      F4_PRE_DO,
      F4_CANCEL,
      F5_DO,
      F5_PRE_DO,
      F5_CANCEL,
      erGrid1Ready,
      erGrid2Ready,
      GridView1dblclick,
      GridView2dblclick
    };
  }
});
