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
import ErPopQuery from 'ERX/ErPopQuery';
import { PopQueryReturnInfo, PopFreeReturnInfo } from 'ERX/er-type';

export default defineComponent({
  name: 'MMSM12QYS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    xrEfDialog,
    ErPopFree,
    ErPopQuery
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let i_form_ename = ''; // 低代码配置画面布局名
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;
    const initializeService = '';
    const grid_view_1 = ref('GridView1');
    const grid_view_2 = ref('GridView2');
    let gridView1: any;
    let gridView2: any;

    // 变量定义
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const gridToolbar: Ref<any[]> = ref([]);
    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({}); // 给弹出画面传入数据
    let popFreeF8: ER.PopFreeHelper;

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
      if (formName === 'MMSM12QYS2N') {
        popFreeF8 = new ER.PopFreeHelper(formPartition, 'MMSM12', 'LayoutPop_F8');
      }
      initializePage();
    };
    const dialogVisible = ref<boolean>(false);
    // 弹框ref
    const xrEfDialogRef = ref<any>(null);
    // 点击按钮打开弹框
    const openXrEfDialog = (PROC_DIV: string) => {
      dialogVisible.value = true;
    };
    // 关闭弹框监听
    const closeXrEfDialog = () => {
      queryMainGrid(); // 关闭弹框后查询主表
    };

    // 获取值：获取事件参数为传递的数据
    const getChildInfo = (info: any) => {
      console.log('获取弹窗画面传递过来的信息', info);
      if (info.close) {
        dialogVisible.value = false; // 关闭弹框
        closeXrEfDialog();
      }
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
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    // 自定义工具栏按钮功能
    const InitialToolbar = () => {
      erFormHelper.initialGridToolbar(grid_view_1.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false }
      });
      erFormHelper.initialGridToolbar(grid_view_2.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false }
      });
    };

    //grid实例
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid(grid_view_1.value);
      console.log('grid_view_1', grid_view_1);
      erFormHelper.setGridToolbarVisible(grid_view_1.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid(grid_view_2.value);
      erFormHelper.setGridToolbarVisible(grid_view_2.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    // 打开弹出画面
    const openADDUDialog = (currentRow: any) => {
      const HEAT_NO = currentRow.HEAT_NO;
      const PROC_NO = currentRow.PROC_NO;
      const data = {
        PROC_DIV: 'U',
        HEAT_NO: HEAT_NO,
        PROC_NO: PROC_NO
      };
      dialogFormName.value = 'MMSM12QYDK'; // 读配置表获取画面名
      console.log(dialogFormName.value);
      dialogVisible.value = true;
      parentInfo.value = data;
      openXrEfDialog('U');
    };

    // 查询主表炉次信息
    const queryMainGrid = async () => {
      const eiInfo = new EI.EIInfo();
      const queryConditionEiBlock: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock('layoutControlGroup1', {
        // FACTORY_DIV: pagePara.factory_div,
        FACTORY_DIV: ' ',
        TABLE_TYPE: 'TMMSM12'
      });
      eiInfo.addBlock(queryConditionEiBlock);
      const outInfo = await erFormHelper.callService('mmsm12qys2nf2_inq', eiInfo, true, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_view_1.value, true);
      }
    };
    // 查询子表明细信息
    const queryDetailInfo = async (currentRowInfo: any) => {
      // 成分信息
      const eiInfo4 = new EI.EIInfo();
      const eiBlock4 = eiInfo4.addBlock(new EI.EiBlock());
      eiBlock4.pushData({ ...currentRowInfo, TABLE_TYPE: 'TQMTS25' }, true);
      const outInfo4 = await erFormHelper.callService('', eiInfo4, true, false, true);
      if (outInfo4.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo4.sys.msg);
      } else {
        erFormHelper.mergeDataToLayoutOrGrid(outInfo4, true, grid_view_2.value);
      }
    };

    // 主表焦点行事件-查询子表明细信息
    const GridView1FocusChanged = async (e: any) => {
      if (!e.data) {
        erFormHelper.clearGridData('GridView2'); // 清空子表数据
        return;
      }
      if (e && e.rowChanged) {
        if (e.data) {
          queryDetailInfo({
            TPD_NO: e.data.get('TPD_NO'),
            IRON_LADLE_NO: e.data.get('IRON_LADLE_NO')
          });
        }
      }
    };

    onMounted(() => {});

    const F2_DO = async (e: any) => {
      queryMainGrid();
    };
    const F3_DO = async (e: any) => {};
    const F3_PRE_DO = async (e: any) => {};
    const F3_CANCEL = async (e: any) => {};

    const F7_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      const eiInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条信息再确认');
        return false;
      }
      const mes_res = await erFormHelper.messageConfirm('选中的记录将进行倒完取消操作， 是否继续？');
      if (!mes_res) {
        return false;
      }

      // setToolbarVisible('GridView1', true);
      //获取增删改行的数据
      const created = erFormHelper.getGridCheckedRowsAsBlock('GridView1', {
        PROC_DIV: 'U'
      });

      eiInfo.addBlock(created);
      console.log(eiInfo);
      const outInfo = await erFormHelper.callService('mmsm12qys2nf7_upd', eiInfo, true, false, true);

      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('修改失败:' + outInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_view_1.value, true);
      }

      queryMainGrid();
    };
    const F7_PRE_DO = async (e: any) => {};
    const F7_CANCEL = async (e: any) => {};
    // const F8_DO = async (e: any) => {
    //   // 使用低代码弹窗组件ErPopFree
    //   popFreeF8.AllowEidt = true; // 设置为可编辑(文本框)
    //   ErPopUtils.showErPopFree(XrErPopFree, popFreeF8, async (event: PopFreeReturnInfo) => {
    //     const inInfo = new EI.EIInfo();
    //     inInfo.addBlock(erFormHelper.convertModelAsBlock(e.dataModel?.get('')));
    //     const outInfo = await erFormHelper.callService('mmsm12qys2nf8_upd', inInfo, false, true);

    //   });

    //   if (e.dataModel?.get('TPC_YL_NO1') === 'N' && e.dataModel?.get('TPC_YL_NO2') === 'N' && e.dataModel?.get('TPC_YL_NO3') === 'N' && e.dataModel?.get('TPC_YL_NO4') === 'N') {
    //       erFormHelper.messageWarning('鱼雷罐倒完标记均为N');
    //       return false;
    //   }

    // };

    const F8_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(grid_view_1.value).length === 0) {
        erFormHelper.messageWarning('请选择一条信息进行操作');
        return false;
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(grid_view_1.value, true)[0];
        console.log('mainGridCheckedRow', mainGridCheckedRow);

        openADDUDialog(mainGridCheckedRow);
      }
      popFreeF8.ReceiveData(erFormHelper.getGridCurrentRow('GridView1'));
      //自定义

      ER.PopUtils.showErPopFree(ErPopFree, popFreeF8, popFreeF8OkClick);
    };

    const popFreeF8OkClick = async (e: any) => {
      console.log('e', e);

      if (
        e.dataModel?.get('POUR_FLAG1').trim() === 'N' &&
        e.dataModel?.get('POUR_FLAG2').trim() === 'N' &&
        e.dataModel?.get('POUR_FLAG3').trim() === 'N' &&
        e.dataModel?.get('POUR_FLAG4').trim() === 'N'
      ) {
        erFormHelper.messageWarning('不能为N');
        return false;
      }
      if (e.dataModel?.get('TPC_YL_NO') === null) {
        erFormHelper.messageWarning('鱼雷罐号不能为空');
        return false;
      }
      if (e.dataModel?.get('IRON_NO') === null) {
        erFormHelper.messageWarning('铁次号不能为空');
        return false;
      }
      console.log('hahahha');
      const inInfo = new EI.EIInfo();
      inInfo.addBlock(erFormHelper.convertModelAsBlock(e.dataModel));
      const outInfo = await erFormHelper.callService('mmsm12qys2nf8_upd', inInfo, false, false);
      if (outInfo.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功');
        //queryMainGrid();
      } else {
        erFormHelper.messageError('处理错误:' + outInfo.sys.msg);
        return false;
      }
      queryMainGrid();
    };
    const F8_PRE_DO = async (e: any) => {};
    const F8_CANCEL = async (e: any) => {};

    return {
      erFormHelper,
      initializeFlag,
      gridToolbar,
      grid_view_1,
      grid_view_2,
      dialogVisible,
      dialogFormName,
      parentInfo,
      xrEfDialogRef,
      closeXrEfDialog,
      openXrEfDialog,
      efFormReady,
      erGrid1Ready,
      erGrid2Ready,
      GridView1FocusChanged,
      getChildInfo,
      F2_DO,
      F3_DO,
      F3_PRE_DO,
      F3_CANCEL,
      F7_DO,
      F7_PRE_DO,
      F7_CANCEL,
      F8_DO,
      F8_PRE_DO,
      F8_CANCEL
    };
  }
});
