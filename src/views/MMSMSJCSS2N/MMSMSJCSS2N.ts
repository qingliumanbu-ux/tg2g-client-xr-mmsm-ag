//本画面原作为实绩成分的树状加载的代码研究所用。后续暂无使用  mfj   2023.12.18
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

//import { TreeView } from '@progress/kendo-treeview-vue-wrapper';

export default defineComponent({
  name: 'MMSMSJCSS2N',
  components: {
    /* treeview: TreeView, */
    xrEfForm,
    xrEfPanel,
    xrEfSearchBox,
    xrEfDialog,
    /*  MMSMPOPV, */
    erGrid,
    erLayout
  },
  setup: () => {
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;
    // 获取画面的分区信息及设置画面初始化service

    const initializeService = '';

    // 变量定义
    formName = 'MMSMSJCSS2N';

    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    const initializeFlag = ref(0);
    let gridView1: any;
    const treeViewRef = ref<any>(null);

    //源数据
    const sourceData = ref();
    // 存放树形结构的值
    const treeData = ref();

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

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('GridView1');
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    onMounted(() => {
      //initializePage();
    });

    return {
      erGrid1Ready,
      erFormHelper,
      initializeFlag,
      efFormReady
    };
  }
});
