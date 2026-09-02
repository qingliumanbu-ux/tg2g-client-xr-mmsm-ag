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
    const initializeService = '';
    const tabActiveKey = ref('tab2');
    // 变量定义
    formName = 'MMSM37BPEOUTER1S2N';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const grid_view_2 = ref('');
    let gridView2: any;
    const gridToolbar: Ref<any[]> = ref([]);
    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({});
    const LayoutGroupFilter = 'LayoutGroupFilter';
    const gridView_line2 = ref('GridView2');
    const dialogVisible = ref<boolean>(false);
    // 获取tab页组件的ref和实例
    const kendoTabStrip = ref<any>(null);
    // 是否显示新增、修改弹框
    const isShowUp = ref<boolean>(false); 

    // 弹框ref
    const xrEfDialogRef = ref<any>(null);

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
        nextTick(() => {
          erFormHelper.setGridEditable(grid_view_2.value, false);
          
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };
    onMounted(() => {
    });
    
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid('GridView2');
      erFormHelper.setGridEditable(grid_view_2.value, false);
      erFormHelper.setGridToolbarVisible('GridView2', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };  

    //查询按钮
    const F2_DO = async (e: any) => {      
      getSubGridProd();
    };

    //修改铸坯信息---初磨外弧
    const F3_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView_line2.value).length === 0) {
        erFormHelper.messageWarning('请选择需要补全的修磨记录');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value, true)[0]; 
        const grindingEndTime =  mainGridCheckedRow.GRINDING_END_TIME;
        if(grindingEndTime ==''){
          erFormHelper.messageWarning('初磨内弧结束时间未设置');
          return;
        }
        
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
            openADDUDialog(mainGridCheckedRow, 'OUTER_2U');
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
            const mendFlag = mainGridCheckedRow.MEND_FLAG;
          
            openADDUDialog(mainGridCheckedRow, 'OUTER_2U');
          }
        }
      }
    };

    const F4_DO = async (e: any) => {
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
    //查询修磨实绩
    const getSubGridProd = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiBlock.addColumn('QUERY_DIV', 'TMMSM34'); //传表名
      eiBlock.addColumn('FLAG', '7');
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('mmsm34f2_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_line2.value);
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

    // 打开弹框事件
    const openXrEfDialog = () => {
      dialogVisible.value = true;     
    };

     // 关闭弹框监听
     const xrEfDialogClose = () => {
      dialogVisible.value = false;
      getSubGridProd(); //关闭弹框后查询修磨信息
    };

    // 获取弹窗画面传递过来的数据 新增
    const getChildInfo = (info: any) => {
      if (info.close) {
        dialogVisible.value = false;
        xrEfDialogClose();
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
      tabActiveKey,
      efFormReady,
      erFormHelper,
      initializeFlag,
      gridToolbar,
      LayoutGroupFilter,
      gridView_line2,
      kendoTabStrip,
      parentInfo,
      xrEfDialogRef,
      xrEfDialogClose,
      F2_DO,
      F3_DO,
      F4_DO,
      isShowUp,
      getChildInfo,
      gridView2FocusChanged
    };
  }
});
