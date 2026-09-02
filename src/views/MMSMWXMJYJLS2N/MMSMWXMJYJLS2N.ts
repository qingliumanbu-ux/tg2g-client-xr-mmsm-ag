import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import xrEfDialog from 'EFX/xrEfDialog';

export default defineComponent({
  name: 'MMSMXMTJJLS2N',
  components: { xrEfForm, xrEfPanel, erLayout, xrEfDialog, erGrid },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let i_form_ename = ''; // 低代码配置画面布局名
    let formPartition: string;
    let formName: '';
    let PROGRAM_NAME: string;
    let LayoutGroupFilter1 = 'layoutControlGroup1';
    const grid_view_1 = ref('GridView1');
    //const gridView_chemi_std = ref('GridView2');
    const gridToolbar: Ref<any[]> = ref([]);
    let gridView1!: any;
    let grid_chemi_std!: any;
    let str: any = ''; // 画面跳转传递的参数
    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({}); // 给弹出画面传入数据
    let proc_div = ''; // 'I'新增，'U'修改

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      console.log('efFormInfo', formName);
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      initializePage();
    };

    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    // 变量定义
    const initializeFlag = ref(0);
    const initializeService = '';

    // 自定义工具栏按钮功能
    const InitialToolbar = () => {
      erFormHelper.initialGridToolbar(grid_view_1.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false }
      });
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, i_form_ename, initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        //初始化工具栏
        InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          //设置grid不可编辑
          erFormHelper.setGridEditable(grid_view_1.value, false);
          erFormHelper.setControlEnable('LayoutGroupFilter1', false);
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid(grid_view_1.value);
      erFormHelper.setGridEditable(grid_view_1.value, false); // 设置grid不可编辑
    };

    onMounted(() => {
      //initializePage();
      //handleEfDialogMessage(); // 接收弹出画面传入的数据
    });

    const getGridViewLine = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter1);
      eiBlock.addColumn('QUERY_DIV', 'TMMSM36'); //传表名
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService('mmsm36f2_inq', eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_view_1.value);
      }
    };

    const F2_DO = async (e: any) => {
      getGridViewLine();
    };

    return {
      erFormHelper,
      initializeFlag,
      gridToolbar,
      F2_DO,
      erGrid1Ready,
      efFormReady,
      grid_view_1,
      LayoutGroupFilter1,
      dialogFormName,
      parentInfo,
    };
  }
});
