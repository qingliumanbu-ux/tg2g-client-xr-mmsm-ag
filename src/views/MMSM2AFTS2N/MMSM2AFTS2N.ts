import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';

export default defineComponent({
  name: 'MMSM2AFTS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let i_form_ename = ''; // 低代码配置画面布局名
    let formPartition: string;
    let formName: '';
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

    // 获取tab页组件的ref和实例
    // Tab页切换显示事件
    const kendoTabStrip = ref<any>(null);

    const tab_flag = 1; //1 为tab1  2 为tab2

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
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
        TABLE_TYPE: 'TMMSM01'
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
        TABLE_TYPE: 'TMMSM96'
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

    onMounted(() => {});

    const F2_DO = async (e: any) => {
      if (tab_flag == 1) queryMainGrid();
      else queryTable2();
    };
    //组批确认
    const F3_DO = async (e: any) => {
      const gridView1data = erFormHelper.getGridCheckedRowsAsBlock('GridView1');
      if (gridView1data.data.length == 0) {
        erFormHelper.messageWarning('请先选择铸坯信息！');
        return false;
      }
      const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
      if (confirm) {
        const eiInfo = new EI.EIInfo();

        const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('GridView1', {
          OPERATE: 'F3',
          HEAT_NO_cf: erFormHelper.getControlValue('layoutControlGroup1', 'HEAT_NO'),
          REMARK_cf: erFormHelper.getControlValue('layoutControlGroup1', 'REMARK')
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
      GridView1DoubleClick
    };
  }
});
