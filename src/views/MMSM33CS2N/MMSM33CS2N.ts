import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import ErPopFree from 'ERX/ErPopFree';
import { PopQueryReturnInfo, PopFreeReturnInfo } from 'ERX/er-type';
export default defineComponent({
  name: 'MMSM33CS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    ErPopFree
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let i_form_ename = ''; // 低代码配置画面布局名
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;
    const initializeService = '';

    // 变量定义
    const initializeFlag = ref(0);
    const grid_view_1 = ref('GridView1');
    const grid_view_2 = ref('GridView2');
    let tab1ActiveKey = ref('tab_1');
    let gridView1!: any;
    let gridView2!: any;
    const gridToolbar: Ref<any[]> = ref([]);
    let popFreeEdit: ER.PopFreeHelper;
    const editable = ref(false);

    // 获取tab页组件的ref和实例
    // Tab页切换显示事件
    const kendoTabStrip = ref<any>(null);
    let v_factory_div: 'LG1';

    let cs_OkClick = '';
    const tab_flag = 1; //1 为tab1  2 为tab2

    let popFreeADD: ER.PopFreeHelper;

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      if (formName === 'MMSM33CS2N') {
        popFreeADD = new ER.PopFreeHelper(formPartition, 'MMSM33CPOP', 'MMSM33C_LAYOUT');
      }
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      initializePage();
    };

    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, i_form_ename, initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          //设置grid不可编辑
          erFormHelper.setGridEditable('GridView1', false);
          erFormHelper.setGridEditable('GridView2', false);
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    //grid实例
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid(grid_view_1.value);
      erFormHelper.setGridToolbarVisible(grid_view_1.value, {
        excel: true
      });
    };
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid(grid_view_2.value);
      erFormHelper.setGridToolbarVisible(grid_view_2.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    //标签页组件的切换事件
    const handleTabChange = (activeKey: string) => {
      console.log('1111', activeKey);
      if (activeKey === 'tab_1') {
        queryMainGrid();
      } else if (activeKey === 'tab_2') {
        queryTable2();
      }
    };

    // 查询主表炉次信息
    const queryMainGrid = async () => {
      const eiInfo = new EI.EIInfo();
      const queryConditionEiBlock: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock('layoutControlGroup1', {
        // FACTORY_DIV: pagePara.factory_div,
        FACTORY_DIV: ' ',
        TABLE_TYPE: 'TMMSM39'
      });
      console.log('queryConditionEiBlock', queryConditionEiBlock);
      eiInfo.addBlock(queryConditionEiBlock);
      const outInfo = await erFormHelper.callService('mmsm33cf2_inq', eiInfo, true, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToGrid(outInfo, 'GridView1', true);
      }
    };

    // 查询主表炉次信息
    const queryTable2 = async () => {
      const eiInfo = new EI.EIInfo();
      const queryConditionEiBlock: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock('layoutControlGroup1', {
        // FACTORY_DIV: pagePara.factory_div,
        FACTORY_DIV: ' ',
        TABLE_TYPE: 'TMMSM38'
      });
      eiInfo.addBlock(queryConditionEiBlock);
      const outInfo = await erFormHelper.callService('mmsm33cf2_inq', eiInfo, true, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToGrid(outInfo, 'GridView2', true);
      }
    };

    const GridView1FocusChanged = (e: any) => {
      erFormHelper.checkGridCurrentRow(grid_view_1.value);
    };

    const GridView1DoubleClick = (e: any) => {
      erFormHelper.checkGridCurrentRow(grid_view_1.value);
    };

    const shijiSave = async (dataModel: any, PROC_DIV: string) => {
      const gridView1data = erFormHelper.getGridCheckedRowsAsBlock('GridView1');
      const eiInfo = new EI.EIInfo();
      // 将dataModel格式转换为EIBlock
      const eiBlock = erFormHelper.convertModelAsBlock(dataModel, {
        FACTORY_DIV: v_factory_div,
        //STATION_ID: pagePara.station_id,
        PROC_DIV: PROC_DIV
      });
      eiInfo.addBlock(eiBlock, 'TMMSM38');
      eiInfo.addBlock(gridView1data, 'PARA');
      console.log('eiInfo', eiInfo);
      const outInfo = await erFormHelper.callService('mmsm33c_pro', eiInfo, false, false, true);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.messageSuccess('保存成功');
        queryMainGrid();
      }
    };

    onMounted(() => {});

    const F2_DO = async (e: any) => {
      queryMainGrid();
    };
    //组批确认
    const F3_DO = async (e: any) => {
      const gridView1data = erFormHelper.getGridCheckedRowsAsBlock('GridView1');
      if (gridView1data.data.length == 0) {
        erFormHelper.messageWarning('请先选择铸坯信息！');
        return false;
      }
      /*  if (erFormHelper.getGridCheckedRows('GridView1', true)[0]['CUT_FIN_FLAG'] == 1) {
        erFormHelper.messageWarning('切断已完毕，不允许修改操作！');
        return false;
      } */
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows(grid_view_1.value, true)[0]; // 获取主表勾选行
      if (popFreeADD) {
        // 使用低代码弹窗组件ErPopFree
        //popFreeADD.ReceiveData(mainGridCheckedRow); // 初始绑值，并设置可编辑
        ER.PopUtils.showErPopFree(ErPopFree, popFreeADD, async (event: PopFreeReturnInfo) => {
          //确定按钮回调
          const recMsg = event as PopFreeReturnInfo; //XrErPopFree弹窗组件返回数据
          shijiSave(recMsg.dataModel, 'I');
        });
      }
    };
    const F3_PRE_DO = async (e: any) => {};
    const F3_CANCEL = async (e: any) => {};

    //组批取消
    const F4_DO = async (e: any) => {
      const gridView1data = erFormHelper.getGridCheckedRowsAsBlock('GridView2');
      if (gridView1data.data.length == 0) {
        erFormHelper.messageWarning('请先选择履历信息！');
        return false;
      }
      const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
      if (confirm) {
        const eiInfo = new EI.EIInfo();

        const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('GridView2', {
          OPERATE: 'F4'
          /* HEAT_NO: erFormHelper.getControlValue('layoutControlGroup1', 'HEAT_NO'),
          REMARK: erFormHelper.getControlValue('layoutControlGroup1', 'REMARK') */
        });
        const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
        const outInfo = await erFormHelper.callService('mmsm33c_pro', eiInfo, true, false, true);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('处理失败:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('处理成功');
          if (tab_flag == 1) queryMainGrid();
          else queryTable2();
        }
      }
    };
    const F4_PRE_DO = async (e: any) => {};
    const F4_CANCEL = async (e: any) => {};

    //删除
    const F5_DO = async (e: any) => {
      const gridView1data = erFormHelper.getGridCheckedRowsAsBlock('GridView2');
      if (gridView1data.data.length == 0) {
        erFormHelper.messageWarning('请先选择履历信息！');
        return false;
      }
      const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
      if (confirm) {
        const eiInfo = new EI.EIInfo();

        const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('GridView2', {
          OPERATE: 'F4'
          /* HEAT_NO: erFormHelper.getControlValue('layoutControlGroup1', 'HEAT_NO'),
          REMARK: erFormHelper.getControlValue('layoutControlGroup1', 'REMARK') */
        });
        const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
        const outInfo = await erFormHelper.callService('mmsm33c_pro', eiInfo, true, false, true);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('处理失败:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('处理成功');
          if (tab_flag == 1) queryMainGrid();
          else queryTable2();
        }
      }
    };
    const F5_PRE_DO = async (e: any) => {};
    const F5_CANCEL = async (e: any) => {};

    return {
      erFormHelper,
      initializeFlag,
      tab1ActiveKey,
      kendoTabStrip,
      grid_view_1,
      grid_view_2,
      handleTabChange,
      F2_DO,
      F3_DO,
      F3_PRE_DO,
      F3_CANCEL,
      F4_DO,
      F4_PRE_DO,
      F4_CANCEL,
      gridToolbar,
      GridView1FocusChanged,
      efFormReady,
      erGrid1Ready,
      erGrid2Ready,
      GridView1DoubleClick,
      F5_DO,
      F5_PRE_DO,
      F5_CANCEL
    };
  }
});
