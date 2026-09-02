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
import MMSM36POP from '../MMSM36POP/MMSM36POP.vue';
import { Console } from 'console';

export default defineComponent({
  name: 'MMSM36S2N',
  components: { MMSM36POP, xrEfForm, xrEfPanel, erLayout, erGrid, xrEfDialog },
  setup: () => {
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    // 获取画面的分区信息及设置画面初始化service
    const initializeService = '';
    /*  let popFreeADDU: ErPopFreeHelper; */
    const gridToolbar: Ref<any[]> = ref([]);
    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({});

    // 变量定义
    formName = 'MMSM36S2N';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const layoutControlGroup1 = 'layoutControlGroup1';
    const gridView_line1 = ref('GridView1');
    const gridView_line2 = ref('GridView2');
    /*  let tabStrip1: any; */
    let gridView1: any;
    let gridView2: any;
    let pagePara: any; // 炼钢配置表页面参数
    const dialogVisible = ref(false);


    let gridApi: any;

    const grid_view_1 = ref('');
    const grid_view_2 = ref('');
    const tabActiveKey = ref('tab1');
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
        //InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          /*  gridView1 = erFormHelper.getKendoGrid(grid_view_1.value);
          gridView2 = erFormHelper.getKendoGrid(grid_view_2.value); */

          //设置grid不可编辑
          erFormHelper.setGridEditable(grid_view_1.value, false);
          erFormHelper.setGridEditable(grid_view_2.value, false);
          // Tab页切换显示事件
          /* tabStrip1 = (kendoTabStrip.value as TabStrip).kendoWidget() as kendo.ui.TabStrip;
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
      //initializePage();
    });

    //查询材料信息
    const getSubGridLine = async () => {
      const eiInfo = new EI.EIInfo();


      erFormHelper.setGridServerPagingQuery('GridView1', eiInfo, (queryPage: number) => {        
        return new Promise(async (resolve, reject) => {
           const eiInfo = new EI.EIInfo();
           const eiBlock = erFormHelper.getAllControlValueAsEiBlock(layoutControlGroup1, { QUERY_DIV: 'TMMSM01' });
            eiBlock.addColumn('QUERY_DIV', 'TMMSM01'); //传表名
            eiInfo.addBlock(eiBlock);
           const result: any = { flag: -1, msg: '', data: undefined, total: 0 };
           const grid = erFormHelper.getGrid('GridView1');
           const pageSize = grid.gridOptions.context?.pageOptions?.pageSize;
           eiInfo.addBlock(ER.Core.buildEiBlock([{ PAGE_NUM: queryPage, PAGE_SIZE: pageSize }], 'PAGEINFO'));
           await erFormHelper.callService('mmsm36f2_inq', eiInfo).then((res: any) => {
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

    //实绩信息
    const getSubGridProd = async () => {
      const eiInfo = new EI.EIInfo();


      erFormHelper.setGridServerPagingQuery('GridView2', eiInfo, (queryPage: number) => {        
        return new Promise(async (resolve, reject) => {
           const eiInfo = new EI.EIInfo();
           const eiBlock = erFormHelper.getAllControlValueAsEiBlock(layoutControlGroup1);
            eiBlock.addColumn('QUERY_DIV', 'TMMSM36'); //传表名
            eiInfo.addBlock(eiBlock, '');
           const result: any = { flag: -1, msg: '', data: undefined, total: 0 };
           const grid = erFormHelper.getGrid('GridView2');
           const pageSize = grid.gridOptions.context?.pageOptions?.pageSize;
           eiInfo.addBlock(ER.Core.buildEiBlock([{ PAGE_NUM: queryPage, PAGE_SIZE: pageSize }], 'PAGEINFO'));
           await erFormHelper.callService('mmsm36f2_inq', eiInfo).then((res: any) => {
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

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('GridView1');
      console.log('gridView1', gridView1);
      erFormHelper.setGridEditable(grid_view_1.value, false);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid2Ready = (e:any) => {


      gridView2 = erFormHelper.getGrid('GridView2');

      gridView2.gridOptions.getRowStyle = (params: any) => {
        if (params.data.DEAL_NOTION.toString().trim() != '0') {
          //封锁状态颜色为红色
          return {
            fontweight: 'blod',
            background: '#F78084'
          };
        }
      };

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

    const F2_DO = async (e: any) => {
      getSubGridLine();
      getSubGridProd();
    };
    const F3_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView_line1.value).length === 0) {
        erFormHelper.messageWarning('未选择材料信息');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line1.value, true)[0]; // 获取主表勾选行
        // 使用框架弹窗组件EFDialogForm
        openADDialog(mainGridCheckedRow);
      }
    };
    // 打开新增弹出画面
    const openADDialog = (currentRow: any) => {
      const MAT_NO = currentRow.MAT_NO;
      const HEAT_NO = currentRow.HEAT_NO;
      const PONO = currentRow.PONO;
      const HOT_FLAG = currentRow.HOT_FLAG;
      const MAT_ACT_WIDTH = currentRow.MAT_ACT_WIDTH;

      //连铸 初判
      const CASTING_PRE_JUDGMENT = currentRow.CASTING_PRE_JUDGMENT;

      //连铸用途
      const CASTING_PURPOSE = currentRow.CASTING_PURPOSE;
      //连铸机组
      const UNIT_CODE = currentRow.UNIT_CODE;
      const data = {
        PROC_DIV: 'I',
        HEAT_NO: HEAT_NO,
        PONO: PONO,
        MAT_NO: MAT_NO,
        HOT_FLAG: HOT_FLAG,
        MAT_ACT_WIDTH: MAT_ACT_WIDTH,
        CASTING_PRE_JUDGMENT: CASTING_PRE_JUDGMENT,
        CASTING_PURPOSE: CASTING_PURPOSE,
        UNIT_CODE: UNIT_CODE,
        QUERY_DIV: 'TMMSM01'
      };
      dialogFormName.value = 'MMSM36POP'; // 读配置表获取画面名
      parentInfo.value = data;
      openXrEfDialog();
    };

    const F4_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView_line2.value).length === 0) {
        erFormHelper.messageWarning('未选择实绩信息');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value, true)[0]; // 获取主表勾选行
        // 使用框架弹窗组件EFDialogForm
        openADDialog1(mainGridCheckedRow);
      }
    };
    // 打开修改弹出画面
    const openADDialog1 = (currentRow: any) => {
      const MAT_NO = currentRow.MAT_NO;
      const HEAT_NO = currentRow.HEAT_NO;
      const PONO = currentRow.PONO;
      const HOT_FLAG = currentRow.HOT_FLAG;
      const data = {
        PROC_DIV: 'U',
        HEAT_NO: HEAT_NO,
        PONO: PONO,
        MAT_NO: MAT_NO,
        HOT_FLAG: HOT_FLAG,
        QUERY_DIV: 'TMMSM36'
      };
      dialogFormName.value = 'MMSM36POP'; // 读配置表获取画面名
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
      dialogVisible.value = false;
      //getSubGridLine();
      getSubGridProd();
    };
    // 获取弹窗画面传递过来的数据 新增
    const getChildInfo = (info: any) => {
      if (info.close) {
        dialogVisible.value = false;
        /* xrEfDialogRef.value.close(); // 关闭弹框 */
        xrEfDialogClose();
      }
    };

    const F5_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView_line2.value).length === 0) {
        erFormHelper.messageWarning('请选择一条信息再删除');
      } else {
        // 删除提示
        const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
        if (confirm) {
          const eiInfo = new EI.EIInfo();
          const mainGridCheckedRow = erFormHelper.getGridCheckedRows(gridView_line2.value, true)[0]; // 获取主表勾选行
          const eiBlock = new EI.EiBlock();
          eiBlock.pushData(
            {
              PROC_DIV: 'D',
              DEV_CODE: mainGridCheckedRow.DEV_CODE,
              HOT_FLAG: mainGridCheckedRow.HOT_FLAG,
              START_TIME: mainGridCheckedRow.START_TIME,
              END_TIME: mainGridCheckedRow.END_TIME,
              STATION_ID: 'C',
              MAT_NO: mainGridCheckedRow.MAT_NO,
              HEAT_NO: mainGridCheckedRow.HEAT_NO
            },
            true
          );
          eiInfo.addBlock(
            eiBlock,
            /*  ErUtils.buildEiBlock([
              {
                PROC_DIV: 'D',
                DEV_CODE: mainGridCheckedRow.DEV_CODE,
                HOT_FLAG: mainGridCheckedRow.HOT_FLAG,
                START_TIME: mainGridCheckedRow.START_TIME,
                END_TIME: mainGridCheckedRow.END_TIME,
                STATION_ID: 'C',
                MAT_NO: mainGridCheckedRow.MAT_NO,
                HEAT_NO: mainGridCheckedRow.HEAT_NO
              }
            ]), */
            'PARA'
          );
          const outInfo = await erFormHelper.callService('mmsm36_pro', eiInfo);
          if (outInfo.sys.status < 0) {
            erFormHelper.messageError('删除失败:' + outInfo.sys.msg);
          } else {
            erFormHelper.messageSuccess('删除成功');
            getSubGridProd();
          }
        }
      }
    };

    return {
      dialogVisible,
      tabActiveKey,
      handleTabChange,
      erGrid2Ready,
      erGrid1Ready,
      efFormReady,
      erFormHelper,
      initializeFlag,
      gridToolbar,
      layoutControlGroup1,
      gridView_line1,
      gridView_line2,
      //kendoTabStrip,
      dialogFormName,
      xrEfDialogRef,
      parentInfo,
      getChildInfo,
      xrEfDialogClose,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO
    };
  }
});
