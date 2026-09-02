import { computed, defineComponent, onMounted, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import ErPopFree from 'ERX/ErPopFree';
import ErPopQuery from 'ERX/ErPopQuery';
import { PopQueryReturnInfo, PopFreeReturnInfo } from 'ERX/er-type';

export default defineComponent({
  name: 'MMSM68S2N',
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
    let formPartition: string;
    let formName: '';
    let PROGRAM_NAME: string;
    let i_form_ename = ''; // 低代码配置画面布局名
    let grid_view!: any;
    let popFreeEdit: ER.PopFreeHelper;
    const gridView = ref('GridView1');

    const initializeService = '';

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      console.log('formName', formName);
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
        nextTick(() => {});
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {});
    //grid实例
    const erGrid1Ready = () => {
      grid_view = erFormHelper.getGrid(gridView.value);
      erFormHelper.setGridToolbarVisible(gridView.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    // 自定义grid工具栏按钮是否可用
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
      const outInfo = await erFormHelper.callService('mmsm68_inq', inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView.value);
      }
    };

    const popFreeEdit_pars = async () => {
      popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM68_DIALOG', 'MMSM68_LAYOUT_DIALOG');
    };
    const popFreeEditOkClick = async (e: any) => {
      const inInfo = new EI.EIInfo();
      inInfo.addBlock(
        erFormHelper.convertModelAsBlock(e.dataModel, {
          PROC_DIV: 'I'
        })
      );
      console.log('111111', inInfo);
      const outInfo = await erFormHelper.callService('mmsm68_pro', inInfo, false, true);
      console.log('22222', outInfo);
      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query();
    };
    const F3_DO = async (e: any) => {
      popFreeEdit_pars();
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };
    const F4_DO = async (e: any) => {
      const selectedRows = erFormHelper.getGridSelectRowsAsBlock(grid_view);
      if (selectedRows.data.length === 0) {
        erFormHelper.messageInfo('请勾选数据行！');
        return;
      } else {
        // 删除提示
        const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
        if (confirm) {
          const eiInfo = new EI.EIInfo();
          const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock(gridView.value, {
            PROC_DIV: 'D'
          });
          eiInfo.addBlock(checkedRowEiBlock);
          const outInfo = await erFormHelper.callService('mmsm68_pro', eiInfo);
          if (outInfo.sys.status < 0) {
            erFormHelper.messageError('删除失败:' + outInfo.sys.msg);
          } else {
            erFormHelper.messageSuccess('删除成功');
            query();
          }
        }
      }
    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      F2_DO,
      gridView,
      erGrid1Ready,
      F3_DO,
      F4_DO
    };
  }
});
