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

import MMSM37POP from '../MMSM37POP/MMSM37POP.vue';
import { Console, log } from 'console';

export default defineComponent({
  name: 'MMSM37BPES2N',
  components: {
    MMSM37POP,
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    xrEfDialog
  },
  setup: () => {
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    // 获取画面的分区信息及设置画面初始化service
    /* const formParams = EFFormInfo.getFormParams(); */

    const initializeService = '';
    const tabActiveKey = ref('tab1');
    // 变量定义
    formName = 'MMSM37BPES2N';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const grid_view_1 = ref('');
    const grid_view_2 = ref('');
    let gridView1: any;
    let gridView2: any;
    let tabStrip1: any;
    const gridToolbar: Ref<any[]> = ref([]);
    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({});
    const LayoutGroupFilter = 'LayoutGroupFilter';
    const gridView_line1 = ref('GridView1');
    const gridView_line2 = ref('GridView2');

    //2024-02-19
    const gridView_tmmsm01 = ref('GridView1');

    const flag = ref('T');
    const isShow = ref<boolean>(false); // 是否显示新增、修改弹框
    const isShowUp = ref<boolean>(false); // 是否显示新增、修改弹框
    let pagePara: any; // 炼钢配置表页面参数
    const dialogVisible = ref<boolean>(false);
    // 获取tab页组件的ref和实例
    const kendoTabStrip = ref<any>(null);
    /* let popFreeADDU: ErPopFreeHelper;
    let popFreeMAT_SCORE: ErPopFreeHelper; */

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition;
      formName = efFormInfo.value.formName; // 当前画面名
      // 初始化低代码工具类
      initializePage();
    };

    // 自定义工具栏按钮功能
    /*  const InitialToolbar = () => {
      gridToolbar.value = erFormHelper.getGridToolbar([{ name: 'excel', visible: true }]);
    }; */

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        //初始化工具栏
        /*  InitialToolbar(); */

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          /* gridView1 = erFormHelper.getKendoGrid(grid_view_1.value);
          gridView2 = erFormHelper.getKendoGrid(grid_view_2.value); */

          //设置grid不可编辑
          erFormHelper.setGridEditable(grid_view_1.value, false);
          erFormHelper.setGridEditable(grid_view_2.value, false);

          // Tab页切换显示事件
          /*  tabStrip1 = (kendoTabStrip.value as TabStrip).kendoWidget() as kendo.ui.TabStrip;
          tabStrip1.bind('show', (e: any) => {
            if (tabStrip1.select()[0].id === 'tab_1') {
              getSubGridLine();
            } else {
              getSubGridProd();
            }
          }); */
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {
      /* initializePage(); */
      // handleEfDialogMessage(); // 接收弹出画面传入的数据
    });
    // 接收弹出画面传入的数据-在mounted中调用
    // const handleEfDialogMessage = () => {
    //   listenerMessageEvent((messageData: any) => {
    //     // 根据弹出画面传入的closeEfDialog关闭弹框
    //     if (messageData.closeEfDialog) {
    //       closeEfDialog();
    //     }
    //   });
    // };

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('GridView1');

      erFormHelper.setGridEditable(grid_view_1.value, false);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid('GridView2');

      erFormHelper.setGridEditable(grid_view_2.value, false);
      erFormHelper.setGridToolbarVisible('GridView2', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const handleTabChange = (activeKey: string) => {
      if (activeKey === 'tab1') {
        getSubGridLine();
      } else if (activeKey === 'tab2') {
        getSubGridProd();
      }
    };

    //查询铸坯信息
    const getSubGridLine = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiBlock.addColumn('QUERY_DIV', 'TMMSM01'); //传表名
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('mmsm34f2_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_line1.value);
      }
    };

    //查询修磨实绩
    const getSubGridProd = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiBlock.addColumn('QUERY_DIV', 'TMMSM34'); //传表名
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('mmsm34f2_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_line2.value);
      }
    };

    //查询
    const F2_DO = async (e: any) => {      
      getSubGridLine();
      getSubGridProd();
    };
    //初磨--内弧
    const F3_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView_line1.value).length === 0) {
        erFormHelper.messageWarning('未选择铸坯信息');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line1.value, true)[0]; // 获取主表勾选行
        const matActWt = mainGridCheckedRow.MAT_ACT_WT;
        const rcv = mainGridCheckedRow.RCV_MAT_FLAG;
        if(rcv=='N'){
          erFormHelper.messageWarning('本材料未收货，不能进行修磨处理');
          return;
        }
        if(rcv=='W'){
          erFormHelper.messageWarning('本材料等待产销系统处理反馈，不能进行修磨处理');
          return;
        }
        if(rcv=='E'){
          erFormHelper.messageWarning('本材料等待产销系统处理反馈，不能进行修磨处理');
          return;
        }
        if (matActWt == 0.0) {
          erFormHelper.messageWarning('本材料未收货');
          return;
        }
        if (mainGridCheckedRow.MEND_FLAG == '' || mainGridCheckedRow.MEND_FLAG == '0') {
          // 使用框架弹窗组件EFDialogForm
          openADDialog(mainGridCheckedRow, 'INNER_1I');
        }else if(mainGridCheckedRow.MEND_FLAG == '5'){
          openADDialog(mainGridCheckedRow, 'INNER_5I');
        } else {
          erFormHelper.messageWarning('本连铸坯已经初磨');
          return;
        }
      }
    };
    // 打开新增弹出画面
    const openADDialog = (currentRow: any, flag: String) => {
      const HEAT_NO = currentRow.HEAT_NO;
      const PROC_NO = currentRow.PROC_NO;
      const MAT_NO = currentRow.MAT_NO;

      //2024-02-20
      //const PROD_SEQ_NO = currentRow.PROD_SEQ_NO;

      const data = {
        PROC_DIV: flag,
        HEAT_NO: HEAT_NO,
        PROC_NO: PROC_NO,
        MAT_NO: MAT_NO
        //PROD_SEQ_NO: PROD_SEQ_NO
      };
      dialogFormName.value = 'MMSM37POPA'; // 读配置表获取画面名
      isShow.value = true;
      parentInfo.value = data;
      openXrEfDialog();
    };

    //修改铸坯信息---初磨外弧
    const F4_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView_line2.value).length === 0) {
        erFormHelper.messageWarning('请选择需要补全的修磨记录');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value, true)[0]; // 获取主表勾选行
        const grindingEndTime =  mainGridCheckedRow.GRINDING_END_TIME;
        if(grindingEndTime ==''){
          erFormHelper.messageWarning('初磨内弧结束时间未设置');
          return;
        }
        const matActWt = mainGridCheckedRow.MAT_ACT_WT;
        if (matActWt == 0.0) {
          erFormHelper.messageWarning('本材料未收货');
          return;
        }
        const mendFlag = mainGridCheckedRow.MEND_FLAG;
        if (mendFlag=='2'||mendFlag=='4'){
          erFormHelper.messageWarning('本材料初磨外弧修磨记录已经录入完毕，如果需要维护，请点击：F7修改');
          return;
        }
        openADDUDialog(mainGridCheckedRow, 'OUTER_1U');
      }
    };

    // 修改铸坯信息---初磨外弧
    const openADDUDialog = (currentRow: any, flag: String) => {
      const HEAT_NO = currentRow.HEAT_NO;
      const PROC_NO = currentRow.PROC_NO;
      const MAT_NO = currentRow.MAT_NO;

      //2024-1-8
      const data = {
        PROC_DIV: flag,
        HEAT_NO: HEAT_NO,
        PROC_NO: PROC_NO,
        MAT_NO: MAT_NO
      };
      dialogFormName.value = 'MMSM37POPOUTER1'; // 读配置表获取画面名
      parentInfo.value = data;

      isShowUp.value = true;
      openXrEfDialog();
    };

    //修磨实绩-修改
    const openEditTextDialog = (currentRow: any, flag: String) => {
      const HEAT_NO = currentRow.HEAT_NO;
      const PROD_SEQ_NO = currentRow.PROD_SEQ_NO;
      const MAT_NO = currentRow.MAT_NO;
      const MEND_CANCEL_FLAG = currentRow.MEND_CANCEL_FLAG;

      //2024-1-8
      const data = {
        PROC_DIV: flag,
        HEAT_NO: HEAT_NO,
        PROD_SEQ_NO: PROD_SEQ_NO,
        MAT_NO: MAT_NO,
        MEND_CANCEL_FLAG: MEND_CANCEL_FLAG
      };
      dialogFormName.value = 'MMSM37POPU'; // 读配置表获取画面名
      parentInfo.value = data;

      isShowUp.value = true;
      openXrEfDialog();
    };

    // 弹框ref
    const xrEfDialogRef = ref<any>(null);
    // 打开弹框事件
    const openXrEfDialog = () => {
      dialogVisible.value = true;
      /*  nextTick(() => {
        xrEfDialogRef.value.open();
      }); */
    };
    // 关闭弹框监听
    const xrEfDialogClose = () => {
      /*  isShow.value = false;
      isShowUp.value = false; */
      dialogVisible.value = false;
      getSubGridLine(); // 关闭弹框后查询铸坯信息
      getSubGridProd(); //关闭弹框后查询修磨信息
    };
    // 获取弹窗画面传递过来的数据 新增
    const getChildInfo = (info: any) => {
      if (info.close) {
        dialogVisible.value = false;
        xrEfDialogClose();
        /*  xrEfDialogRef.value.close(); // 关闭弹框 */
      }
    };

    // 获取弹窗画面传递过来的数据 修改
    const getChildInfoUp = (info: any) => {
      if (info.close) {
        dialogVisible.value = false;
        xrEfDialogClose();
        /*   xrEfDialogRef.value.close(); // 关闭弹框 */
      }
    };

    //再磨（内弧）
    const F5_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView_line1.value).length === 0) {
        erFormHelper.messageWarning('请选择需要再磨的铸坯信息');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line1.value, true)[0]; // 获取主表勾选行
        const rcvMatFlag = mainGridCheckedRow.RCV_MAT_FLAG;
        if(rcvMatFlag=='N'){
          erFormHelper.messageWarning('本材料未收货，不能进行修磨处理');
          return;
        }
        if(rcvMatFlag=='W'){
          erFormHelper.messageWarning('本材料等待产销系统处理反馈，不能进行修磨处理');
          return;
        }
        if(rcvMatFlag=='E'){
          erFormHelper.messageWarning('本材料等待产销系统处理反馈，不能进行修磨处理');
          return;
        }
        if (mainGridCheckedRow.MEND_FLAG == 1 || mainGridCheckedRow.MEND_FLAG == 2) {
          openADDialog(mainGridCheckedRow, 'INNER_2I');
        } else {
          erFormHelper.messageWarning('只有初磨之后的材料，才能再磨');
        }
      }
    };

    //再磨（外弧）
    const F6_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView_line2.value).length === 0) {
        erFormHelper.messageWarning('请选择需要补全的修磨记录');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value, true)[0]; // 获取主表勾选行
        const grindingEndTime = mainGridCheckedRow.GRINDING_END_TIME;
        if(grindingEndTime ==''){
          erFormHelper.messageWarning('再内弧结束时间未设置');
          return;
        }
        const matActWt = mainGridCheckedRow.MAT_ACT_WT;
        if (matActWt == 0.0) {
          erFormHelper.messageWarning('本材料未收货');
          return;
        }
        const mendFlag = mainGridCheckedRow.MEND_FLAG;
        if (mendFlag=='2'||mendFlag=='4'){
          erFormHelper.messageWarning('本材料再磨外弧修磨记录已经录入完毕，如果需要维护，请点击：F7修改');
          return;
        }
        openADDUDialog(mainGridCheckedRow, 'OUTER_2U');
      }
    };

    //修改
    const F7_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView_line2.value).length === 0) {
        erFormHelper.messageWarning('请选择一条需要修改的修磨记录');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value, true)[0]; // 获取子表勾选行
        openEditTextDialog(mainGridCheckedRow, 'Edit');
      }
    };

    //删除打分
    const F8_DO = async (e: any) => {
      const GridView1CheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value);

      if (GridView1CheckedRow.length === 0) {
        erFormHelper.messageWarning('请选择需要删除修磨实绩进行删除！');
        return false;
      }
      const matNo = GridView1CheckedRow[0]['MAT_NO'];
      const heatNo = GridView1CheckedRow[0]['HEAT_NO'];
      const psq = GridView1CheckedRow[0]['PROD_SEQ_NO'];
      //磨后重量
      const afterWeight = GridView1CheckedRow[0]['MEND_AFTER_WEIGHT'];
      //再磨重量
      const secondWeight = GridView1CheckedRow[0]['MEND_SECOND_WEIGHT'];
      //修磨标记
      const mendFlag = GridView1CheckedRow[0]['MEND_FLAG'];

      //2024-03-02

      const info = '是否删除材料号为:' + matNo + ',熔炼号为:' + heatNo + '的修磨实绩？';

      const eiInfoTmmsm01 = new EI.EIInfo();
      const eiBlockTmmsm01 = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiBlockTmmsm01.addColumns('QUERY_DIV', 'MAT_NO');
      eiBlockTmmsm01.data[0]['QUERY_DIV'] = 'TMMSM01';
      eiBlockTmmsm01.data[0]['MAT_NO'] = matNo;
      eiInfoTmmsm01.addBlock(eiBlockTmmsm01, '');
      const outInfoTmmsm01 = await erFormHelper.callService('mmsm34f2_inq', eiInfoTmmsm01);

      if (outInfoTmmsm01.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfoTmmsm01.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfoTmmsm01, gridView_tmmsm01.value);
      }
      const mainGridInfo = erFormHelper.getGridCurrentRow(gridView_tmmsm01.value, true);

      const mainGridInfoMatWT = mainGridInfo.MAT_ACT_WT;

      const complexDecideCode = mainGridInfo.COMPLEX_DECIDE_CODE;

      const mendFlagTMMSM01 = mainGridInfo.MEND_FLAG;

      //2024-02-19 添加逻辑，
      //如果不存在磨后量，直接删除不发电文
      //如果  存在磨后量，判断磨后量和主档表的磨后重量是否一致

      //如果 complexDecideCode==1，表示不能删除
      if (complexDecideCode == 1) {
        erFormHelper.messageWarning('不能删除');
        return;
      }
      //如果tmmsm01表的修磨标记和tmmsm34表的修磨标记不一致，不能删除
      if (mendFlag != mendFlagTMMSM01) {
        erFormHelper.messageWarning('当前主档表修磨标记和所选修磨实绩不一致，不能删除');
        return;
      }

      //如果是初磨：flag==1||flag==2，需要比较 --磨后重量
      if (mendFlag == 1 || mendFlag == 2) {
        if (afterWeight == 0 || afterWeight == mainGridInfoMatWT) {
          //erFormHelper.messageWarning('删除成功');
        } else {
          erFormHelper.messageWarning('不能删除');
          return false;
        }
        //如果是再磨：flag==3||flag==4, 需要比较 --再磨重量
      } else if (mendFlag == 3 || mendFlag == 4) {
        if (secondWeight == 0 || secondWeight == mainGridInfoMatWT) {
          //erFormHelper.messageWarning('删除成功');
        } else {
          erFormHelper.messageWarning('不能删除');
          return false;
        }
      }
      const confirm = await erFormHelper.messageConfirm(info);
      if (confirm) {
        const eiInfo = new EI.EIInfo();
        const eiBlock_PARA = new EI.EiBlock();

        const obj: any = {
          PROC_DIV: 'D',
          FACTORY_DIV: ' ',
          STATION_ID: 'C',
          MAT_NO: matNo,
          PROD_SEQ_NO: psq
        };
        eiBlock_PARA.pushData(obj, true);
        eiInfo.addBlock(eiBlock_PARA, 'PARA');
        // const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock(GridView1CheckedRow[0]);
        // eiInfo.addBlock(checkedRowEiBlock,'DEL');
        const outInfo = await erFormHelper.callService('mmsm34f5_del', eiInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('删除失败:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('删除成功');
          getSubGridProd();
        }
      }

      /*   popFreeMAT_SCORE = new ErPopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM37_LAYOUT_DIALOG');

      popFreeMAT_SCORE.ReceiveData(GridView1CheckedRow, true); // 初始绑值，并设置可编辑
      ErPopUtils.showErPopFree(XrErPopFree, popFreeMAT_SCORE, async (event: PopFreeReturnInfo) => {
        //确定按钮回调
        const eiInfo = new EI.EIInfo();
        // 将dataModel格式转换为EIBlock
        const eiBlock = erFormHelper.convertModelAsBlock(event.dataModel?.get(''), {});
        eiInfo.addBlock(eiBlock);
        const outInfo = await erFormHelper.callService('', eiInfo, false, false, true);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('保存成功');
          //queryMainGrid();
          getSubGridLine(); // 查询铸坯信息
          getSubGridProd(); //查询修磨信息
        }
      }); */
    };

    const F81_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView_line2.value).length === 0) {
        erFormHelper.messageWarning('请选择一条需要上传修磨实绩的修磨记录');
      } else {
        const uploadCheckRow = erFormHelper.getGridCheckedRows(gridView_line2.value, true)[0]; // 获取子表勾选行      
        const isConfirm = uploadCheckRow['ISCONFIRM'];
        if(isConfirm=="1"){
          erFormHelper.messageWarning('此条修磨记录已经上传到产销系统');
          return;
        }
        const matNo = uploadCheckRow['MAT_NO'];
        const prodSeqNo = uploadCheckRow['PROD_SEQ_NO'];
        const mendFlag = uploadCheckRow['MEND_FLAG'];
        if(mendFlag=='1'||mendFlag=='2'){
          const afterWeight = uploadCheckRow['MEND_AFTER_WEIGHT'];
          if(afterWeight==0){
            erFormHelper.messageWarning('此条修磨记录没有磨后重量，请添加磨后重量，再上传给产销系统');
            return;
          }
        }else if(mendFlag=='3'||mendFlag=='4'){
          const secondWeight = uploadCheckRow['MEND_SECOND_WEIGHT'];
          if(secondWeight==0){
            erFormHelper.messageWarning('此条修磨记录没有再磨重量，请添加再磨重量，再上传给产销系统');
            return;
          }
        }
        const info = '是否上传材料号为:' + matNo + '的修磨实绩？';
        const confirm = await erFormHelper.messageConfirm(info);
        if (confirm) {
            const eiInfoConfirm = new EI.EIInfo();
            
            const eiBlockConfirm = eiInfoConfirm.addBlock(new EI.EiBlock(),'MMSM34');
            eiBlockConfirm.addColumns('MAT_NO', 'PROD_SEQ_NO');
            eiBlockConfirm.pushData(
              {
                MAT_NO: matNo,
                PROD_SEQ_NO:prodSeqNo
              },
              true
            );
            const eiBlockConfirmPAPA = eiInfoConfirm.addBlock(new EI.EiBlock(),'PARA');
            eiBlockConfirmPAPA.addColumns('PROC_DIV', 'FACTORY_DIV','STATION_ID');
            eiBlockConfirmPAPA.pushData({
              PROC_DIV:'CONFIRM',
              FACTORY_DIV:'LG1',
              STATION_ID:'C'
            });
            const outInfoConfirm = await erFormHelper.callService('mmsm34f8_confirm', eiInfoConfirm);
            if (outInfoConfirm.sys.status < 0) {
              erFormHelper.messageError('发送电文错误:' + outInfoConfirm.sys.msg);
              return;
            } else{
              getSubGridProd(); //查询修磨信息
            }

        }
      }
    }

    //修磨取消---2024-03-05
    const F9_DO = async (e: any) => {
      const GridView1CheckedRow = erFormHelper.getGridCheckedRows(gridView_line1.value);
      if (GridView1CheckedRow.length === 0) {
        erFormHelper.messageWarning('请选择需要取消修磨的材料！');
        return false;
      }
      const mendFlag = GridView1CheckedRow[0]['MEND_FLAG'];
      if (mendFlag != 1 && mendFlag != 2 && mendFlag != 3 && mendFlag != 4) {
        erFormHelper.messageWarning('材料无法进行修改');
        return false;
      }
      const matNo = GridView1CheckedRow[0]['MAT_NO'];
      const info = '是否取消材料号为:' + matNo + '的修磨记录';
      const confirm = await erFormHelper.messageConfirm(info);
      if (confirm) {
        const eiInfo = new EI.EIInfo();
        const eiBlock_PARA = new EI.EiBlock();

        const obj: any = {
          PROC_DIV: 'CANCEL',
          FACTORY_DIV: ' ',
          STATION_ID: 'C',
          MAT_NO: matNo
        };
        eiBlock_PARA.pushData(obj, true);
        eiInfo.addBlock(eiBlock_PARA, 'PARA');
        // const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock(GridView1CheckedRow[0]);
        // eiInfo.addBlock(checkedRowEiBlock,'DEL');
        const outInfo = await erFormHelper.callService('mmsm34f9_cancel', eiInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('取消修磨失败:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('修磨取消成功');
          getSubGridLine();
        }
      } else {
        console.log('confirm', 'no');
      }
    };

    //上传修磨实绩---2024-03-08
    const F10_DO = async (e: any) => {
      const GridView1CheckedRow = erFormHelper.getGridCheckedRows(gridView_line1.value);
      if (GridView1CheckedRow.length === 0) {
        erFormHelper.messageWarning('请选择需要上传修磨实绩的材料！');
        return false;
      }
      const mendFlag = GridView1CheckedRow[0]['MEND_FLAG'];
      if (mendFlag === '1' || mendFlag === '2' || mendFlag === '3' || mendFlag === '4') {
        erFormHelper.messageWarning('只有未修磨材料才能直接上传修磨实绩');
        return false;
      }
      const matNo = GridView1CheckedRow[0]['MAT_NO'];
      const info = '是否上传材料号为:' + matNo + '的修磨记录';
      const confirm = await erFormHelper.messageConfirm(info);
      if (confirm) {
        const eiInfo = new EI.EIInfo();
        const eiBlock_PARA = new EI.EiBlock();

        const obj: any = {
          PROC_DIV: 'SEND',
          FACTORY_DIV: ' ',
          STATION_ID: 'C',
          MAT_NO: matNo
        };
        eiBlock_PARA.pushData(obj, true);
        eiInfo.addBlock(eiBlock_PARA, 'PARA');
        const outInfo = await erFormHelper.callService('mmsm34f10_send', eiInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('修磨实绩上传失败:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('修磨实绩上传成功');
          getSubGridLine();
        }
      }
    };

    //2024-1-4
    const forbidChangeExitedRows = (e: any) => {
      e.column.colDef.editable = false;
    };

    const gridView2FocusChanged = (e: any) => {
      forbidChangeExitedRows(e);
      if (!e.data) {
        return false;
      }
    };

    return {
      dialogFormName,
      dialogVisible,
      erGrid2Ready,
      erGrid1Ready,
      handleTabChange,
      tabActiveKey,
      efFormReady,
      erFormHelper,
      initializeFlag,
      gridToolbar,
      LayoutGroupFilter,
      gridView_line1,
      gridView_line2,
      kendoTabStrip,
      xrEfDialogRef,
      parentInfo,
      xrEfDialogClose,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      F6_DO,
      F7_DO,
      F8_DO,
      F81_DO,
      F9_DO,
      F10_DO,
      isShow,
      isShowUp,
      getChildInfo,
      getChildInfoUp,

      gridView2FocusChanged
    };
  }
});
