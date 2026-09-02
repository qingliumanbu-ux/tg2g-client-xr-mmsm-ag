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
import ErPopFree from 'ERX/ErPopFree';
import ErPopQuery from 'ERX/ErPopQuery';
import { PopQueryReturnInfo, PopFreeReturnInfo } from 'ERX/er-type';
import { Console } from 'console';

export default defineComponent({
  name: 'MMSMQG33S2N',
  components: {
    xrEfForm,
    xrEfPanel,
    xrEfSearchBox,
    xrEfDialog,
    erGrid,
    erLayout,
    ErPopFree
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;

    // 变量定义
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeService = 'mmsm_form_get';
    const initializeFlag = ref(0);
    let i_form_ename = '';
    let v_factory_div: any;
    let i_func_id_q: any;
    let i_func_id_p: any;
    let i_func_id1: any;
    let i_func_id2: any;
    let i_func_id3: any;
    let i_service_f21: any;
    let i_service_f22: any;
    let i_service_f3: any;
    let i_service_f4: any;
    let i_service_f5: any;
    let i_service_f6: any;
    let i_formlayout: any;
    let i_factory_div: any;
    let i_station_id: any;
    let i_billet_type: any;
    let i_station_no: any;
    let i_cut_type: any;
    let i_cut_trans_ls: any;
    i_cut_trans_ls = '1'; //0-不允许跨长坯1-允许跨长坯切割
    let i_cutTube_eb: any; //是否允许录入切割支数
    i_cutTube_eb = 1; //是否允许录入切割支数
    let i_formwidth: any;
    let i_formheight: any;
    let i_colcount: any;
    let i_windowsNumber: any;
    let i_tableName: any;
    let i_data_set: any;
    let i_layout_group_filter: any;
    let i_gridView: any;
    let v_billet_type: any;
    const listGridView: Ref<any[]> = ref([]);
    let i_layout_dialog: any;
    let cs_OkClick = '';
    let popFreeEdit: ER.PopFreeHelper;
    const editable = ref(false);
    const gridToolbar: Ref<any[]> = ref([]);
    let v: any;
    const factory_div = 'LG1';
    let i_cutTime_eb = 1; //是否允许多次切割

    let gridView1: any;
    let gridView2: any;
    let gridView3: any;
    //let service_f21: any;
    let FACTORY_DIV: any;

    const tabActiveKey = ref('tab1');

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition;
      formName = efFormInfo.value.formName; // 当前画面名
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      console.log('efFormInfo', efFormInfo);
      // 初始化低代码工具类
      initializePage();
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      i_form_ename = efFormInfo.value.formName;
      if (efFormInfo.value.formParams?.factory_div) v_factory_div = efFormInfo.value.formParams['factory_div'];
      if (efFormInfo.value.formParams?.billet_type) v_billet_type = efFormInfo.value.formParams['billet_type'];
      const formPartition = efFormInfo.value.formPartition;
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        QueryPara();
        InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          erFormHelper.setGridEditable('GridView1', false);
          erFormHelper.setGridEditable('GridView2', false);
          erFormHelper.setGridEditable('GridView3', false);
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {
      //initializePage();
    }); // 自定义工具栏按钮功能
    const InitialToolbar = () => {
      /*  gridToolbar.value = erFormHelper.getGridToolbar([
        { name: 'excel', visible: true },
        { name: 'addrow', visible: false },
        { name: 'copyrow', visible: false },
        { name: 'delete', visible: false },
        { name: 'save', visible: false },
        { name: 'cancel', visible: false }
      ]); */
    };
    const QueryPara = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock = inInfo.addBlock(new EI.EiBlock());
      eiBlock.pushData(
        {
          PROGRAM_NAME: i_form_ename
          // PROGRAM_NAME: programName
        },
        true
      );
      const outInfo = await erFormHelper.callService('mmsmpara_inq', inInfo, false, true);
      //console.log(outInfo.getBlock(0));

      for (let i = 0; i < outInfo.getBlock(0).data.length; i++) {
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'func_id_q') {
          i_func_id_q = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'func_id_p') {
          i_func_id_p = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'func_id1') {
          i_func_id1 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'func_id2') {
          i_func_id2 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'func_id3') {
          i_func_id3 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f21') {
          i_service_f21 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f22') {
          i_service_f22 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f3') {
          i_service_f3 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f4') {
          i_service_f4 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f5') {
          i_service_f5 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f6') {
          i_service_f6 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'formlayout') {
          i_formlayout = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'factory_div') {
          i_factory_div = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'station_id') {
          i_station_id = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'station_no') {
          i_station_no = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'cut_type') {
          i_cut_type = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'cut_trans_ls') {
          i_cut_trans_ls = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'windows') {
          i_windowsNumber = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'table_name') {
          i_tableName = outInfo.getBlock(0).data[i]['PARA'];
          if (i_tableName != '') {
            listGridView.value = i_tableName.split(',');
          }
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'data_set') {
          i_data_set = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (i_data_set == '') {
          i_data_set = 'DataSet_' + i_form_ename.substring(0, 6);
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'layout_group_filter') {
          i_layout_group_filter = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'grid_view') {
          i_gridView = outInfo.getBlock(0).data[i]['PARA'];
          if (i_tableName != '') {
            listGridView.value = i_gridView.split(',');
          }
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'layout_dialog') {
          i_layout_dialog = outInfo.getBlock(0).data[i]['PARA'];
        }

        if (i_formlayout != '' && i_formlayout != null) {
          const formlayout: Ref<any[]> = ref([]);
          formlayout.value = i_formlayout.split(',');
          i_formwidth = formlayout.value[0];
          i_formheight = formlayout.value[1];
          i_colcount = formlayout.value[2];
        }
      }
      console.log(i_station_id);
    };
    const Query = async () => {
      //查询条件
      if (!erFormHelper.checkRequiredInput('LayoutGroupFilter')) {
        return false;
      }
      //清空grid数据
      //erFormHelper.clearGridData('GridView1');
      erFormHelper.checkGridCurrentRow('GridView1');
      const inInfo = new EI.EIInfo();
      //获取查询条件dt
      const Query = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      Query.addColumns('FACTORY_DIV');
      Query.addColumns('BILLET_TYPE');
      Query.addColumns('STATION_ID');
      //新增全局变量信息
      if (!Query.data[0]['FACTORY_DIV']) {
        Query.data[0]['FACTORY_DIV'] = v_factory_div;
      }

      if (!Query.data[0]['BILLET_TYPE']) {
        Query.data[0]['BILLET_TYPE'] = v_billet_type;
      }

      if (!Query.data[0]['STATION_ID']) {
        Query.data[0]['STATION_ID'] = i_station_id;
      }
      if (!Query.data[0]['STATION_NO']) {
        Query.data[0]['STATION_NO'] = i_station_no;
      }

      //console.log(i_factory_div, '1', i_billet_type, '2', i_station_id, '3', i_station_no);

      inInfo.addBlock(Query);
      // console.log(inInfo);
      //console.log(i_service_f21);

      const outInfo = await erFormHelper.callService(i_service_f21, inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        if (outInfo.getBlock(0).data.length === 0) {
          erFormHelper.messageError('未查询到数据');
          return false;
        }
        //修改返回Table的名称
        outInfo.blocks = {
          i_service_f21: outInfo.getBlock(0)
        };
        // 根据返回数据加载页面显示数据//需要和si配置的数据集的表一致
        erFormHelper.mergeEiBlockToGrid(outInfo.getBlock(0), gridView1);
      } else {
        erFormHelper.messageError(outInfo.sys.msg);
      }
    };
    //子表GridView2查询
    const getSubGridData = async (eData: any) => {
      //判断对象是否为空
      if (erFormHelper.isNullOrEmpty(eData)) {
        //如果主表信息为空，则清空子表所有数据
        erFormHelper.clearGridData(gridView2);
      } else {
        const eiInfo = new EI.EIInfo();
        const eiBlock = erFormHelper.addJsonToEiBlock(JSON.parse(JSON.stringify(eData)));
        eiInfo.addBlock(eiBlock, 'Table0');
        //调用后台服务
        const outInfo = await erFormHelper.callService('mmsm33f2_inq1', eiInfo);
        //console.log('111');
        //判断代码是否为0，如果为-1则是后台出现问题。
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('查询错误：' + outInfo.sys.msg);
          return;
        }
        //将数据绑定到grid中
        erFormHelper.mergeDataToGrid(outInfo.getBlock(0), gridView2);
      }
    };
    //子表GridView3查询
    const getSubGridData1 = async (eData: any) => {
      //判断对象是否为空
      if (erFormHelper.isNullOrEmpty(eData)) {
        //如果主表信息为空，则清空子表所有数据
        erFormHelper.clearGridData(gridView3);
      } else {
        const eiInfo = new EI.EIInfo();
        const eiBlock = erFormHelper.addJsonToEiBlock(JSON.parse(JSON.stringify(eData)));
        eiInfo.addBlock(eiBlock, 'Table0');
        //调用后台服务
        //console.log(eiInfo);

        const outInfo = await erFormHelper.callService('mmsm33f2_inq1', eiInfo);
        //console.log('111');
        // console.log('outigo:',outInfo);

        //判断代码是否为0，如果为-1则是后台出现问题。
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('查询错误：' + outInfo.sys.msg);
          return;
        }
        //将数据绑定到grid中
        erFormHelper.mergeDataToGrid(outInfo.getBlock(1), gridView3);
      }
    };

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('GridView1');
      console.log('gridView1', gridView1);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid('GridView2');
      erFormHelper.setGridToolbarVisible('GridView2', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid3Ready = () => {
      gridView3 = erFormHelper.getGrid('GridView3');
      erFormHelper.setGridToolbarVisible('GridView3', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const handleTabChange = (activeKey: string) => {
      const mainGridCurrentRow = erFormHelper.getGridCurrentRow(gridView1, true);
      console.log('切换页面1', activeKey, mainGridCurrentRow);
      if (activeKey === 'tab1') {
        getSubGridData(mainGridCurrentRow);
      } else if (activeKey === 'tab2') {
        getSubGridData1(mainGridCurrentRow);
      }
    };

    const F2_DO = async (e: any) => {
      Query();
    };
    //e:PopFreeReturnInfo
    const popFreeEditOkClick = async (e: any) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
      //新增
      if (cs_OkClick === 'F3') {
        inInfo.addBlock(
          erFormHelper.convertModelAsBlock(e.dataModel, {
            FACTORY_DIV: v_factory_div
          }),
          'PARA'
        );
        console.log('inInfo398', inInfo, e.dataModel);

        outInfo = await erFormHelper.callService('mmsm33f3_ins', inInfo, false, true, true);
        console.log('outInfo: ', outInfo);
        if (outInfo.status < 0) {
          //return false;
        }
      }
      //修改
      if (cs_OkClick === 'F4') {
        inInfo.addBlock(
          erFormHelper.convertModelAsBlock(e.dataModel, {
            // PROC_DIV: i_proc_div,
            FACTORY_DIV: v_factory_div
          }),
          'PARA'
        );
        console.log('F4inInfo', inInfo);
        outInfo = await erFormHelper.callService('mmsm33f4_upd', inInfo, false, true);
      }

      //判断操作
      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功');
      }
      /*  const GridView1_value = erFormHelper.getGridCheckedRows('GridView1');
      getSubGridData(GridView1_value);
      getSubGridData1(GridView1_value); */
      Query();
      console.log('inInfo', inInfo, inInfo.getBlock(0).data[0]['PROC_NO']?.toString());

      erFormHelper.setGridIndicator('GridView1', {
        PROC_NO: inInfo.getBlock(0).data[0]['PROC_NO']?.toString()
      });
      erFormHelper.checkGridCurrentRow('GridView1');
    };
    const popFreeEdit_paras = async (windowsNumber: string, Click_name: string) => {
      if (i_windowsNumber === 'MMSM_DIALOG') {
        //新增
        if (Click_name === 'F3') {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM33_LAYOUT_DIALOG');
        }
        //修改
        if (Click_name === 'F4') {
          popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM33_LAYOUT_DIALOG');
        }
      }
      if (Click_name === 'F3') {
        //新增
        //popFreeEdit.AllowEidt = true;
        if (i_windowsNumber === 'MMSM_DIALOG') {
          popFreeEdit.FormHelper.setControlReadOnly('MMSM33_LAYOUT_DIALOG', true, 'HEAT_NO', 'PONO');

          popFreeEdit.ReceiveData({
            ...JSON.parse(
              JSON.stringify(
                erFormHelper.getGridCurrentRow('GridView1', true)
                  ? erFormHelper.getGridCurrentRow('GridView1', true)
                  : {}
              )
            ),
            ...JSON.parse(
              JSON.stringify(
                erFormHelper.getGridCurrentRow('GridView2', true)
                  ? erFormHelper.getGridCurrentRow('GridView2', true)
                  : {}
              )
            ),
            ...JSON.parse(
              JSON.stringify(
                erFormHelper.getGridCurrentRow('GridView3', true)
                  ? erFormHelper.getGridCurrentRow('GridView3', true)
                  : {}
              )
            )
          });
        }
      }
      //修改
      if (Click_name === 'F4') {
        //popFreeEdit.AllowEidt = true;
        if (i_windowsNumber === 'MMSM_DIALOG') {
          popFreeEdit.FormHelper.setControlReadOnly(
            'MMSM33_LAYOUT_DIALOG',
            true,
            'HEAT_NO',
            'PONO',
            'MAT_NO',
            'ST_NO',
            'SM_PLAN_NO'
          );
          popFreeEdit.ReceiveData({
            ...JSON.parse(
              JSON.stringify(
                erFormHelper.getGridCurrentRow('GridView1', true)
                  ? erFormHelper.getGridCurrentRow('GridView1', true)
                  : {}
              )
            ),
            ...JSON.parse(
              JSON.stringify(
                erFormHelper.getGridCurrentRow('GridView2', true)
                  ? erFormHelper.getGridCurrentRow('GridView2', true)
                  : {}
              )
            ),
            ...JSON.parse(
              JSON.stringify(
                erFormHelper.getGridCurrentRow('GridView3', true)
                  ? erFormHelper.getGridCurrentRow('GridView3', true)
                  : {}
              )
            )
          });
        }
      }
    };
    const F3_DO = async (e: any) => {
      // console.log(erFormHelper.getGridCheckedRows('GridView1', true)[0]['CUT_FIN_FLAG']);
      const selectedRows = erFormHelper.getGridCheckedRowsAsBlock(gridView1);

      if (selectedRows.data.length === 0) {
        erFormHelper.messageInfo('请选择一条炉次信息进行新增');
        return;
      }
      if (erFormHelper.getGridCheckedRows('GridView1', true)[0]['CUT_FIN_FLAG'] == 1) {
        erFormHelper.messageWarning('切断已完毕，不允许新增！');
        return false;
      }
      // 弹出新增画面
      cs_OkClick = 'F3';
      i_windowsNumber = 'MMSM_DIALOG';
      //模板参数
      await popFreeEdit_paras(i_windowsNumber, cs_OkClick);
      //加载弹窗配置
      //popFreeEdit.EditType = 'Add';

      selectedRows.addColumns(
        'SLAB_THICK',
        'FACTORY_DIV',
        'STATION_ID',
        'SLAB_HEAD_WIDTH',
        'SLAB_TAIL_WIDTH',
        'MAT_TUBE',
        'FIX_SLAB_NUM',
        'SLAB_CUT_TIME',
        'STATION_NO',
        'SLAB_TYPE',
        'SLAB_LEN'
      );

      selectedRows.data[0]['FACTORY_DIV'] = v_factory_div;
      selectedRows.data[0]['STATION_ID'] = i_station_id;
      selectedRows.data[0]['STATION_NO'] = selectedRows.data[0]['CC_MACH_NO'];
      selectedRows.data[0]['SLAB_TYPE'] = selectedRows.data[0]['BILLET_TYPE'];

      const Grid2cr = erFormHelper.getGridCurrentRowAsBlock('GridView2'); //焦点行数据
      const grid2sr = erFormHelper.getGridSelectRowsAsBlock('GridView2'); //勾选行数据
      const grid2ds = erFormHelper.getGridAllRowsAsBlock('GridView2'); //获取所有行数据
      let row_id = 0;
      let get_num = 0;

      const c_slab_type = selectedRows.data[0]['SLAB_TYPE']?.toString(); //wzn_20170920 add 增加板坯类型  1-板坯 ；3、4-方圆坯

      for (row_id = 0; row_id < grid2ds.data.length; row_id++) {
        console.log('grid2ds.length', grid2ds.data.length);
        console.log('get_num', get_num);
        if (grid2ds.data[row_id]['SLAB_PROD_FLAG']?.toString() !== '1') {
          if ((i_cut_type == 'L' || grid2sr.data.length > 1) && c_slab_type != '3' && c_slab_type != '4') {
            //wzn_20170920 add 增加板坯类型
            if (i_station_id.toString() == 'C') {
              selectedRows.data[0]['SLAB_THICK'] = grid2ds.data[row_id]['SLAB_THICK'];
              selectedRows.data[0]['SLAB_WIDTH'] = grid2ds.data[row_id]['SLAB_WIDTH'];
              selectedRows.data[0]['SLAB_LEN'] = grid2ds.data[row_id]['SLAB_LEN'];
              // selectedRows.data[0]["SLAB_LEN_L"] = grid2ds.data[row_id]['SLAB_LEN_L'];
              selectedRows.data[0]['SLAB_HEAD_WIDTH'] = grid2ds.data[row_id]['SLAB_WIDTH'];
              selectedRows.data[0]['SLAB_TAIL_WIDTH'] = grid2ds.data[row_id]['SLAB_WIDTH'];
              selectedRows.data[0]['FIX_SLAB_NUM'] = grid2ds.data[row_id]['SLAB_NUM_REMAIN'];
              i_cutTube_eb = grid2ds.data[row_id]['SLAB_NUM'];
              selectedRows.data[0]['MAT_TUBE'] = i_cutTube_eb;
            }
            get_num = 1;
          } else {
            if (i_station_id.toString() == 'C') {
              selectedRows.data[0]['SLAB_THICK'] = grid2ds.data[row_id]['SLAB_THICK'];
              selectedRows.data[0]['SLAB_WIDTH'] = grid2ds.data[row_id]['SLAB_WIDTH'];
              selectedRows.data[0]['SLAB_LEN'] = grid2ds.data[row_id]['SLAB_LEN'];
              // selectedRows.data[0]["SLAB_LEN_L"] = grid2ds.data[i]['SLAB_LEN_L'];
              selectedRows.data[0]['SLAB_HEAD_WIDTH'] = grid2ds.data[row_id]['SLAB_WIDTH'];
              selectedRows.data[0]['SLAB_TAIL_WIDTH'] = grid2ds.data[row_id]['SLAB_WIDTH'];
              //selectedRows.data[0]["FIX_SLAB_NUM"] = grid2ds.data[row_id]['MAT_TUBE'];
              i_cutTube_eb = grid2ds.data[row_id]['SLAB_NUM'];
              selectedRows.data[0]['MAT_TUBE'] = i_cutTube_eb;
              console.log('1', i_cut_type);
            }
            if (c_slab_type == '3' || c_slab_type == '4') {
              selectedRows.data[0]['FIX_SLAB_NUM'] = 1;
              //selectedRows.data[0]["MAT_TUBE"] = 1;
              console.log('2', i_cut_type);
            } else if (i_cut_type.toString() == 'A') {
              selectedRows.data[0]['FIX_SLAB_NUM'] = grid2ds.data[row_id]['MAT_TUBE'];
              selectedRows.data[0]['SLAB_LEN'] = grid2ds.data[row_id]['SLAB_LEN'];
            } else {
              console.log('aaaaa', grid2ds.data.length);

              selectedRows.data[0]['FIX_SLAB_NUM'] = grid2ds.data.length == 0 ? 1 : grid2ds.data.length;
            }
            get_num = 1;
          }
          if (get_num === 1) {
            break;
          }
        }
      }
      console.log('222', get_num);
      //如果获取不到（都已产出） 默认取最后一个命令信息
      if (get_num !== 1) {
        i_cutTube_eb = 1;
        selectedRows.data[0]['MAT_TUBE'] = i_cutTube_eb;
        if ((grid2ds.data.length > 0 || i_cut_type == 'L') && c_slab_type != '3' && c_slab_type != '4') {
          if (i_station_id === 'C') {
            selectedRows.data[0]['SLAB_THICK'] = grid2ds.data[grid2ds.data.length - 1]['SLAB_THICK'];
            selectedRows.data[0]['SLAB_WIDTH'] = grid2ds.data[grid2ds.data.length - 1]['SLAB_WIDTH'];
            selectedRows.data[0]['SLAB_LEN'] = grid2ds.data[grid2ds.data.length - 1]['SLAB_LEN'];
            // selectedRows.data[0]["MEASURE_WT_FLAG"] = grid2ds.data[grid2ds.data.length-1]['MEASURE_WT_FLAG'];
            // selectedRows.data[0]["SLAB_WT"] = grid2ds.data[grid2ds.data.length-1]['SLAB_WT'];
            selectedRows.data[0]['SLAB_HEAD_WIDTH'] = grid2ds.data[grid2ds.data.length - 1]['SLAB_HEAD_WIDTH'];
            selectedRows.data[0]['SLAB_TAIL_WIDTH'] = grid2ds.data[grid2ds.data.length - 1]['SLAB_TAIL_WIDTH'];
          }

          selectedRows.data[0]['FIX_SLAB_NUM'] = 0; //余材
          get_num = 1;
        } else if (grid2ds.data.length > 0) {
          if (i_station_id === 'C') {
            /*  selectedRows.data[0]['SLAB_THICK'] = grid3ds1.data[0]['SLAB_THICK'];
          selectedRows.data[0]['SLAB_WIDTH'] = grid3ds1.data[0]['SLAB_WIDTH'];
          selectedRows.data[0]['SLAB_LEN'] = grid3ds1.data[0]['SLAB_LEN'];
          selectedRows.data[0]['SLAB_HEAD_WIDTH'] = grid3ds1.data[0]['SLAB_WIDTH'];
          selectedRows.data[0]['SLAB_TAIL_WIDTH'] = grid3ds1.data[0]['SLAB_WIDTH']; */
            selectedRows.data[0]['SLAB_THICK'] = grid2ds.data[grid2ds.data.length - 1]['SLAB_THICK'];
            selectedRows.data[0]['SLAB_WIDTH'] = grid2ds.data[grid2ds.data.length - 1]['SLAB_WIDTH'];
            selectedRows.data[0]['SLAB_LEN'] = grid2ds.data[grid2ds.data.length - 1]['SLAB_LEN'];
            // selectedRows.data[0]["MEASURE_WT_FLAG"] = grid2ds.data[grid2ds.data.length-1]['MEASURE_WT_FLAG'];
            // selectedRows.data[0]["SLAB_WT"] = grid2ds.data[grid2ds.data.length-1]['SLAB_WT'];
            selectedRows.data[0]['SLAB_HEAD_WIDTH'] = grid2ds.data[grid2ds.data.length - 1]['SLAB_HEAD_WIDTH'];
            selectedRows.data[0]['SLAB_TAIL_WIDTH'] = grid2ds.data[grid2ds.data.length - 1]['SLAB_TAIL_WIDTH'];
          }

          selectedRows.data[0]['FIX_SLAB_NUM'] = 0;
          get_num = 1;
        } else {
          // selectedRows.data[0]["SLAB_THICK"] = selectedRows.data[0]['SLAB_THICK'];
          // selectedRows.data[0]["SLAB_WIDTH"] = selectedRows.data[0]['SLAB_WIDTH'];
          // selectedRows.data[0]["SLAB_LEN"] = selectedRows.data[0]['SLAB_LEN'];
          // selectedRows.data[0]["SLAB_HEAD_WIDTH"] = selectedRows.data[0]['SLAB_WIDTH'];
          // selectedRows.data[0]["SLAB_TAIL_WIDTH"] = selectedRows.data[0]['SLAB_WIDTH'];
        }
      }

      let matLen = 0;
      let v_slab_no: any;
      console.log('grid2sr', grid2sr);
      console.log('grid2sr', grid2sr.data.length);
      if (grid2sr.data.length >= 1) {
        selectedRows.data[0]['FIX_SLAB_NUM'] = grid2sr.data.length;
        i_cutTime_eb = 0;
        for (let i = 1; i <= grid2sr.data.length; i++) {
          //此处客制化，是否允许跨长坯勾选
          if (i > 1) {
            if (v_slab_no !== grid2sr.data[i - 1]['LSLAB_NO']?.toString() && i_cut_trans_ls !== '1') {
              erFormHelper.messageInfo('设定条件不可跨长坯切割！');
              return;
            }
          }

          v_slab_no = grid2sr.data[i - 1]['LSLAB_NO']?.toString();

          if (grid2sr.containsColumn('SLAB_PROD_FLAG') && grid2sr.containsColumn('SLAB_NO')) {
            if (grid2sr.data[i - 1]['SLAB_PROD_FLAG']?.toString() === '1') {
              erFormHelper.messageInfo('板坯' + grid2sr.data[i - 1]['SLAB_NO']?.toString() + '已产出！');
              return;
            }
            //下面待定是否注释，为9应该是可生产
            if (grid2sr.data[i - 1]['SLAB_PROD_FLAG']?.toString() === '9') {
              erFormHelper.messageInfo('板坯' + grid2sr.data[i - 1]['SLAB_NO']?.toString() + '未产出！');
              return;
            }
          }
          if (c_slab_type !== '3' && c_slab_type !== '4') {
            //方圆坯默认从数据库取
            if (grid2sr.containsColumn('SLAB_LEN')) {
              matLen = matLen + Number(grid2sr.data[i - 1]['SLAB_LEN']?.toString());
            } else {
              matLen = 0;
            }
          }

          if (!selectedRows.containsColumn('PONO_SLAB_' + i.toString())) {
            selectedRows.addColumn('PONO_SLAB_' + i.toString());
          }

          selectedRows.data[0]['PONO_SLAB_' + i.toString()] = grid2sr.data[i - 1]['SLAB_NO'];

          if (!selectedRows.containsColumn('PONO_SLAB_LEN_' + i.toString())) {
            selectedRows.addColumn('PONO_SLAB_LEN_' + i.toString());
          }

          if (grid2sr.containsColumn('SLAB_LEN')) {
            selectedRows.data[0]['PONO_SLAB_LEN_' + i.toString()] = grid2sr.data[i - 1]['SLAB_LEN'];
          }
        }

        if (c_slab_type !== '3' && c_slab_type !== '4') {
          //selectedRows.data[0]['SLAB_LEN_PLAN']
          if (!selectedRows.containsColumn('SLAB_LEN_PLAN')) {
            selectedRows.addColumn('SLAB_LEN_PLAN');
          }
          selectedRows.data[0]['SLAB_LEN_PLAN'] = matLen;
          if (!selectedRows.containsColumn('SLAB_LEN')) {
            selectedRows.addColumn('SLAB_LEN');
          }
          selectedRows.data[0]['SLAB_LEN'] = matLen;
          if (!selectedRows.containsColumn('FIX_LEN')) {
            selectedRows.addColumn('FIX_LEN');
          }
          selectedRows.data[0]['FIX_LEN'] = matLen;
        }
      } else {
        if (!grid2ds.containsColumn('SLAB_NUM_REMAIN')) {
          grid2ds.addColumn('SLAB_LEN_PLAN');
          console.log('111');
        }
        //如果rowid =0 则表示尚未产出实绩，先将0置1，以便下一条语句可以获取第0行数据
        if (row_id == 0) {
          row_id = 1;
        }

        i_cutTime_eb = 1;
        selectedRows.data[0]['FIX_SLAB_NUM'] = grid2ds.data[row_id - 1]['SLAB_NUM_REMAIN'];
        if (!selectedRows.containsColumn('SLAB_LEN_PLAN')) {
          selectedRows.addColumn('SLAB_LEN_PLAN');
        }
        selectedRows.data[0]['SLAB_LEN_PLAN'] = selectedRows.data[0]['SLAB_LEN'];
      }

      if (grid2ds.data.length > 0 && grid2sr.data.length > 0) {
        if (grid2sr.getColumn('INGOT_CODE')) {
          selectedRows.data[0]['INGOT_CODE'] = grid2sr.data[0]['INGOT_CODE'];
        }
      }

      popFreeEdit.ReceiveData(selectedRows.data[0], { PONO: true, HEAT_NO: true });

      popFreeEdit.setEvent('itemValueChanged', (e: any) => {
        if (e.itemCode === 'FIX_SLAB_NUM') {
          const s_slab_len =
            popFreeEdit.getValue('SLAB_LEN_PLAN').toString().trim() === '' ? 0 : popFreeEdit.getValue('SLAB_LEN_PLAN');
          const fix_num =
            popFreeEdit.getValue('FIX_SLAB_NUM').toString().trim() === '' ? 0 : popFreeEdit.getValue('FIX_SLAB_NUM');
          if (Number(fix_num) >= 1 && Number(s_slab_len) > 0) {
            const cut_slab_len = Number(s_slab_len) * Number(fix_num);
            const fin_slab_len = cut_slab_len < 0 ? s_slab_len : cut_slab_len;
            popFreeEdit.setValue({ SLAB_LEN: fin_slab_len });
          }
        }
      });

      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };

    const F4_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRowsAsBlock(gridView1).data.length === 0) {
        erFormHelper.messageInfo('请选择一条炉次信息进行修改');
        return;
      }
      if (erFormHelper.getGridCheckedRows('GridView1', true)[0]['CUT_FIN_FLAG'] == 1) {
        erFormHelper.messageWarning('切断已完毕，不允许修改操作！');
        return false;
      }
      const selectedRows = erFormHelper.getGridSelectRowsAsBlock(gridView1);
      //console.log('selectedRows.data: ', selectedRows.data);
      if (selectedRows.data.length === 0) {
        erFormHelper.messageInfo('请选择一条炉次信息进行修改');
        return;
      }
      // const eiInfo = new EI.EIInfo();
      // 弹出新增画面
      cs_OkClick = 'F4';
      i_windowsNumber = 'MMSM_DIALOG';
      //模板参数
      popFreeEdit_paras(i_windowsNumber, cs_OkClick);
      //加载弹窗配置
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
      //添加
      Query();
      editable.value = false;
      erFormHelper.setGridEditable('GridView1', false);
    };
    const F5_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRowsAsBlock(gridView1).data.length === 0) {
        erFormHelper.messageInfo('请选择一条炉次信息进行删除');
        return;
      }
      if (erFormHelper.getGridCheckedRows('GridView1', true)[0]['CUT_FIN_FLAG'] == 1) {
        erFormHelper.messageWarning('切断已完毕，不允许删除操作！');
        return false;
      }
      if (erFormHelper.getGridCheckedRows('GridView3', true).length) {
        const selectedRows = erFormHelper.getGridSelectRowsAsBlock(gridView3);
        const eiInfo = new EI.EIInfo();
        eiInfo.addBlock(selectedRows, 'Table0');
        const outInfo = await erFormHelper.callService('mmsm33f5_del', eiInfo);

        if (outInfo.sys.status < 0) {
          //维护完成重新查询
          erFormHelper.messageError('处理错误：' + outInfo.sys.msg);
          return false;
        } else {
          erFormHelper.messageSuccess('保存成功');
          Query();
        }
      } else {
        return false;
      }
    };
    const F5_PRE_DO = async (e: any) => {};
    const F5_CANCEL = async (e: any) => {};

    const F6_DO = async (e: any) => {
      const selectedRows = erFormHelper.getGridSelectRowsAsBlock(gridView1);
      //console.log('selectedRows.data: ', selectedRows.data);
      if (selectedRows.data.length === 0) {
        erFormHelper.messageInfo('请选择一条炉次信息进行修改');
        return;
      }

      const mes_res = await erFormHelper.messageConfirm('切割完成后的炉次信息不能进行新增修改删除，是否继续');

      if (!mes_res) {
        return false;
      }
      //切断完毕
      const inInfo = new EI.EIInfo();
      const data = erFormHelper.buildEiBlock(erFormHelper.getGridCheckedRows('GridView1', true));
      data.addColumns('FACTORY_DIV', 'CUT_FIN_FLAG');
      data.data[0]['FACTORY_DIV'] = v_factory_div;
      data.data[0]['CUT_FIN_FLAG'] = 1;
      inInfo.addBlock(
        data,
        // erFormHelper.convertModelAsBlock(e.dataModel?.get(''), {
        //   //PROC_DIV: i_proc_div,
        //   FACTORY_DIV: v_factory_div
        // }),
        'Table1'
      );

      const outInfo = await erFormHelper.callService('mmsm33f6_cut', inInfo, false, false);
      if (outInfo.sys.status != 0) {
        erFormHelper.messageWarning(outInfo.sys.msg);
      } else {
        Query();
      }
    };

    const F7_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      const data = erFormHelper.buildEiBlock(erFormHelper.getGridCheckedRows('GridView1', true));
      data.addColumns('FACTORY_DIV', 'CUT_FIN_FLAG');
      data.data[0]['FACTORY_DIV'] = v_factory_div;
      data.data[0]['CUT_FIN_FLAG'] = 0;
      inInfo.addBlock(
        data,
        // erFormHelper.convertModelAsBlock(e.dataModel?.get(''), {
        //   //PROC_DIV: i_proc_div,
        //   FACTORY_DIV: v_factory_div
        // }),
        'Table1'
      );
      const selectedRows = erFormHelper.getGridSelectRowsAsBlock(gridView1);
      //console.log('selectedRows.data: ', selectedRows.data);
      if (selectedRows.data.length === 0) {
        erFormHelper.messageInfo('请选择一条炉次信息进行修改');
        return;
      }
      // let outInfo = new EI.EIInfo();
      const outInfo = await erFormHelper.callService('mmsm33f6_cut', inInfo, false, false);
      if (outInfo.sys.status != 0) {
        erFormHelper.messageWarning(outInfo.sys.msg);
      } else {
        Query();
      }
      //Query();
    };
    const GridView1FocusChanged = (e: any) => {
      erFormHelper.unCheckAllGridRow('GridView1');

      if (e && e.rowChanged && e.data && e.data.get('PROC_NO')) {
        if (e.data) {
          nextTick(() => {
            let rowIndex = 1;

            console.log('887e', e, e.rowIndex);

            /*  if (e.sender.current()) {
              console.log('887e', e);
              rowIndex = e.sender.current().closest('tr').index();
            } */

            //e.sender.select(`tr:eq(${rowIndex})`);

            //e.sender.select(`tr:eq(${rowIndex})`);
            getSubGridData(e.data);
            getSubGridData1(e.data);
          });
        } else {
          erFormHelper.clearGridData('GridView2');
          erFormHelper.clearGridData('GridView3');
        }
      }
    };

    return {
      handleTabChange,
      tabActiveKey,
      erGrid1Ready,
      erGrid2Ready,
      erGrid3Ready,
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      F5_PRE_DO,
      F5_CANCEL,
      F6_DO,
      F7_DO,
      GridView1FocusChanged,
      gridToolbar
    };
  }
});
