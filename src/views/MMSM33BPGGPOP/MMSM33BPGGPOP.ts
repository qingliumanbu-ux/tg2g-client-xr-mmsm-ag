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
  name: 'MMSM33BPGGPOP',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid
  },
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
    const ST_NO = parentInfo.value?.ST_NO;
    const SLAB_TYPE = parentInfo.value?.SLAB_TYPE;

    // 获取url的参数
    // if (route.query.HEAT_NO) {
    //   console.log("路由参数--- ", route.query.HEAT_NO);
    //   str = route.query.HEAT_NO;
    // } else {
    //   console.log("无路由参数--- ");
    // }

    // // 自定义工具栏按钮功能
    // const InitialToolbar = () => {
    //   erFormHelper.initialGridToolbar(grid_view_2.value, {
    //     excel: { visible: true },
    //     addrow: { visible: false },
    //     copyrow: { visible: false },
    //     delete: { visible: false },
    //   });
    //   erFormHelper.initialGridToolbar(grid_view_3.value, {
    //     excel: { visible: true },
    //     addrow: { visible: false },
    //     copyrow: { visible: false },
    //     delete: { visible: false },
    //   });
    //   erFormHelper.initialGridToolbar(grid_view_4.value, {
    //     excel: { visible: true },
    //     addrow: { visible: false },
    //     copyrow: { visible: false },
    //     delete: { visible: false },
    //   });
    // };

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
    //   const toolbarClick = (event: any, configId: string) => {
    //     if (event.name === "addrow") {
    //       const HEAT_NO: string = erFormHelper.getControlValue(
    //         "layoutControlGroup1",
    //         "HEAT_NO"
    //       );
    //       const PROC_NO: string = erFormHelper.getControlValue(
    //         "layoutControlGroup1",
    //         "PROC_NO"
    //       );
    //       const gridData = erFormHelper.getGridAllRows(configId);
    //       const currentRow = gridData[gridData.length - 1];
    //       currentRow.set("HEAT_NO", HEAT_NO);
    //       currentRow.set("PROC_NO", PROC_NO);
    //     }
    //   };

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

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          console.log(PROC_DIV, ST_NO, SLAB_TYPE);
          if (PROC_DIV && ST_NO && SLAB_TYPE) {
            queryAll();
          }
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {
      //initializePage();
      //handleEfDialogMessage();
    });

    // 修改时进入画面查询
    const queryAll = async () => {
      // 查询实绩
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const queryCondition = {
        ST_NO: ST_NO,
        SLAB_TYPE: SLAB_TYPE
      };
      eiBlock.pushData(queryCondition, true);
      console.log('eiInfo', eiInfo);
      const outInfo = await erFormHelper.callService('mmsm33bpgg_inq', eiInfo);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.setControlValueEx('layoutControlGroup1', outInfo.getBlock(0).data[0]);
      }
    };

    // layout区域加载完成事件
    const layout1Loaded = async (e: any) => {
      erFormHelper.clearLayoutData(e.configId);
      // 获取layout中所有的字段
      // layout1Cols = erFormHelper.getLayoutBindModel(e.configId)?.toJSON();
      if (ST_NO) {
        // 查询工序实绩
        //queryShiji("layoutControlGroup1");
        queryAll();
      }
    };

    const F2_DO = async (e: any) => {
      console.log(PROC_DIV);
      //新增
      if (PROC_DIV == 'I') {
        const eiInfo = new EI.EIInfo();
        const eiBlock = eiInfo.addBlock(new EI.EiBlock());
        const layoutControlGroup1 = erFormHelper.getAllControlValue('layoutControlGroup1');
        if (layoutControlGroup1.ST_NO.trim() === '') {
          erFormHelper.messageWarning('请输入出钢记号!');
          return;
        }
        const obj: any = {
          ...layoutControlGroup1,
          PROC_DIV: PROC_DIV
        };
        eiBlock.pushData(obj, true);
        console.log('eiInfo', eiInfo);
        const outInfo = await erFormHelper.callService('mmsm33bpgg_pro', eiInfo);
        // 判断调后台是否失败
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('保存成功');
          closeEfDialog();
        }
      }
      //修改时进入画面查询
      else {
        const eiInfo = new EI.EIInfo();
        const eiBlock = eiInfo.addBlock(new EI.EiBlock());
        const layoutControlGroup1 = erFormHelper.getAllControlValue('layoutControlGroup1');
        const obj: any = {
          ...layoutControlGroup1,
          ST_NO: ST_NO,
          SLAB_TYPE: SLAB_TYPE,
          PROC_DIV: PROC_DIV
        };
        eiBlock.pushData(obj, true);
        const outInfo = await erFormHelper.callService('mmsm33bpgg_pro', eiInfo);
        // 判断调后台是否失败
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('保存成功');
          closeEfDialog();
        }
      }
    };

    return {
      erFormHelper,
      initializeFlag,
      F2_DO,
      gridToolbar2,
      //toolbarClick,
      efFormReady,
      closeEfDialog,
      layout1Loaded
    };
  }
});
