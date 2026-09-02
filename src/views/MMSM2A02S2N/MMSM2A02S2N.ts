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
  name: 'MMSM2A02S2N',
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
    let gridView1!: any;
    const grid_view_1 = ref('GridView1');

    // 变量定义
    const initializeFlag = ref(0);
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const gridToolbar: Ref<any[]> = ref([]);

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

    /*  if (formName = 'MMSM2A02S2N') {
      popFreeF3 = new ErPopFreeHelper(formPartition, '', '');
      popFreeF4 = new ErPopFreeHelper(formPartition, '', '');
      popFreeF5 = new ErPopFreeHelper(formPartition, '', '');
    } */

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
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
      /*   gridToolbar.value = erFormHelper.getGridToolbar([
        { name: 'excel', visible: true },
        {
          name: 'addrow',
          visible: false
        },
        { name: 'copyrow', visible: false },
        { name: 'delete', visible: false }
        // { name: 'save', visible: false },
        // { name: 'cancel', visible: false }
      ]); */
    };

    // 查询主表炉次信息
    const queryMainGrid = async () => {
      const eiInfo = new EI.EIInfo();
      const queryConditionEiBlock: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock('layoutControlGroup1', {
        // FACTORY_DIV: pagePara.factory_div,
        FACTORY_DIV: ' ',
        TABLE_TYPE: 'TMMSM2A'
      });
      eiInfo.addBlock(queryConditionEiBlock);
      const outInfo = await erFormHelper.callService('mmsm2a_inq1', eiInfo, true, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_view_1.value, true);
      }
    };

    onMounted(() => {});
    //grid实例
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid(grid_view_1.value);
      console.log('grid_view_1', grid_view_1);
      erFormHelper.setGridToolbarVisible(grid_view_1.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const F2_DO = async (e: any) => {
      queryMainGrid();
    };
    const F3_DO = async (e: any) => {};
    const F3_PRE_DO = async (e: any) => {};
    const F3_CANCEL = async (e: any) => {};
    const F4_DO = async (e: any) => {};
    const F4_PRE_DO = async (e: any) => {};
    const F4_CANCEL = async (e: any) => {};
    const F5_DO = async (e: any) => {};
    const F5_PRE_DO = async (e: any) => {};
    const F5_CANCEL = async (e: any) => {};

    return {
      erFormHelper,
      initializeFlag,
      gridToolbar,
      grid_view_1,
      efFormReady,
      erGrid1Ready,
      F2_DO,
      F3_DO,
      F3_PRE_DO,
      F3_CANCEL,
      F4_DO,
      F4_PRE_DO,
      F4_CANCEL,
      F5_DO,
      F5_PRE_DO,
      F5_CANCEL
    };
  }
});
