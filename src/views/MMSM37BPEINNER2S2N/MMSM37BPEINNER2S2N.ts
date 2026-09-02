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
    formName = 'MMSM37BPEINNER2S2N';
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

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {         

          //设置grid不可编辑
          erFormHelper.setGridEditable(grid_view_1.value, false);
          erFormHelper.setGridEditable(grid_view_2.value, false);          
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {

    });


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
      erFormHelper.setGridServerPagingQuery('GridView1', eiInfo, (queryPage: number) => {        
        return new Promise(async (resolve, reject) => {
           const eiInfo = new EI.EIInfo();
           const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
           eiBlock.addColumn('QUERY_DIV', 'TMMSM01'); //传表名
           eiBlock.addColumn('INNER2_C','INNER2_C')
           eiInfo.addBlock(eiBlock, '');
        
           const result: any = { flag: -1, msg: '', data: undefined, total: 0 };
           const grid = erFormHelper.getGrid('GridView1');
           const pageSize = grid.gridOptions.context?.pageOptions?.pageSize;
           eiInfo.addBlock(ER.Core.buildEiBlock([{ PAGE_NUM: queryPage, PAGE_SIZE: pageSize }], 'PAGEINFO'));
           await erFormHelper.callService('mmsm34f2_inq', eiInfo).then((res: any) => {
            if (res.sys.status >= 0) {
              result.flag = 0;
              result.data = res.getBlock(0);
              result.total = res.getBlock(0).length;

              if (res.contains('PAGEINFO')) {
                result.total = res.getBlock('PAGEINFO').data[0]['TOTAL_RECORD'];
              }
            }
          });
          resolve(result);
        });
      });
    };

    //查询修磨实绩
    const getSubGridProd = async () => {

      const eiInfo = new EI.EIInfo();
      erFormHelper.setGridServerPagingQuery('GridView2', eiInfo, (queryPage: number) => {       
        return new Promise(async (resolve, reject) => {
           const eiInfo = new EI.EIInfo();
           const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
           eiBlock.addColumn('QUERY_DIV', 'TMMSM34'); //传表名.
           eiBlock.addColumn('FLAG', '7');
           eiInfo.addBlock(eiBlock, '');
           const result: any = { flag: -1, msg: '', data: undefined, total: 0 };
           const grid = erFormHelper.getGrid('GridView2');
           const pageSize = grid.gridOptions.context?.pageOptions?.pageSize;

           eiInfo.addBlock(ER.Core.buildEiBlock([{ PAGE_NUM: queryPage, PAGE_SIZE: pageSize }], 'PAGEINFO'));
           await erFormHelper.callService('mmsm34f2_inq', eiInfo).then((res: any) => {
            if (res.sys.status >= 0) {
              result.flag = 0;
              result.data = res.getBlock(0);
              result.total = res.getBlock(0).length;

              if (res.contains('PAGEINFO')) {
                result.total = res.getBlock('PAGEINFO').data[0]['TOTAL_RECORD'];
              }
            }
          });
          resolve(result);
        });
      });
    };

    //查询
    const F2_DO = async (e: any) => {  
      if(!await erFormHelper.checkRequiredInput('LayoutGroupFilter')){
        erFormHelper.messageWarning('请检查输入');
        return false;
      }    
      getSubGridLine();
      getSubGridProd();
    };  
   
    // 打开新增弹出画面
    const openADDialog = (currentRow: any, flag: String) => {
      const HEAT_NO = currentRow.HEAT_NO;
      const PROC_NO = currentRow.PROC_NO;
      const MAT_NO = currentRow.MAT_NO;
      const PROD_SEQ_NO = currentRow?.PROD_SEQ_NO||''
      const data = {
        PROC_DIV: flag,
        HEAT_NO: HEAT_NO,
        PROC_NO: PROC_NO,
        MAT_NO: MAT_NO,
        PROD_SEQ_NO:PROD_SEQ_NO
      };
      dialogFormName.value = 'MMSM37POPA'; // 读配置表获取画面名
      isShow.value = true;
      parentInfo.value = data;
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
    const F3_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView_line1.value).length === 0&&erFormHelper.getGridCheckedRows(gridView_line2.value).length===0) {
        erFormHelper.messageWarning('请选择需要再磨的铸坯信息');
      } else {
        //第一次再磨内弧
        if(erFormHelper.getGridCheckedRows(gridView_line1.value).length != 0){
          const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line1.value, true)[0]; // 获取主表勾选行
          const mendFlag = mainGridCheckedRow.MEND_FLAG;
          if(mendFlag==''||mendFlag=='0'){
            erFormHelper.messageWarning('本材料还未进行初磨，请先进行初磨');
            return;
          }
          if(mendFlag=='3'){
            erFormHelper.messageWarning('本材料已经进行了再磨内弧操作，如果需要进行修改，请到修磨记录中，选中修改');
            return;
          }
          if(mendFlag=='4'){
            erFormHelper.messageWarning('本材料已经进行了再磨外弧操作，如果需要进行修改，请到修磨记录中，选中修改');
            return;
          }
          const rcvMatFlag = mainGridCheckedRow.RCV_MAT_FLAG;
          if(rcvMatFlag=='W'){
            erFormHelper.messageWarning('本材料等待产销系统处理反馈，不能进行修磨处理');
            return;
          }
          if(rcvMatFlag=='E'){
            erFormHelper.messageWarning('本材料等待产销系统处理反馈，不能进行修磨处理');
            return;
          }
          openADDialog(mainGridCheckedRow, 'INNER_2I');
        }
        //第二次再磨内弧
        if(erFormHelper.getGridCheckedRows(gridView_line2.value).length != 0){
          const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value, true)[0]; // 获取主表勾选行

          const now = new Date().getTime();
          const startTime1 = mainGridCheckedRow['GRINDING_START_TIME'];
          const year = startTime1.slice(0,4);
          const month = startTime1.slice(4,6);
          const day = startTime1.slice(6,8);
          const hour = startTime1.slice(8,10);
          const min = startTime1.slice(10,12);
          const sec = startTime1.slice(12,14);
          const newDate = year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec;
          const hours = Math.floor((now- new Date(newDate).getTime())/(1000*60*60));
          if(hours>12){
            erFormHelper.messageWarning('只能修改本班的修磨记录');
            return;
          }else{
            //如果是交班料，不受8点20点交接班的限制,只要保证在12小时之内就可以修改
            if(mainGridCheckedRow['MEND_SHIFT_MATERIAL']=='Y'){
              openADDialog(mainGridCheckedRow, 'INNER_2I');
            //如果不是交班料，受到8点20点交班点的限制  
            }else{
              const nowHour = new Date().getHours();
              if(nowHour>20&&hour<20){
                erFormHelper.messageWarning('只能修改本班的修磨记录');
                return;
              }
              if(nowHour>8&&hour<8){
                erFormHelper.messageWarning('只能修改本班的修磨记录');
                return;
              }
              openADDialog(mainGridCheckedRow, 'INNER_2I');
            }
          }
        }
      }
    };  
    const F4_DO = async (e: any) => {
      const GridView1CheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value);
      if (GridView1CheckedRow.length === 0) {
        erFormHelper.messageWarning('请选择需要删除修磨实绩进行操作！');
        return false;
      }
      const matNo = GridView1CheckedRow[0]['MAT_NO'];
      const psq = GridView1CheckedRow[0]['PROD_SEQ_NO'];
      const secondWeight = GridView1CheckedRow[0]['MEND_SECOND_WEIGHT'];
      if(secondWeight!=0){
        erFormHelper.messageWarning('材料号为:'+matNo+',已经存在再磨重量，不能删除');
        return false;
      }
      const info = '是否删除材料号为:' + matNo +  '的修磨记录？';
      const confirm = await erFormHelper.messageConfirm(info);
      if (confirm) {
        const eiInfo = new EI.EIInfo();
        const eiBlock_PARA = new EI.EiBlock();
        const obj: any = {
          PROC_DIV: 'DELRECORD',
          FACTORY_DIV: ' ',
          STATION_ID: 'C',
          MAT_NO: matNo,
          PROD_SEQ_NO: psq
        };
        eiBlock_PARA.pushData(obj, true);
        eiInfo.addBlock(eiBlock_PARA, 'PARA');        
        const outInfo = await erFormHelper.callService('mmsm34f5_del_record', eiInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('删除失败:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('删除成功');
          getSubGridProd();
        }
      }
    }

    const F5_DO = async (e: any) => {
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
    /**
     * 日期：2024-05-29
     * 
     */
    const F6_DO = async (e: any) => {
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value, true)[0]; // 获取主表勾选行
      if (erFormHelper.getGridCheckedRows(gridView_line2.value, true).length === 0) {
        erFormHelper.messageWarning('请选择需要修改的修磨电子记录！');
        return false;
      }
      openADDialog(mainGridCheckedRow, 'ADMIN_EDIT');
    }
    const F7_DO = async (e: any) => {
      const GridView1CheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value);
      if (GridView1CheckedRow.length === 0) {
        erFormHelper.messageWarning('请选择需要修改的修磨记录进行删除');
        return false;
      }
      const matNo = GridView1CheckedRow[0]['MAT_NO'];
      const psq = GridView1CheckedRow[0]['PROD_SEQ_NO'];
      const info = '是否删除材料号为:' + matNo +  '的修磨记录？';
      const confirm = await erFormHelper.messageConfirm(info);
      if (confirm) {
        const eiInfo = new EI.EIInfo();
        const eiBlock_PARA = new EI.EiBlock();
        const obj: any = {
          PROC_DIV: 'ADMIN_DELETE',
          FACTORY_DIV: ' ',
          STATION_ID: 'C',
          MAT_NO: matNo,
          PROD_SEQ_NO: psq
        };
        eiBlock_PARA.pushData(obj, true);
        eiInfo.addBlock(eiBlock_PARA, 'PARA');        
        const outInfo = await erFormHelper.callService('mmsm34f5_del_record', eiInfo);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('删除失败:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('删除成功');
          getSubGridProd();
        }
      }
    }
   

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
      isShow,
      isShowUp,
      getChildInfo,
      getChildInfoUp,

      gridView2FocusChanged
    };
  }
});
