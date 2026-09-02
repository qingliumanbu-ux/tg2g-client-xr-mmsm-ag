/**
 * 功能描述：鱼雷罐倒铁实绩管理
 * 界面代码：MMSM12AS2N
 * 创建人：李晓明
 * 创建时间：2024年3月15日11点22分
 * 修改人：
 * 修改时间：
 **/

import { defineComponent, ref, nextTick } from 'vue';
import { ER } from 'ERX/Er';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import xrEfSearchBox from 'EFX/xrEfSearchBox';
import xrEfDialog from 'EFX/xrEfDialog';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';

export default defineComponent({
    name: 'MMSM12AS2N',
    components: {
      xrEfForm,
      xrEfPanel,
      xrEfSearchBox,
      xrEfDialog,
      erGrid,
      erLayout
    },
    setup: () => {
        // 获取画面的分区信息及设置画面初始化service
        const efFormInfo = ref<{ [key: string]: any }>({});         //页面信息对象
        const efFormIsReady = ref(false);
        let formPartition: string;                                  //页面分区
        let formName: string;                                       //页面代码
        const initializeService = '';                               //初始化服务

        //变量定义
        const erFormHelper: ER.FormHelper = new ER.FormHelper();
        const initializeFlag = ref(0);

        //页面加载方法
        const efFormReady = (e: any) => {
            //获取页面信息对象，并设置页面分区、页面代码
            efFormInfo.value = e.formInfo;
            efFormIsReady.value = true;
            formPartition = efFormInfo.value.formPartition;
            formName = efFormInfo.value.formName;
            console.log("分区名：", formPartition);
            console.log("页面名", formName);
            initializePage();
        };

        //页面初始化页面        
        const initializePage = async () => {
            const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
            if (initialResult.flag >= 0) {
              // 画面工具类初始化成功后将画面渲染条件设置为1
              initializeFlag.value = 1;
      
              // 回调函数获取控件信息及设置定义事件等操作
              nextTick(() => {
                InitialToolbar();
              });
            } else {
              erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
            }
        }

        // 自定义工具栏按钮功能
        const InitialToolbar = () => {
            
        };

        //页面数据加载查询
        const queryData = async () => {
            
        }

        //F2点击事件：查询
        const F2_DO = async (e: any) => {
            queryData();
        };

        return{
            efFormReady,
            erFormHelper,
            initializeFlag,
            F2_DO
        }
    }
});