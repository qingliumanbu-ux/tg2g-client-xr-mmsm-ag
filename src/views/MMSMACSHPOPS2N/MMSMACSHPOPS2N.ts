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
import { CellValueChangedEvent, Logger } from '@ag-grid-community/core';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import { RefSymbol } from '@vue/reactivity';
import { Console } from 'console';

export default defineComponent({
  name: '详细信息',
  components: { xrEfForm, xrEfPanel, erLayout, erGrid },
  props: {
    openInDialog: {
      type: Boolean,
      default: false
    },
    dialogFormName: {
      type: String,
      default: '详细信息'
    },
    parentInfo: {
      type: Object
    }
  },
  // 向父画面传递数据-注册emit监听事件
  emits: ['getChildInfo'],
  setup: (props, { emit }) => {
    // 变量定义
    let formParams: any = '';
    let formPartition: any = '';
    const initializeService = '';
    let formName = ''; // 当前画面名
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    const initializeFlag = ref(0);
    let gridView1: any;
    const grid_view_1 = ref('');
    let gridApi: any;

    // 获取画面相关配置信息
    /* const efFormInitialized = (formInfo: any) => {
      formParams = formInfo;
      formPartition = formParams.formPartition;
      formName = formParams.formName;
      nextTick(() => {
        initializePage();
      });
    }; */
    const parentInfo = ref(props.parentInfo); // 获取父画面传入参数

    console.log('parentInfo', parentInfo.value);

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition;
      formName = efFormInfo.value.formName; // 当前画面名
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
          erFormHelper.stopGridEditing('gridView1', () => {
            erFormHelper.mergeEiBlockToGrid(props.parentInfo?.mainData, 'gridView1');
          });
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {
      //initializePage();
    });

    //修改时事件回调的函数
    const cellValueChangedHandler = (e: CellValueChangedEvent) => {
      gridApi.removeEventListener('cellValueChanged', cellValueChangedHandler);
      //e.node.setDataValue('', '');
      // e.oldValue为旧值
      // e.newValue为新值
      // e.colDef.field为当前点击单元格的列名
      // e.rowIndex为当前点击单元格的行号
      // e.type为当前点击的类型
      //const toolbarPanel = gridApi.value.getStatusPanel('');
      if (e.colDef.field == 'PRODUCT_FLAG') {
        //F3收货时修改收货时刻
        const selectNode = gridApi.getSelectedNodes();
        console.log('4356', selectNode, e, e.data, e.colDef.field);
        selectNode.forEach((row: any) => {
          console.log('123r254', row.data, row.setDataValue('PRODUCT_FLAG', e.newValue));
        });
      }

      gridApi.addEventListener('cellValueChanged', cellValueChangedHandler);
    };

    const erGrid1Ready = (e: any) => {
      gridApi = e.api;
      gridApi.addEventListener('cellValueChanged', cellValueChangedHandler);
      gridView1 = erFormHelper.getGrid('GridView1');
      erFormHelper.setGridEditable(grid_view_1.value, false);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    // 新增时进入画面查询

    const F2_DO = async (e: any) => {
      erFormHelper.stopGridEditing('gridView1', async () => {
        const eiInfo = new EI.EIInfo();
        const eiBlock = erFormHelper.getGridAllRowsAsBlock('gridView1');
        eiInfo.addBlock(eiBlock);
        console.log('layoutControlGroup1', eiBlock);

        console.log('eiInfo', eiInfo);
        const outInfo = await erFormHelper.callService('mmsmacshf4_pro', eiInfo, true, false, true);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
          return false;
        } else {
          erFormHelper.messageSuccess('保存成功');
          closeEfDialog();
        }
      });
      /*  const outInfo = await erFormHelper.callService('mmsm36_pro', eiInfo, false, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.messageSuccess('保存成功');
        closeEfDialog();
      } */
    };

    // 点击关闭按钮，绑定事件closeEfDialog
    // 向父画面传递数据-触发emit方法向父传递数据，并在emits中注册事件名
    const closeEfDialog = () => {
      const data = {
        // name: formName,
        close: true
      };
      emit('getChildInfo', data);
    };

    return {
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO,
      /*  efFormInitialized, */
      closeEfDialog,
      erGrid1Ready
    };
  }
});
