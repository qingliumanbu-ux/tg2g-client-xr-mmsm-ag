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


import MMSM37LG1POP from '../MMSM37LG1POP/MMSM37LG1POP.vue';

export default defineComponent({
  name: 'MMSM37BPELG1',
  components: {
    MMSM37LG1POP,
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
    const tabActiveKey = ref('tab1');
    // 变量定义
    formName = 'MMSM37BPELG1';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const grid_view_1 = ref('');
    const grid_view_2 = ref('');
    const grid_view_3 = ref('');
    let gridView1: any;
    let gridView2: any;
    let gridView3: any;
    let tabStrip1: any;
    const gridToolbar: Ref<any[]> = ref([]);
    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({});
    const LayoutGroupFilter = 'LayoutGroupFilter';
    const gridView_line1 = ref('GridView1');
    const gridView_line2 = ref('GridView2');
    const gridView_line3 = ref('GridView3');

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
          erFormHelper.setGridEditable(grid_view_3.value, false);     
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

      gridView2.gridOptions.getRowStyle = (params: any) => {
        const row = params?.data||'count';
        if(row!='count'){
            const isUpload = params.data?.ISUPLOAD||'No';
            if(isUpload!='No'){
              if (params.data.ISUPLOAD.toString().trim() == '-1') {
                  //封锁状态颜色为红色
                  return {
                    fontweight: 'blod',
                    background: '#F78084'
                  };
                }
            }
        }
      };

      erFormHelper.setGridEditable(grid_view_2.value, false);
      erFormHelper.setGridToolbarVisible('GridView2', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid3Ready = () => {
      gridView3 = erFormHelper.getGrid('GridView3');

      erFormHelper.setGridEditable(grid_view_3.value,false);
      erFormHelper.setGridToolbarVisible('GridView3',{
        addrow: false,
        copyrow: false,
        excel: true
      });

    }

    const handleTabChange = (activeKey: string) => {
      if (activeKey === 'tab1') {
        getSubGridLine();
      } else if (activeKey === 'tab2') {
        getSubGridProd();
      }
      if(activeKey==='tab3'){
        getMendGridLine();
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
          eiBlock.addColumn('QUERY_DIV', 'TMMSM34_1'); //传  实绩
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


    /**
     * 查询修磨记录
     * @param e  
     * @returns 
     */
    const getMendGridLine = async () =>{     
      const eiInfo = new EI.EIInfo();

      erFormHelper.setGridServerPagingQuery('GridView3', eiInfo, (queryPage: number) => {        
        return new Promise(async (resolve, reject) => {
           const eiInfo = new EI.EIInfo();
           const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
           eiBlock.addColumn('QUERY_DIV', 'TMMSM34'); //传  记录表
           eiInfo.addBlock(eiBlock, '');
           const result: any = { flag: -1, msg: '', data: undefined, total: 0 };
           const grid = erFormHelper.getGrid('GridView3');
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
    }

    //查询
    const F2_DO = async (e: any) => {     
      
  

      if(!await erFormHelper.checkRequiredInput('LayoutGroupFilter')){
        erFormHelper.messageWarning('请检查输入');
        return false;
      }
      getSubGridLine();
      getSubGridProd();

      /**
       *  日期：2024-05-21
       *  原因：添加修磨记录，解决修磨报表中能看到，但是修磨实绩中查不到。同时添加手工上传修磨实绩的功能
       * 
       */
      getMendGridLine();
    };
   //修改修磨新增
    const F3_DO = async (e:any) => {
      if (erFormHelper.getGridCheckedRows(gridView_line1.value).length === 0) {
        erFormHelper.messageWarning('未选择铸坯信息');
      }else{
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line1.value, true)[0]; 

        console.log('mainGridCheckedRow',mainGridCheckedRow)

        const complexDecideCode = mainGridCheckedRow.COMPLEX_DECIDE_CODE;
        
        const rcvMatFlag = mainGridCheckedRow.RCV_MAT_FLAG;
        const matActWt = mainGridCheckedRow.MAT_ACT_WT;
        const mendFlag = mainGridCheckedRow.MEND_FLAG;

        if(complexDecideCode!='1'){
          erFormHelper.messageWarning('本材料综判不合格，不能进行修磨处理');
          return;
        }

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
        if (matActWt == 0.0) {
          erFormHelper.messageWarning('本材料未收货');
          return;
        }
        if(mendFlag!='0'&&mendFlag!=''){
          erFormHelper.messageWarning('只有未修磨的，才能新增修磨实绩');
          return;
        }
        openADDialog(mainGridCheckedRow, 'INS_ACHIEVEMENT');
      }
    }

    //修改修磨实绩
    const F4_DO = async(e:any) =>{
      if (erFormHelper.getGridCheckedRows(gridView_line2.value).length === 0) {
        erFormHelper.messageWarning('请选择一条需要修改的实绩');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value, true)[0]; // 获取子表勾选行
        openEditTextDialog(mainGridCheckedRow, 'EDIT_ACHIEVEMENT');
      }
    };

    //新增弹出框
    const openADDialog = (currentRow: any, flag: String) => {
      const HEAT_NO = currentRow.HEAT_NO;
      const PROC_NO = currentRow.PROC_NO;
      const MAT_NO = currentRow.MAT_NO;     

      const data = {
        PROC_DIV: flag,
        HEAT_NO: HEAT_NO,
        PROC_NO: PROC_NO,
        MAT_NO: MAT_NO
      };
      dialogFormName.value = 'MMSM37LG1POPA'; // 读配置表获取画面名
      isShow.value = true;
      parentInfo.value = data;
      openXrEfDialog();
    };

    //修改弹出框
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
      dialogFormName.value = 'MMSM37LG1POPA'; // 读配置表获取画面名
      parentInfo.value = data;
      isShowUp.value = true;
      openXrEfDialog();
    };


    // 弹框ref
    const xrEfDialogRef = ref<any>(null);
    // 打开弹框事件
    const openXrEfDialog = () => {
      dialogVisible.value = true;      
    };



    //修磨实绩删除
    const F5_DO = async(e:any) =>{
      const GridView1CheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value);
      
      if (GridView1CheckedRow.length === 0) {
        erFormHelper.messageWarning('请选择需要删除修磨实绩进行操作！');
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

      const info = '是否删除材料号为:' + matNo + ',熔炼号为:' + heatNo + '的修磨实绩？';
      const eiInfoTmmsm01 = new EI.EIInfo();
      const eiBlockTmmsm01 = eiInfoTmmsm01.addBlock(new EI.EiBlock());

      const tmmsm01QueryCondition = {
        MAT_NO:matNo,
        QUERY_DIV: 'TMMSM01'
      };
      eiBlockTmmsm01.pushData(tmmsm01QueryCondition, true);
      const outInfoTmmsm01 = await erFormHelper.callService('mmsm34f2_inq', eiInfoTmmsm01);
      if (outInfoTmmsm01.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfoTmmsm01.sys.msg);
        return;
      } else {

       
        const mainGridInfo = outInfoTmmsm01.getBlock(0).data[0];
        if(mainGridInfo==undefined){
          erFormHelper.messageError('材料号:'+matNo + '已经归档，不能删除');
          return;
        }
        
        const mainGridInfoMatWT = mainGridInfo.MAT_ACT_WT;
        const complexDecideCode = mainGridInfo.COMPLEX_DECIDE_CODE;
        const mendFlagTMMSM01 = mainGridInfo.MEND_FLAG;
        //2024-02-19 添加逻辑，
      //如果不存在磨后量，直接删除不发电文
      //如果  存在磨后量，判断磨后量和主档表的磨后重量是否一致     

      //如果 complexDecideCode==1，表示不能删除
      if (complexDecideCode == 1) {
        erFormHelper.messageWarning('综判合格不能删除');
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
      }
    } 
    //上传修磨实绩
    const F6_DO = async(e:any) =>{
      const GridView1CheckedRow = erFormHelper.getGridCheckedRows(gridView_line1.value);
      if (GridView1CheckedRow.length === 0) {
        erFormHelper.messageWarning('请选择需要上传修磨实绩的材料！');
        return false;
      }      

      const complexDecideCode = GridView1CheckedRow[0].COMPLEX_DECIDE_CODE;
        if(complexDecideCode!='1'){
          erFormHelper.messageWarning('本材料综判不合格，不能进行修磨处理');
          return;
        }

      const rcvMatFlag = GridView1CheckedRow[0].RCV_MAT_FLAG;      
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

      const mendFlag = GridView1CheckedRow[0]['MEND_FLAG'];
      if (mendFlag === '1' || mendFlag === '2' || mendFlag === '3' || mendFlag === '4'||mendFlag === '5') {
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
    }

    //手工上传修磨实绩
    const F7_DO = async(e:any) => {
      const GridView1CheckedRow = erFormHelper.getGridCheckedRows(gridView_line3.value);
      if (GridView1CheckedRow.length === 0) {
        erFormHelper.messageWarning('请选择需要手工上传修磨实绩的材料！');
        return false;
      }      
      const isUpload = GridView1CheckedRow[0].ISUPLOAD;
      if(isUpload=='1'){
        erFormHelper.messageWarning('已经上传修磨实绩，不能重复上传');
        return;
      }  

      const mendAfterWeight = GridView1CheckedRow[0].MEND_AFTER_WEIGHT;  
      const mendSeqNo = GridView1CheckedRow[0].PROD_SEQ_NO;  
      if(mendAfterWeight<='0'){
        erFormHelper.messageWarning('没有磨后重量，不能上传修磨实绩');
        return;
      }

      /**
       *  通过材料号，从TMMSM01主档表里面获取：COMPLEX_DECIDE_CODE；RCV_MAT_FLAG，获取综判信息
       */

      let tmmsm01QueryCondition = {
        MAT_NO: GridView1CheckedRow[0].MAT_NO,
        QUERY_DIV: 'TMMSM01'
      };
      const eiInfoTmmsm01 = new EI.EIInfo();
      const eiBlockTmmsm01 = eiInfoTmmsm01.addBlock(new EI.EiBlock());
      eiBlockTmmsm01.pushData(tmmsm01QueryCondition, true);
      const outInfoTmmsm01 = await erFormHelper.callService('mmsm34f2_inq', eiInfoTmmsm01, false, true);
      const complexDecideCode = outInfoTmmsm01.getBlock(0).data[0]['COMPLEX_DECIDE_CODE'];     
      if(complexDecideCode!='1'){
        erFormHelper.messageWarning('本材料综判不合格，不能手工上传修磨实绩');
        return;
      }    
      const holdFlag = outInfoTmmsm01.getBlock(0).data[0]['HOLD_FLAG'];
      if(holdFlag!='0'){
        erFormHelper.messageWarning('本材料已经被封锁，不能手工上传修磨实绩');
        return;
      }
      const rcvMatFlag =  outInfoTmmsm01.getBlock(0).data[0]['RCV_MAT_FLAG'];         
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
      const matNo = GridView1CheckedRow[0]['MAT_NO'];    
      const info = '是否上传材料号为:' + matNo + '的修磨记录';
      const confirm = await erFormHelper.messageConfirm(info);

      if (confirm) {
        const eiInfo = new EI.EIInfo();
        const eiBlock_PARA = new EI.EiBlock();
        const obj: any = {
          PROC_DIV: 'INS_ACHIEVEMENT',
          FACTORY_DIV: ' ',
          STATION_ID: 'C',
          PROD_SEQ_NO:mendSeqNo,
          MAT_NO: matNo,
          MEND_AFTER_WEIGHT:mendAfterWeight
        };
        eiInfo.addBlock(eiBlock_PARA, 'PARA');
        eiBlock_PARA.pushData(obj, true);
        
        const outInfo = await erFormHelper.callService('mmsm34f3_ins', eiInfo,false, false, true);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('修磨实绩上传失败:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('修磨实绩上传成功');
          getSubGridLine();
        }
      }

    }
   
    // 关闭弹框监听
    const xrEfDialogClose = () => {
      dialogVisible.value = false;
      getSubGridLine(); // 关闭弹框后查询铸坯信息
      getSubGridProd(); //关闭弹框后查询修磨信息
    };
    // 获取弹窗画面传递过来的数据 新增
    const getChildInfo = (info: any) => {
      if (info.close) {
        dialogVisible.value = false;
        xrEfDialogClose();
      }
    };

    // 获取弹窗画面传递过来的数据 修改
    const getChildInfoUp = (info: any) => {
      if (info.close) {
        dialogVisible.value = false;
        xrEfDialogClose();
      }
    };

    return {
      dialogFormName,
      dialogVisible,
      erGrid3Ready,
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
      gridView_line3,
      kendoTabStrip,
      parentInfo,
      xrEfDialogRef,
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
      getChildInfoUp
    };
  }
});
