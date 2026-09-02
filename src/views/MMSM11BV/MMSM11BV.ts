import { defineComponent, ref, reactive, nextTick, onMounted } from 'vue';
import { ER } from 'ERX/Er';
import { EI } from 'EIX/ei';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import xrEfSearchBox from 'EFX/xrEfSearchBox';
import xrEfDialog from 'EFX/xrEfDialog';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';

export default defineComponent({
  name: 'MMSM11BV',
  components: {
    xrEfForm,
    xrEfPanel,
    xrEfSearchBox,
    xrEfDialog,
    erGrid,
    erLayout
  },
  setup: () => {
    let formPartition = '';
    let formName = 'MMSM11BV';

    const initializeFlag = ref(0);
    const initializeService = '';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);

    //----- 升级框架更新内容 -------
    //xr-ef-form加载完成获取画面配置信息并初始化
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      //formName = efFormInfo.value.formName; // 当前画面名
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
          InitialToolbar();
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {});

    // 自定义工具栏按钮功能
    const InitialToolbar = () => {};

    // 查询按钮点击事件
    const F2_DO = async (e: any) => {
      queryGrid();
    };

    // 理论铁铲量查询
    const queryGrid = async () => {
      const inInfo = new EI.EIInfo();
      const filter_condition = erFormHelper.getAllControlValueAsEiBlock('query1', {});
      inInfo.addBlock(filter_condition);
      const eiBlock_page = new EI.EiBlock();
      eiBlock_page.pushData(
        {
          RecordFrom: 0,
          PageSize: 500
        },
        true
      );
      inInfo.addBlock(eiBlock_page, 'PageInfo');
      const outInfo = await erFormHelper.callService('mmsm11bv_inq', inInfo, false, true, true);
      erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'gridView1');
    };

    return {
      initializeFlag,
      erFormHelper,
      efFormReady,
      F2_DO
    };
  }
});
