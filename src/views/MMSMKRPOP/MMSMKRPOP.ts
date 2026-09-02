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
  name: 'MMSMKRPOP',
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
  setup: (props, { emit }) => {
    // 在ts中获取DEMO02画面数据
    console.log(props.openInDialog);
    console.log('🐅', props.parentInfo);

    const route = useRoute();

    // 变量定义
    const efFormInfo = ref<{ [key: string]: any }>({});
    // const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;
    //const { postMessageToParent, listenerMessageEvent } = EFDialogFormMessage();
    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
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

    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const initializeService = '';
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
    let grid_view_cf = ref(''); //成分对应grid响应
    let grid_view_auxi = ref(''); //加料对应grid响应
    let touliaoOutInfo: EI.EIInfo;
    let cewenOutInfo: EI.EIInfo;
    let tongdianOutInfo: EI.EIInfo;
    const gridToolbar2: Ref<any[]> = ref([]);
    const gridToolbar3: Ref<any[]> = ref([]);
    const gridToolbar4: Ref<any[]> = ref([]);
    const gridView_cf_caption = ref<string>(''); // gridView_cf的低代码配置标题名
    let str: any = ''; // 画面跳转传递的参
    const parentInfo = ref(props.parentInfo); // 获取父画面传入参数
    const PROC_DIV = parentInfo.value?.PROC_DIV;
    const HEAT_NO_THIS = parentInfo.value?.HEAT_NO;
    const PROC_NO_THIS = parentInfo.value?.PROC_NO;
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
      erFormHelper.initialGridToolbar(grid_view_4.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false }
      });
    };

    // 点击关闭按钮，绑定事件closeEfDialog
    // 向父画面传递数据-触发emit方法向父传递数据，并在emits中注册事件名
    const closeEfDialog = () => {
      const data = {
        close: true,
        PROC_DIV: PROC_DIV
      };
      emit('getChildInfo', data);
    };

    // grid工具栏按钮点击事件自定义
    const toolbarClick = (event: any, configId: string) => {
      if (event.name === 'addrow') {
        const HEAT_NO: string = erFormHelper.getControlValue('layoutControlGroup1', 'HEAT_NO');
        const PROC_NO: string = erFormHelper.getControlValue('layoutControlGroup1', 'PROC_NO');
        const gridData = erFormHelper.getGridAllRows(configId);
        const currentRow = gridData[gridData.length - 1];
        currentRow.set('HEAT_NO', HEAT_NO);
        currentRow.set('PROC_NO', PROC_NO);
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
          // grid_view_cf = erFormHelper.getKendoGrid("gridView_cf");
          // grid_view_auxi = erFormHelper.getKendoGrid("gridView_auxi");
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

            nextTick(() => {
              initializePage();
            });
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    };

    // 修改时进入画面查询
    const queryAll = async () => {
      // 查询工序实绩
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      console.log('pagePara.station_id', pagePara.station_id);
      const queryCondition = {
        HEAT_NO: HEAT_NO_THIS,
        PROC_NO: PROC_NO_THIS,
        //FACTORY_DIV: pagePara.factory_div,
        STATION_ID: pagePara.station_id,
        STATION_NO: pagePara.station_no,
        TABLE_TYPE: 'T' + formName.slice(0, 6).toUpperCase()
      };
      eiBlock.pushData(queryCondition, true);
      console.log('eiBlock', eiBlock);

      const outInfo = await erFormHelper.callService(pagePara.service_f21, eiInfo, false, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        console.log('outInfo', outInfo);

        erFormHelper.setControlValueEx('layoutControlGroup1', outInfo.getBlock(0).data[0]);
        erFormHelper.setControlValueEx('layoutControlGroup2', outInfo.getBlock(0).data[0]);

        //queryDetail('TMMSM2A', 'gridView_auxi');
      }
    };

    // layout区域加载完成事件
    const layout1Loaded = async (e: any) => {
      erFormHelper.clearLayoutData(e.configId);
      // 获取layout中所有的字段
      // layout1Cols = erFormHelper.getLayoutBindModel(e.configId)?.toJSON();
      if (PROC_NO_THIS) {
        // 查询工序实绩
        //queryShiji("layoutControlGroup1");
        queryAll();
      }
    };
    const layout2Loaded = async (e: any) => {
      erFormHelper.clearLayoutData(e.configId);
      // 获取layout中所有的字段
      // layout2Cols = erFormHelper.getLayoutBindModel(e.configId)?.toJSON();
      if (PROC_NO_THIS) {
        // 查询工序实绩
        queryAll();
      }
    };

    // 查询投料测温等子表
    const queryDetail = async (TABLE_TYPE: string, configId: string) => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const queryCondition = {
        HEAT_NO: HEAT_NO_THIS,
        PROC_NO: PROC_NO_THIS,
        TABLE_TYPE: TABLE_TYPE
      };
      eiBlock.pushData(queryCondition, true);
      const outInfo = await erFormHelper.callService(pagePara.service_f22, eiInfo, false, false, true);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, configId);
      }
    };

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

    // 接收父画面传入的数据-在mounted中调用
    const handleEfDialogMessage = () => {
      // PROC_DIV = props.PROC_DIV;
      // HEAT_NO_THIS = props.HEAT_NO;
      // PROC_NO_THIS = props.PROC_NO;
    };

    //画面加载
    onMounted(() => {});

    const F3_DO = async (e: any) => {
      erFormHelper
        .checkRequiredInput('layoutControlGroup1', true)
        .then(async (res: boolean) => {
          // res值为true表示验证通过，false表示验证不通过
          if (res) {
            const eiInfo = new EI.EIInfo();
            const eiBlock = eiInfo.addBlock(new EI.EiBlock());
            const layoutControlGroup1 = erFormHelper.getAllControlValue('layoutControlGroup1');
            const layoutControlGroup2 = erFormHelper.getAllControlValue('layoutControlGroup2');
            const obj: any = {
              ...layoutControlGroup1,
              ...layoutControlGroup2,
              FACTORY_DIV: pagePara.factory_div,
              STATION_ID: pagePara.station_id,
              PROC_DIV: PROC_DIV
            };
            eiBlock.pushData(obj, true);
            const outInfo = await erFormHelper.callService(pagePara.service_f3, eiInfo, true, false, true);
            // 判断调后台是否失败
            if (outInfo.sys.status < 0) {
              erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
            } else {
              erFormHelper.messageSuccess('操作成功');
              if (PROC_DIV === 'I') {
                closeEfDialog();
              }
            }
          }
        })
        .catch((err: any) => {
          erFormHelper.messageError('必输项校验错误:' + err);
        });
    };

    //加料保存
    const F4_DO = async (e: any) => {
      /*  const eiInfo = new EI.EIInfo();
      const HEAT_NO: string = erFormHelper.getControlValue('layoutControlGroup1', 'HEAT_NO');
      const PROC_NO: string = erFormHelper.getControlValue('layoutControlGroup1', 'PROC_NO');
      erFormHelper.checkAllGridRow(grid_view_auxi as any); */
      /* const touliaoGridCheckedRowsBlock = erFormHelper.getGridCheckedRowsAsBlock(
        grid_view_auxi,
        {
          FACTORY_DIV: pagePara.factory_div,
          STATION_ID: pagePara.station_id,
          STATION_NO: HEAT_NO ? HEAT_NO.slice(3, 4) : '',

        },
        true
      ); */
      /* //获取新增行的数据
      const created = erFormHelper.getGridRows(grid_view_auxi, 'add', true);
      const newcreated = created.map((item) => {
        item.STATION_ID = pagePara.station_id;
        return item;
      });
      const createdBlock = new EI.EiBlock();
      createdBlock.pushData(toRaw(newcreated), true);
      eiInfo.addBlock(createdBlock, 'MMSM_2A_INS');
      //获取修改行的数据
      const modified = erFormHelper.getGridRows(grid_view_auxi, 'modify', true);
      const newmodified = modified.map((item) => {
        item.STATION_ID = pagePara.station_id;
        return item;
      });
      const modifiedBlock = new EI.EiBlock();
      modifiedBlock.pushData(toRaw(newmodified), true);
      eiInfo.addBlock(modifiedBlock, 'MMSM_2A_UPD');
      //获取删除行的数据
      const deleted = erFormHelper.getGridRows(grid_view_auxi, 'delete', true);
      const newdeleted = deleted.map((item) => {
        item.STATION_ID = pagePara.station_id;
        return item;
      });
      const deletedBlock = new EI.EiBlock();
      deletedBlock.pushData(toRaw(newdeleted), true);
      eiInfo.addBlock(deletedBlock, 'MMSM_2A_DEL');
 */
      /* eiInfo.addBlock(touliaoGridCheckedRowsBlock); */
      /*  console.log('eiInfo', eiInfo);

      const outInfo = await erFormHelper.callService('mmsm2a_pro', eiInfo, false, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        console.log(outInfo);
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.messageSuccess('保存成功');
        queryChildGrid(
          {
            HEAT_NO,
            PROC_NO,
            TABLE_TYPE: 'TMMSM2A'
          },
          'gridView_auxi'
        );
      } */
    };

    return {
      F4_DO,
      F3_DO,
      erFormHelper,
      initializeFlag,
      gridToolbar2,
      toolbarClick,
      efFormReady,
      closeEfDialog,
      layout1Loaded,
      layout2Loaded
    };
  }
});
