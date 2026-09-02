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
  name: 'MMSM33CZXSPOP',
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
      //efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      console.log('efFormInfo', formName);
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      initializePage();
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
    //const PROC_DIV = parentInfo.value?.PROC_DIV;
    const CC_MACH_NO = parentInfo.value?.CC_MACH_NO;
    const STRAND_NO = parentInfo.value?.STRAND_NO;
    const ST_NO = parentInfo.value?.ST_NO;
    // 获取url的参数
    // if (route.query.HEAT_NO) {
    //   console.log("路由参数--- ", route.query.HEAT_NO);
    //   str = route.query.HEAT_NO;
    // } else {
    //   console.log("无路由参数--- ");
    // }

    // 点击关闭按钮，绑定事件closeEfDialog
    // 向父画面传递数据-触发emit方法向父传递数据，并在emits中注册事件名
    const closeEfDialog = () => {
      const data = {
        close: true
        //PROC_DIV: PROC_DIV,
      };
      emit('getChildInfo', data);
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          console.log(STRAND_NO, ST_NO);
          if (STRAND_NO && ST_NO) {
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
      // 查询
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const queryCondition = {
        STRAND_NO: STRAND_NO,
        ST_NO: ST_NO
      };
      eiBlock.pushData(queryCondition, true);
      console.log('eiInfo', eiInfo);
      const outInfo = await erFormHelper.callService('mmsm33czxs_inq', eiInfo);
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
      if (STRAND_NO && ST_NO) {
        // 查询工序实绩
        //queryShiji("layoutControlGroup1");
        queryAll();
      }
    };

    const F2_DO = async (e: any) => {
      //console.log(PROC_DIV);
      //修改时进入画面查询
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const layoutControlGroup1 = erFormHelper.getAllControlValue('layoutControlGroup1');
      const obj: any = {
        ...layoutControlGroup1
        //PROC_DIV: PROC_DIV,
      };
      eiBlock.pushData(obj, true);
      const outInfo = await erFormHelper.callService('mmsm33czxs_upd', eiInfo);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.messageSuccess('保存成功');
        closeEfDialog();
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
