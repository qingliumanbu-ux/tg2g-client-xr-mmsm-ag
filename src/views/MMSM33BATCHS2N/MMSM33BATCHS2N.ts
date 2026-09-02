import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
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
  name: 'MMSM33BATCHS2N',
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
    const gridView_tab2 = ref('gridView_m');
    let LayoutGroupFilter = 'LayoutGroupFilter';

    const initializeService = '';
    const tabActiveKey = ref('tab1');
    let i_proc_div = '';
    let cs_OkClick = '';
    let popFreeEdit: ER.PopFreeHelper;
    let grid_tab = '';

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
    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    // 变量定义
    const initializeFlag = ref(0);
    let dt_key = new EI.EiBlock();

    const i_factory_div = 'LG1';

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
      grid_main = erFormHelper.getGrid(gridView_tab1.value);
      erFormHelper.setGridToolbarVisible(gridView_tab1.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const handleTabChange = (activeKey: string) => {
      if (activeKey === 'tab1') {
        query_main();
      } else if (activeKey === 'tab2') {
        //getSubGridProd();
        query();
      }
    };

    //自定义模板参数
    const popFreeEdit_pars = async (Click_name: string) => {
      // popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM39_LAYOUT_DIALOG');
      if (cs_OkClick === 'F3') {
        //popFreeEdit.AllowEidt = true;
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM39_LAYOUT_DIALOG1');
      }
      if (cs_OkClick === 'F4') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM39_LAYOUT_DIALOG2');
      }
    };

    //弹出界面OK按钮点击事件
    const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
      let i_service: any;
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();

      if (cs_OkClick === 'F3') {
        i_service = '';
      } else if (cs_OkClick === 'F4') {
        i_service = '';
      }

      inInfo.addBlock(
        erFormHelper.convertModelAsBlock(e.dataModel, {
          FACTORY_DIV: i_factory_div,
          PRO_DIV: i_proc_div
        }),
        'PARA'
      );

      if (inInfo.getBlock('PARA').data[0]['MAT_NO'] == '') {
        erFormHelper.messageWarning('材料号不能为空!');
        return;
      }

      const mainGridCheckedRow = erFormHelper.getGridSelectRowsAsBlock('GridView1');
      inInfo.addBlock(mainGridCheckedRow, 'TMMSM01');

      console.log('inInfo', inInfo);

      outInfo = await erFormHelper.callService(i_service, inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query();
    };

    const F2_DO = async () => {
      query_main();
      //query();
    };

    // const query = async () => {
    //   const inInfo = new EI.EIInfo();
    //   const filter_condition = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter', {});
    //   inInfo.addBlock(filter_condition);
    //   const eiBlock_page = new EI.EiBlock();
    //   eiBlock_page.pushData(
    //     {
    //       RecordFrom: 0,
    //       PageSize: 500
    //     },
    //     true
    //   );
    //   //inInfo.addBlock(eiBlock_page, 'PageInfo');
    //   inInfo.addBlock(eiBlock_page, 'PageInfo');
    //   const outInfo = await erFormHelper.callService(i_service_f2, inInfo, false, true, true);
    //   // erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'GridView1');
    //   erFormHelper.mergeDataToGrid(outInfo, gridView_tab1.value);

    //   if (outInfo.sys.status < 0) {
    //     erFormHelper.messageError(outInfo.msg);
    //     return false;
    //   } else {
    //     erFormHelper.mergeDataToGrid(outInfo, gridView_tab2.value);
    //   }
    // };

    const query_main = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiBlock.addColumn('TABLE_TYPE', 'TPSSM03'); //传表名
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('mmsm33batch_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_tab1.value);
      }
    };

    const query = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiBlock.addColumn('TABLE_TYPE', 'TPSSM03'); //传表名
      eiInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService('mmsm33batch_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_tab2.value);
      }
    };

    //F3点击事件：新增
    const F3_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条需要新增的铸坯记录！');
        return;
      }
      const eiInfo = new EI.EIInfo();
      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRowsAsBlock('GridView1');
      eiInfo.addBlock(mainGridCheckedRow);
      const outInfo = await erFormHelper.callService('mmsm33cut_batch', eiInfo, false, false, true);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.messageSuccess('处理成功');
        query_main();
      }
    };

    //F4点击事件：修改
    const F4_DO = async (e: any) => {
      /* const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('gridView_m').length === 0) {
        erFormHelper.messageWarning('请选择一条需要修改的改切记录！');
        return;
      }
      new Date();
      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('gridView_m', true)[0];
      cs_OkClick = 'F4';
      i_proc_div = 'U';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow, {
        MAT_NO: true,
        PRINT_NO: true
      });
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick); */
    };

    //F5点击事件：删除
    const F5_DO = async (e: any) => {
      /*  const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('gridView_m').length === 0) {
        erFormHelper.messageWarning('请选择一条需要删除的记录！');
        return;
      }

      inInfo.addBlock(
        erFormHelper.getGridSelectRowsAsBlock('gridView_m', {
          PRO_DIV: 'D',
          FACTORY_DIV: i_factory_div
        }),
        'PARA'
      );

      const mes_res = await erFormHelper.messageConfirm('选中的记录将被永久删除, 是否继续？');
      if (!mes_res) {
        return false;
      }

      const outInfo = await erFormHelper.callService('', inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      query(); */
    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      LayoutGroupFilter,
      gridView_tab1,
      gridView_tab2,
      F2_DO,
      erGrid1Ready,
      handleTabChange,
      tabActiveKey,
      F3_DO,
      F4_DO,
      F5_DO
    };
  }
});
