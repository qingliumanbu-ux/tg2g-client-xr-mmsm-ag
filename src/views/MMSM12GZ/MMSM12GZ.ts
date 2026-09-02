import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';

export default defineComponent({
  name: 'MMSM12GZ',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let i_form_ename = ''; // 低代码配置画面布局名
    let formPartition: string;
    let formName: '';
    let PROGRAM_NAME: string;
    let LayoutGroupFilter = 'LayoutGroupFilter';
    const grid_view_m = ref('gridView_m');
    let gridViewm!: any;
    const initializeService = '';

    // 变量定义
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    let i_service_f2: any;
    const gridToolbar: Ref<any[]> = ref([]);

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      i_form_ename = formName;
      console.log('efFormInfo', formName);
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      initializePage();
    };

    // 自定义工具栏按钮功能
    const InitialToolbar = () => {
      erFormHelper.initialGridToolbar(grid_view_m.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false }
      });
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(
        formPartition,
        i_form_ename.substring(0, 7),
        '',
        initializeService
      );
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          InitialToolbar();
          QueryPara();
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    //通过炼钢配置表，进行模板画面参数查询
    const QueryPara = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock = inInfo.addBlock(new EI.EiBlock());
      eiBlock.pushData(
        {
          PROGRAM_NAME: i_form_ename
        },
        true
      );
      const outInfo = await erFormHelper.callService('mmsmpara_inq', inInfo, false, true, true);
      for (let i = 0; i < outInfo.getBlock(0).data.length; i++) {
        //获取设置F2服务名
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f2') {
          i_service_f2 = outInfo.getBlock(0).data[i]['PARA'];
        }
      }
    };

    onMounted(() => {});

    //页面数据加载查询
    const queryMain = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService(i_service_f2, eiInfo, false, false, true);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, grid_view_m.value);
      }
    };
    //grid实例
    const erGrid1Ready = () => {
      gridViewm = erFormHelper.getGrid(grid_view_m.value);
      console.log('grid_view_m', grid_view_m);
      erFormHelper.setGridToolbarVisible(grid_view_m.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    //F2点击事件：查询
    const F2_DO = async (e: any) => {
      queryMain();
    };

    return {
      erFormHelper,
      initializeFlag,
      F2_DO,
      efFormReady,
      erGrid1Ready,
      gridToolbar,
      grid_view_m,
      LayoutGroupFilter
    };
  }
});
