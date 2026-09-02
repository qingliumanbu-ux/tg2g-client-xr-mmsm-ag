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
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MMSMSJDCS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    xrEfSearchBox,
    xrEfDialog,
    erGrid,
    erLayout
  },
  setup() {
    // 获取画面的分区信息及设置画面初始化service
    const route = useRoute();
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;
    const tabActiveKey = ref('tab1');

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition;
      formName = efFormInfo.value.formName; // 当前画面名
      console.log('formName', formName);

      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      // 初始化低代码工具类
      QueryPara();
    };
    const initializeService = '';
    let gridView1: any;
    let gridView2: any;
    let gridView3: any;
    let gridView4: any;
    let gridView5: any;
    let gridView2Api: any;
    let gridView3Api: any;
    let gridView4Api: any;
    let gridView5Api: any;
    //定义详细信息tab页的画面名
    const oneTabName = ref('');
    const twoTabName = ref('');
    const threeTabName = ref('');
    const fourTabName = ref('');

    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    const initializeFlag = ref(0);

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
    const grid_view_4 = ref('');
    const grid_view_5 = ref('');
    const gridToolbar: Ref<any[]> = ref([]);
    //测温
    let tongdianOutInfo: EI.EIInfo;
    //加料
    let cwtongdianOutInfo: EI.EIInfo;
    //获取配置表中table_name的表名
    let table_name1 = ''; //实绩表名
    let table_name2 = ''; //加料表名
    let table_name3 = ''; //测温表名
    let table_name4 = ''; //通电表名
    let table_name5 = ''; //通电表名
    //定义是否显示tab页变量
    const isOneShow = ref<boolean>(false); // 是否显示第一个tab页
    const isTwoShow = ref<boolean>(false); // 是否显示第二个tab页
    const isThreeShow = ref<boolean>(false); // 是否显示第三个tab页
    const isFourShow = ref<boolean>(false); // 是否显示第四个tab页
    const isChildShow = ref<boolean>(false); // 是否显示详细信息(整个)

    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({}); // 给弹出画面传入数据
    //定义加载逻辑表名
    const table_name_main = ref(''); //主信息表名
    const table_name_one = ref('');
    const table_name_two = ref('');
    const table_name_three = ref('');
    const table_name_four = ref('');

    let str: any = ''; // 画面跳转传递的参数
    // 获取url的参数
    if (route.query.HEAT_NO) {
      console.log('路由参数--- ', route.query.HEAT_NO);
      str = route.query.HEAT_NO;
    } else {
      console.log('无路由参数--- ');
    }
    // 获取tab页组件的ref和实例
    const detailTabsRef = ref<any>(null);

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
    /* const setToolbarVisible = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, [
        { name: 'addrow', visible: visible },
        { name: 'copyrow', visible: visible },
        { name: 'delete', visible: visible }
        // { name: 'save', visible: visible },
        // { name: 'cancel', visible: visible }
      ]);
    }; */

    /* const contentLoad = async () => {
      console.log('e.item;');
    };
 */
    // //切换tab页时调用----被选择时调用
    // const select = async (e: kendo.ui.TabStripSelectEvent) => {
    //   /* const selected_id = e.item?.id;
    //   //获取炉次信息焦点行数据
    //   const mainGridCurrentRow = erFormHelper.getGridCurrentRow(gridView1);
    //   //没有获取炉次信息，不处理
    //   if (!mainGridCurrentRow) {
    //     return 0;
    //   } else if (selected_id === 'li1_id') {
    //     console.log('进来了老铁');
    //     // 加料信息
    //     const eiInfo1 = new EI.EIInfo();
    //     const eiBlock1 = eiInfo1.addBlock(new EI.EiBlock());
    //     eiBlock1.pushData(
    //       {
    //         HEAT_NO: mainGridCurrentRow.get('HEAT_NO'),
    //         PROC_NO: mainGridCurrentRow.get('PROC_NO'),
    //         TABLE_TYPE: table_name_one.value
    //       },
    //       true
    //     );
    //     console.log('eiBlock1', eiBlock1);
    //     const outInfo1 = await erFormHelper.callService(
    //       pagePara.service_f22,
    //       eiInfo1,
    //       true,
    //       false,
    //       true
    //     );
    //     if (outInfo1.sys.status < 0) {
    //       erFormHelper.messageError('查询错误:' + outInfo1.sys.msg);
    //     } else {
    //       erFormHelper.mergeDataToLayoutOrGrid(outInfo1, true, grid_view_2.value);
    //     }
    //   } */
    // };

    /* // grid工具栏按钮点击事件自定义
    const toolbarClick = (event: any, configId: string) => {
      if (event.name === 'addrow') {
        const mainGridCurrentRow = erFormHelper.getGridCurrentRow(gridView1, true);
        const gridData = erFormHelper.getGridAllRows(configId);
        const currentRow = gridData[gridData.length - 1];
        currentRow.set('HEAT_NO', mainGridCurrentRow.HEAT_NO);
        currentRow.set('PROC_NO', mainGridCurrentRow.PROC_NO);
      }
    }; */

    // 画面相关数据初始化
    const initializePage = async () => {
      /* const grid_views = pagePara.grid_view ? pagePara.grid_view.split(',') : [];
      const layouts = pagePara.layout_group_filter ? pagePara.layout_group_filter.split(',') : []; */
      const initialResult = await erFormHelper.Initialize(formPartition, i_form_ename, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        //初始化工具栏
        InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          //设置grid不可编辑
          erFormHelper.setGridEditable(grid_view_1.value, false);
          erFormHelper.setGridEditable(grid_view_2.value, false);
          erFormHelper.setGridEditable(grid_view_3.value, false);
          erFormHelper.setGridEditable(grid_view_4.value, false);
          erFormHelper.setGridEditable(grid_view_5.value, false);
          nextTick(() => {
            // 跳转画面的初始查询
            if (str) {
              erFormHelper.clearLayoutData(layout_group_filter.value);
              erFormHelper.setControlValue(layout_group_filter.value, 'HEAT_NO', str);
              queryMainGrid();
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

    //通过炼钢配置表，进行模板画面参数查询
    const QueryPara = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());

      eiBlock.pushData(
        {
          PROGRAM_NAME: formName
          // PROGRAM_NAME: programName
        },
        true
      );

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
            i_form_ename = pagePara.windows;
            table_type_x.value = pagePara.table_type_x ? pagePara.table_type_x : '';
            layout_group_filter.value = pagePara.layout_group_filter;
            grid_view_1.value = pagePara.grid_view.split(',')[0];
            grid_view_2.value = pagePara.grid_view.split(',')[1];
            grid_view_3.value = pagePara.grid_view.split(',')[2];
            grid_view_4.value = pagePara.grid_view.split(',')[3];
            grid_view_5.value = pagePara.grid_view.split(',')[4];

            //获取后台程序对应表名
            table_name_main.value = pagePara.table_name.split(',')[0];
            table_name_one.value = pagePara.table_name.split(',')[1];
            table_name_two.value = pagePara.table_name.split(',')[2];
            table_name_three.value = pagePara.table_name.split(',')[3];
            table_name_four.value = pagePara.table_name.split(',')[4];

            //根据配置决定是否加载gridView画面
            if (pagePara.func_id_one) {
              isOneShow.value = true;
              oneTabName.value = pagePara.func_id_one;
            } else {
              isOneShow.value = false;
            }

            if (pagePara.func_id_two) {
              isTwoShow.value = true;
              twoTabName.value = pagePara.func_id_two;
            } else {
              isTwoShow.value = false;
            }

            if (pagePara.func_id_three) {
              isThreeShow.value = true;
              threeTabName.value = pagePara.func_id_three;
            } else {
              isThreeShow.value = false;
            }

            if (pagePara.func_id_four) {
              isFourShow.value = true;
              fourTabName.value = pagePara.func_id_four;
            } else {
              isFourShow.value = false;
            }

            if (
              isOneShow.value === false &&
              isTwoShow.value === false &&
              isThreeShow.value === false &&
              isFourShow.value === false
            ) {
              isChildShow.value = false;
            } else {
              isChildShow.value = true;
            }

            console.log('pagePara', pagePara, layout_group_filter);
            nextTick(() => {
              initializePage();
            });
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    };

    // 查询主表炉次信息
    const queryMainGrid = async () => {
      const eiInfo = new EI.EIInfo();
      const queryConditionEiBlock: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock(layout_group_filter.value, {
        // FACTORY_DIV: pagePara.factory_div,
        FACTORY_DIV: ' ',
        TABLE_TYPE: 'T' + i_form_ename.slice(0, 6).toUpperCase()
      });
      eiInfo.addBlock(queryConditionEiBlock);
      console.log('eiInfo', eiInfo);
      const outInfo = await erFormHelper.callService(pagePara.service_f21, eiInfo, true, false, true);
      console.log('outInfo', outInfo);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        // erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'GridView1');
        erFormHelper.mergeDataToGrid(outInfo, grid_view_1.value);
      }
    };

    // grid渲染完成事件
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid(grid_view_1.value);
      erFormHelper.setGridEditable(grid_view_1.value, false); // 设置grid不可编辑
    };
    const erGrid2Ready = (e: any) => {
      gridView2 = erFormHelper.getGrid(grid_view_2.value);
      gridView2Api = e.api;
      erFormHelper.setGridEditable(grid_view_2.value, false); // 设置grid不可编辑
      erFormHelper.initialGridToolbar(grid_view_2.value, {
        excel: { visible: true }
      });
      if (cwtongdianOutInfo) {
        erFormHelper.mergeDataToGrid(cwtongdianOutInfo, grid_view_2.value, true);
      }
    };
    const erGrid3Ready = (e: any) => {
      gridView3 = erFormHelper.getGrid(grid_view_3.value);
      gridView3Api = e.api;
      erFormHelper.setGridEditable(grid_view_3.value, false); // 设置grid不可编辑
      erFormHelper.initialGridToolbar(grid_view_3.value, {
        excel: { visible: true }
      });
      if (cwtongdianOutInfo) {
        erFormHelper.mergeDataToGrid(cwtongdianOutInfo, grid_view_4.value, true);
      }
    };
    const erGrid4Ready = (e: any) => {
      gridView4 = erFormHelper.getGrid(grid_view_4.value);
      gridView4Api = e.api;
      erFormHelper.setGridEditable(grid_view_4.value, false); // 设置grid不可编辑
      erFormHelper.initialGridToolbar(grid_view_4.value, {
        excel: { visible: true }
      });
      if (cwtongdianOutInfo) {
        erFormHelper.mergeDataToGrid(cwtongdianOutInfo, grid_view_4.value, true);
      }
    };
    const erGrid5Ready = (e: any) => {
      gridView5 = erFormHelper.getGrid(grid_view_5.value);
      gridView5Api = e.api;
      erFormHelper.setGridEditable(grid_view_5.value, false); // 设置grid不可编辑
      erFormHelper.initialGridToolbar(grid_view_5.value, {
        excel: { visible: true }
      });
      if (cwtongdianOutInfo) {
        erFormHelper.mergeDataToGrid(cwtongdianOutInfo, grid_view_5.value, true);
      }
    };

    // 查询子表明细信息
    // const queryDetailInfo = async (currentRowInfo: any) => {
    //   // 加料信息
    //   const eiInfo1 = new EI.EIInfo();
    //   const eiBlock1 = eiInfo1.addBlock(new EI.EiBlock());
    //   eiBlock1.pushData({ ...currentRowInfo, TABLE_TYPE: table_name_one.value }, true);
    //   const outInfo1 = await erFormHelper.callService(pagePara.service_f22, eiInfo1, true, false, true);
    //   if (outInfo1.sys.status < 0) {
    //     erFormHelper.messageError('查询错误:' + outInfo1.sys.msg);
    //   } else {
    //     erFormHelper.mergeDataToLayoutOrGrid(outInfo1, true, grid_view_2.value);
    //   }
    //   // 测温信息
    //   const eiInfo2 = new EI.EIInfo();
    //   const eiBlock2 = eiInfo2.addBlock(new EI.EiBlock());
    //   eiBlock2.pushData({ ...currentRowInfo, TABLE_TYPE: table_name_two.value }, true);

    //   const outInfo2 = await erFormHelper.callService(pagePara.service_f22, eiInfo2, true, false, true);
    //   if (outInfo2.sys.status < 0) {
    //     erFormHelper.messageError('查询错误:' + outInfo2.sys.msg);
    //   } else {
    //     erFormHelper.mergeDataToLayoutOrGrid(outInfo2, true, grid_view_3.value);
    //   }
    //   // 第三个tab页子表（eg. 通电信息）
    //   if (isThreeShow.value) {
    //     const eiInfo3 = new EI.EIInfo();
    //     const eiBlock3 = eiInfo3.addBlock(new EI.EiBlock());
    //     eiBlock3.pushData({ ...currentRowInfo, TABLE_TYPE: table_name_three.value }, true);
    //     const outInfo3 = await erFormHelper.callService(pagePara.service_f22, eiInfo3, true, false, true);
    //     if (outInfo3.sys.status < 0) {
    //       erFormHelper.messageError('查询错误:' + outInfo3.sys.msg);
    //     } else {
    //       erFormHelper.mergeDataToLayoutOrGrid(outInfo3, true, grid_view_4.value);
    //     }
    //   }
    //   //第四个tab页表
    //   if (isFourShow.value) {
    //     const eiInfo4 = new EI.EIInfo();
    //     const eiBlock4 = eiInfo4.addBlock(new EI.EiBlock());
    //     eiBlock4.pushData({ ...currentRowInfo, TABLE_TYPE: table_name_four.value }, true);
    //     const outInfo4 = await erFormHelper.callService(pagePara.service_f22, eiInfo4, true, false, true);
    //     if (outInfo4.sys.status < 0) {
    //       erFormHelper.messageError('查询错误:' + outInfo4.sys.msg);
    //     } else {
    //       erFormHelper.mergeDataToLayoutOrGrid(outInfo4, true, grid_view_4.value);
    //     }
    //   }
    // };

    // 主表焦点行事件-查询子表明细信息
    const GridView1FocusChanged = async (e: any) => {
      // if (e && e.rowChanged) {
      //   if (e.data) {
      //     queryDetailInfo({
      //       PROC_NO: e.data.get('PROC_NO'),
      //       HEAT_NO: e.data.get('HEAT_NO')
      //     });
      //   }
      // }
    };

    const handleTabChange = (activeKey: string) => {
      // if (activeKey === 'tab1') {
      // } else if (activeKey === 'tab2') {
      // } else if (activeKey === 'tab3') {
      // } else if (activeKey === 'tab4') {
      // }
    };

    onMounted(() => {
      //QueryPara();
      // handleEfDialogMessage(); // 接收弹出画面传入的数据;
    });

    //window.JSZip = JSZip;
    const F2_DO = async (e: any) => {
      queryMainGrid();
    };
    return {
      handleTabChange,
      tabActiveKey,
      F2_DO,
      initializeFlag,
      erFormHelper,
      gridToolbar,
      grid_view_1,
      grid_view_2,
      grid_view_3,
      grid_view_4,
      grid_view_5,
      layout_group_filter,
      isOneShow,
      isTwoShow,
      isThreeShow,
      isFourShow,
      oneTabName,
      twoTabName,
      threeTabName,
      fourTabName,
      //toolbarClick,
      GridView1FocusChanged,
      isChildShow,
      erGrid5Ready,
      erGrid4Ready,
      erGrid3Ready,
      erGrid2Ready,
      erGrid1Ready,
      efFormReady
    };
  }
});
