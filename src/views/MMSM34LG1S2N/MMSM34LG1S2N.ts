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

export default defineComponent({
  name: 'MMSM34LG1S2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    xrEfDialog
  },
  setup: () => {
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    const initializeService = '';
    // 变量定义
    formName = 'MMSM34LG1S2N';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const grid_view_1 = ref('');
    const gridToolbar: Ref<any[]> = ref([]);
    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({});
    const LayoutGroupFilter = 'LayoutGroupFilter';
    const gridView_line1 = ref('GridView1');

    const flag = ref('T');
    const dialogVisible = ref<boolean>(false);
    // 获取tab页组件的ref和实例
    const kendoTabStrip = ref<any>(null);
    /* let popFreeADDU: ErPopFreeHelper;
    let popFreeMAT_SCORE: ErPopFreeHelper; */

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition;
      //formName = efFormInfo.value.formName; // 当前画面名
      // 初始化低代码工具类
      initializePage();
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;        
        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          //设置grid不可编辑
          erFormHelper.setGridEditable(grid_view_1.value, false);
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {

    });    

    const erGrid1Ready = () => {
      erFormHelper.setGridEditable(grid_view_1.value, false);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    //查询铸坯信息
    const getSubGridLine = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiBlock.addColumn('QUERY_DIV', 'TPSSM81'); //传表名
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('tpssm81f2_inq', eiInfo);
      console.log(outInfo)
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_line1.value);
      }
    };
    
    //查询
    const F2_DO = async (e: any) => {      
      getSubGridLine();
    };
    return {
      dialogFormName,
      dialogVisible,
      erGrid1Ready,
      efFormReady,
      erFormHelper,
      initializeFlag,
      gridToolbar,
      LayoutGroupFilter,
      gridView_line1,
      kendoTabStrip,
      parentInfo,
      F2_DO
    };
  }
});
