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

export default defineComponent({
  name: 'MMSM11DCS2N',
  components: { xrEfForm, xrEfPanel, erLayout, erGrid, xrEfDialog },
  setup: () => {
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;
    // 获取画面的分区信息及设置画面初始化service
    const initializeService = '';

    // 变量定义
    formName = 'MMSM11DCS2N';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const gridToolbar: Ref<any[]> = ref([]);
    let gridView1: any;
    // 定义低代码弹出画面 - 新增、修改等
    /*   let popFreeF3: ErPopFreeHelper;
    let popFreeF4: ErPopFreeHelper;
    let popFreeF5: ErPopFreeHelper; // F12底吹氩 */

    if (formName == 'MMSM11DCS2N') {
      /*  popFreeF3 = new ErPopFreeHelper(formPartition, '', '');
      popFreeF4 = new ErPopFreeHelper(formPartition, '', '');
      popFreeF5 = new ErPopFreeHelper(formPartition, '', ''); */
    }

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition;
      // 初始化低代码工具类
      initializePage();
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        //InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    // 自定义工具栏按钮功能
    /*   const InitialToolbar = () => {
      gridToolbar.value = erFormHelper.getGridToolbar([
        { name: 'excel', visible: true },
        {
          name: 'addrow',
          visible: false
        },
        { name: 'copyrow', visible: false },
        { name: 'delete', visible: false }
        // { name: 'save', visible: false },
        // { name: 'cancel', visible: false }
      ]);
    }; */

    // 自定义grid工具栏按钮是否可用
    const setToolbarVisible = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, { addrow: visible, copyrow: visible, delete: visible });
    };

    // 查询主表炉次信息
    const queryMainGrid = async () => {
      const eiInfo = new EI.EIInfo();
      const queryConditionEiBlock: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock('layoutControlGroup1', {
        // FACTORY_DIV: pagePara.factory_div,
        FACTORY_DIV: ' ',
        TABLE_TYPE: 'TMMSM11'
      });
      eiInfo.addBlock(queryConditionEiBlock);
      const outInfo = await erFormHelper.callService('mmsm11dcs2nf2_inq', eiInfo, true, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToGrid(outInfo, 'GridView1', true);
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
    // 实绩保存-popFree中的确定按钮触发
    const gridsave_F3 = async (dataModel: any, PROC_DIV: string) => {};

    onMounted(() => {
      //initializePage();
    });

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
      erGrid1Ready,
      efFormReady,
      erFormHelper,
      initializeFlag,
      gridToolbar,
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
