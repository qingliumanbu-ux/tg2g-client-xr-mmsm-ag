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
  name: 'MMSM37LG1POP',
  components: { xrEfForm, xrEfPanel, erLayout, erGrid },
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
    const efFormInitialized = (formInfo: any) => {
      formParams = formInfo;
      formPartition = formParams.formPartition;
      formName = formParams.formName;      
    };
    let pagePara: any; // 炼钢配置表页面参数
    let procDiv: any;
    const parentInfo = ref(props.parentInfo); // 获取父画面传入参数
    const PROC_DIV = parentInfo.value?.PROC_DIV;
    const HEAT_NO_THIS = parentInfo.value?.HEAT_NO;   
    const MAT_NO_THIS = parentInfo.value?.MAT_NO;   
    const PROD_SEQ_NO_THIS = parentInfo.value?.PROD_SEQ_NO;

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition;
      formName = efFormInfo.value.formName; // 当前画面名
      // 初始化低代码工具类
      procDiv = parentInfo.value?.PROC_DIV;
      QueryPara();
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        initializeFlag.value = 1;
        //procDiv === INS_ACHIEVEMENT              
        nextTick(() => {
          if (HEAT_NO_THIS && MAT_NO_THIS) {
            queryAll();
          }
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };
    onMounted(() => {

    });
    //通过炼钢配置表，进行模板画面参数查询
    const QueryPara = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      eiBlock.pushData(
        {
          PROGRAM_NAME: formName
        },
        true
      );
      EIManager.callService(formPartition, 'mmsmpara_inq', eiInfo)
        .then((res: EI.EIInfo) => {
          if (res.status === 0) {
            const resData: any = {};
            res.blocks['MMSMPARA_INQ'].data.forEach((item: any) => {
              resData[item.PARA_NAME] = item.PARA;
            });
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
      // 查询修磨实绩
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());

      //这里是默认的：初磨内弧
      let queryCondition = {
        HEAT_NO: HEAT_NO_THIS,
        MAT_NO: MAT_NO_THIS,
        FACTORY_DIV: 'LG1',
        STATION_ID: pagePara.station_id,
        STATION_NO: pagePara.station_no,
        QUERY_DIV: pagePara.QUERY_DIV,
        PROD_SEQ_NO:''
      };  
      if(procDiv =='EDIT_ACHIEVEMENT'){
        queryCondition = {
          HEAT_NO: HEAT_NO_THIS,
          MAT_NO: MAT_NO_THIS,
          FACTORY_DIV: ' ',
          STATION_ID: pagePara.station_id,
          STATION_NO: pagePara.station_no,
          QUERY_DIV: 'TMMSM34_1',
          PROD_SEQ_NO:PROD_SEQ_NO_THIS
        };  
      }        
      eiBlock.pushData(queryCondition, true);
      const outInfo = await erFormHelper.callService(pagePara.service_f2, eiInfo, false, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.setControlValueEx('layoutControlGroup1', outInfo.getBlock(0).data[0]);
        if(procDiv =='INS_ACHIEVEMENT'){

          //这里判断一下，
          //日期：2024-05-17 
          //如果如果磨前量为空，则去取系统重量
          if(outInfo.getBlock(0).data[0]['MEND_FLAG']==' '||outInfo.getBlock(0).data[0]['MEND_FLAG']=='0'){
            erFormHelper.setControlValueEx('layoutControlGroup1', {
              REAL_WIDTH:outInfo.getBlock(0).data[0]['MAT_ACT_WIDTH'],
              MEND_BEFORE_WEIGHT: outInfo.getBlock(0).data[0]['MAT_ACT_WT']
            });
          }else{
            if (outInfo.getBlock(0).data[0]['MEND_BEFORE_WEIGHT'] == 0) {
              erFormHelper.setControlValueEx('layoutControlGroup1', {
                REAL_WIDTH:outInfo.getBlock(0).data[0]['MAT_ACT_WIDTH'],
                MEND_BEFORE_WEIGHT: outInfo.getBlock(0).data[0]['MAT_ACT_WT']
              });
            } else {
              erFormHelper.setControlValueEx('layoutControlGroup1', {
                REAL_WIDTH:outInfo.getBlock(0).data[0]['MAT_ACT_WIDTH'],
                MEND_BEFORE_WEIGHT: outInfo.getBlock(0).data[0]['MEND_BEFORE_WEIGHT']
              });
            }
          }
          //erFormHelper.setControlValueEx('layoutControlGroup1', {
          //  REAL_WIDTH:outInfo.getBlock(0).data[0]['MAT_ACT_WIDTH'],
          //  MEND_BEFORE_WEIGHT: outInfo.getBlock(0).data[0]['MAT_WT']
          //});
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

    //保存修磨实绩
    const F2_DO = async (e: any) => {

      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const layoutControlGroup1 = erFormHelper.getAllControlValue('layoutControlGroup1');

      const beforeWeight = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_BEFORE_WEIGHT');
      const afterWeight = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_AFTER_WEIGHT');
      if(afterWeight>beforeWeight){
        erFormHelper.messageError('填写的磨后重量比磨前重量大，请核实输入的磨后重量');
        return false;
      }


      let obj: any = {
        ...layoutControlGroup1,
        FACTORY_DIV: pagePara.factory_div,
        STATION_ID: pagePara.station_id,
        PROC_DIV: PROC_DIV
      };
      if(procDiv =='EDIT_ACHIEVEMENT'){

      }
      
      const eiBlock_PARA = new EI.EiBlock();
      eiBlock_PARA.pushData( {
          PROC_DIV: procDiv,
          FACTORY_DIV: ' ',
          STATION_ID: 'C' }, true
      );
      eiInfo.addBlock(eiBlock_PARA, 'PARA');
      eiBlock.pushData(obj, true);
      
      //pagePara.service_f3 ---> mmsm34f3_ins
      const outInfo = await erFormHelper.callService(pagePara.service_f3, eiInfo, false, false, true);
      console.log(outInfo)
      //判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
      } else {
        erFormHelper.messageSuccess('保存成功');
        closeEfDialog();
      }
    };

     //2024-03-27
    //layout值发生改变事件
    const layout_valueChanged1 = (e: any) => {

      //修磨实绩  ---  内弧修磨机号 onBlur事件
      if(e.itemCode === 'MEND_AFTER_WEIGHT'){
        const beforeWeight = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_BEFORE_WEIGHT');
        const afterWeight = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_AFTER_WEIGHT');
        if(afterWeight>beforeWeight){
          erFormHelper.messageError('填写的磨后重量比磨前重量大，请核实输入的磨后重量');
          return false;
        }
      }
    };

    return {
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO,
      closeEfDialog,
      efFormInitialized,
      layout_valueChanged1,
    };
  }
});
