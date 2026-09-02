/**
 * 功能描述：理论铁产量查询
 * 界面代码：MMSM15AS2N
 * 创建人：李晓明
 * 创建时间：2024年2月20日10点42分
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
    name: 'MMSM15AS2N',
    components: {
        xrEfForm,
        xrEfPanel,
        erGrid,
        erLayout
    },
    setup: () => {
        const efFormInfo = ref<{ [key: string]: any }>({});
        const erFormHelper: ER.FormHelper = new ER.FormHelper()
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
                    //设置查询条件默认值
                    let curDate = new Date();       //当前日期
                    let year = '';
                    let month = '';
                    let lastDateOfMonth = '';
                    let curDay = curDate.getDate();

                    //如果为1号，则显示上月1号至月底的日期
                    if (curDay === 1) {
                        curDate.setDate(curDate.getDate() - 1);
                    }

                    year = curDate.getFullYear().toString();
                    month = (curDate.getMonth() + 1) < 10 ? '0' + (curDate.getMonth() + 1).toString() : (curDate.getMonth() + 1).toString();
                    let firstDayOfNextMonth = new Date(
                        curDate.getMonth() == 11 ? (curDate.getFullYear() + 1).toString() : year +
                            ', ' + (curDate.getMonth() + 2) +
                            ', 1');
                    let lastDayOfMonth = new Date(firstDayOfNextMonth.setDate(firstDayOfNextMonth.getDate() - 1));
                    lastDateOfMonth = lastDayOfMonth.getDate().toString();

                    let dateStart = year + month + '01';
                    let dateEnd = year + month + lastDateOfMonth;

                    erFormHelper.setControlValue('query1', 'DATE_START', dateStart);
                    erFormHelper.setControlValue('query1', 'DATE_END', dateEnd);
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
            const outInfo = await erFormHelper.callService("mmsm15a_inq", inInfo, false, true, true);
            if (outInfo.status === 0) {
                erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'gridView1');
            }
        }

        return {
            initializeFlag,
            erFormHelper,
            efFormReady,
            F2_DO
        }
    }
});