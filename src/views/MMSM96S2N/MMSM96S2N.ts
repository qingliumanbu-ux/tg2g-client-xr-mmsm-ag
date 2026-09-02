import { defineComponent, onMounted, ref, reactive, computed, nextTick, toRaw, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
//import { SiUtils } from "ERX/SiUtils";
//import { FiUtils } from "ERX/FiUtils";
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import { useRoute } from 'vue-router';
import EFCallForm from 'EFX/EFCallForm';
import { log } from 'console';

export default defineComponent({
  name: 'MMSM96S2N',
  components: { xrEfForm, xrEfPanel, erLayout, erGrid },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const efFormInfo = ref<{ [key: string]: any }>({});
    const tab1ActiveKey = ref('tab1');
    const initializeFlag = ref(0);
    const initializeService = '';
    let formName: string;
    // 变量定义
    formName = 'MMSM96S2N';
    let formPartition: string;

    let i_form_ename = '';
    let gridView1: any;
    let gridView3: any;
    const route = useRoute(); //获取跳转参数
    let i_flag = 0;
    let str: any;
    if (route.query.MAT_NO) str = route.query.MAT_NO; //是跳转

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      initializePage();
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        //回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          nextTick(() => {
            if (str) {
              erFormHelper.clearLayoutData('LayoutGroupFilter');
              erFormHelper.setControlValue('LayoutGroupFilter', 'MAT_NO', str);
              queryMainGrid();
            }
          });
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {
      initializePage();
    });

    //焦点行数据查询
    const GridView1FocusChanged = async (e: any) => {
      if (e && e.rowChanged) {
        if (e.data) {
          /*  erFormHelper.clearLayoutData(
            'LayoutGroupWarehouseNo',
            'LayoutGroupChemicalNo',
            'LayoutGroupQualityNo',
            'LayoutGroupOtherNo',
            'LayoutGroupEventNo',
            'LayoutGroupPlanNo',
            'LayoutGroupMatNo'
          ); */ // 清空实绩数据
          const inInfo = new EI.EIInfo();
          inInfo.addBlock(erFormHelper.convertModelAsBlock(e.data, { MAT_NO: e.data.get('MAT_NO') }));
          const outInfo = await erFormHelper.callService('mmsm96a1f2_inq', inInfo, false, false);
          if (outInfo.sys.status < 0) {
            return false;
          }
          console.log('outInfo', outInfo);
          console.log('outInfo', outInfo.getBlock(0));
          console.log('outInfo', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValueEx('LayoutGroupWarehouseNo', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValueEx('LayoutGroupChemicalNo', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValueEx('LayoutGroupQualityNo', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValueEx('LayoutGroupOtherNo', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValueEx('LayoutGroupEventNo', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValueEx('LayoutGroupPlanNo', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValueEx('LayoutGroupMatNo', outInfo.getBlock(0).data[0]);
        }
      }
    };

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('gridView1');
      erFormHelper.setGridEditable('gridView1', false); // 设置grid不可编辑
    };

    const erGrid3Ready = () => {
      gridView3 = erFormHelper.getGrid('gridView3');
      erFormHelper.setGridEditable('gridView3', false); // 设置grid不可编辑
    };

    //#region 分页查询信息 grid1pagingQuery start
    /*  const grid1pagingQuery = async (options: any) => {
      options.success({ data: undefined, total: undefined });

      const Query = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      if (Query.data[0]['MAT_NO']?.toString().trim() === '') {
        erFormHelper.messageInfo('查询条件中的材料号必须输入！');
        return;
      }
      const inInfo = new EI.EIInfo();
      inInfo.addBlock(Query, 'Table1');
      inInfo.addBlock(erFormHelper.getAllControlValueAsFilter('LayoutGroupFilter'), 'QUERY_FILTER');
      inInfo.addBlock(
        ErUtils.buildEiBlock([
          {
            RecordFrom: options.data.skip,
            PageSize: options.data.pageSize
          }
        ]),
        'PageInfo'
      );
      const outInfo = await erFormHelper.callService('mmsm96a1f2_inq', inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        const resultData = outInfo.getBlock(0).data; //后台返回的当页的数据123
        console.log('123', outInfo);
        const reusltTotal = outInfo.blocks['PAGEINFO'].data[0]['TOTAL_RECORD']; //后台返回数据总条数
        const result = { data: resultData, total: reusltTotal };
        options.success(result);
        if (outInfo.getBlock(0).data.length === 0) {
          erFormHelper.messageInfo('未查询到材料信息');
        }
      }
    }; */
    //#endregion 分页查询信息 end

    const queryMainGrid = async () => {
      const eiInfo = new EI.EIInfo();
      const Query: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      eiInfo.addBlock(Query);
      const outInfo = await erFormHelper.callService('mmsm96a1f2_inq', eiInfo, true, false, true);
      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        // 是否弹出查询成功提示
        erFormHelper.messageInfo('信息查询成功！本次查询返回' + outInfo.getBlock(0).data.length + '条记录！');
        erFormHelper.mergeDataToGrid(outInfo, 'gridView1', true);
      }
    };

    const F2_DO = async (e: any) => {
      //console.log('length', erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter').data[0]['MAT_NO']);

      if (erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter').data[0]['MAT_NO'] == '') {
        erFormHelper.messageWarning('材料号必须输入！');
        return false;
      }
      queryMainGrid();
    };

    return {
      tab1ActiveKey,
      erGrid1Ready,
      erGrid3Ready,
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO,
      GridView1FocusChanged
    };
  }
});
