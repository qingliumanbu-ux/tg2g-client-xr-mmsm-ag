/*
 * @Description:
 * @Author: Edward
 * @Date: 2022-06-02 17:21:37
 * @LastEditors: zhangTing
 * @LastEditTime: 2023-07-19 15:13:06
 */
import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MMSMPOPV',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid
  },
  // 接收父画面传递过来的参数
  props: {
    openInDialog: {
      type: Boolean,
      default: false
    },
    dialogFormName: {
      type: String,
      default: ''
    },
    parentInfo: {
      type: Object
    }
  },
  // 向父画面传递数据-注册emit监听事件
  emits: ['getChildInfo'],
  // setup中添加props和emit
  setup: (props, { emit }) => {
    // 变量定义
    const efFormInfo = ref<{ [key: string]: any }>({});
    // const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;
    let formParams: any = '';
    const initializeService = '';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      // efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      if (efFormInfo.value.formParams?.form_name) {
        PROGRAM_NAME = efFormInfo.value.formParams['form_name'];
      }
      QueryPara();
    };

    // 获取画面相关配置信息
    const efFormInitialized = (formInfo: any) => {
      console.log('efFormInitialized', formInfo);
      formParams = formInfo;
      formPartition = formParams.formPartition;
      formName = formParams.formName;
      nextTick(() => {
        QueryPara();
      });
    };

    let pagePara: any; // 炼钢配置表页面参数
    let i_form_ename = ''; // 低代码配置画面布局名
    const gridToolbar1: Ref<any[]> = ref([]);
    const gridToolbar2: Ref<any[]> = ref([]);
    let grid_view_cf: any;
    let grid_view_auxi: any;
    let grid_view_temp: any;
    const gridView_cf_caption = ref<string>(''); // gridView_cf的低代码配置标题名
    const parentInfo = ref(props.parentInfo); // 获取父画面传入参数
    const PROC_DIV = parentInfo.value?.PROC_DIV;
    const HEAT_NO_THIS = parentInfo.value?.HEAT_NO;
    const L2_PROC_NO_THIS = parentInfo.value?.L2_PROC_NO;
    const isGridViewAuxiShow = ref<boolean>(false); // 是否显示gridView_auxi
    const isGridViewCfShow = ref<boolean>(false); // 是否显示gridView_cf
    const isLayout2Show = ref<boolean>(false); // 是否显示layoutControlGroup2
    //获取配置表中table_name的表名
    let table_name1 = ''; //实绩表名
    let table_name2 = ''; //加料表名
    let table_name3 = ''; //测温表名
    // 自定义工具栏按钮功能
    // const InitialToolbar = () => {
    //   gridToolbar1.value = erFormHelper.getGridToolbar([
    //     { name: "excel", visible: true },
    //     {
    //       name: "addrow",
    //       visible: false,
    //     },
    //     { name: "copyrow", visible: false },
    //     { name: "delete", visible: false },
    //     // { name: 'save', visible: false },
    //     // { name: 'cancel', visible: false }
    //   ]);
    //   gridToolbar2.value = erFormHelper.getGridToolbar([
    //     { name: "excel", visible: true },
    //     {
    //       name: "addrow",
    //       visible: true,
    //     },
    //     { name: "copyrow", visible: true },
    //     { name: "delete", visible: true },
    //     // { name: 'save', visible: false },
    //     // { name: 'cancel', visible: false }
    //   ]);
    // };

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, i_form_ename, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        //初始化工具栏
        //InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          // grid_view_cf = erFormHelper.getKendoGrid("gridView_cf");
          // grid_view_auxi = erFormHelper.getKendoGrid("gridView_auxi");
          // grid_view_temp = erFormHelper.getKendoGrid("gridView_temp");

          // 获取gridView_cf的低代码配置标题名
          gridView_cf_caption.value = erFormHelper.getConfigInfo('gridView_cf', true)?.TSI00GRIDVIEW[0].FUNCNAME;
          // let mainTableModel = new kendo.data.Model({});
          // mainTableModel = erFormHelper.addModelToLayout(
          //   "layoutControlGroup1",
          //   true,
          //   "default"
          // );
          nextTick(() => {
            // 进入画面后先查询实绩投料测温等信息
            if (HEAT_NO_THIS && L2_PROC_NO_THIS) {
              console.log('HEAT_NO_THIS', HEAT_NO_THIS, L2_PROC_NO_THIS);

              queryAll();
            } else {
              nextTick(() => {
                // erFormHelper.setGridToolbarPosition(grid_view_cf, "bottom"); // 设置grid工具栏位置固定在下方
                // erFormHelper.setGridToolbarPosition(grid_view_auxi, "bottom");
                // erFormHelper.setGridToolbarPosition(grid_view_temp, "bottom");
              });
            }
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
            //获取表名
            table_name1 = pagePara.table_name.split(',')[0];
            table_name2 = pagePara.table_name.split(',')[1];
            table_name3 = pagePara.table_name.split(',')[2];

            isGridViewAuxiShow.value =
              pagePara.grid_view.split(',').indexOf('gridView_auxi') === -1 &&
              pagePara.table_name.split(',').indexOf('TMMSM2A') === -1
                ? false
                : true;
            isGridViewCfShow.value = pagePara.grid_view.split(',').indexOf('gridView_cf') === -1 ? false : true;
            //i_form_ename.includes('MMSM21POP') || i_form_ename.includes('MMSM31POP')
            if (false) {
              //这里太钢环境弃用
              isLayout2Show.value = true; // MMSMADD21画面有layoutControlGroup2
            } else {
              isLayout2Show.value = false; // 其他子画面没有layoutControlGroup2
            }

            nextTick(() => {
              initializePage();
            });
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    };

    // layout区域加载完成事件
    const layout1Loaded = async (e: any) => {
      erFormHelper.clearLayoutData(e.configId);
      // 获取layout中所有的字段
      // layout1Cols = erFormHelper.getLayoutBindModel(e.configId)?.toJSON();
      if (L2_PROC_NO_THIS) {
        // 查询工序实绩
        //queryShiji("layoutControlGroup1");
        queryAll();
      }
    };
    const layout2Loaded = async (e: any) => {
      erFormHelper.clearLayoutData(e.configId);
      // 获取layout中所有的字段
      // layout2Cols = erFormHelper.getLayoutBindModel(e.configId)?.toJSON();
      if (L2_PROC_NO_THIS) {
        // 查询工序实绩
        queryAll();
      }
    };

    const layout4Loaded = async (e: any) => {
      erFormHelper.clearLayoutData(e.configId);
      // 获取layout中所有的字段
      // layout2Cols = erFormHelper.getLayoutBindModel(e.configId)?.toJSON();
      if (L2_PROC_NO_THIS) {
        // 查询工序实绩
        queryAll();
      }
    };

    // 修改时进入画面查询
    const queryAll = async () => {
      // 查询工序实绩
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const queryCondition = {
        HEAT_NO: HEAT_NO_THIS,
        L2_PROC_NO: L2_PROC_NO_THIS,
        FACTORY_DIV: pagePara.factory_div,
        // STATION_ID: pagePara.station_id,
        STATION_NO: pagePara.station_no,
        TABLE_TYPE: table_name1
      };
      eiBlock.pushData(queryCondition, true);

      const outInfo = await erFormHelper.callService(pagePara.service_f21, eiInfo, false, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.setControlValueEx('layoutControlGroup1', outInfo.getBlock(0).data[0]);
        erFormHelper.setControlValueEx('layoutControlGroup2', outInfo.getBlock(0).data[0]);
        erFormHelper.setControlValueEx('layoutControlGroup3', outInfo.getBlock(0).data[0]);
        erFormHelper.setControlValueEx('layoutControlGroup4', outInfo.getBlock(0).data[0]);

        /*  queryDetail('TMMSM2A', 'gridView_auxi');
        queryDetail('TMMSM2B', 'gridView_temp');
        queryDetailCf(); */
      }
    };

    // 查询投料测温等子表
    const queryDetail = async (TABLE_TYPE: string, configId: string) => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const queryCondition = {
        HEAT_NO: HEAT_NO_THIS,
        L2_PROC_NO: L2_PROC_NO_THIS,
        TABLE_TYPE: TABLE_TYPE
      };
      eiBlock.pushData(queryCondition, true);
      const outInfo = await erFormHelper.callService(pagePara.service_f22, eiInfo, false, false, true);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, configId);
      }
      nextTick(() => {
        // 设置grid工具栏位置固定在下方
        // erFormHelper.setGridToolbarPosition(grid_view_auxi, "bottom");
        // erFormHelper.setGridToolbarPosition(grid_view_temp, "bottom");
      });
    };

    // 查询成分信息
    const queryDetailCf = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const queryCondition = {
        HEAT_NO: HEAT_NO_THIS
      };
      eiBlock.pushData(queryCondition, true);
      const outInfo = await erFormHelper.callService('mmsmcf_inq', eiInfo, false, false, true);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'gridView_cf');
      }
      nextTick(() => {
        // 设置grid工具栏位置固定在下方
        //erFormHelper.setGridToolbarPosition(grid_view_cf, "bottom");
      });
    };

    // grid工具栏按钮点击事件自定义
    const toolbarClick = (event: any, configId: string) => {
      if (event.name === 'addrow') {
        const HEAT_NO: string = erFormHelper.getControlValue('layoutControlGroup1', 'HEAT_NO');
        const L2_PROC_NO: string = erFormHelper.getControlValue('layoutControlGroup1', 'L2_PROC_NO');
        const gridData = erFormHelper.getGridAllRows(configId);
        const currentRow = gridData[gridData.length - 1];
        currentRow.set('HEAT_NO', HEAT_NO);
        currentRow.set('L2_PROC_NO', L2_PROC_NO);
      }
    };

    // 点击关闭按钮，绑定事件closeEfDialog
    // 向父画面传递数据-触发emit方法向父传递数据，并在emits中注册事件名
    const closeEfDialog = () => {
      const data = {
        // name: formName,
        close: true
      };
      emit('getChildInfo', data);
    };

    onMounted(() => {
      // QueryPara();
    });

    const queryChildGrid = async (queryCondition: any, configId: string) => {
      const eiInfo1 = new EI.EIInfo();
      const eiBlock1 = eiInfo1.addBlock(new EI.EiBlock());
      eiBlock1.pushData(queryCondition, true);
      const outInfo1 = await erFormHelper.callService(pagePara.service_f22, eiInfo1, false, false, true);
      if (outInfo1.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo1.sys.msg);
      } else {
        erFormHelper.mergeDataToLayoutOrGrid(outInfo1, true, configId);
      }
    };

    // 投料保存
    const F2_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      const HEAT_NO: string = erFormHelper.getControlValue('layoutControlGroup1', 'HEAT_NO');
      const L2_PROC_NO: string = erFormHelper.getControlValue('layoutControlGroup1', 'L2_PROC_NO');
      erFormHelper.checkAllGridRow(grid_view_auxi);
      const touliaoGridCheckedRowsBlock = erFormHelper.getGridCheckedRowsAsBlock(
        grid_view_auxi,
        {
          FACTORY_DIV: pagePara.factory_div,
          AREA_ID: pagePara.area_id,
          STATION_ID: pagePara.station_id,
          STATION_NO: HEAT_NO ? HEAT_NO.slice(3, 4) : ''
        },
        true
      );
      // 判断是否有数据
      if (touliaoGridCheckedRowsBlock.data.length > 0) {
        // 有数据则调用保存服务，正常进行保存
        eiInfo.addBlock(touliaoGridCheckedRowsBlock);
        const outInfo = await erFormHelper.callService('mmsm2a_save', eiInfo, false, false, true);
        // 判断调后台是否失败
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('保存成功');
          queryChildGrid(
            {
              HEAT_NO,
              L2_PROC_NO,
              TABLE_TYPE: 'TMMSM2A'
            },
            'gridView_auxi'
          );
        }
      }
      // 无数据，判断是本来就没数据，还是因为做了删除操作后没数据了
      else if (erFormHelper.getGridRows(grid_view_auxi, 'delete').length > 0) {
        // 做了删除操作后没数据了，则调用删除服务，清空后台数据
        const eiInfodel = new EI.EIInfo();
        const eiblockdel = eiInfodel.addBlock(new EI.EiBlock());
        eiblockdel.pushData(
          {
            L2_PROC_NO: L2_PROC_NO
          },
          true
        );
        const outInfodel = await erFormHelper.callService('mmsm2a_del', eiInfodel, false, false, true);
        if (outInfodel.sys.status < 0) {
          erFormHelper.messageError('删除错误:' + outInfodel.sys.msg);
        } else {
          erFormHelper.messageSuccess('删除成功');
          queryChildGrid(
            {
              HEAT_NO,
              L2_PROC_NO,
              TABLE_TYPE: 'TMMSM2A'
            },
            'gridView_auxi'
          );
        }
      } else {
        // 本来就没数据，弹出提示，不允许保存
        erFormHelper.messageWarning('无数据要保存');
      }
    };

    // 测温保存
    const F3_DO = async (e: any) => {
      const HEAT_NO: string = erFormHelper.getControlValue('layoutControlGroup1', 'HEAT_NO');
      const L2_PROC_NO: string = erFormHelper.getControlValue('layoutControlGroup1', 'L2_PROC_NO');
      const eiInfo = new EI.EIInfo();
      const cewenGridCreated = erFormHelper.getGridRowsAsBlock(
        grid_view_temp,
        'add',
        {
          FACTORY_DIV: pagePara.factory_div,
          STATION_ID: pagePara.station_id,
          PROC_DIV: PROC_DIV
        },
        true
      );
      eiInfo.addBlock(cewenGridCreated, 'MMSM_2B_INS');
      const cewenGridModified = erFormHelper.getGridRowsAsBlock(
        grid_view_temp,
        'modify',
        {
          FACTORY_DIV: pagePara.factory_div,
          STATION_ID: pagePara.station_id,
          PROC_DIV: PROC_DIV
        },
        true
      );
      eiInfo.addBlock(cewenGridModified, 'MMSM_2B_UPD');
      const cewenGridDeleted = erFormHelper.getGridRowsAsBlock(
        grid_view_temp,
        'delete',
        {
          FACTORY_DIV: pagePara.factory_div,
          STATION_ID: pagePara.station_id,
          PROC_DIV: PROC_DIV
        },
        true
      );
      eiInfo.addBlock(cewenGridDeleted, 'MMSM_2B_DEL');
      // 判断是否有数据：
      // 1. 有数据则调用保存服务，正常进行保存
      // 2. 因为进行了删除操作而导致无数据了，也正常调用保存服务
      if (erFormHelper.getGridAllRows(grid_view_temp).length > 0 || cewenGridDeleted.data.length > 0) {
        // 有数据则调用保存服务，正常进行保存
        const outInfo = await erFormHelper.callService('mmsm2b_pro', eiInfo, false, false, true);
        // 判断调后台是否失败
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('保存成功');
          queryChildGrid(
            {
              HEAT_NO,
              L2_PROC_NO,
              TABLE_TYPE: 'TMMSM2B'
            },
            'gridView_temp'
          );
        }
      } else {
        // 无数据，而且是本来就没有数据的情况，则弹出提示，不允许保存
        erFormHelper.messageWarning('无数据要保存');
      }
    };

    // 实绩保存
    const F4_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const layoutControlGroup1 = erFormHelper.getAllControlValue('layoutControlGroup1');
      const layoutControlGroup2 = erFormHelper.getAllControlValue('layoutControlGroup2');
      const layoutControlGroup3 = erFormHelper.getAllControlValue('layoutControlGroup3');
      const layoutControlGroup4 = erFormHelper.getAllControlValue('layoutControlGroup4');
      const obj: any = {
        ...layoutControlGroup1,
        ...layoutControlGroup2,
        ...layoutControlGroup3,
        ...layoutControlGroup4,
        FACTORY_DIV: pagePara.factory_div,
        //STATION_ID: pagePara.station_id,
        PROC_DIV: PROC_DIV
      };
      eiBlock.pushData(obj, true);
      console.log('eiBlock', eiBlock);
      console.log('eiBlock', eiInfo);
      const outInfo = await erFormHelper.callService(pagePara.service_f3, eiInfo, false, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.messageSuccess('保存成功');
        // if (PROC_DIV === 'I') {
        //   erFormHelper.clearGridData('gridView_auxi', 'gridView_temp');
        // }
        closeEfDialog();
      }
    };

    return {
      efFormInitialized,
      erFormHelper,
      initializeFlag,
      gridToolbar1,
      gridToolbar2,
      gridView_cf_caption,
      isGridViewAuxiShow,
      isGridViewCfShow,
      isLayout2Show,
      toolbarClick,
      F2_DO,
      F3_DO,
      F4_DO,
      closeEfDialog,
      efFormReady,
      layout1Loaded,
      layout2Loaded,
      layout4Loaded
    };
  }
});
