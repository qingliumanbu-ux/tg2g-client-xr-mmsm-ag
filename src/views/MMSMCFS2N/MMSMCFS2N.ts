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
import { PopQueryReturnInfo, PopFreeReturnInfo } from 'ERX/er-type';

export default defineComponent({
  name: 'MMSMCFS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    ErPopFree,
    ErPopQuery
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: '';
    let PROGRAM_NAME: string;
    let i_form_ename = ''; // 低代码配置画面布局名
    let popFreeEdit: ER.PopFreeHelper;
    let gridView1: any;
    let gridView2: any;
    let gridView3: any;
    let gridView4: any;
    let gridView5: any;
    let gridView6: any;
    const grid_View_1 = ref('GridView1');
    const grid_View_2 = ref('GridView2');
    const grid_View_3 = ref('GridView3');
    const grid_View_4 = ref('GridView4');
    const grid_View_5 = ref('GridView5');
    const grid_View_6 = ref('GridView6');
    const initializeService = '';

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
      gridView1 = erFormHelper.getGrid(grid_View_1.value);
      erFormHelper.setGridToolbarVisible(grid_View_1.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid(grid_View_2.value);
      erFormHelper.setGridToolbarVisible(grid_View_2.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid5Ready = () => {
      gridView5 = erFormHelper.getGrid(grid_View_5.value);
      erFormHelper.setGridToolbarVisible(grid_View_5.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid3Ready = () => {
      gridView3 = erFormHelper.getGrid(grid_View_3.value);
      erFormHelper.setGridToolbarVisible(grid_View_3.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid4Ready = () => {
      gridView4 = erFormHelper.getGrid(grid_View_4.value);
      erFormHelper.setGridToolbarVisible(grid_View_4.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid6Ready = () => {
      gridView6 = erFormHelper.getGrid(grid_View_6.value);
      erFormHelper.setGridToolbarVisible(grid_View_6.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const popFreeEdit_pars = async () => {
      popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSMCF_DIALOG', 'MMSMCF_LAYOUT_DIALOG');
    };
    const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
      inInfo.addBlock(erFormHelper.convertModelAsBlock(e.dataModel));
      console.log('111111', inInfo);
      outInfo = await erFormHelper.callService('mmsm27cf_pro', inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
    };

    const F2_DO = async () => {
      query_ciew();
      query();
      queryth();
    };
    //数据区
    const query_ciew = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      inInfo.addBlock(eiBlock);
      const ZCBlock = inInfo.addBlock(new EI.EiBlock(), 'ZC');
      ZCBlock.addColumns('DIV');
      ZCBlock.addRow({
        DIV: 'ZC'
      });
      const outInfo = await erFormHelper.callService('mmsmaod_inq', inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_View_1.value);
      }
    };
    //查询重复数据
    const query = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      inInfo.addBlock(eiBlock);
      const CFBlock = inInfo.addBlock(new EI.EiBlock(), 'CF');
      CFBlock.addColumns('DIV');
      CFBlock.addRow({
        DIV: 'CF'
      });
      const outInfo = await erFormHelper.callService('mmsmaod_inq', inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_View_2.value);
      }
    };
    //查询跳区数据
    const queryth = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      inInfo.addBlock(eiBlock);
      const CFBlock = inInfo.addBlock(new EI.EiBlock(), 'TH');
      CFBlock.addColumns('DIV');
      CFBlock.addRow({
        DIV: 'TH'
      });
      const outInfo = await erFormHelper.callService('mmsmaod_inq', inInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_View_6.value);
      }
    };
    // 查询子表明细信息
    const queryDetailInfo = async (currentRowInfo: any) => {
      queryTmmsm12(currentRowInfo);
    };
    const queryDetailInfo1 = async (currentRowInfo: any) => {
      queryTmmsm2a(currentRowInfo);
      queryTmmsm2a1(currentRowInfo);
    };
    // 主表焦点行事件-查询子表明细信息
    const gridView1FocusChanged = async (e: any) => {
      if (!e.data) {
        erFormHelper.clearGridData(gridView3, gridView4, gridView5); // 清空子表数据
        return;
      }
      if (e && e.rowChanged) {
        if (e.data) {
          queryDetailInfo({
            L2_PROC_NO: e.data.get('L2_PROC_NO'),
            HEAT_NO: e.data.get('HEAT_NO'),
            STATION_ID: e.data.get('STATION_ID'),
            DEV_CODE: e.data.get('DEV_CODE')
          });
        }
      }
    };
    //获取工艺路线的焦点行
    const gridView3FocusChanged = async (e: any) => {
      if (!e.data) {
        erFormHelper.clearGridData(gridView4, gridView5); // 清空子表数据
        return;
      }
      if (e && e.rowChanged) {
        if (e.data) {
          queryDetailInfo1({
            L2_PROC_NO: e.data.get('L2_PROC_NO'),
            HEAT_NO: e.data.get('HEAT_NO'),
            STATION_ID: e.data.get('STATION_ID'),
            DEV_CODE: e.data.get('DEV_CODE')
          });
        }
      }
    };

    // 查询子表明细信息-加料
    const queryTmmsm2a = async (currentRowInfo: any) => {
      const eiInfo1 = new EI.EIInfo();
      const eiBlock1 = eiInfo1.addBlock(new EI.EiBlock());
      eiBlock1.pushData({ ...currentRowInfo, TABLE_TYPE: 'TMMSM2A' }, true);
      const outInfo = await erFormHelper.callService('mmsmg2a_inq', eiInfo1);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_View_4.value);
      }
    };
    // 查询分组子表明细信息-加料
    const queryTmmsm2a1 = async (currentRowInfo: any) => {
      const eiInfo1 = new EI.EIInfo();
      const eiBlock1 = eiInfo1.addBlock(new EI.EiBlock());
      eiBlock1.pushData({ ...currentRowInfo, TABLE_TYPE: 'TMMSM2A' }, true);
      const outInfo = await erFormHelper.callService('mmsmgy2a_inq', eiInfo1);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_View_5.value);
      }
    };
    // 查询工艺路线
    const queryTmmsm12 = async (currentRowInfo: any) => {
      const eiInfo1 = new EI.EIInfo();
      const eiBlock1 = eiInfo1.addBlock(new EI.EiBlock());
      eiBlock1.pushData({ ...currentRowInfo, TABLE_TYPE: 'TMMSM2A' }, true);
      const outInfo = await erFormHelper.callService('mmsmgylx_pro', eiInfo1);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError(outInfo.msg);
        return false;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_View_3.value);
      }
    };
    //维护修改
    const F3_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        return false;
      }
      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView1', true)[0];
      console.log('123', mainGridCheckedRow);
      popFreeEdit_pars();
      popFreeEdit.ReceiveData(mainGridCheckedRow);
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };
    const F4_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('GridView3').length === 0) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        return false;
      }
      console.log('11111');
      inInfo.addBlock(erFormHelper.getGridSelectRowsAsBlock('GridView3'), 'ADD');
      console.log('11111');
      const outInfo = await erFormHelper.callService('mmsmgylx_ins', inInfo, false, false, true);
      console.log('11111');
      if (outInfo?.sys.status < 0) {
        erFormHelper.messageError('确认失败' + outInfo.sys.msg);
        console.log('11111');
      } else {
        erFormHelper.messageSuccess('确认成功');
      }
    };

    return {
      erFormHelper,
      initializeFlag,
      grid_View_1,
      grid_View_2,
      grid_View_3,
      grid_View_4,
      grid_View_5,
      grid_View_6,
      efFormReady,
      erGrid6Ready,
      erGrid5Ready,
      F2_DO,
      F3_DO,
      F4_DO,
      erGrid1Ready,
      erGrid2Ready,
      gridView1FocusChanged,
      gridView3FocusChanged,
      erGrid3Ready,
      erGrid4Ready
    };
  }
});
