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
import MMSM35POP from '../MMSM35POP/MMSM35POP.vue';

export default defineComponent({
  name: 'MMSM31AS2N',
  components: { xrEfForm, xrEfPanel, erLayout, erGrid, xrEfDialog },
  setup: () => {
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;

    // 获取画面的分区信息及设置画面初始化service

    const initializeService = '';

    // 变量定义
    formName = 'MMSM31AS2N';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    let gridView1: any;

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition;
      // 初始化低代码工具类
      initializePage();
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        //自定义分页查询
        /* erFormHelper.setGridServerPagingQuery('GridView1', queryMain); */

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {
      //initializePage();
    });

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('GridView1');
      console.log('gridView1', gridView1);
      erFormHelper.setGridEditable('GridView1', false);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const queryMain = async () => {
      /* options.success({ data: undefined, total: undefined }); */
      const inInfo = new EI.EIInfo();
      //const filter_condition = erFormHelper.getAllControlValue('LayoutGroupFilter');
      const filter_condition = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      inInfo.addBlock(filter_condition);
      //inInfo.addBlock(ErUtils.buildEiBlock([filter_condition]));
      //追加分页表到inInfo
      /* const eiBlock_page = new EI.EiBlock(); */
      /*  eiBlock_page.pushData(
        {
          RecordFrom: options.data.skip,
          PageSize: options.data.pageSize
        },
        true
      ); */
      /*  inInfo.addBlock(
        eiBlock_page,
        ErUtils.buildEiBlock(
          [
            {
              RecordFrom: options.data.skip,
              PageSize: options.data.pageSize
            }
          ],
        'PageInfo'
      ); */
      const outInfo = await erFormHelper.callService('mmsm31a_inq', inInfo, false, true, true);
      console.log('2222', outInfo.getBlock(0).data.length);
      if (outInfo.sys.status >= 0) {
        const resultData = outInfo.getBlock(0).data; //后台返回的当页的数据TOTALRECORDCOUNT
        const reusltTotal = outInfo.blocks['PageInfo'].data[0]['TOTALRECORDCOUNT']; //后台返回数据总条数
        console.log('条数', outInfo.blocks['PageInfo']);

        //固定写法[ison的键必须是data和total]
        /*  const result = { data: resultData, total: reusltTotal };
        options.success(result); */
        if (outInfo.getBlock(0).data.length === 0) {
          erFormHelper.messageInfo('未查询到材料信息');
        }
      }
    };

    const F2_DO = async (options: any) => {
      console.log('12212');
      queryMain();
      /* erFormHelper.getGridServerPageData('GridView1'); //分页调用方法 */
      // erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'GridView1');
      //erFormHelper.mergeDataToLayoutOrGrid(outInfo);
    };

    return {
      erGrid1Ready,
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO
    };
  }
});
