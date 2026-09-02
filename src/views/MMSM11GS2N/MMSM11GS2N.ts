/**
 * 功能描述：跟踪条目维护
 * 界面代码：MMSM11GS2N
 * 创建人：李晓明
 * 创建时间：2024年3月18日10点38分
 * 修改人：
 * 修改时间：
 **/
import { defineComponent, ref, reactive, nextTick } from 'vue';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import ErPopFree from 'ERX/ErPopFree';
import { ER } from 'ERX/Er';
import { EI } from 'EIX/ei';
import { PopFreeReturnInfo } from 'ERX/er-type';

export default defineComponent({
    name: 'MMSM11GS2N',
    components: { 
        xrEfForm, 
        xrEfPanel, 
        erGrid, 
        erLayout,
        ErPopFree
    },
    setup: () => {
        const efFormInfo = ref<{ [key: string]: any }>({});
        const erFormHelper: ER.FormHelper = new ER.FormHelper();
        let popFreeEdit: ER.PopFreeHelper;
        const initializeService = '';
        const initializeFlag = ref(0);

        let formPartition: string;
        let formName: string;
        let i_proc_div : string;

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

        //弹出界面OK按钮点击事件
        const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
            const inInfo = new EI.EIInfo();
            let outInfo: EI.EIInfo = new EI.EIInfo();
    
            inInfo.addBlock(
            erFormHelper.convertModelAsBlock(e.dataModel, {
                PROC_DIV: i_proc_div
            }), 
            'PARA'
            );
            outInfo = await erFormHelper.callService('mmsm11g_pro', inInfo, false, true, true);
    
            if (outInfo?.sys.status >= 0) {
            erFormHelper.messageSuccess('操作成功！');
            }
            queryData();
        };

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
            const outInfo = await erFormHelper.callService("mmsm11g_inq", inInfo, false, true, true);
            if(outInfo.status === 0){
                erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'gridView1');
            }
        }

        //F3新增
        const F3_DO = async (e: any) => {
            i_proc_div = 'I';
            popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM11G', 'POP1');
            ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
        }

        //F4修改
        const F4_DO = async (e: any) => {
            i_proc_div = 'U';

            //获取选中行
            const selectedRows = erFormHelper.getGridCheckedRows('gridView1', true);

            if (selectedRows.length === 0) {
                erFormHelper.messageWarning('请选择一条需要修改的条目信息！');
                return false;
            }

            if (selectedRows.length > 1) {
                erFormHelper.messageWarning('只能对一条记录执行修改操作！');
                return false;
            }

            popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM11G', 'POP1');
            popFreeEdit.ReceiveData(selectedRows[0], {
                ITEM_NAME: true
            });
            ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
        }

        //F5删除
        const F5_DO = async (e: any) => {
            const inInfo = new EI.EIInfo();

            if (erFormHelper.getGridCheckedRows('gridView1').length === 0) {
                erFormHelper.messageWarning('没有选中的需要删除的记录！');
                return false;
            }

            //获取选中行
            inInfo.addBlock(
                erFormHelper.getGridSelectRowsAsBlock('gridView1', {
                  PROC_DIV: 'D'
                }),
                'PARA'
            );

            const mes_res = await erFormHelper.messageConfirm('选中的记录将被永久删除， 是否继续？');
            if (!mes_res) {
                return false;
            }

            const outInfo = await erFormHelper.callService('mmsm11g_pro', inInfo, false, true);
            if (outInfo.sys.status >= 0) {
                erFormHelper.messageSuccess('操作成功！');
            }

            queryData();
        }

        return{
            initializeFlag,
            erFormHelper,
            efFormReady,
            F2_DO,
            F3_DO,
            F4_DO,
            F5_DO
        }
    }
});