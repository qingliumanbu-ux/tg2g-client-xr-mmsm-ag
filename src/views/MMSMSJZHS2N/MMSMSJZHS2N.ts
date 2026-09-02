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
/* import { KendoTabStrip, TabStrip } from '@progress/kendo-layout-vue-wrapper'; */

export default defineComponent({
  name: 'MMSMSJZHS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    xrEfSearchBox,
    xrEfDialog,
    erGrid,
    erLayout
  },
  setup: () => {
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;

    let gridView1: any;
    let gridView2: any;
    let gridView3: any;
    let gridView4: any;
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
    // 获取画面的分区信息及设置画面初始化service
    const initializeService = '';
    // 变量定义
    formName = 'MMSM61PES2N';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    let i_form_ename: any;
    const gridView1Caption = ref('标签名');
    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {
      //initializePage();
    });

    //#region 分页查询信息 grid1pagingQuery start
    const grid1pagingQuery = async (options: any) => {
      options.success({ data: undefined, total: undefined });
      const Query = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter', {
        TABLE_TYPE: 'TMMSM20'
      });
      const inInfo = new EI.EIInfo();
      inInfo.addBlock(Query, 'Table1');
      inInfo.addBlock(erFormHelper.getAllControlValueAsFilter('LayoutGroupFilter'), 'QUERY_FILTER');
      const eiBlock_page = new EI.EiBlock();
      eiBlock_page.pushData(
        {
          RecordFrom: options.data.skip,
          PageSize: options.data.pageSize
        },
        true
      );
      inInfo.addBlock(eiBlock_page, 'PageInfo');
      const outInfo = await erFormHelper.callService('mmsm01a1f2_inq', inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        const resultData = outInfo.getBlock(0).data; //后台返回的当页的数据
        const reusltTotal = outInfo.blocks['PageInfo'].data[0]['TOTALRECORDCOUNT']; //后台返回数据总条数
        //固定写法[ison的键必须是data和total]
        const result = { data: resultData, total: reusltTotal };
        options.success(result);
        if (outInfo.getBlock(0).data.length === 0) {
          erFormHelper.messageInfo('未查询到材料信息');
        }
      }
    };
    //#endregion 分页查询信息 end

    const Query = async (e: any, table_type: any) => {
      //查询条件
      if (!erFormHelper.checkRequiredInput('LayoutGroupFilter')) {
        return false;
      }
      //清空grid数据
      erFormHelper.clearGridData();
      const inInfo = new EI.EIInfo();
      //获取查询条件dt
      const Query = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter', {
        TABLE_TYPE: table_type
      });
      inInfo.addBlock(Query);
      const outInfo = await erFormHelper.callService('mmsmsjf2_inq', inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        if (outInfo.getBlock(0).data.length === 0) {
          erFormHelper.messageWarning('未查询到数据');
          return false;
        }
        // 根据返回数据加载页面显示数据,需要和si配置的数据集的表一致
        erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, e);
      }
    };

    const handleTabChange = (activeKey: string) => {
      if (activeKey === 'tab1') {
        Query('GridView1', 'TMMSM20');
      } else if (activeKey === 'tab2') {
        Query('GridView2', 'TMMSM23');
      } else if (activeKey === 'tab3') {
        Query('GridView3', 'TMMSM24');
      } else if (activeKey === 'tab4') {
        Query('GridView4', 'TMMSM31');
      }
    };
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('GridView1');
      console.log('gridView1', gridView1);
      erFormHelper.setGridEditable('GridView1', false);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid2Ready = () => {
      gridView1 = erFormHelper.getGrid('GridView1');
      console.log('gridView1', gridView1);
      erFormHelper.setGridEditable('GridView1', false);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid3Ready = () => {
      gridView1 = erFormHelper.getGrid('GridView1');
      console.log('gridView1', gridView1);
      erFormHelper.setGridEditable('GridView1', false);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid4Ready = () => {
      gridView1 = erFormHelper.getGrid('GridView1');
      console.log('gridView1', gridView1);
      erFormHelper.setGridEditable('GridView1', false);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const F2_DO = async () => {
      Query('GridView1', 'TMMSM20');
      Query('GridView2', 'TMMSM23');
      Query('GridView3', 'TMMSM24');
      Query('GridView4', 'TMMSM31');
    };

    return {
      handleTabChange,
      tabActiveKey,
      erGrid4Ready,
      erGrid3Ready,
      erGrid2Ready,
      erGrid1Ready,
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO,
      formName,
      gridView1Caption
    };
  }
});
