import { defineComponent, onMounted, ref, reactive, computed, nextTick, toRaw, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import EFDialogForm from 'EFX/EFDialogForm';
import MMSMKRPOP from '../MMSMKRPOP/MMSMKRPOP.vue';
import xrEfDialog from 'EFX/xrEfDialog';

import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MMSMKRS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    xrEfDialog,
    erGrid,
    MMSMKRPOP
  },
  setup: () => {
    const route = useRoute();
    // 变量定义
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      console.log('efFormInfo', efFormInfo);
      QueryPara();
    };

    const dialogVisible = ref<boolean>(false);
    // 弹框ref
    const xrEfDialogRef = ref<any>(null);
    // 点击按钮打开弹框
    const openXrEfDialog = (PROC_DIV: string) => {
      dialogVisible.value = true;
      proc_div = PROC_DIV;
    };

    // 获取值：获取事件参数为传递的数据
    const getChildInfo = (info: any) => {
      console.log('获取弹窗画面传递过来的信息', info);
      if (info.close) {
        proc_div = info.PROC_DIV;
        dialogVisible.value = false; // 关闭弹框
        closeXrEfDialog();
      }
    };
    // 关闭弹窗事件
    const closeXrEfDialog = () => {
      // 如果是修改，则不做主表查询，只做子表查询，保持主表焦点行不变
      if (proc_div === 'U') {
        const currentRow = erFormHelper.getGridCurrentRow(grid_view_1.value, true);
        queryMainGrid({
          HEAT_NO: currentRow.HEAT_NO
        });
        queryDetailInfo({
          PROC_NO: currentRow.PROC_NO,
          HEAT_NO: currentRow.HEAT_NO
        });
      } else if (proc_div === 'I') {
        queryMainGrid(true); // 关闭弹框后查询主表
      }
    };
    //const { openEfDialog, closeEfDialog } = EFDialogForm();

    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const initializeService = '';

    let gridView1: any;
    let gridView2: any;
    let gridView3: any;
    let gridView4: any;
    let gridViewCf: any;
    const tab1ActiveKey = ref('tab1');
    let tab2ActiveKey = ref('tab1');
    let F6_Status = 0; // F6按钮状态，0: 未进入多步，1: 进入多步
    let F7_Status = 0; // F7按钮状态，0: 未进入多步，1: 进入多步
    let F8_Status = 0; // F8按钮状态，0: 未进入多步，1: 进入多步

    let pagePara: any; // 炼钢配置表页面参数
    let i_form_ename = ''; // 低代码配置画面布局名
    const isThirdTabShow = ref<boolean>(false); // 是否显示第三个tab页
    const thirdTabName = ref(''); // 第三个tab页的标题名
    const table_type_x = ref(''); // 第三个tab中的表名
    const isJialiaoTabShow = ref<boolean>(true); // 是否显示加料tab页
    const layout_group_filter = ref('');
    const grid_view_1 = ref('');
    const grid_view_2 = ref('');
    const grid_view_3 = ref('');
    let touliaoOutInfo: EI.EIInfo;
    let cewenOutInfo: EI.EIInfo;
    let tongdianOutInfo: EI.EIInfo;
    const gridToolbar2: Ref<any[]> = ref([]);
    const gridToolbar3: Ref<any[]> = ref([]);
    const gridView_cf_caption = ref<string>(''); // gridView_cf的低代码配置标题名
    let str: any = ''; // 画面跳转传递的参数
    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({}); // 给弹出画面传入数据
    let proc_div = ''; // 'I'新增，'U'修改
    let gridView2Api: any;
    let layoutMainCols: any;
    // 获取url的参数
    if (route.query.HEAT_NO) {
      console.log('路由参数--- ', route.query.HEAT_NO);
      str = route.query.HEAT_NO;
    } else {
      console.log('无路由参数--- ');
    }

    // 自定义工具栏按钮功能
    const InitialToolbar = () => {
      erFormHelper.initialGridToolbar(grid_view_2.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false }
      });
      erFormHelper.initialGridToolbar(grid_view_3.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false }
      });
    };

    // 自定义grid工具栏按钮是否可用
    const setToolbarVisible = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, {
        addrow: visible,
        copyrow: visible,
        delete: visible
      });
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        //初始化工具栏
        InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 设置grid不可编辑
          erFormHelper.setGridEditable(grid_view_1.value, false);
          erFormHelper.setGridEditable(grid_view_2.value, false);
          erFormHelper.setGridEditable(grid_view_3.value, false);
          erFormHelper.setGridEditable('gridView_cf', false);

          nextTick(() => {
            // 跳转画面的初始查询
            if (str) {
              erFormHelper.clearLayoutData(layout_group_filter.value);
              erFormHelper.setControlValue(layout_group_filter.value, 'HEAT_NO', str);
              queryMainGrid(true);
            }

            nextTick(() => {
              // 设置实绩区域初始只读
              erFormHelper.setAllControlReadOnly('layoutControlGroupMain', true);
              erFormHelper.setAllControlReadOnly('layoutControlGroupRemark', true);
            });
          });
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    // grid工具栏按钮点击事件自定义
    const toolbarClick = (event: any, configId: string) => {
      if (event.name === 'addrow') {
        const mainGridCurrentRow = erFormHelper.getGridCurrentRow(gridView1, true);
        const gridData = erFormHelper.getGridAllRows(configId);
        const currentRow = gridData[gridData.length - 1];
        currentRow.set('HEAT_NO', mainGridCurrentRow.HEAT_NO);
        currentRow.set('PROC_NO', mainGridCurrentRow.PROC_NO);
      }
    };

    //通过炼钢配置表，进行模板画面参数查询
    const QueryPara = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());

      eiBlock.pushData(
        {
          PROGRAM_NAME: formName
          // PROGRAM_NAME: 'MMSMADD23'
        },
        true
      );

      console.log('eiBlock---', eiBlock);
      EIManager.callService(formPartition, 'mmsmpara_inq', eiInfo)
        .then((res: EI.EIInfo) => {
          if (res.status === 0) {
            // const resData: any = res.blocks['MMSMPARA_INQ'].data.map((item) => {
            //   return {
            //     PARA_NAME: item.PARA_NAME,
            //     PARA_DESC: item.PARA_DESC,
            //     PARA: item.PARA
            //   };
            // });
            const resData: any = {};
            res.blocks['MMSMPARA_INQ'].data.forEach((item: any) => {
              resData[item.PARA_NAME] = item.PARA;
            });
            console.log('resData---', resData);
            pagePara = resData;
            table_type_x.value = pagePara.table_type_x ? pagePara.table_type_x : '';
            layout_group_filter.value = pagePara.layout_group_filter;
            grid_view_1.value = pagePara.grid_view.split(',')[0];
            grid_view_2.value = pagePara.grid_view.split(',')[1];
            grid_view_3.value = pagePara.grid_view.split(',')[2];
            console.log('pagePara.grid_view---', pagePara.grid_view);

            console.log('grid_view_1.value---', grid_view_1.value);
            console.log('grid_view_2.value---', grid_view_2.value);
            console.log('grid_view_3.value---', grid_view_3.value);
            if (pagePara.func_id_s_c) {
              isThirdTabShow.value = true;
              thirdTabName.value = pagePara.func_id_s_c;
            } else {
              isThirdTabShow.value = false;
            }
            nextTick(() => {
              initializePage();
              /*  setTimeout(() => {initializePage();}, 3000); */
            });
            console.log('流程', 4);
          }
        })
        .catch((error: any) => {
          console.log('aaaaaaaaaaa', error);
        });
    };
    //---
    // grid渲染完成事件
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid(grid_view_1.value);
      erFormHelper.setGridEditable(grid_view_1.value, false); // 设置grid不可编辑
    };
    const erGrid2Ready = (e: any) => {
      gridView2 = erFormHelper.getGrid(grid_view_2.value);
      gridView2Api = e.api;
      erFormHelper.setGridEditable(grid_view_2.value, false); // 设置grid不可编辑
      erFormHelper.initialGridToolbar(
        grid_view_2.value,
        {
          excel: { visible: true },
          addrow: {
            visible: false,
            action: () => {
              // 新增行自动填充熔炼号和生产处理号
              const mainGridCurrentRow = erFormHelper.getGridCurrentRow(gridView1);
              const gridData = erFormHelper.getGridAllRows(grid_view_2.value);
              const currentRow = gridData[gridData.length - 1]; // 新增行在最后一行
              // const currentRow = gridData[0];
              const currentRowNode = gridView2Api.getRowNode(currentRow.uid);
              currentRowNode.setDataValue('HEAT_NO', mainGridCurrentRow.HEAT_NO);
              currentRowNode.setDataValue('PROC_NO', mainGridCurrentRow.PROC_NO);
            }
          }
        },
        {
          showIco: true,
          showText: true
        }
      );

      if (touliaoOutInfo) {
        erFormHelper.mergeDataToGrid(touliaoOutInfo, grid_view_2.value, true);
      }
      if (F6_Status) {
        // 如果F7处于多步状态
        // 设置工具栏按钮可见
        setToolbarVisible(grid_view_2.value, true);
      }
    };
    const erGrid3Ready = () => {
      gridView3 = erFormHelper.getGrid(grid_view_3.value);
      erFormHelper.setGridEditable(grid_view_3.value, false); // 设置grid不可编辑
      if (cewenOutInfo) {
        erFormHelper.mergeDataToGrid(cewenOutInfo, grid_view_3.value, true);
      }
      if (F7_Status) {
        // 如果F7处于多步状态
        // 设置工具栏按钮可见
        setToolbarVisible(grid_view_3.value, true);
      }
      if (tongdianOutInfo) {
        erFormHelper.mergeDataToGrid(tongdianOutInfo, grid_view_3.value, true);
      }
    };
    //--

    // 查询主表炉次信息
    const queryMainGrid = async (currentRowInfo: any) => {
      const eiInfo = new EI.EIInfo();
      const queryConditionEiBlock: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock(layout_group_filter.value, {
        FACTORY_DIV: pagePara.factory_div,
        TABLE_TYPE: 'T' + formName.slice(0, 6)
      });
      eiInfo.addBlock(queryConditionEiBlock);
      console.log('diaoyong', pagePara.service_f2);
      console.log('eiInfo', eiInfo);
      const outInfo = await erFormHelper.callService(pagePara.service_f2, eiInfo, false, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        // erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'GridView1');
        erFormHelper.mergeDataToGrid(outInfo, grid_view_1.value);
      }
    };

    // 查询子表明细信息
    const queryDetailInfo = async (currentRowInfo: any) => {
      // 加料信息
      const eiInfo1 = new EI.EIInfo();
      const eiBlock1 = eiInfo1.addBlock(new EI.EiBlock());
      eiBlock1.pushData({ ...currentRowInfo, TABLE_TYPE: 'TMMSM2A' }, true);
      tongdianOutInfo = await erFormHelper.callService(pagePara.service_f21, eiInfo1, false, false, true);
      if (tongdianOutInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + tongdianOutInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToLayoutOrGrid(tongdianOutInfo, true, grid_view_2.value);
      }

      // 成分信息
      const eiInfo2 = new EI.EIInfo();
      const eiBlock2 = eiInfo2.addBlock(new EI.EiBlock());
      eiBlock2.pushData({ ...currentRowInfo, TABLE_TYPE: 'T' + formName.slice(0, 6) }, true);
      const outInfo2 = await erFormHelper.callService(pagePara.service_f22, eiInfo2, true, false, true);
      if (outInfo2.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo2.sys.msg);
      } else {
        erFormHelper.mergeDataToLayoutOrGrid(outInfo2, true, grid_view_3.value);
      }
    };

    // 主表行双击事件-弹出修改框
    // 主表行双击事件-弹出修改框
    const GridView1DoubleClick = async (e: any) => {
      if (e && e.data) {
        openADDUDialog(e.data);
      }
    };

    //主数据焦点行事件
    const gridView1FocusChanged = async (e: any) => {
      console.log(e);
      if (!e.data) {
        erFormHelper.clearGridData(gridView2, gridView3, gridView4); // 清空子表数据
        return;
      }
      if (e && e.rowChanged) {
        if (e.data) {
          // console.log(e.data.get('PROC_NO'));
          queryDetailInfo({
            PROC_NO: e.data.get('PROC_NO'),
            HEAT_NO: e.data.get('HEAT_NO')
          });
        }
      }
    };

    // 打开修改弹出画面
    const openADDUDialog = (currentRow: any) => {
      // const mainGridCheckedRow = erFormHelper.getGridCheckedRows(grid_view_1.value, true)[0];
      // const HEAT_NO = mainGridCheckedRow.HEAT_NO;
      const HEAT_NO = currentRow.HEAT_NO;
      // const PROC_NO = mainGridCheckedRow.PROC_NO;
      const PROC_NO = currentRow.PROC_NO;
      const data = {
        //currentRow,
        PROC_DIV: 'U',
        HEAT_NO: HEAT_NO,
        PROC_NO: PROC_NO
      };

      //const dialogFormName = formName.slice(0, 6).toUpperCase() + "POPU";
      // 打开新增弹出画面
      // openEfDialog(dialogFormName, data, {
      //   height: 500,
      //   width: 1200,
      // });
      dialogFormName.value = pagePara.updPopFormName; // 读配置表获取画面名
      console.log(dialogFormName.value);
      parentInfo.value = data;
      openXrEfDialog('U');
    };

    // 接收弹出画面传入的数据-在mounted中调用
    const handleEfDialogMessage = () => {
      // listenerMessageEvent((messageData: any) => {
      //   // 根据弹出画面传入的closeEfDialog关闭弹框
      //   if (messageData.closeEfDialog) {
      //     closeEfDialog();
      //     queryMainGrid();
      //   }
      // });
    };

    onMounted(() => {});

    // window.JSZip = JSZip;

    //查询
    const F2_DO = async (e: any) => {
      queryMainGrid(true);
    };

    //新增
    const F3_DO = async (e: any) => {
      const data = {
        PROC_DIV: 'I'
      };
      //const dialogFormName = formName.slice(0, 6).toUpperCase() + "POPA";
      //打开新增弹出画面
      // openEfDialog(dialogFormName, data, {
      //   height: 500,
      //   width: 1200,
      // });
      dialogFormName.value = pagePara.addPopFormName; // 读配置表获取画面名
      parentInfo.value = data;
      console.log(dialogFormName.value);
      openXrEfDialog('I');
    };

    //修改
    const F4_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(grid_view_1.value).length === 0) {
        erFormHelper.messageWarning('请选择一条信息进行操作');
      } else {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRows(grid_view_1.value, true)[0];
        console.log('mainGridCheckedRow', mainGridCheckedRow);

        openADDUDialog(mainGridCheckedRow);
      }
    };

    //删除
    const F5_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(grid_view_1.value).length === 0) {
        erFormHelper.messageWarning('请选择一条信息再删除');
      } else {
        // 删除提示
        const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
        if (confirm) {
          const eiInfo = new EI.EIInfo();
          const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock(grid_view_1.value, {
            // FACTORY_DIV: pagePara.factory_div,
            // STATION_ID: pagePara.station_id,
            PROC_DIV: 'D'
          });
          const eiBlock = eiInfo.addBlock(checkedRowEiBlock, 'PARA');
          const outInfo = await erFormHelper.callService(pagePara.service_f5, eiInfo, true, false, true);
          if (outInfo.sys.status < 0) {
            erFormHelper.messageError('删除失败:' + outInfo.sys.msg);
          } else {
            erFormHelper.messageSuccess('删除成功');
            queryMainGrid(true);
          }
        }
      }
    };

    //加料确认
    const F6_DO = async (e: any) => {
      // openF6Dialog(); // 打开加料维护弹窗
      const eiInfo = new EI.EIInfo();
      //获取新增行的数据
      const created = erFormHelper.getGridRows(gridView2, 'add', true);
      const newcreated = created.map((item) => {
        item.STATION_ID = pagePara.station_id;
        return item;
      });
      const createdBlock = new EI.EiBlock();
      createdBlock.pushData(toRaw(newcreated), true);
      eiInfo.addBlock(createdBlock, 'MMSM_2A_INS');
      //获取修改行的数据
      const modified = erFormHelper.getGridRows(gridView2, 'modify', true);
      const newmodified = modified.map((item) => {
        item.STATION_ID = pagePara.station_id;
        return item;
      });
      const modifiedBlock = new EI.EiBlock();
      modifiedBlock.pushData(toRaw(newmodified), true);
      eiInfo.addBlock(modifiedBlock, 'MMSM_2A_UPD');
      //获取删除行的数据
      const deleted = erFormHelper.getGridRows(gridView2, 'delete', true);
      const newdeleted = deleted.map((item) => {
        item.STATION_ID = pagePara.station_id;
        return item;
      });
      const deletedBlock = new EI.EiBlock();
      deletedBlock.pushData(toRaw(newdeleted), true);
      eiInfo.addBlock(deletedBlock, 'MMSM_2A_DEL');
      console.log('eiInfo', eiInfo);
      const outInfo = await erFormHelper.callService('mmsm2a_pro', eiInfo, true, false, true);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        return false;
      } else {
        // 隐藏工具栏按钮
        setToolbarVisible(grid_view_2.value, false);
        //设置grid不可编辑
        erFormHelper.setGridEditable(grid_view_2.value, false);
        const mainGridCurrentRow = erFormHelper.getGridCurrentRow(gridView1, true);
        if (mainGridCurrentRow) {
          queryDetailInfo({
            PROC_NO: mainGridCurrentRow.PROC_NO,
            HEAT_NO: mainGridCurrentRow.HEAT_NO
          });
        }
      }
    };

    //加料
    const F6_PRE_DO = async (e: any) => {
      const mainGridCurrentRow = erFormHelper.getGridSelectRows(gridView1, true);
      // 主表有选中行时才可进入维护状态
      if (mainGridCurrentRow.length === 0) {
        erFormHelper.messageWarning('请选择一条信息再维护');
        return 0; //这里return 0 后就需要再点击取消，return;不管用
      } else {
        const mainGridCurrentRow = erFormHelper.getGridSelectRows(gridView1, true);
        // 设置工具栏按钮可见
        setToolbarVisible(grid_view_2.value, true);
        //设置grid可编辑
        erFormHelper.setGridEditable(grid_view_2.value, true);
      }
    };

    //F6加料取消
    const F6_CANCEL = async (e: any) => {
      // 重新绑数据
      if (tongdianOutInfo) {
        erFormHelper.mergeDataToGrid(tongdianOutInfo, grid_view_2.value, true);
      } else {
        erFormHelper.clearGridData(grid_view_2.value);
      }
      // 撤销所有修改
      //gridView2.dataSource.cancelChanges();
      // 隐藏工具栏按钮
      setToolbarVisible(grid_view_2.value, false);
      //设置grid不可编辑
      erFormHelper.setGridEditable(grid_view_2.value, false);
      F6_Status = 0;
    };

    return {
      efFormReady,
      layout_group_filter,
      grid_view_1,
      grid_view_2,
      grid_view_3,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      F6_DO,
      F6_PRE_DO,
      F6_CANCEL,
      initializeFlag,
      erFormHelper,
      toolbarClick,
      erGrid1Ready,
      erGrid2Ready,
      erGrid3Ready,
      gridView1FocusChanged,
      xrEfDialogRef,
      openXrEfDialog,
      parentInfo,
      getChildInfo,
      closeXrEfDialog,
      GridView1DoubleClick,
      dialogVisible,
      dialogFormName,
      tab1ActiveKey,
      tab2ActiveKey,
      isJialiaoTabShow,
      isThirdTabShow,
      thirdTabName,
      gridView_cf_caption
    };
  }
});
