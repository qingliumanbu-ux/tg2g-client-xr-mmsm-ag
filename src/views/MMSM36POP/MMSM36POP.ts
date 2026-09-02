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

export default defineComponent({
  name: '详细信息',
  components: { xrEfForm, xrEfPanel, erLayout, erGrid },
  props: {
    openInDialog: {
      type: Boolean,
      default: false
    },
    dialogFormName: {
      type: String,
      default: '详细信息'
    },
    parentInfo: {
      type: Object
    }
  },
  // 向父画面传递数据-注册emit监听事件
  emits: ['getChildInfo'],
  setup: (props, { emit }) => {
    // 变量定义
    let formParams: any = '';
    let formPartition: any = '';
    const initializeService = '';
    let formName = ''; // 当前画面名
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    const initializeFlag = ref(0);

    // 获取画面相关配置信息
    /* const efFormInitialized = (formInfo: any) => {
      formParams = formInfo;
      formPartition = formParams.formPartition;
      formName = formParams.formName;
      nextTick(() => {
        initializePage();
      });
    }; */
    const parentInfo = ref(props.parentInfo); // 获取父画面传入参数

    const PROC_DIV = parentInfo.value?.PROC_DIV;
    //熔炼号
    const HEAT_NO = parentInfo.value?.HEAT_NO;
    //批次号
    const BATCH = parentInfo.value?.BATCH;
    const PONO = parentInfo.value?.PONO;
    const MAT_NO = parentInfo.value?.MAT_NO;
    const HOT_FLAG = parentInfo.value?.HOT_FLAG;
    const QUERY_DIV = parentInfo.value?.QUERY_DIV;

    const MAT_ACT_WIDTH = parentInfo.value?.MAT_ACT_WIDTH;

    const CASTING_PRE_JUDGMENT = parentInfo.value?.CASTING_PRE_JUDGMENT;
    const CASTING_PURPOSE = parentInfo.value?.CASTING_PURPOSE;
    const UNIT_CODE = parentInfo.value?.UNIT_CODE;

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

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          if (HEAT_NO || PONO || MAT_NO) {
            queryAll();
          }
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {
      //initializePage();
    });

    // 新增时进入画面查询
    const queryAll = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const queryCondition = {
        MAT_NO: MAT_NO,
        QUERY_DIV: QUERY_DIV
      };
      eiBlock.pushData(queryCondition, true);
      const outInfo = await erFormHelper.callService('mmsm36f2_inq', eiInfo, false, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {

         //获取主数据
         erFormHelper.setControlValueEx('layoutControlGroup1', outInfo.getBlock(0).data[0]);
         erFormHelper.setControlValueEx('layoutControlGroup1', {
           OUTTER_HEIGHT: MAT_ACT_WIDTH,
           INNER_HEIGHT: MAT_ACT_WIDTH,
           WATER_EXPLOSION_WIDTH:MAT_ACT_WIDTH,
           CASTING_PRE_JUDGMENT: CASTING_PRE_JUDGMENT,
           WATER_EXPLOSION_USE: CASTING_PURPOSE,
           WATER_EXPLOSION_CASTING: UNIT_CODE,
           DEAL_NOTION: '0'
         });           
      }
    };
    const F2_DO = async (e: any) => {
      if (PROC_DIV == 'I') {
        const eiInfo = new EI.EIInfo();
        const eiBlock = eiInfo.addBlock(new EI.EiBlock());
        const layoutControlGroup1 = erFormHelper.getAllControlValue('layoutControlGroup1');
        //erFormHelper.get

        const obj: any = {
          ...layoutControlGroup1,
          PROC_DIV: PROC_DIV
        };
        const eiBlock_PARA = new EI.EiBlock();
        eiBlock_PARA.pushData(
          {
            PROC_DIV: 'I',
            //HOT_FLAG: HOT_FLAG,
            STATION_ID: 'C'
          },
          true
        );
        eiInfo.addBlock(eiBlock_PARA, 'PARA');
        eiBlock.pushData(obj, true);
        console.log('eiInfo', eiInfo);
        const outInfo = await erFormHelper.callService('mmsm36_pro', eiInfo, false, false, true);
        // 判断调后台是否失败
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('新增报错:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('保存成功');
          closeEfDialog();
        }
      } else {
        const eiInfo = new EI.EIInfo();
        const eiBlock = eiInfo.addBlock(new EI.EiBlock());
        const layoutControlGroup1 = erFormHelper.getAllControlValue('layoutControlGroup1');
        const obj: any = {
          ...layoutControlGroup1,
          PROC_DIV: PROC_DIV
        };
        const eiBlock_PARA = new EI.EiBlock();
        eiBlock_PARA.pushData(
          {
            PROC_DIV: 'U',
            HOT_FLAG: HOT_FLAG,
            STATION_ID: 'C',
            MAT_NO: MAT_NO,
            HEAT_NO: HEAT_NO
          },
          true
        );
        eiInfo.addBlock(eiBlock_PARA, 'PARA');
        eiBlock.pushData(obj, true);
        const outInfo = await erFormHelper.callService('mmsm36_pro', eiInfo, false, false, true);
        // 判断调后台是否失败
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('保存成功');
          closeEfDialog();
        }
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

    return {
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO,
      /*  efFormInitialized, */
      closeEfDialog
    };
  }
});
