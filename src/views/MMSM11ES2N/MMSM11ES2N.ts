/**
 * 功能描述：客户端操作记录
 * 界面代码：MMSM11ES2N
 * 创建人：李晓明
 * 创建时间：2024年3月4日16点28分
 * 修改人：
 * 修改时间：
 **/
import { defineComponent, ref, reactive, nextTick } from 'vue';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import { ER } from 'ERX/Er';
import { EI } from 'EIX/ei';

export default defineComponent({
    name: 'MMSM11ES2N',
    components: { 
        xrEfForm, 
        xrEfPanel, 
        erGrid, 
        erLayout 
    },
    setup: () => {
        const efFormInfo = ref<{ [key: string]: any }>({});
        const erFormHelper: ER.FormHelper = new ER.FormHelper();
        const initializeService = '';
        const initializeFlag = ref(0);

        let formPartition: string;
        let formName: string;

        //界面加载方法
        const efFormReady = (e: any) => {
            efFormInfo.value = e.formInfo;
            formPartition = efFormInfo.value.formPartition;     // 分区
            formName = efFormInfo.value.formName;               // 当前画面名

            initializePage();
        }

        const initializePage = async () => {
            const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
        
            if (initialResult.flag >= 0) {
                // 画面工具类初始化成功后将画面渲染条件设置为1
                initializeFlag.value = 1;
        
                // 回调函数获取控件信息及设置定义事件等操作
                nextTick(() => {
                    
                });
              } else {
                erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
              }
        }

        //F2点击事件
        const F2_DO = async (e: any) => {
            queryData();
        }

        //页面数据加载查询
        const queryData = async () => {
            const inInfo = new EI.EIInfo();
            const filter_condition = erFormHelper.getAllControlValueAsEiBlock('query1', {});
            inInfo.addBlock(filter_condition);
            const eiBlock_page = new EI.EiBlock();
            eiBlock_page.pushData({
                RecordFrom: 0,
                PageSize: 500
            });
            inInfo.addBlock(eiBlock_page, 'PageInfo');
            const outInfo = await erFormHelper.callService("mmsm11e_inq", inInfo, false, true, true);
            if(outInfo.status === 0){
                erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'gridView1');
            }
        }

        return{
            initializeFlag,
            erFormHelper,
            efFormReady,
            F2_DO
        }
    }
});