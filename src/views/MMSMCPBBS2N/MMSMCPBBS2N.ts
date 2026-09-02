import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager, buildEIInfo } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import xrEfDialog from 'EFX/xrEfDialog';
import ErPopFree from 'ERX/ErPopFree';
import { PopQueryReturnInfo, PopFreeReturnInfo } from 'ERX/er-type';
import { Console, log } from 'console';

export default defineComponent({
  name: 'MMSMCPBBS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    xrEfDialog,
    ErPopFree
  },

  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: '';
    let PROGRAM_NAME: string;
    let i_form_ename = ''; // 低代码配置画面布局名
    let grid_main!: any;
    const gridView_tab1 = ref('GridView1');

    let LayoutGroupFilter = 'LayoutGroupFilter';
    let pagePara: any; // 炼钢配置表页面参数
    const layout_group_filter = ref('');

    const table_type_x = ref('');
    const table_name_main = ref('');
    const initializeService = '';
    const tabActiveKey = ref('tab1');
    let i_proc_div = '';
    let cs_OkClick = '';
    let popFreeEdit: ER.PopFreeHelper;
    let grid_tab = '';
    let v_service = '';

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
      v_service = efFormInfo.value.formParams['service'];
      console.log('v_service', v_service, efFormInfo);
      initializePage();
    };
    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    // 变量定义
    const initializeFlag = ref(0);
    let dt_key = new EI.EiBlock();
    const i_service_f2 = ref('');

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {});
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    /*  onMounted(() => {}); */
    //grid实例
    const erGrid1Ready = () => {
      grid_main = erFormHelper.getGrid(gridView_tab1.value);
      erFormHelper.setGridEditable(gridView_tab1.value, false);
      erFormHelper.setGridToolbarVisible(gridView_tab1.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const handleTabChange = (activeKey: string) => {
      if (activeKey === 'tab1') {
        query_main();
      }
    };

    const F2_DO = async () => {
      query_main();
    };

    const query_main = async () => {
      const eiInfo = new EI.EIInfo();
      erFormHelper.setGridServerPagingQuery(gridView_tab1.value, eiInfo, (queryPage: number) => {
        return new Promise(async (resolve, reject) => {
          const eiInfo = new EI.EIInfo();
          const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
          eiBlock.addColumn('GRID_TAB', 'TMMSM01'); //传表名
          eiInfo.addBlock(eiBlock, '');
          const result: any = { flag: -1, msg: '', data: undefined, total: 0 };
          const grid = erFormHelper.getGrid(gridView_tab1.value);
          const pageSize = grid.gridOptions.context?.pageOptions?.pageSize;
          eiInfo.addBlock(ER.Core.buildEiBlock([{ PAGE_NUM: queryPage, PAGE_SIZE: pageSize }], 'PAGEINFO'));
          await erFormHelper.callService(v_service, eiInfo).then((res: any) => {
            if (res.sys.status >= 0) {
              result.flag = 0;
              result.data = res.getBlock(0);
              result.total = res.getBlock(0).length;

              if (res.contains('PAGEINFO')) {
                result.total = res.getBlock('PAGEINFO').data[0]['TOTAL_RECORD'];
              }
            }
          });
          resolve(result);
        });
      });

      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiBlock.addColumn('GRID_TAB', 'TMMSM01'); //传表名
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService(v_service, eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_tab1.value);
      }
    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      LayoutGroupFilter,
      gridView_tab1,
      F2_DO,
      erGrid1Ready,
      handleTabChange,
      tabActiveKey
    };
  }
});
