/**
 * 功能描述：铁水分配信息管理
 * 界面代码：MMSM11S2N
 * 创建人：李晓明
 * 创建时间：2024年2月19日10点42分
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
    name: 'MMSM11S2N',
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
                    //设置查询条件默认值
                    let year = new Date().getFullYear().toString();
                    let month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1).toString() : (new Date().getMonth() + 1).toString();
                    let day = new Date().getDate().toString();
                    let dateStr = year + month + day;
                    console.log(dateStr);

                    erFormHelper.setControlValue('query1', 'RECV_END_TIME_S', dateStr + '000000');
                    erFormHelper.setControlValue('query1', 'RECV_END_TIME_E', dateStr + '235959');
                });
              } else {
                erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
              }
        }

        //弹出界面OK按钮点击事件
        const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
            let i_service: any;
            const inInfo = new EI.EIInfo();
            let outInfo: EI.EIInfo = new EI.EIInfo();
    
            inInfo.addBlock(
            erFormHelper.convertModelAsBlock(e.dataModel, {
                PROC_DIV: i_proc_div
            }), 
            'PARA'
            );
            outInfo = await erFormHelper.callService('mmsm11_pro', inInfo, false, true, true);
    
            if (outInfo?.sys.status >= 0) {
            erFormHelper.messageSuccess('操作成功！');
            }
            queryData();
        };

        //F2【查询】点击事件
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
            const outInfo = await erFormHelper.callService("mmsm11_inq", inInfo, false, true, true);
            if(outInfo.status === 0){
                erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'gridView1');
            }
        }

        //F3【新增】点击事件
        const F3_DO = async (e: any) => {
            i_proc_div = 'I';
            popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM11', 'MMSM11A');
            ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
        }

        //F4【预计倒空】点击事件
        const F4_DO = async (e: any) => {
            i_proc_div = 'R';

            //获取选中行
            const selectedRows = erFormHelper.getGridCheckedRows('gridView1', true);

            if (selectedRows.length === 0) {
                erFormHelper.messageWarning('没有选中的需要预计倒空的记录！');
                return false;
            }

            if (selectedRows.length > 1) {
                erFormHelper.messageWarning('只能对一条记录执行预计倒空操作！');
                return false;
            }

            if(selectedRows[0]['RECV_FLAG'] != '0'){
                erFormHelper.messageWarning('罐次号[' + selectedRows[0]['TPC_ID'] + ']的罐次信息收料状态不为【未收料】，不允许预计倒空操作！');
                return;
            }

            popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM11', 'MMSM11B');

            //设置预计倒空时间默认值未当前时间+10分钟
            let datetime = new Date();
            datetime.setMinutes(datetime.getMinutes() + 10);
            selectedRows[0]['EMPTY_TIME'] = datetime;

            popFreeEdit.ReceiveData(selectedRows[0], {

            });
            ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
        }

        //F5【倒空】点击事件
        const F5_DO = async (e: any) => {
            i_proc_div = 'R';

            //获取选中行
            const selectedRows = erFormHelper.getGridCheckedRows('gridView1', true);

            if (selectedRows.length === 0) {
                erFormHelper.messageWarning('没有选中的需要倒空的记录！');
                return false;
            }

            if (selectedRows.length > 1) {
                erFormHelper.messageWarning('只能对一条记录执行倒空操作！');
                return false;
            }

            if(selectedRows[0]['RECV_FLAG'] != '1'){
                erFormHelper.messageWarning('罐次号[' + selectedRows[0]['TPC_ID'] + ']的罐次信息收料状态不为【预计倒空】，不允许倒空操作！');
                return;
            }

            popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM11', 'MMSM11C');

            //设置倒空时间默认值未当前时间
            selectedRows[0]['EMPTY_TIME_ACT'] = new Date();

            popFreeEdit.ReceiveData(selectedRows[0], {

            });
            ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
        }

        //F6【返重】点击事件
        const F6_DO = async (e: any) => {
            i_proc_div = 'R';

            //获取选中行
            const selectedRows = erFormHelper.getGridCheckedRows('gridView1', true);

            if (selectedRows.length === 0) {
                erFormHelper.messageWarning('没有选中的需要返重的记录！');
                return false;
            }

            if (selectedRows.length > 1) {
                erFormHelper.messageWarning('只能对一条记录执行返重操作！');
                return false;
            }

            if(selectedRows[0]['RECV_FLAG'] != '2'){
                erFormHelper.messageWarning('罐次号[' + selectedRows[0]['TPC_ID'] + ']的罐次信息收料状态不为【倒空】，不允许返重操作！');
                return;
            }

            popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM11', 'MMSM11D');
            popFreeEdit.setEvent('itemValueChanged', (e:any) => {
                if(e.itemCode === 'TPC_WT'){
                    if(popFreeEdit.getValue('TPC_WT') > popFreeEdit.getValue('NET_WT_COMPUT')){
                        erFormHelper.messageWarning("倒出量不允许大于罐次净重！");
                    }

                    popFreeEdit.setValue({'ACCOUNT_WT' : popFreeEdit.getValue('TPC_WT')*0.97});
                }
            });
            popFreeEdit.ReceiveData(selectedRows[0], {

            });
            ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);

        }

        //F7【到达温度&时间】
        const F7_DO = async (e: any) => {
            i_proc_div = 'R';

            //获取选中行
            const selectedRows = erFormHelper.getGridCheckedRows('gridView1', true);

            if (selectedRows.length === 0) {
                erFormHelper.messageWarning('没有选中的需要到达温度&时间的记录！');
                return false;
            }

            if (selectedRows.length > 1) {
                erFormHelper.messageWarning('只能对一条记录执行到达温度&时间操作！');
                return false;
            }

            if(selectedRows[0]['RECV_FLAG'] != '3'){
                erFormHelper.messageWarning('罐次号[' + selectedRows[0]['TPC_ID'] + ']的罐次信息收料状态不为【返重】，不允许到达温度&时间操作！');
                return;
            }

            popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM11', 'MMSM11E');
            popFreeEdit.ReceiveData(selectedRows[0], {

            });
            ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
        }

        //F8【确认】
        const F8_DO = async (e: any) => {
            const inInfo = new EI.EIInfo();

            if (erFormHelper.getGridCheckedRows('gridView1').length === 0) {
                erFormHelper.messageWarning('没有选中的需要确认的记录！');
                return false;
            }

            //获取选中行
            inInfo.addBlock(
                erFormHelper.getGridSelectRowsAsBlock('gridView1', {
                  PROC_DIV: 'R'
                }),
                'PARA'
            );

            //判断收料标志是否操作到达温度&时间和已确认
            for(let i = 0; i < inInfo.getBlock('PARA').data.length; i++){
                if(inInfo.getBlock('PARA').data[i]['RECV_FLAG'] == '6'){
                    erFormHelper.messageWarning('罐次号[' + inInfo.getBlock('PARA').data[i]['TPC_ID'] + ']的罐次信息收料状态为【已确认】，不允许重复确认！');
                    return;
                }

                if(inInfo.getBlock('PARA').data[i]['RECV_FLAG'] != '5'){
                    erFormHelper.messageWarning('罐次号[' + inInfo.getBlock('PARA').data[i]['TPC_ID'] + ']的罐次信息收料状态不为【到达温度&时间】，不允许确认！');
                    return;
                }
            }

            const outInfo = await erFormHelper.callService('mmsm11_pro', inInfo, false, true);
            if (outInfo.sys.status >= 0) {
                erFormHelper.messageSuccess('操作成功！');
            }

            queryData();
        }

        //F9【删除】
        const F9_DO = async (e: any) => {
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

            //判断收料标志是否已确认
            for(let i = 0; i < inInfo.getBlock('PARA').data.length; i++){
                if(inInfo.getBlock('PARA').data[i]['RECV_FLAG'] == '6'){
                    erFormHelper.messageWarning('罐次号[' + inInfo.getBlock('PARA').data[i]['TPC_ID'] + ']的罐次信息收料状态为【已确认】，不允许删除！');
                    return;
                }
            }

            const mes_res = await erFormHelper.messageConfirm('选中的记录将被永久删除， 是否继续？');
            if (!mes_res) {
                return false;
            }

            const outInfo = await erFormHelper.callService('mmsm11_pro', inInfo, false, true);
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
            F5_DO,
            F6_DO,
            F7_DO,
            F8_DO,
            F9_DO
        }
    }
});