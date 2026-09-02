import { defineComponent, onMounted, ref, reactive, computed, nextTick, toRaw, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';

import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MMSMWTS2N',
  components: { xrEfForm, xrEfPanel, erGrid, erLayout },
  setup: () => {
    const efFormInfo = ref<{ [key: string]: any }>({});
    // const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    // 获取画面的分区信息及设置画面初始化service
    let PROGRAM_NAME: string;
    const initializeService = '';
    const gridToolbar: Ref<any[]> = ref([]);
    const detailTabsRef = ref<any>(null);
    /* const detailTabsInstance = computed(() => {
      return detailTabsRef.value?.kendoWidget() as kendo.ui.TabStrip;
    }); */
    // 变量定义
    formName = 'MMSMWTS2N';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    let gridView1: any;
    const LayoutGroupFilter = ref('');

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      // efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      initializePage();
    };

    const queryMainGrid = async () => {
      if (!erFormHelper.checkRequiredInput('LayoutGroupFilter')) {
        return false;
      }
      //清空grid数据
      erFormHelper.clearGridData('gridView_m');
      const inInfo = new EI.EIInfo();
      //获取查询条件dt
      const Query = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');

      inInfo.addBlock(Query);
      const outInfo = await erFormHelper.callService('mmsmwt_inq', inInfo, false, false);
      console.log(outInfo.getBlock(0).data.length);
      if (outInfo.sys.status >= 0) {
        // 根据返回数据加载页面显示数据//需要和si配置的数据集的表一致
        erFormHelper.mergeEiBlockToGrid(outInfo.getBlock(0), gridView1);
      } else {
        erFormHelper.messageError(outInfo.sys.msg);
      }
    };

    const setToolbarVisible = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, {
        addrow: visible,
        copyrow: visible /* ,
        delete: visible */
      });
    };
    const setToolbarVisible1 = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, { delete: visible });
    };
    const InitialToolbar = () => {
      /*  gridToolbar.value = erFormHelper.getGridToolbar([
        { name: 'excel', visible: true },
        { name: 'addrow', visible: false },
        { name: 'copyrow', visible: false },
        { name: 'delete', visible: false }
      ]); */
    };
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
          /*  gridView1 = erFormHelper.getKendoGrid('gridView_m'); */
          erFormHelper.setGridEditable('gridView_m', false);
          erFormHelper.setAllControlReadOnly;
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {
      //initializePage();
    });

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('GridView1');
      console.log('gridView1', gridView1);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const F2_DO = async (e: any) => {
      queryMainGrid();
    };
    const F3_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      //获取增删改行的数据
      const created = erFormHelper.getGridRowsAsBlock(gridView1, 'add');

      // 增加操作标记
      // const column1 = new EI.EiColumn();
      // column1.name = 'PROC_DIV';
      // column1.pos = 1;
      // column1.type = 'C';
      // created.addColumn(column1);
      // if (created.data.length > 0) {
      //   created.data[0]['PROC_DIV'] = 'I';
      // }
      eiInfo.addBlock(created);

      const outInfo = await erFormHelper.callService('mmsmwt_ins', eiInfo, false, false, true);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        return false;
      } else {
        // 隐藏工具栏按钮
        setToolbarVisible('gridView_m', false);
        erFormHelper.setGridEditable('gridView_m', false);
        queryMainGrid();
      }
    };
    const F3_PRE_DO = async (e: any) => {
      setToolbarVisible('gridView_m', true);
      erFormHelper.setGridEditable('gridView_m', true);
      //设置grid可编辑
    };
    const F3_CANCEL = async (e: any) => {
      setToolbarVisible('gridView_m', false);
      erFormHelper.setGridEditable('gridView_m', false);
      queryMainGrid();
    };
    const F4_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      //获取增删改行的数据
      const created = erFormHelper.getGridRowsAsBlock(gridView1, 'modify');
      const column1 = new EI.EiColumn();
      column1.name = 'PROC_DIV';
      column1.pos = 1;
      column1.type = 'C';
      created.addColumn(column1);
      if (created.data.length > 0) {
        created.data[0]['PROC_DIV'] = 'U';
      }
      eiInfo.addBlock(created);
      const outInfo = await erFormHelper.callService('mmsmwt_upd', eiInfo, false, false, true);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        return false;
      } else {
        // 隐藏工具栏按钮
        setToolbarVisible('gridView_m', false);
        erFormHelper.setGridEditable('gridView_m', false);
        queryMainGrid();
      }
    };
    const F4_PRE_DO = async (e: any) => {
      erFormHelper.setGridEditable('gridView_m', true);
    };
    const F4_CANCEL = async (e: any) => {
      erFormHelper.setGridEditable('gridView_m', false);
      queryMainGrid();
    };
    const F5_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView1).length === 0) {
        erFormHelper.messageWarning('请选择一条信息再删除');
      } else {
        // 删除提示
        const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
        if (confirm) {
          const eiInfo = new EI.EIInfo();
          const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock(gridView1, {
            // FACTORY_DIV: pagePara.factory_div,
            // STATION_ID: pagePara.station_id,
            PROC_DIV: 'D'
          });
          const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
          const outInfo = await erFormHelper.callService('mmsmwt_del', eiInfo, false, false, true);
          if (outInfo.sys.status < 0) {
            erFormHelper.messageError('删除失败:' + outInfo.sys.msg);
          } else {
            erFormHelper.messageSuccess('删除成功');
            erFormHelper.setGridEditable('gridView_m', false);
            queryMainGrid();
          }
        }
      }
    };
    const F5_PRE_DO = async (e: any) => {
      setToolbarVisible1('gridView_m', true);
    };
    const F5_CANCEL = async (e: any) => {
      setToolbarVisible1('gridView_m', false);
      queryMainGrid();
    };
    return {
      erGrid1Ready,
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO,
      F3_DO,
      F3_PRE_DO,
      F3_CANCEL,
      F4_DO,
      F4_PRE_DO,
      F4_CANCEL,
      F5_DO,
      F5_PRE_DO,
      F5_CANCEL,
      gridView1,
      LayoutGroupFilter,
      gridToolbar
    };
  }
});
