import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import ErPopFree from 'ERX/ErPopFree';
import ErPopQuery from 'ERX/ErPopQuery';

export default defineComponent({
  name: '',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    ErPopFree
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
    formName = 'MMSM67S2N';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    let gridView1: any;

    //let popFreeEdit: ErPopFreeHelper;
    let cs_OkClick = '';
    let i_proc_div = '';

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition;
      // 初始化低代码工具类
      initializePage();
    };

    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          // gridView1 = erFormHelper.getKendoGrid('GridView1');
          // erFormHelper.setGridEditable('GridView1', true);
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {
      // initializePage();
    });

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('GridView1');
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    // 自定义工具栏按钮功能
    // const InitialToolbar = () => {
    //   gridToolbar.value = erFormHelper.getGridToolbar([
    //     { name: 'excel', visible: true },
    //     { name: 'addrow', visible: false },
    //     { name: 'copyrow', visible: false },
    //     { name: 'delete', visible: false },
    //     { name: 'save', visible: false, caption: 'save', event: SaveMainGrid },
    //     { name: 'cancel', visible: false },
    //     // { name: 'print', visible: true, caption: '查询' },
    //     { name: 'import', visible: true, caption: 'imp' },
    //   ]);
    // };

    const queryMainGrid = async () => {
      if (!erFormHelper.checkRequiredInput('LayoutGroupFilter')) {
        return false;
      }
      //清空grid数据
      erFormHelper.clearGridData(['GridView1']);

      const inInfo = new EI.EIInfo();
      //获取查询条件dt
      const Query = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');

      inInfo.addBlock(Query);
      //let ss = inInfo.blocks.Table1.data[0].START_TIME;
      //let ss = inInfo.blocks.Table1;
      let ss = inInfo.getBlock(0).data[0]['START_TIME'];
      console.log(ss);
      const outInfo = await erFormHelper.callService('mmsm67_inq', inInfo, false, false);
      console.log(outInfo.getBlock(0).data.length);
      if (outInfo.sys.status >= 0) {
        // 根据返回数据加载页面显示数据//需要和si配置的数据集的表一致
        erFormHelper.mergeEiBlockToGrid(outInfo.getBlock(0), gridView1);

        erFormHelper.setGridEditable('GridView1', false);
        // erFormHelper.messageInfo('SUCCESS');
      } else {
        erFormHelper.messageError(outInfo.sys.msg);
      }
    };

    const popFreeAdd = new ER.PopFreeHelper(efFormInfo.value.formPartition, 'MMSM67POP', 'MMSM67_POP_LAYOUT', '');

    const SaveMainGrid = async () => {
      const eiInfo = new EI.EIInfo();
      erFormHelper.getGridChangedRowsAsEiInfo(gridView1, eiInfo, 'MMSM11CV');

      if (
        !eiInfo.contains('MMSM11CV_DELETE') &&
        !eiInfo.contains('MMSM11CV_MODIFY') &&
        !eiInfo.contains('MMSM11CV_ADD')
      ) {
        erFormHelper.messageInfo('没有变更记录需要保存');

        // erFormHelper.unCheckAllGridRow(gridView1);
        // setToolbarVisible("MMSM11ListGridview", false);
        // erFormHelper.setGridEditable("MMSM11ListGridview",false);
        return false;
      }

      const outInfo = await erFormHelper.callService('mmsm11cv_iud', eiInfo, false, false, true);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        return false;
      } else {
        erFormHelper.messageSuccess('保存成功:' + outInfo.sys.msg);
        queryMainGrid();
      }
    };

    // const setToolbarVisible = (configId: string, visible: boolean) => {
    //   erFormHelper.setGridToolbarVisible(configId, [
    //     { name: 'addrow', visible: visible },
    //     { name: 'copyrow', visible: visible },
    //     { name: 'delete', visible: visible },
    //     { name: 'save', visible: visible },
    //     { name: 'cancel', visible: visible }

    //   ]);
    // };

    const F2_DO = async (e: any) => {
      queryMainGrid();
    };

    const F4_DO = async (e: any) => {
      if (erFormHelper.getGridSelectRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条信息再修改');
        return false;
      }

      for (let item1 of erFormHelper.getGridSelectRows('GridView1')) {
        if (item1.STATUS === '1' || item1.STATUS === '2') {
          erFormHelper.messageWarning(item1.PURCHASEDOCID + '该信息已经发送资源系统，不能修改！');
          return false;
        }
      }

      //加载弹窗配置
      cs_OkClick = 'F4';
      i_proc_div = 'U';
      const selectedRows = erFormHelper.getGridSelectRows('GridView1', false);
      console.log(selectedRows);
      popFreeAdd.ReceiveData(selectedRows[0]);
      ER.PopUtils.showErPopFree(ErPopFree, popFreeAdd, (e: any) => {
        if (popFreeAdd.getEvent('ok')) {
          popFreeEditOkClick(i_proc_div);
        }
      });
    };
    const popFreeEditOkClick = async (a: any) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
      let blockname = '';
      if (a == 'I') blockname = 'MMSM67_ADD';
      if (a == 'U') blockname = 'MMSM67_MODIFY';
      inInfo.addBlock(erFormHelper.convertModelAsBlock(popFreeAdd.DataModel), blockname);

      outInfo = await erFormHelper.callService('mmsm67_pro', inInfo, false, true);
      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功');
      }
      queryMainGrid();
    };

    const F3_DO = async (e: any) => {
      cs_OkClick = 'F3';
      i_proc_div = 'I';
      // erFormHelper.clearGridData(gridView1);
      let edmde: ER.Model = new ER.Model();
      popFreeAdd.ReceiveData(edmde);
      ER.PopUtils.showErPopFree(ErPopFree, popFreeAdd, (e: any) => {
        if (popFreeAdd.getEvent('ok')) {
          popFreeEditOkClick(i_proc_div);
        }
      });
    };

    const F5_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridSelectRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条信息再删除');
        return false;
      }

      const alldata = erFormHelper.getGridSelectRows('GridView1');

      // for (let i = 0; i < alldata.length; i++)
      // {
      //   const currdata = alldata[i];
      //   if (currdata.PURCHASEDOCID == '21PS6240202312070031')
      //   {
      //     erFormHelper.messageWarning(currdata.PURCHASEDOCID.trim().substr(0,6)+'THIS IS A TEST');
      //     return false;
      //       }

      // }

      for (let item1 of erFormHelper.getGridSelectRows('GridView1')) {
        if (item1.STATUS === '1' || item1.STATUS === '2') {
          erFormHelper.messageWarning(item1.PURCHASEDOCID + '该信息已经发送资源系统，不能删除！');
          return false;
        }
      }

      const mes_res = await erFormHelper.messageConfirm('选中的记录将被永久删除， 是否继续？');
      if (!mes_res) {
        return false;
      }

      // let inblock = erFormHelper.getGridSelectRowsAsBlock('gridView1');

      inInfo.addBlock(erFormHelper.getGridSelectRowsAsBlock('GridView1'), 'MMSM67_DELETE');
      const outInfo = await erFormHelper.callService('mmsm67_pro', inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        // erFormHelper.getGridServerPageData('gridView1');
        queryMainGrid();
      }
    };
    const F6_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridSelectRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条信息再操作');
        return false;
      }

      const alldata = erFormHelper.getGridSelectRows('GridView1');

      for (let item1 of erFormHelper.getGridSelectRows('GridView1')) {
        if (item1.STATUS === '1' || item1.STATUS === '2') {
          erFormHelper.messageWarning(item1.PURCHASEDOCID + '该信息已经发送资源系统！');
          return false;
        }
      }

      inInfo.addBlock(erFormHelper.getGridSelectRowsAsBlock('GridView1', { DEAL_FLAG: 'I' }), 'MMSM67_SND');
      const outInfo = await erFormHelper.callService('mmsm67_snd', inInfo, false, false);
      if (outInfo.sys.status >= 0) {
        // erFormHelper.getGridServerPageData('gridView1');
        erFormHelper.messageSuccess('发送成功');
        queryMainGrid();
        // console.log('111111');
      } else {
        erFormHelper.messageError(outInfo.sys.msg);
      }
    };
    const F6_PRE_DO = async (e: any) => {
      for (let item of erFormHelper.getGridAllRows('GridView1')) {
        if (item.PURCHASEDOCID.search('121PS6240202312') >= 0) {
          erFormHelper.checkGridRow('GridView1', item);
          // break;
        }
      }
    };
    const F6_CANCEL = async (e: any) => {
      erFormHelper.unCheckAllGridRow(gridView1);
    };
    const F7_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridSelectRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条信息再操作');
        return false;
      }

      const alldata = erFormHelper.getGridSelectRows('GridView1');

      for (let item1 of erFormHelper.getGridSelectRows('GridView1')) {
        if (item1.STATUS === '0' || item1.STATUS === '') {
          erFormHelper.messageWarning(item1.PURCHASEDOCID + '该信息没有发送，不需要关闭！');
          return false;
        }
        if (item1.STATUS === '2') {
          erFormHelper.messageWarning(item1.PURCHASEDOCID + '该信息已经关闭！');
          return false;
        }
      }

      inInfo.addBlock(erFormHelper.getGridSelectRowsAsBlock('GridView1', { DEAL_FLAG: 'C' }), 'MMSM67_SND');
      const outInfo = await erFormHelper.callService('mmsm67_snd', inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        // erFormHelper.getGridServerPageData('gridView1');
        erFormHelper.messageSuccess('成功');
      }
      queryMainGrid();
    };
    const F7_PRE_DO = async (e: any) => {};
    const F7_CANCEL = async (e: any) => {
      erFormHelper.unCheckAllGridRow(gridView1);
    };
    const LayoutGroupFilterQueryClick = (e: any) => {
      queryMainGrid();
    };
    return {
      erFormHelper,
      initializeFlag,
      erGrid1Ready,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      F6_DO,
      F6_PRE_DO,
      F6_CANCEL,
      F7_DO,
      F7_PRE_DO,
      F7_CANCEL,
      LayoutGroupFilterQueryClick,
      gridView1,
      efFormReady
    };
  }
});
