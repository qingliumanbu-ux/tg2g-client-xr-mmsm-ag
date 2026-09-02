/* eslint-disable no-use-before-define */
import { defineComponent, onMounted, ref, reactive, computed, nextTick, toRaw, Ref, resolveTransitionHooks } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import xrEfDialog from 'EFX/xrEfDialog';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import EFCallForm from 'EFX/EFCallForm';
import ErPopFree from 'ERX/ErPopFree';
import ErPopQuery from 'ERX/ErPopQuery';
import { PopQueryReturnInfo, PopFreeReturnInfo } from 'ERX/er-type';
import MMSM67CARPOPS2N from '../MMSM67CARPOPS2N/MMSM67CARPOPS2N.vue';

import { useRoute } from 'vue-router';
import { Console } from 'console';

export default defineComponent({
  name: 'MMSM67CARS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    ErPopFree,
    xrEfDialog,
    MMSM67CARPOPS2N,
    erGrid,
    EFCallForm
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    console.log('开始');
    const efFormInfo = ref<{ [key: string]: any }>({});

    let formPartition: string;

    let formName_Now: string;
    const initializeService = ''; //画面布局配置获取
    // WMSMQUERY1

    // 变量定义
    const formName = 'MMSM67CARS2N';
    const keyStr = '';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const layout = ref();
    const gridview = ref(); //主表
    const gridview1 = ref(); //子表
    const mainviewName = ref('');
    const subviewName = ref('');
    const dialogVisible = ref(false);
    const dialogFormName = ref('');
    const dialogFormNametile = ref('');
    const parentInfo = ref({});
    const xrEfDialogRef = ref<any>(null);
    const xrEfDialogRefBath = ref<any>(null);
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      // efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName_Now = efFormInfo.value.formName; // 当前画面名
      layout.value = 'LayoutGroupFilter';
      gridview.value = 'GridView1';
      gridview1.value = 'GridView2';
      console.log('dfghyuiop', layout, gridview, gridview1, String(formName_Now), efFormInfo);
      console.log('dfghyuiop', efFormInfo.value.formPartition);
      // if (efFormInfo.value.formParams?.MainviewName)
      //   mainviewName.value = efFormInfo.value.formParams['MainviewName'];
      // console.log('mainviewName', efFormInfo.value.formParams['MainviewName'].toString());
      // if (efFormInfo.value.formParams?.SubviewName)
      //   subviewName.value = efFormInfo.value.formParams['SubviewName'];

      initializePage();
    };

    // console.log('subviewName', subviewName);
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

    onMounted(() => {
      //initializePage();
    });
    // 查询主表明细信息
    const queryMainGrid = async () => {
      //清空grid数据
      console.log('F2查询开始');
      erFormHelper.clearGridData(gridview.value);
      const inInfo = new EI.EIInfo();
      //获取查询条件dt
      const Query = erFormHelper.getAllControlValueAsEiBlock(layout.value);
      inInfo.addBlock(Query);
      console.log('inInfo', inInfo);
      const service_name = 'mmsm67car_inq';
      const outInfo = await erFormHelper.callService(service_name, inInfo, false, false);
      console.log(outInfo.getBlock(0).data.length);
      if (outInfo.sys.status >= 0) {
        // 根据返回数据加载页面显示数据//需要和si配置的数据集的表一致
        erFormHelper.mergeEiBlockToGrid(outInfo.getBlock(0), gridview.value);
        erFormHelper.setGridEditable(gridview.value, false);
      } else {
        erFormHelper.messageError(outInfo.sys.msg);
      }
    };
    // 查询子表明细信息
    const queryDetailInfo = async (currentRowInfo: any) => {
      //

      const eiInfo4 = new EI.EIInfo();
      const eiBlock4 = new EI.EiBlock();
      // eiInfo4.addBlock(ErUtils.buildEiBlock(currentRowInfo));
      eiInfo4.addBlock(eiBlock4);
      eiBlock4.pushData({ ...currentRowInfo }, true);
      console.log('eiInfo4', eiInfo4);
      console.log('currentRowInfo', currentRowInfo);
      const service_name = 'mmsm67loadcar_inq';
      const outInfo4 = await erFormHelper.callService(service_name, eiInfo4, false, false);
      if (outInfo4.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo4.sys.msg);
      } else {
        // erFormHelper.messageInfo("123");
        erFormHelper.mergeEiBlockToGrid(outInfo4.getBlock(0), gridview1.value);
        erFormHelper.setGridEditable(gridview1.value, false);
      }
    };

    // 主表焦点行事件-查询子表明细信息
    const GridView1FocusChanged = async (e: any) => {
      if (e) {
        if (e.data && e.rowChanged) {
          if (e.data) {
            const currentRow = erFormHelper.getGridCurrentRow(gridview.value, true, true);
            console.log('currentRow', currentRow);
            // erFormHelper.messageInfo(currentRow["PURCHASEDOCID"]);
            queryDetailInfo(currentRow);
          }
        }
      }
    };
    const F2_DO = async (e: any) => {
      queryMainGrid();
    };
    const F3_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridview.value).length === 1) {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridview.value, true)[0]; // 获取主表勾选行
        // erFormHelper.messageInfo(mainGridCheckedRow.STATUS);
        if (mainGridCheckedRow.STATUS === '0') {
          erFormHelper.messageInfo('交料单先上传资源系统，才有配车信息！');
          return;
        }
        if (mainGridCheckedRow.STATUS === '2') {
          erFormHelper.messageInfo('交料申请已经关闭，不能再装车！');
          return;
        }
        //openUPDialog(mainGridCheckedRow);
        // 使用框架弹窗组件EFDialogForm
        // erFormHelper.messageInfo(mainGridCheckedRow.PURCHASEDOCID);
        openADDUDialog(mainGridCheckedRow);

        // const eiBlock =
        //   erFormHelper.getAllControlValueAsEiBlock("LayoutGroupFilter");
        // erFormHelper.reloadDropDownDataSource(
        //   "LayoutGroupFilter",
        //   "QUALITY_BATCH_NO",
        //   eiBlock
        // );
      } else {
        // openADDialog();
      }
    };
    const F4_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridview1.value).length === 1) {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridview1.value, true)[0];
        if (mainGridCheckedRow['UNLOAD_STATE'] != '0') {
          erFormHelper.messageInfo('已经上传装车信息，不能卸车！');
          return false;
        }
        const inInfo = new EI.EIInfo();
        const eiBlock1 = new EI.EiBlock();
        inInfo.addBlock(eiBlock1, 'MMSM67_UNLOADCAR');
        eiBlock1.pushData({ ...mainGridCheckedRow }, true);
        // inInfo.addBlock(
        //   erFormHelper.convertModelAsBlock(mainGridCheckedRow),
        //   'MMSM67_UNLOADCAR'
        // );
        // erFormHelper.messageInfo(inInfo.getBlock(0).name);

        const outInfo = await erFormHelper.callService('mmsm67loadcar_pro', inInfo, false, false);
        // erFormHelper.messageInfo(inInfo.getBlock(0).name);
        if (outInfo.sys.status >= 0) {
          erFormHelper.messageSuccess();
          const data1 = {
            PURCHASEDOCID: mainGridCheckedRow.PLAN_NO
          };
          queryDetailInfo(data1);
        } else {
          erFormHelper.messageError(outInfo.sys.msg);
        }
      }
    };
    const F5_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridSelectRows('GridView2').length === 0) {
        erFormHelper.messageWarning('请选择一条信息再操作');
        return false;
      }

      const alldata = erFormHelper.getGridSelectRows('GridView2');

      let plan_no = '';
      for (let item1 of erFormHelper.getGridSelectRows('GridView2')) {
        plan_no = item1.PLAN_NO;
        if (item1.UNLOAD_STATE === '1' || item1.UNLOAD_STATE === '2') {
          erFormHelper.messageWarning(item1.PRACTICE_NO + '该信息已经发送物流系统！');
          return false;
        }
      }

      inInfo.addBlock(erFormHelper.getGridSelectRowsAsBlock('GridView2', { DEAL_FLAG: 'I' }), '21A009');
      // console.log(inInfo.getBlock(0));
      // console.log(inInfo.blocks["21A009"]);
      const outInfo = await erFormHelper.callService('mmsm67car_snd', inInfo, false, false);
      if (outInfo.sys.status >= 0) {
        erFormHelper.messageSuccess('发送成功');
        const data1 = {
          PURCHASEDOCID: plan_no
        };
        queryDetailInfo(data1);
      } else {
        erFormHelper.messageError(outInfo.sys.msg);
      }
    };
    const F6_DO = async (e: any) => {
      const li = '2378.83339';
      const num = Number(li);
      console.log(num);

      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridSelectRows('GridView2').length === 0) {
        erFormHelper.messageWarning('请选择一条信息再操作');
        return false;
      }
      const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
      if (!confirm) {
        return false;
      }

      let plan_no = '';
      for (let item1 of erFormHelper.getGridSelectRows('GridView2')) {
        plan_no = item1.PLAN_NO;
        console.log(item1.BACK11);
        const li = parseFloat(item1.BACK11);

        if (parseFloat(item1.BACK11.trim()) > 0 || item1.MAT_WT > 0) {
          erFormHelper.messageWarning(item1.PRACTICE_NO + '已经计量，不能取消！');
          return false;
        }

        if (item1.UNLOAD_STATE === '0' || item1.UNLOAD_STATE === '2') {
          erFormHelper.messageWarning(item1.PRACTICE_NO + '该信息已经发送物流系统！');

          return false;
        }

        erFormHelper.setGridRowData('GridView2', item1, { DEAL_FLAG: 'D' });
      }

      inInfo.addBlock(erFormHelper.getGridSelectRowsAsBlock('GridView2'), '21A009');
      // console.log(inInfo.getBlock(0));
      // console.log(inInfo.blocks["21A009"]);
      const outInfo = await erFormHelper.callService('mmsm67car_snd', inInfo, false, false);
      if (outInfo.sys.status >= 0) {
        erFormHelper.messageSuccess('发送成功');
        const data1 = {
          PURCHASEDOCID: plan_no
        };
        queryDetailInfo(data1);
      } else {
        erFormHelper.messageError(outInfo.sys.msg);
      }
    };
    // 关闭弹框监听
    const xrEfDialogClose = () => {
      // console.log('fdfgj')
      // queryMainGrid();
    };
    // 获取弹窗画面传递过来的数据 新增
    const getChildInfo = (info: any) => {
      console.log(info);
      if (info.close) {
        // xrEfDialogRef.value.close(); // 关闭弹框
        dialogVisible.value = false;
      }
      // erFormHelper.messageInfo(info.PLAN_NO);
      if (info.PLAN_NO != '') {
        const data1 = {
          PURCHASEDOCID: info.PLAN_NO
        };
        queryDetailInfo(data1);
      }
    };
    const openXrEfDialog = () => {
      dialogVisible.value = true;
      // proc_div = PROC_DIV;
    };

    const openADDUDialog = (currentRow: any) => {
      let PLAN_NO = currentRow.PURCHASEDOCID;
      console.log(PLAN_NO);
      const data = {
        PLAN_NO: PLAN_NO
      };
      // erFormHelper.messageInfo(PLAN_NO);
      dialogFormName.value = 'MMSM67CARPOPS2N'; // 读配置表获取画面名
      dialogFormNametile.value = '车辆';
      dialogVisible.value = true;
      parentInfo.value = data;

      openXrEfDialog();
    };
    return {
      erFormHelper,
      initializeFlag,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      F6_DO,
      layout,
      gridview,
      gridview1,
      GridView1FocusChanged,
      mainviewName,
      subviewName,
      efFormReady,
      dialogFormName,
      dialogFormNametile,
      parentInfo,
      xrEfDialogRef,
      dialogVisible,
      getChildInfo,
      xrEfDialogClose,
      openXrEfDialog
    };
  }
});
