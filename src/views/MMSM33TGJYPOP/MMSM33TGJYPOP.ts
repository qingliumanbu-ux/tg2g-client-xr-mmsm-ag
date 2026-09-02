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
  name: 'MMSM33TGJYPOP',
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
    let now = new Date();
    //const { postMessageToParent, listenerMessageEvent } = EFDialogFormMessage();
    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    // const efFormReady = (e: any) => {
    //   efFormInfo.value = e.formInfo;
    //   // efFormIsReady.value = true;
    //   formPartition = efFormInfo.value.formPartition; // 分区
    //   formName = efFormInfo.value.formName; // 当前画面名
    //   if (efFormInfo.value.formParams?.form_name) {
    //     PROGRAM_NAME = efFormInfo.value.formParams['form_name'];
    //   }
    //   QueryPara();
    // };
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
    const gridToolbar2: Ref<any[]> = ref([]);
    const parentInfo = ref(props.parentInfo); // 获取父画面传入参数
    const PROC_DIV = parentInfo.value?.PROC_DIV;
    const DIV = parentInfo.value?.DIV;
    const MAT_NO = parentInfo.value?.MAT_NO;
    const PRINT_NO = parentInfo.value?.PRINT_NO;
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
        close: true,
        PROC_DIV: PROC_DIV,
        DIV: DIV
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
          console.log(PROC_DIV, MAT_NO, PRINT_NO);
          if (PROC_DIV && MAT_NO && PRINT_NO) {
            if(PROC_DIV === 'I'){
              queryAll();
            }else{
              query();
            }
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

    // 画面查询
    const queryAll = async () => {
      console.log('111');

      // 查询实绩
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const queryCondition = {
        MAT_NO: MAT_NO,
        PRINT_NO: PRINT_NO
      };
      eiBlock.pushData(queryCondition, true);
      console.log('eiInfo', eiInfo);
      // if (PROC_DIV === 'I') {
         const outInfo = await erFormHelper.callService('mmsm33tgjypop_inq', eiInfo);
        // 判断调后台是否失败
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        } else {
          erFormHelper.setControlValueEx('layoutControlGroup1', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValue('layoutControlGroup1', 'DATE_TIME', now); //接管时间
        }
        console.log('outInfo', outInfo);
        // }else if(PROC_DIV === 'U'){
        //   const outInfo = await erFormHelper.callService('mmsm33tgjy_inq', eiInfo);
        //   // 判断调后台是否失败
        // if (outInfo.sys.status < 0) {
        //   erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        // } else {
        //   erFormHelper.setControlValueEx('layoutControlGroup1', outInfo.getBlock(0).data[0]);
        // }
        // console.log('outInfo', outInfo);
      //}
      

    };

    const query = async () => {
      console.log('222');
      // 查询实绩
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const queryCondition = {
        MAT_NO: MAT_NO,
        PRINT_NO: PRINT_NO
      };
      eiBlock.pushData(queryCondition, true);
      console.log('eiInfo', eiInfo);
      const outInfo = await erFormHelper.callService('mmsm33tgjy_inq', eiInfo);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.setControlValueEx('layoutControlGroup1', outInfo.getBlock(0).data[0]);
        erFormHelper.setControlValue('layoutControlGroup1', 'DATE_TIME', now); //接管时间
      }
      console.log('outInfo', outInfo);

    };

    // layout区域加载完成事件
    // const layout1Loaded = async (e: any) => {
    //   erFormHelper.clearLayoutData(e.configId);
      
    //   console.log('MAT_NO',MAT_NO);
    //   console.log('QUERY_DIV',QUERY_DIV);
    //   // 获取layout中所有的字段
    //   // layout1Cols = erFormHelper.getLayoutBindModel(e.configId)?.toJSON();
    //   if (MAT_NO && QUERY_DIV) {
    //     queryAll();
    //   }
    // };

    const F2_DO = async (e: any) => {
      console.log(PROC_DIV);
      //新增
      if (PROC_DIV == 'I') {
        const eiInfo = new EI.EIInfo();
        const eiBlock = eiInfo.addBlock(new EI.EiBlock());
        const layoutControlGroup1 = erFormHelper.getAllControlValue('layoutControlGroup1');
        if (layoutControlGroup1.MAT_NO.trim() === '') {
          erFormHelper.messageWarning('请输入材料号!');
          return;
        }
        const obj: any = {
          ...layoutControlGroup1,
          PROC_DIV: PROC_DIV,
          PRINT_NO: PRINT_NO,
          MAT_NO: MAT_NO,
        };
        eiBlock.pushData(obj, true);
        console.log('eiInfo', eiInfo);
        const outInfo = await erFormHelper.callService('mmsm33tgjy_pro', eiInfo);
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
          //DEV_CODE: DEV_CODE,
          PRINT_NO: PRINT_NO,
          MAT_NO: MAT_NO,
          PROC_DIV: PROC_DIV
        };
        eiBlock.pushData(obj, true);
        const outInfo = await erFormHelper.callService('mmsm33tgjy_pro', eiInfo);
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
      //layout1Loaded
    };
  }
});
