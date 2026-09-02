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
import { anyType } from 'ant-design-vue/es/_util/type';

export default defineComponent({
    name: 'MMSM37POP',
    components: { xrEfForm, xrEfPanel, erLayout, erGrid },
    props: {
        openInDialog: {
            type: Boolean,
            default: false
        },
        dialogFormName: {
            type: String,
            default: ''
        },
        parentInfo: {
            type: Object
        }
    },
    // 向父画面传递数据-注册emit监听事件
    emits: ['getChildInfo'],
    setup: (props, { emit }) => {
    // 变量定义
    let formParams: any = '';
    let formPartition: any = '';
    const initializeService = '';
    let formName = ''; // 当前画面名
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    const initializeFlag = ref(0);

    // 获取画面相关配置信息
    const efFormInitialized = (formInfo: any) => {
            formParams = formInfo;
            formPartition = formParams.formPartition;
            formName = formParams.formName;
            /*  nextTick(() => {
              QueryPara();
            }); */
        };
    let pagePara: any; // 炼钢配置表页面参数
    let procDiv: any;
    const parentInfo = ref(props.parentInfo); // 获取父画面传入参数
    const PROC_DIV = parentInfo.value?.PROC_DIV;
    const HEAT_NO_THIS = parentInfo.value?.HEAT_NO;
    //这里设置一下弹出框的PROD_SEQ
    let PROD_SEQ_NO_THIS = parentInfo.value?.PROD_SEQ_NO;
    const MAT_NO_THIS = parentInfo.value?.MAT_NO;
    //2024-03-08
    const MEND_CANCEL_FLAG = parentInfo.value?.MEND_CANCEL_FLAG;

    //2024-04-18
    let MEND_ODD_SHIFT_NAME: any;
    let MEND_EVEN_SHIFT_NAME: any;
    //2024-04-07
    let MEND_SLAG_HOPPER_MACHINE: any;
    let MEND_SLAG_HOPPER_OPERATOR: any;
    let MEND_SLAG_HOPPER_WEIGHT: any;

    let MEND_SLAG_OUTER_HOPPER_MACHINE: any;
    let MEND_SLAG_OUTER_HOPPER_OPERATOR: any;
    let MEND_SLAG_OUTER_HOPPER_WEIGHT: any;

    let WHEEL_TYPE_IN: any;
    let GRINDSTONE_SUPPLIER_IN: any;
    let GRINDING_WHEEL_GRAININESS: any;
    let GRINDING_WHEEL_PEOPLE: any;
    let GRINDING_WHEEL_MACHINE: any;

    let WHEEL_TYPE_OUT: any;
    let GRINDSTONE_SUPPLIER_OUT: any;
    let GRINDING_WHEEL_OUTER_GRAININESS: any;
    let GRINDING_WHEEL_OUTER_PEOPLE: any;
    let GRINDING_WHEEL_OUTER_MACHINE: any;

    let lay = ref('0');
    const efFormReady = (e: any) => {
            efFormInfo.value = e.formInfo;
            efFormIsReady.value = true;
            formPartition = efFormInfo.value.formPartition;
            formName = efFormInfo.value.formName; // 当前画面名
            // 初始化低代码工具类
            procDiv = parentInfo.value?.PROC_DIV;
            QueryPara();
        };

    // 画面相关数据初始化
    const initializePage = async() => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
            if (initialResult.flag >= 0) {
                // 画面工具类初始化成功后将画面渲染条件设置为1

                initializeFlag.value = 1;
                if (formName == 'MMSM37POPU') {
                    initializeFlag.value = 2;
                    procDiv = 'Edit';
                }
                //2024-1-11
                if (procDiv == 'INNER_1I' || procDiv == 'OUTER_1U') {
                    lay.value = 'layoutControlGroup2';
                } else if (procDiv == 'INNER_2I' || procDiv == 'OUTER_2U') {
                    lay.value = 'layoutControlGroup4';
                }

                //初始化弹出界面
                if (procDiv == 'INNER_1I') {
                    erFormHelper.setControlVisible('layoutControlGroup1', false, 'CASTING_BILLET_SCORE', 'empty');
                    erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_SECOND_WEIGHT', 'empty');
                    //内弧是否更换砂轮  --layoutControlGroup3
                    setControlVisibleGrinding(1);
                    //是否倒渣斗  -- layoutControlGroup3
                    setControlVisibleHopper(1);
                    //是否交接班料
                }
                if (procDiv == 'OUTER_1U') {
                    erFormHelper.setControlVisible('layoutControlGroup1', false, 'MATERIAL_DESC', 'empty');
                    //外弧是否更换砂轮  --layoutControlGroup3
                    setControlVisibleOuterGrinding(1);
                    //是否倒渣斗  -- layoutControlGroup3
                    setControlVisibleOuterHopper(1);
                }
                if (procDiv == 'INNER_2I') {
                    //内弧是否更换砂轮  --layoutControlGroup3
                    setControlVisibleGrinding(1);
                    //是否倒渣斗  -- layoutControlGroup3
                    setControlVisibleHopper(1);
                }
                if (procDiv == 'OUTER_2U') {
                    erFormHelper.setControlVisible('layoutControlGroup1', false, 'MATERIAL_DESC', 'empty');
                    //外弧是否更换砂轮  --layoutControlGroup3
                    setControlVisibleOuterGrinding(1);
                    //是否倒渣斗  -- layoutControlGroup3
                    setControlVisibleOuterHopper(1);
                }


                /**
                 *   日期：2024-05-27
                 *   原因：对于跨班料等修磨工无法改电子记录的情况，需要给管理人员一个操作的权限，可以修改：磨前重量、磨后重量等
                 *   标记：ADMIN_EDIT
                 */
                if (procDiv == 'ADMIN_EDIT') {
                    lay.value = 'layoutControlGroup2';

                }

                // 回调函数获取控件信息及设置定义事件等操作
                nextTick(() => {
                    if (HEAT_NO_THIS && MAT_NO_THIS) {
                        queryAll();
                    }
                });
            } else {
                erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
            }
    };

        onMounted(() => {
            //QueryPara();
            //handleEfDialogMessage();
            // initializePage();
        });
    //通过炼钢配置表，进行模板画面参数查询
    const QueryPara = async() => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
            eiBlock.pushData(
                {
                    PROGRAM_NAME: formName
                },
                true
                );
            EIManager.callService(formPartition, 'mmsmpara_inq', eiInfo)
                .then((res: EI.EIInfo) => {
                    if (res.status === 0) {
            const resData: any = {};
                        res.blocks['MMSMPARA_INQ'].data.forEach((item: any) => {
                            resData[item.PARA_NAME] = item.PARA;
                        });
                        pagePara = resData;
                        nextTick(() => {
                            initializePage();
                        });
          }
                })
                .catch((error: any) => { });
    };

    // 修改时进入画面查询
    const queryAll = async() => {
      // 查询修磨实绩
      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());

      //取消修磨之后，材料修磨之前的重量变化，newMatWT 保存最新的材料MAT_WT重量
      let newMatWT;
      //这里是：初磨（内弧）-----从铸坯信息，弹出
      let queryCondition = {
                PROD_SEQ_NO: '',
                HEAT_NO: HEAT_NO_THIS,
                MAT_NO: MAT_NO_THIS,
                FACTORY_DIV: 'LG1',
                STATION_ID: pagePara.station_id,
                STATION_NO: pagePara.station_no,
                QUERY_DIV: pagePara.QUERY_DIV
            };
            //这里是：初磨（内弧）-----从修磨记录，弹出
            if (procDiv == 'INNER_1I' && PROD_SEQ_NO_THIS != undefined && PROD_SEQ_NO_THIS != '') {
                queryCondition = {
                    PROD_SEQ_NO: PROD_SEQ_NO_THIS,
                    HEAT_NO: HEAT_NO_THIS,
                    MAT_NO: MAT_NO_THIS,
                    FACTORY_DIV: ' ',
                    STATION_ID: '',
                    STATION_NO: '',
                    QUERY_DIV: 'TMMSM34'
                };
            }

            //这里是：初磨（外弧）
            if (procDiv == 'OUTER_1U') {
                queryCondition = {
                    PROD_SEQ_NO: PROD_SEQ_NO_THIS,
                    HEAT_NO: HEAT_NO_THIS,
                    MAT_NO: MAT_NO_THIS,
                    FACTORY_DIV: ' ',
                    STATION_ID: '',
                    STATION_NO: '',
                    QUERY_DIV: 'TMMSM34'
                };
                //再磨（内弧）
            }
            //这里是：再磨（内弧）
            else if (procDiv == 'INNER_2I') {
                //表示从铸坯信息，弹出的再磨框

                if (PROD_SEQ_NO_THIS == '' || PROD_SEQ_NO_THIS == undefined) {
                    queryCondition = {
                        PROD_SEQ_NO: PROD_SEQ_NO_THIS,
                        HEAT_NO: HEAT_NO_THIS,
                        MAT_NO: MAT_NO_THIS,
                        FACTORY_DIV: 'LG1',
                        STATION_ID: pagePara.station_id,
                        STATION_NO: pagePara.station_no,
                        QUERY_DIV: pagePara.QUERY_DIV
                    };
                } else {
                    queryCondition = {
                        PROD_SEQ_NO: PROD_SEQ_NO_THIS,
                        HEAT_NO: HEAT_NO_THIS,
                        MAT_NO: MAT_NO_THIS,
                        FACTORY_DIV: ' ',
                        STATION_ID: '',
                        STATION_NO: '',
                        QUERY_DIV: 'TMMSM34'
                    };
                }
            }
            //这里是：再磨（外弧）
            else if (procDiv == 'OUTER_2U') {
                queryCondition = {
                    PROD_SEQ_NO: PROD_SEQ_NO_THIS,
                    HEAT_NO: HEAT_NO_THIS,
                    MAT_NO: MAT_NO_THIS,
                    //MEND_FLAG:'1',
                    FACTORY_DIV: ' ',
                    STATION_ID: '',
                    STATION_NO: '',
                    QUERY_DIV: 'TMMSM34'
                };
            }
            //这里是：修改
            if (procDiv == 'Edit') {
                queryCondition = {
                    PROD_SEQ_NO: PROD_SEQ_NO_THIS,
                    HEAT_NO: HEAT_NO_THIS,
                    MAT_NO: MAT_NO_THIS,
                    //MEND_FLAG:'1',
                    FACTORY_DIV: ' ',
                    STATION_ID: '',
                    STATION_NO: '',
                    QUERY_DIV: 'TMMSM34'
                };
            }
            // 这里是：管理员修改
            if (procDiv == 'ADMIN_EDIT') {
                queryCondition = {
                    PROD_SEQ_NO: PROD_SEQ_NO_THIS,
                    HEAT_NO: HEAT_NO_THIS,
                    MAT_NO: MAT_NO_THIS,
                    //MEND_FLAG:'1',
                    FACTORY_DIV: ' ',
                    STATION_ID: '',
                    STATION_NO: '',
                    QUERY_DIV: 'TMMSM34'
                };
            }

            eiBlock.pushData(queryCondition, true);
            //这里需要查一下当前01表数据
            if (MEND_CANCEL_FLAG == '1') {
        let tmmsm01QueryCondition = {
                    MAT_NO: MAT_NO_THIS,
                    FACTORY_DIV: ' ',
                    STATION_ID: '',
                    STATION_NO: '',
                    QUERY_DIV: 'TMMSM01'
                };
        const eiInfoTmmsm01 = new EI.EIInfo();
        const eiBlockTmmsm01 = eiInfoTmmsm01.addBlock(new EI.EiBlock());
                eiBlockTmmsm01.pushData(tmmsm01QueryCondition, true);
        const outInfoTmmsm01 = await erFormHelper.callService('mmsm34f2_inq', eiInfoTmmsm01, false, true);
                newMatWT = outInfoTmmsm01.getBlock(0).data[0]['MAT_WT'];
      }
      const outInfo = await erFormHelper.callService(pagePara.service_f2, eiInfo, false, false, true);
            PROD_SEQ_NO_THIS = outInfo.getBlock(0).data[0]['PROD_SEQ_NO'];
            // 判断调后台是否失败
            if (outInfo.sys.status < 0) {
                erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
            } else {
        //内弧
        const innerOperator = outInfo.getBlock(0).data[0]['MEND_INNER_OPERATOR'];
        const innerMode = outInfo.getBlock(0).data[0]['MEND_INNER_MODE'];
        const innerMachine = outInfo.getBlock(0).data[0]['MEND_INNER_MACHINE'];

        //外弧
        const outerOperator = outInfo.getBlock(0).data[0]['MEND_OUTER_OPERATOR'];
        const outerMode = outInfo.getBlock(0).data[0]['MEND_OUTER_MODE'];
        const outerMachine = outInfo.getBlock(0).data[0]['MEND_OUTER_MACHINE'];

        let blockInfo = outInfo.getBlock(0);


                if (innerOperator == ' ') {
                    blockInfo = blockInfo.removeColumn('MEND_INNER_OPERATOR');
                }
                if (innerMode == ' ') {
                    blockInfo = blockInfo.removeColumn('MEND_INNER_MODE');
                }
                if (innerMachine == ' ') {
                    blockInfo = blockInfo.removeColumn('MEND_INNER_MACHINE');
                }

                if (outerOperator == ' ') {
                    blockInfo = blockInfo.removeColumn('MEND_OUTER_OPERATOR');
                }
                if (outerMode == ' ') {
                    blockInfo = blockInfo.removeColumn('MEND_OUTER_MODE');
                }
                if (outerMachine == ' ') {
                    blockInfo = blockInfo.removeColumn('MEND_OUTER_MACHINE');
                }
                erFormHelper.setControlValueEx('layoutControlGroup1', blockInfo.data[0]);

        //2024-04-18 这里通过IP获取一下  ---开始
        let ipQueryCondition = {
                    KEY: 'IP'
                };
                console.log('11111','IP')
        const eiIpSetInfo = new EI.EIInfo();
        const eiIpSetBlock = eiIpSetInfo.addBlock(new EI.EiBlock());
                eiIpSetBlock.pushData(ipQueryCondition, true);
        const ipSetInfo = await erFormHelper.callService('mmsmcode_query', eiIpSetInfo, false, false, true);
                console.log('11111', ipSetInfo);
                if (ipSetInfo.sys.status < 0) {

                } else {

                    if (ipSetInfo.getBlock(0).data[0] == undefined) {
                        console.log('ipSetInfo', 'IP信息不存在')
          } else {
          let set = ipSetInfo.getBlock(0).data[0]['CODE_DESC_1_CONTENT'];
          const value = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_SET');
                        if (value != undefined && value != ' ' && value != ''){
                            set = value;
          }
          const machine = ipSetInfo.getBlock(0).data[0]['CODE_DESC_2_CONTENT'];
          const userName = ipSetInfo.getBlock(0).data[0]['CODE_DESC_3_CONTENT'];
          const group = ipSetInfo.getBlock(0).data[0]['CODE_DESC_4_CONTENT'];
                        if (set != undefined) {
                            erFormHelper.setControlValueEx('layoutControlGroup1', {
                                MEND_SET: set
                            });
                        }
                        if (machine != undefined || machine != ' ') {
                            erFormHelper.setControlValueEx('layoutControlGroup1', {
                                MEND_INNER_MACHINE: machine
                            });
                        }
                        if (userName != undefined || userName != ' ') {
                            erFormHelper.setControlValueEx('layoutControlGroup1', {
                                MEND_INNER_OPERATOR: userName
                            });
                        }
                        if (procDiv == 'ADMIN_EDIT') {

                        } else {
                            if (group != undefined || group != ' ') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_SHIFT: group
                                });
                            }
                        }
                        //这里表示：修磨初磨外弧
                        if (procDiv == 'OUTER_1U') {
                            if (set != undefined) {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_SET: set
                                });
                            }
                            if (machine != undefined || machine != ' ') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_OUTER_MACHINE: machine
                                });
                            }
                            if (userName != undefined || userName != ' ') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_OUTER_OPERATOR: userName
                                });
                            }
                        }
                    }
                }
                //2024-04-18 这里通过IP获取一下  ---结束

                /*
                    日期：2024-05-17
                    原因：由于存在倒灌数据，MEND_BEFORE_WEIGHT量存在、MEND_FLAG为未修磨且 MEND_BEFORE_WEIGHT>MAT_ACT_WT，
                    这样对导致修磨磨前量出现错误
                    修改开始-----------------------------
                */
                /**
                 * 修磨标记为未修磨，强制取MAT_ACT_WT
                 */
                if (outInfo.getBlock(0).data[0]['MEND_FLAG'] == ' ' || outInfo.getBlock(0).data[0]['MEND_FLAG'] == '0') {
                    if (outInfo.getBlock(0).data[0]['MAT_ACT_WT'] == 0) {
                        erFormHelper.setControlValueEx('layoutControlGroup1', {
                            MEND_BEFORE_WEIGHT: outInfo.getBlock(0).data[0]['MAT_WT']
                        });
                    } else {
                        erFormHelper.setControlValueEx('layoutControlGroup1', {
                            MEND_BEFORE_WEIGHT: outInfo.getBlock(0).data[0]['MAT_ACT_WT']
                        });
                    }

                } else {
                    if (outInfo.getBlock(0).data[0]['MEND_BEFORE_WEIGHT'] == 0) {
                        if (outInfo.getBlock(0).data[0]['MAT_ACT_WT'] == 0) {
                            erFormHelper.setControlValueEx('layoutControlGroup1', {
                                MEND_BEFORE_WEIGHT: outInfo.getBlock(0).data[0]['MAT_WT']
                            });
                        } else {
                            erFormHelper.setControlValueEx('layoutControlGroup1', {
                                MEND_BEFORE_WEIGHT: outInfo.getBlock(0).data[0]['MAT_ACT_WT']
                            });
                        }
                        // erFormHelper.setControlValueEx('layoutControlGroup1', {
                        //   MEND_BEFORE_WEIGHT: outInfo.getBlock(0).data[0]['MAT_ACT_WT']
                        // });
                    } else {
                        erFormHelper.setControlValueEx('layoutControlGroup1', {
                            MEND_BEFORE_WEIGHT: outInfo.getBlock(0).data[0]['MEND_BEFORE_WEIGHT']
                        });
                    }
                }
                /**
                 *  修改结束---------------------------------
                 */

                erFormHelper.setControlValueEx('layoutControlGroup1', {
                    REAL_WIDTH: outInfo.getBlock(0).data[0]['MAT_WIDTH'],
                    MEND_BEFORE_QUALITY: outInfo.getBlock(0).data[0]['SURF_QUALITY'],
                    MEND_AFTER_QUALITY: outInfo.getBlock(0).data[0]['SURF_QUALITY']
                });
                MEND_SLAG_HOPPER_MACHINE = outInfo.getBlock(0).data[0]['MEND_SLAG_HOPPER_MACHINE'];
                MEND_SLAG_HOPPER_OPERATOR = outInfo.getBlock(0).data[0]['MEND_SLAG_HOPPER_OPERATOR'];
                MEND_SLAG_HOPPER_WEIGHT = outInfo.getBlock(0).data[0]['MEND_SLAG_HOPPER_WEIGHT'];

                MEND_ODD_SHIFT_NAME = outInfo.getBlock(0).data[0]['MEND_ODD_SHIFT_NAME'];
                MEND_EVEN_SHIFT_NAME = outInfo.getBlock(0).data[0]['MEND_EVEN_SHIFT_NAME'];

                MEND_SLAG_OUTER_HOPPER_MACHINE = outInfo.getBlock(0).data[0]['MEND_SLAG_OUTER_HOPPER_MACHINE'];
                MEND_SLAG_OUTER_HOPPER_OPERATOR = outInfo.getBlock(0).data[0]['MEND_SLAG_OUTER_HOPPER_OPERATOR'];
                MEND_SLAG_OUTER_HOPPER_WEIGHT = outInfo.getBlock(0).data[0]['MEND_SLAG_OUTER_HOPPER_WEIGHT'];

                WHEEL_TYPE_IN = outInfo.getBlock(0).data[0]['WHEEL_TYPE_IN'];
                GRINDSTONE_SUPPLIER_IN = outInfo.getBlock(0).data[0]['GRINDSTONE_SUPPLIER_IN'];
                GRINDING_WHEEL_GRAININESS = outInfo.getBlock(0).data[0]['GRINDING_WHEEL_GRAININESS'];
                GRINDING_WHEEL_PEOPLE = outInfo.getBlock(0).data[0]['GRINDING_WHEEL_PEOPLE'];
                GRINDING_WHEEL_MACHINE = outInfo.getBlock(0).data[0]['GRINDING_WHEEL_MACHINE'];

                WHEEL_TYPE_OUT = outInfo.getBlock(0).data[0]['WHEEL_TYPE_OUT'];
                GRINDSTONE_SUPPLIER_OUT = outInfo.getBlock(0).data[0]['GRINDSTONE_SUPPLIER_OUT'];
                GRINDING_WHEEL_OUTER_GRAININESS = outInfo.getBlock(0).data[0]['GRINDING_WHEEL_OUTER_GRAININESS'];
                GRINDING_WHEEL_OUTER_PEOPLE = outInfo.getBlock(0).data[0]['GRINDING_WHEEL_OUTER_PEOPLE'];
                GRINDING_WHEEL_OUTER_MACHINE = outInfo.getBlock(0).data[0]['GRINDING_WHEEL_OUTER_MACHINE'];

                erFormHelper.setControlValueEx('layoutControlGroup3', outInfo.getBlock(0).data[0]);
                erFormHelper.setControlValueEx('layoutControlGroup2', outInfo.getBlock(0).data[0]);
                erFormHelper.setControlValueEx('layoutControlGroup4', outInfo.getBlock(0).data[0]);

                //如果是修磨内弧------------------ 再磨内弧
                if (procDiv == 'INNER_1I' || procDiv == 'INNER_2I') {
          //这里设置---金属去除速度和修磨工艺要求-------------开始
          const value = erFormHelper.getControlValue('layoutControlGroup1', 'ST_NO');
          const mend_set = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_SET');
          let metalRateQueryCondition = {
                        KEY: 'METALRATE',
                        VALUE: value,
                        MEND_SET: mend_set
                    };
          const eiInfoMentalRate = new EI.EIInfo();
          const eiBlockMentalRate = eiInfoMentalRate.addBlock(new EI.EiBlock());
                    eiBlockMentalRate.pushData(metalRateQueryCondition, true);
          const outInfoMentalRate = await erFormHelper.callService('mmsmcode_query', eiInfoMentalRate, false, true);
                    console.log('22222')
          if (outInfoMentalRate.sys.status < 0) {
                    } else {
            const len = outInfoMentalRate.getBlock(0).data.length;
                        if (len == 1) {
              const key = outInfoMentalRate.getBlock(0).data[0]['CODE_CLASS'];
                            if (key == 'METALRATE') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_METAL_RATE: outInfoMentalRate.getBlock(0).data[0]['CODE_DESC_1_CONTENT']
                                });
                            } else if (key == 'PROCESS_S') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_GY: outInfoMentalRate.getBlock(0).data[0]['CODE_DESC_1_CONTENT']
                                });
                            }
            } else if (len == 2) {
              const key1 = outInfoMentalRate.getBlock(0).data[0]['CODE_CLASS'];
              const key2 = outInfoMentalRate.getBlock(0).data[1]['CODE_CLASS'];
                            if (key1 == 'METALRATE') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_METAL_RATE: outInfoMentalRate.getBlock(0).data[0]['CODE_DESC_1_CONTENT']
                                });
                            } else if (key1 == 'PROCESS_S') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_GY: outInfoMentalRate.getBlock(0).data[0]['CODE_DESC_1_CONTENT']
                                });
                            }
                            if (key2 == 'METALRATE') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_METAL_RATE: outInfoMentalRate.getBlock(0).data[1]['CODE_DESC_1_CONTENT']
                                });
                            } else if (key2 == 'PROCESS_S') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_GY: outInfoMentalRate.getBlock(0).data[1]['CODE_DESC_1_CONTENT']
                                });
                            }
            }
          }
          //这里设置---金属去除速度和修磨工艺要求-------------结束


          //这里设置---砂轮使用要求和修磨放置时间要求-------------开始
          let metalRateQueryCondition_s = {
                        KEY: 'WHEEL',
                        VALUE: value
                    };
          const eiInfoMentalRate_s = new EI.EIInfo();
          const eiBlockMentalRate_s = eiInfoMentalRate_s.addBlock(new EI.EiBlock());
                    eiBlockMentalRate_s.pushData(metalRateQueryCondition_s, true);
          const outInfoMentalRate_s = await erFormHelper.callService('mmsmcode_query', eiInfoMentalRate_s, false, true);
                    console.log('33333')

          console.log('WHEEL', outInfoMentalRate_s)
          console.log('WHEEL.len', outInfoMentalRate_s.getBlock(0).data.length)

          if (outInfoMentalRate_s.sys.status < 0) {
                    } else {

                        if (outInfoMentalRate_s.getBlock(0).data.length > 0) {
                            erFormHelper.setControlValueEx('layoutControlGroup1', {
                                GRINDING_WHEEL_USE: outInfoMentalRate_s.getBlock(0).data[0]['CODE_DESC_3_CONTENT']
                            });
                            erFormHelper.setControlValueEx('layoutControlGroup1', {
                                MEND_PLACE_TIME: outInfoMentalRate_s.getBlock(0).data[0]['CODE_DESC_4_CONTENT']
                            });
                        }

                    }
          //这里设置---砂轮使用要求和修磨放置时间要求-------------结束

          let endTime: any;
          let startTime: any;
                    if (PROD_SEQ_NO_THIS != undefined) {
                        startTime = outInfo.getBlock(0).data[0]['GRINDING_START_TIME'];
                        endTime = outInfo.getBlock(0).data[0]['GRINDING_END_TIME'];
                    } else {
                        startTime = new Date();
                        endTime = ' ';
                    }
                    erFormHelper.setControlValueEx('layoutControlGroup1', {
                        GRINDING_START_TIME: startTime,
                        GRINDING_END_TIME: endTime
                    });

          //设置修磨实绩2
          const f1 = outInfo.getBlock(0).data[0]['GRINDING_WHEEL_CHANGE'] == 'Y' ? 'Y' : 'N';
          const f2 = outInfo.getBlock(0).data[0]['MEND_SLAG_HOPPER'] == 'Y' ? 'Y' : 'N';
          const f3 = outInfo.getBlock(0).data[0]['MEND_SHIFT_MATERIAL'] == 'Y' ? 'Y' : 'N';
                    erFormHelper.setControlValueEx('layoutControlGroup3', {
                        GRINDING_WHEEL_CHANGE: f1,
                        MEND_SLAG_HOPPER: f2,
                        MEND_SHIFT_MATERIAL: f3
                    });
                    //内弧是否更换砂轮  --layoutControlGroup3
                    if (f1 == 'Y') {
                        setControlVisibleGrinding(1);
                    } else {
                        setControlVisibleGrinding(0);
                    }
                    //是否倒渣斗  -- layoutControlGroup3
                    if (f2 == 'Y') {
                        setControlVisibleHopper(1);
                    } else {
                        setControlVisibleHopper(0);
                    }
                    //是否交接班料 ---layoutControlGroup1
                    if (f3 == 'Y') {
                        erFormHelper.setControlVisible('layoutControlGroup1', true, 'MEND_ODD_SHIFT_NAME', 'empty');
                        erFormHelper.setControlVisible('layoutControlGroup1', true, 'MEND_EVEN_SHIFT_NAME', 'empty');
                        erFormHelper.setControlValueEx('layoutControlGroup1', {
                            MEND_ODD_SHIFT_NAME: outInfo.getBlock(0).data[0]['MEND_ODD_SHIFT_NAME'],
                            MEND_EVEN_SHIFT_NAME: outInfo.getBlock(0).data[0]['MEND_EVEN_SHIFT_NAME']
                        });
                    } else {
                        erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_ODD_SHIFT_NAME', 'empty');
                        erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_EVEN_SHIFT_NAME', 'empty');
                    }
                    //初磨设置:再磨重量不显示
                    if (procDiv == 'INNER_1I') {
                        erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_SECOND_WEIGHT', 'empty');

                        setControlEditableInner(1);

            const isUpload = outInfo.getBlock(0).data[0]['ISUPLOAD']?.toString() || 'a';
                        if (isUpload != '1') {
              let itemCodes = ['MEND_AFTER_WEIGHT', 'MEND_RATE'];
                            erFormHelper.setControlReadOnly('layoutControlGroup1', false, ...itemCodes);
                            erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'white');
                        } else {
              let itemCodes = ['MEND_AFTER_WEIGHT'];
                            erFormHelper.setControlReadOnly('layoutControlGroup1', true, ...itemCodes);
                            erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'LightGray');
                        }
             /**
             *  日期：20240604
             *  原因：对于填了磨后量，就不能改磨后
             *  
             */
            let mendAfterWeight = outInfo.getBlock(0).data[0]['MEND_AFTER_WEIGHT']
            if (mendAfterWeight != undefined) {
                            if (mendAfterWeight == '0') {
                let itemCodes = ['MEND_AFTER_WEIGHT'];
                                erFormHelper.setControlReadOnly('layoutControlGroup1', false, ...itemCodes);
                                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'white');
                            } else {   
                let itemCodes = ['MEND_AFTER_WEIGHT'];
                                erFormHelper.setControlReadOnly('layoutControlGroup1', true, ...itemCodes);
                                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'LightGray');
                            }
                        }

                    }
                    //如果是再磨内弧,需要单独设置一下：磨后重量

                    if (procDiv == 'INNER_2I') {
                        erFormHelper.setControlValueEx('layoutControlGroup1', {
                            MEND_AFTER_WEIGHT: outInfo.getBlock(0).data[0]['MAT_ACT_WT']
                        });
                        erFormHelper.setControlReadOnly('layoutControlGroup1', true, 'MEND_AFTER_WEIGHT');
                        erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', 'MEND_AFTER_WEIGHT', 'LightGray');

                        setControlSecondEditableInner(0);

            const isUpload = outInfo.getBlock(0).data[0]['ISUPLOAD']?.toString() || 'a';
                        if (isUpload == '2') {
              let itemCodes = ['MEND_SECOND_WEIGHT'];
                            erFormHelper.setControlReadOnly('layoutControlGroup1', true, ...itemCodes);
                            erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'LightGray');
                        } else {
              let itemCodes = ['MEND_SECOND_WEIGHT', 'MEND_RATE'];
                            erFormHelper.setControlReadOnly('layoutControlGroup1', false, ...itemCodes);
                            erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'white');
                        }
                    }
        }

                //如果是修磨外弧
                if (procDiv == 'OUTER_1U' || procDiv == 'OUTER_2U') {
          const value = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_CALCULATE_RATE');
                    //物料描述
                    erFormHelper.setControlVisible('layoutControlGroup1', false, 'MATERIAL_DESC', 'empty');
                    erFormHelper.setControlValueEx('layoutControlGroup1', {
                        GRINDING_OUTER_START_TIME:
                        outInfo.getBlock(0).data[0]['GRINDING_OUTER_START_TIME'] == ' '
                        ? new Date()
                        : outInfo.getBlock(0).data[0]['GRINDING_OUTER_START_TIME'],
                        MEND_CALCULATE_RATE: value
                    });
          //设置修磨实绩2
          const f1 = outInfo.getBlock(0).data[0]['GRINDING_WHEEL_OUTER_CHANGE'] == 'Y' ? 'Y' : 'N';
          const f2 = outInfo.getBlock(0).data[0]['MEND_SLAG_OUTER_HOPPER'] == 'Y' ? 'Y' : 'N';
          const f3 = outInfo.getBlock(0).data[0]['MEND_SHIFT_MATERIAL'] == 'Y' ? 'Y' : 'N';
                    erFormHelper.setControlValueEx('layoutControlGroup3', {
                        GRINDING_WHEEL_OUTER_CHANGE: f1,
                        MEND_SLAG_OUTER_HOPPER: f2,
                        MEND_SHIFT_MATERIAL: f3
                    });
                    //外弧是否更换砂轮  --layoutControlGroup3
                    if (f1 == 'Y') {
                        setControlVisibleOuterGrinding(1);
                    } else {
                        setControlVisibleOuterGrinding(0);
                    }
                    //外弧是否倒渣斗  -- layoutControlGroup3
                    if (f2 == 'Y') {
                        setControlVisibleOuterHopper(1);
                    } else {
                        setControlVisibleOuterHopper(0);
                    }
                    //是否交接班料 ---layoutControlGroup1
                    if (f3 == 'Y') {
                        console.log('Y');
                        erFormHelper.setControlVisible('layoutControlGroup1', true, 'MEND_ODD_SHIFT_NAME', 'empty');
                        erFormHelper.setControlVisible('layoutControlGroup1', true, 'MEND_EVEN_SHIFT_NAME', 'empty');
                        erFormHelper.setControlValueEx('layoutControlGroup1', {
                            MEND_ODD_SHIFT_NAME: outInfo.getBlock(0).data[0]['MEND_ODD_SHIFT_NAME'],
                            MEND_EVEN_SHIFT_NAME: outInfo.getBlock(0).data[0]['MEND_EVEN_SHIFT_NAME']
                        });
                    } else {
                        erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_ODD_SHIFT_NAME', 'empty');
                        erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_EVEN_SHIFT_NAME', 'empty');
                    }
                    //初磨设置:再磨重量不显示
                    if (procDiv == 'OUTER_1U') {
                        erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_SECOND_WEIGHT', 'empty');
                        //设置 修磨实绩3 ----layoutControlGroup2
                        setControlOuterEditableInner(0);

            const isUpload = outInfo.getBlock(0).data[0]['ISUPLOAD']?.toString() || 'a';
                        if (isUpload == '1') {
              let itemCodes = ['MEND_AFTER_WEIGHT'];
                            erFormHelper.setControlReadOnly('layoutControlGroup1', true, ...itemCodes);
                            erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'LightGray');
                        } else {
              let itemCodes = ['MEND_AFTER_WEIGHT', 'MEND_RATE'];
                            erFormHelper.setControlReadOnly('layoutControlGroup1', false, ...itemCodes);
                            erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'white');
                        }
            /**
             *  日期：20240604
             *  原因：对于填了磨后量，就不能改磨后
             *  
             */
            let mendAfterWeight = outInfo.getBlock(0).data[0]['MEND_AFTER_WEIGHT']
            if (mendAfterWeight != undefined) {
                            if (mendAfterWeight == '0') {
                let itemCodes = ['MEND_AFTER_WEIGHT'];
                                erFormHelper.setControlReadOnly('layoutControlGroup1', false, ...itemCodes);
                                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'white');
                            } else {   
                let itemCodes = ['MEND_AFTER_WEIGHT'];
                                erFormHelper.setControlReadOnly('layoutControlGroup1', true, ...itemCodes);
                                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'LightGray');
                            }
                        }
                    }
                    if (procDiv == 'OUTER_2U') {
                        erFormHelper.setControlReadOnly('layoutControlGroup1', true, 'MEND_AFTER_WEIGHT');
                        erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', 'MEND_AFTER_WEIGHT', 'LightGray');
                        setControlSecondOuterEditableInner(0);
            const isUpload = outInfo.getBlock(0).data[0]['ISUPLOAD']?.toString() || 'a';
                        if (isUpload == 'a' || isUpload == ' ') {
              let itemCodes = ['MEND_SECOND_WEIGHT', 'MEND_RATE'];
                            erFormHelper.setControlReadOnly('layoutControlGroup1', false, ...itemCodes);
                            erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'white');
                        } else if (isUpload == '2') {
              let itemCodes = ['MEND_SECOND_WEIGHT', 'MEND_RATE'];
                            erFormHelper.setControlReadOnly('layoutControlGroup1', true, ...itemCodes);
                            erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'LightGray');
                        }
                    }
        }
                /**
                 *  日期：2024-05-27
                 */
                if (procDiv == 'ADMIN_EDIT') {



          let itemCodes = ['MEND_BEFORE_WEIGHT'];
                    erFormHelper.setControlReadOnly('layoutControlGroup1', false, ...itemCodes);
                    erFormHelper.setLayoutItemContentBackColor('layoutControlGroup1', itemCodes, 'white');
                    erFormHelper.setControlVisible('layoutControlGroup1', true, 'MEND_BEFORE_WEIGHT');

            //这里设置---金属去除速度和修磨工艺要求-------------开始
            const value = erFormHelper.getControlValue('layoutControlGroup1', 'ST_NO');
            const mend_set = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_SET');
            let metalRateQueryCondition = {
                        KEY: 'METALRATE',
                        VALUE: value,
                        MEND_SET: mend_set
                    };
            const eiInfoMentalRate = new EI.EIInfo();
            const eiBlockMentalRate = eiInfoMentalRate.addBlock(new EI.EiBlock());
                    eiBlockMentalRate.pushData(metalRateQueryCondition, true);
            const outInfoMentalRate = await erFormHelper.callService('mmsmcode_query', eiInfoMentalRate, false, true);
                    console.log('44444')
            console.log('outInfoMentalRate111', outInfoMentalRate)

            if (outInfoMentalRate.sys.status < 0) {
                    } else {
                        console.log('outInfoMentalRate222',outInfoMentalRate)
              const len = outInfoMentalRate.getBlock(0).data.length;
                        if (len == 1) {
                const key = outInfoMentalRate.getBlock(0).data[0]['CODE_CLASS'];
                            if (key == 'METALRATE') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_METAL_RATE: outInfoMentalRate.getBlock(0).data[0]['CODE_DESC_1_CONTENT']
                                });
                            } else if (key == 'PROCESS_S') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_GY: outInfoMentalRate.getBlock(0).data[0]['CODE_DESC_1_CONTENT']
                                });
                            }
              } else if (len == 2) {
                const key1 = outInfoMentalRate.getBlock(0).data[0]['CODE_CLASS'];
                const key2 = outInfoMentalRate.getBlock(0).data[1]['CODE_CLASS'];
                            if (key1 == 'METALRATE') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_METAL_RATE: outInfoMentalRate.getBlock(0).data[0]['CODE_DESC_1_CONTENT']
                                });
                            } else if (key1 == 'PROCESS_S') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_GY: outInfoMentalRate.getBlock(0).data[0]['CODE_DESC_1_CONTENT']
                                });
                            }
                            if (key2 == 'METALRATE') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_METAL_RATE: outInfoMentalRate.getBlock(0).data[1]['CODE_DESC_1_CONTENT']
                                });
                            } else if (key2 == 'PROCESS_S') {
                                erFormHelper.setControlValueEx('layoutControlGroup1', {
                                    MEND_GY: outInfoMentalRate.getBlock(0).data[1]['CODE_DESC_1_CONTENT']
                                });
                            }
              }
                    }
            //这里设置---金属去除速度和修磨工艺要求-------------结束

            //这里设置---砂轮使用要求和修磨放置时间要求-------------开始
          let metalRateQueryCondition_s = {
                        KEY: 'WHEEL',
                        VALUE: value
                    };
          const eiInfoMentalRate_s = new EI.EIInfo();
          const eiBlockMentalRate_s = eiInfoMentalRate_s.addBlock(new EI.EiBlock());
                    eiBlockMentalRate_s.pushData(metalRateQueryCondition_s, true);
          const outInfoMentalRate_s = await erFormHelper.callService('mmsmcode_query', eiInfoMentalRate_s, false, true);
                    console.log('55555')

          console.log('WHEEL', outInfoMentalRate_s)

          if (outInfoMentalRate_s.sys.status < 0) {
                    } else {

                        if (outInfoMentalRate_s.getBlock(0).data.length > 0) {
                            erFormHelper.setControlValueEx('layoutControlGroup1', {
                                GRINDING_WHEEL_USE: outInfoMentalRate_s.getBlock(0).data[0]['CODE_DESC_3_CONTENT']
                            });
                            erFormHelper.setControlValueEx('layoutControlGroup1', {
                                MEND_PLACE_TIME: outInfoMentalRate_s.getBlock(0).data[0]['CODE_DESC_4_CONTENT']
                            });
                        }
                    }
          //这里设置---砂轮使用要求和修磨放置时间要求-------------结束

            
            let endTime: any;
            let startTime: any;
                    if (PROD_SEQ_NO_THIS != undefined) {
                        startTime = outInfo.getBlock(0).data[0]['GRINDING_START_TIME'];
                        endTime = outInfo.getBlock(0).data[0]['GRINDING_END_TIME'];
                    } else {
                        startTime = new Date();
                        endTime = ' ';
                    }
                    erFormHelper.setControlValueEx('layoutControlGroup1', {
                        GRINDING_START_TIME: startTime,
                        GRINDING_END_TIME: endTime
                    });

            //设置修磨实绩2
            const f1 = outInfo.getBlock(0).data[0]['GRINDING_WHEEL_CHANGE'] == 'Y' ? 'Y' : 'N';
            const f2 = outInfo.getBlock(0).data[0]['MEND_SLAG_HOPPER'] == 'Y' ? 'Y' : 'N';
            const f3 = outInfo.getBlock(0).data[0]['MEND_SHIFT_MATERIAL'] == 'Y' ? 'Y' : 'N';
                    erFormHelper.setControlValueEx('layoutControlGroup3', {
                        GRINDING_WHEEL_CHANGE: f1,
                        MEND_SLAG_HOPPER: f2,
                        MEND_SHIFT_MATERIAL: f3
                    });
                    //内弧是否更换砂轮  --layoutControlGroup3
                    if (f1 == 'Y') {
                        setControlVisibleGrinding(1);
                    } else {
                        setControlVisibleGrinding(0);
                    }
                    //是否倒渣斗  -- layoutControlGroup3
                    if (f2 == 'Y') {
                        setControlVisibleHopper(1);
                    } else {
                        setControlVisibleHopper(0);
                    }
                    //是否交接班料 ---layoutControlGroup1
                    if (f3 == 'Y') {
                        erFormHelper.setControlVisible('layoutControlGroup1', true, 'MEND_ODD_SHIFT_NAME', 'empty');
                        erFormHelper.setControlVisible('layoutControlGroup1', true, 'MEND_EVEN_SHIFT_NAME', 'empty');
                        erFormHelper.setControlValueEx('layoutControlGroup1', {
                            MEND_ODD_SHIFT_NAME: outInfo.getBlock(0).data[0]['MEND_ODD_SHIFT_NAME'],
                            MEND_EVEN_SHIFT_NAME: outInfo.getBlock(0).data[0]['MEND_EVEN_SHIFT_NAME']
                        });
                    } else {
                        erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_ODD_SHIFT_NAME', 'empty');
                        erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_EVEN_SHIFT_NAME', 'empty');
                    }

                }

                if (procDiv == 'INNER_5I') {
          let tmmsm34_1QueryCondition = {
                        MAT_NO: MAT_NO_THIS,
                        FACTORY_DIV: ' ',
                        STATION_ID: '',
                        STATION_NO: '',
                        QUERY_DIV: 'TMMSM34_1'
                    };
          const eiInfoTmmsm34_1 = new EI.EIInfo();
          const eiBlockTmmsm34_1 = eiInfoTmmsm34_1.addBlock(new EI.EiBlock());
                    eiBlockTmmsm34_1.pushData(tmmsm34_1QueryCondition, true);
          const outInfoTmmsm34_1 = await erFormHelper.callService('mmsm34_1_inq', eiInfoTmmsm34_1, false, true);
                    erFormHelper.setControlValueEx('layoutControlGroup1', {
                        GRINDING_START_TIME: new Date(),
                        MEND_AFTER_WEIGHT: outInfoTmmsm34_1.getBlock(0).data[0]['MEND_AFTER_WEIGHT'],
                        MEND_CALCULATE_RATE: outInfoTmmsm34_1.getBlock(0).data[0]['MEND_CALCULATE_RATE']
                    });
                }
                //如果是取消修磨，并且并且是修改重量：
                erFormHelper.setControlValueEx('layoutControlGroup5', outInfo.getBlock(0).data[0]);
                if (initializeFlag.value == 2) {
                    if (outInfo.getBlock(0).data[0]['MEND_FLAG'] == '1' || outInfo.getBlock(0).data[0]['MEND_FLAG'] == '2') {
            const before = erFormHelper.getControlValue('layoutControlGroup5', 'MEND_BEFORE_WEIGHT');
            const afterWeight = erFormHelper.getControlValue('layoutControlGroup5', 'MEND_AFTER_WEIGHT');
            let rate = (((before - afterWeight) / before) * 100).toFixed(2) + '%';
                        if (afterWeight == 0) {
                            rate = '0';
                        }
                        erFormHelper.setControlValueEx('layoutControlGroup5', {
                            GRINDING_OUTER_START_TIME: outInfo.getBlock(0).data[0]['GRINDING_OUTER_START_TIME'],
                            GRINDING_OUTER_END_TIME: outInfo.getBlock(0).data[0]['GRINDING_OUTER_END_TIME'],
                            MEND_CALCULATE_RATE: rate,
                            MEND_WEIGHT: 20
                        });
          }
                    if (outInfo.getBlock(0).data[0]['MEND_FLAG'] == '3' || outInfo.getBlock(0).data[0]['MEND_FLAG'] == '4') {
            const before = erFormHelper.getControlValue('layoutControlGroup5', 'MEND_AFTER_WEIGHT');
            const afterWeight = erFormHelper.getControlValue('layoutControlGroup5', 'MEND_SECOND_WEIGHT');
            let rate = (((before - afterWeight) / before) * 100).toFixed(2) + '%';
                        if (afterWeight == 0) {
                            rate = '0';
                        }
                        erFormHelper.setControlReadOnly('layoutControlGroup5', true, 'MEND_AFTER_WEIGHT');
                        erFormHelper.setLayoutItemContentBackColor('layoutControlGroup5', 'MEND_AFTER_WEIGHT', 'LightGray');
                        erFormHelper.setControlValueEx('layoutControlGroup5', {
                            GRINDING_OUTER_START_TIME: outInfo.getBlock(0).data[0]['GRINDING_OUTER_START_TIME'],
                            GRINDING_OUTER_END_TIME: outInfo.getBlock(0).data[0]['GRINDING_OUTER_END_TIME'],
                            MEND_CALCULATE_RATE: rate
                        });
          }
                }
                if (MEND_CANCEL_FLAG == 1) {
                    erFormHelper.setControlValueEx('layoutControlGroup5', {
                        MEND_BEFORE_WEIGHT: newMatWT
                    });
                }
      }
    };

    // 点击关闭按钮，绑定事件closeEfDialog
    // 向父画面传递数据-触发emit方法向父传递数据，并在emits中注册事件名
    const closeEfDialog = () => {
      const data = {
                // name: formName,
                close: true
            };
            emit('getChildInfo', data);
    };

    //保存修磨实绩
    const F2_DO = async(e: any) => {
      if (!(await erFormHelper.checkRequiredInput('layoutControlGroup1'))) {
    erFormHelper.messageWarning('请检查输入');
    return false;
      }
      /**
       *  日期：20240604
       *  原因：对于磨后量大于磨前量的，强制限制
       */

      const before = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_BEFORE_WEIGHT');
      const afterWeight = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_AFTER_WEIGHT');
if (afterWeight > before){
    erFormHelper.messageError('修磨电子记录，填写的磨后重量比磨前重量大，请核实填入的磨后重量');
    return false;
      }

      /**
       *  日期：20240604
       *  原因：校验一下34表磨前量，和主档表的系统重量
       */
      const matNo = erFormHelper.getControlValue('layoutControlGroup1', 'MAT_NO');
      let matTmmsm01QueryCondition = {
    MAT_NO: matNo
};
      const ei01Info = new EI.EIInfo();
      const ei01Block = ei01Info.addBlock(new EI.EiBlock());
ei01Block.pushData(matTmmsm01QueryCondition, true);
ei01Block.addColumn('QUERY_DIV', 'TMMSM01'); //传表名
      const mat01Info = await erFormHelper.callService('mmsm34f2_inq', ei01Info, false, false, true);

if (mat01Info.sys.status >= 0){
    if (mat01Info.getBlock(0).data[0] == undefined){
            const msg = '此材料已经出库';
        erFormHelper.messageError(msg);
        return false;
          } else{
            const matActWt = mat01Info.getBlock(0).data[0]["MAT_ACT_WT"];
            const mendFlag = mat01Info.getBlock(0).data[0]["MEND_FLAG"];
        console.log('mendFlag', mendFlag)
            if (mendFlag != "1" && mendFlag != "2") {
            if (matActWt != before){
                const info = "材料" + matNo + ",系统重量为：" + matActWt + ",电子记录磨前重量为：" + before + "，将电子记录的磨前重量改为系统重量";
                erFormHelper.setControlValueEx('layoutControlGroup1', {
                    MEND_BEFORE_WEIGHT: matActWt
                });
                erFormHelper.messageError(info);
                return false;
              }
        }
            
          }
      }



      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock());
      const layoutControlGroup1 = erFormHelper.getAllControlValue('layoutControlGroup1');

      const mendInnerMode = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_INNER_MODE');
      const mendInnerMachine = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_INNER_MACHINE');
      const mendInnerOperator = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_INNER_OPERATOR');
      const mendBeforeSize = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_BEFORE_SIZE');
      const mendAfterSize = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_AFTER_SIZE');

      const mendOuterMode = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_OUTER_MODE');
      const mendOuterMachine = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_OUTER_MACHINE');
      const mendOuterOperator = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_OUTER_OPERATOR');

      const layoutControlGroup3 = erFormHelper.getAllControlValue('layoutControlGroup3');

      let layoutControlGroup = erFormHelper.getAllControlValue('layoutControlGroup2');
if (procDiv == 'INNER_2I' || procDiv == 'OUTER_2U') {
    layoutControlGroup = erFormHelper.getAllControlValue('layoutControlGroup4');
      }
      const layoutControlGroup5 = erFormHelper.getAllControlValue('layoutControlGroup5');
      
      let obj: any = {
        ...layoutControlGroup1,
        ...layoutControlGroup3,
        ...layoutControlGroup,
    FACTORY_DIV: pagePara.factory_div,
    STATION_ID: pagePara.station_id,
    PROC_DIV: PROC_DIV,
    PROD_SEQ_NO: PROD_SEQ_NO_THIS,
    MEND_INNER_MODE: mendInnerMode,
    MEND_INNER_MACHINE: mendInnerMachine,
    MEND_INNER_OPERATOR: mendInnerOperator,
    MEND_OUTER_MODE: mendOuterMode,
    MEND_OUTER_MACHINE: mendOuterMachine,
    MEND_OUTER_OPERATOR: mendOuterOperator,
    MEND_BEFORE_SIZE: mendBeforeSize,
    MEND_AFTER_SIZE: mendAfterSize
      };

if (procDiv == 'Edit') {
    obj = {
          ...layoutControlGroup5,
        FACTORY_DIV: pagePara.factory_div,
        STATION_ID: pagePara.station_id,
        PROC_DIV: PROC_DIV,
        PROD_SEQ_NO: PROD_SEQ_NO_THIS
        };
      }

      const eiBlock_PARA = new EI.EiBlock();
eiBlock_PARA.pushData(
    {
        PROC_DIV: procDiv,
        FACTORY_DIV: ' ',
        STATION_ID: 'C'
    },
    true
    );
eiInfo.addBlock(eiBlock_PARA, 'PARA');
eiBlock.pushData(obj, true);
      const outInfo = await erFormHelper.callService(pagePara.service_f3, eiInfo, false, false, true);
//判断调后台是否失败
if (outInfo.sys.status < 0) {
    erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
} else {
    erFormHelper.messageSuccess('保存成功');
    closeEfDialog();
      }
    };

    const F3_DO = async(e: any) => {
    erFormHelper.setControlValueEx('layoutControlGroup1', {
        GRINDING_END_TIME: new Date()
    });
};

    //2024-03-27
    //layout值发生改变事件
    const layout_valueChanged1 = async(e: any) => {

    //弹窗上修改修磨机组，修磨工艺要求随之更改，机组分类为 热1热2（MEND_SET=H1）和其他
    if (e.itemCode === 'MEND_SET') {
        const mend_set = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_SET');
        const st_no = erFormHelper.getControlValue('layoutControlGroup1', 'ST_NO');
        console.log('st_no', st_no)

        let sqlstr = `SELECT CODE_DESC_1_CONTENT, CODE_DESC_2_CONTENT FROM TWMSMZD02 WHERE 1 = 1 AND CODE_CLASS = 'PROCESS_S' AND CODE = '`+ erFormHelper.getControlValue('layoutControlGroup1', 'ST_NO') +`'`;
        const out = await erFormHelper.querySql('', sqlstr);
        console.log('out', out)

        if (mend_set == 'H1') {
            erFormHelper.setControlValueEx('layoutControlGroup1', { MEND_GY: out.getBlock(0).data[0].CODE_DESC_1_CONTENT });
        } else {
            erFormHelper.setControlValueEx('layoutControlGroup1', { MEND_GY: out.getBlock(0).data[0].CODE_DESC_2_CONTENT });
        }
      }

    //修磨实绩  ---  内弧修磨机号 onBlur事件
    if (e.itemCode === 'MEND_INNER_MACHINE') {
        if (procDiv === 'INNER_1I' || procDiv === 'INNER_2I') {
          const mendInnerMachine = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_INNER_MACHINE');
          const isWheelChange = erFormHelper.getControlValue('layoutControlGroup3', 'GRINDING_WHEEL_CHANGE');
            if (isWheelChange == 'Y') {
                erFormHelper.setControlValueEx('layoutControlGroup3', { GRINDING_WHEEL_MACHINE: mendInnerMachine });
          }
          const isSlagHopper = erFormHelper.getControlValue('layoutControlGroup3', 'MEND_SLAG_HOPPER');
            if (isSlagHopper == 'Y') {
                erFormHelper.setControlValueEx('layoutControlGroup3', {
                    MEND_SLAG_HOPPER_MACHINE: mendInnerMachine
                });
            }
        }
    }
    //修磨实绩  --- 外弧修磨机号 onBlur事件
    if (e.itemCode === 'MEND_OUTER_MACHINE') {
        if (procDiv === 'OUTER_1U' || procDiv === 'OUTER_2U') {
          const mendOuterMachine = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_OUTER_MACHINE');
          const isOuterWheelChange = erFormHelper.getControlValue('layoutControlGroup3', 'GRINDING_WHEEL_OUTER_CHANGE');
            if (isOuterWheelChange == 'Y') {
                erFormHelper.setControlValueEx('layoutControlGroup3', {
                    GRINDING_WHEEL_OUTER_MACHINE: mendOuterMachine
                });
          }
          const isOuterSlagHopper = erFormHelper.getControlValue('layoutControlGroup3', 'MEND_SLAG_OUTER_HOPPER');
            if (isOuterSlagHopper == 'Y') {
                erFormHelper.setControlValueEx('layoutControlGroup3', {
                    MEND_SLAG_OUTER_HOPPER_MACHINE: mendOuterMachine
                });
            }
        }
    }
    if (e.itemCode === 'MEND_SHIFT_MATERIAL') {
        if (procDiv === 'INNER_1I' || procDiv === 'OUTER_1U') {
          const isShiftMaterial = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_SHIFT_MATERIAL');
            if (isShiftMaterial == 'Y') {
                erFormHelper.setControlVisible('layoutControlGroup1', true, 'MEND_ODD_SHIFT_NAME', 'empty');
                erFormHelper.setControlVisible('layoutControlGroup1', true, 'MEND_EVEN_SHIFT_NAME', 'empty');
                erFormHelper.setControlValueEx('layoutControlGroup1', {
                    MEND_ODD_SHIFT_NAME: MEND_ODD_SHIFT_NAME,
                    MEND_EVEN_SHIFT_NAME: MEND_EVEN_SHIFT_NAME
                });
            } else {
                erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_ODD_SHIFT_NAME', 'empty');
                erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_EVEN_SHIFT_NAME', 'empty');
            }
        }
        if (procDiv === 'INNER_2I' || procDiv === 'OUTER_2U') {
          const isShiftMaterial = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_SHIFT_MATERIAL');
            if (isShiftMaterial == 'Y') {
                erFormHelper.setControlVisible('layoutControlGroup1', true, 'MEND_ODD_SHIFT_NAME', 'empty');
                erFormHelper.setControlVisible('layoutControlGroup1', true, 'MEND_EVEN_SHIFT_NAME', 'empty');
                erFormHelper.setControlValueEx('layoutControlGroup1', {
                    MEND_ODD_SHIFT_NAME: MEND_ODD_SHIFT_NAME,
                    MEND_EVEN_SHIFT_NAME: MEND_EVEN_SHIFT_NAME
                });
            } else {
                erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_ODD_SHIFT_NAME', 'empty');
                erFormHelper.setControlVisible('layoutControlGroup1', false, 'MEND_EVEN_SHIFT_NAME', 'empty');
            }
        }
    }
    //录入磨后重量，自动算出修磨率
    //初磨---修磨率为：（磨前重量-磨后重量）/磨前重量
    if (procDiv === 'INNER_1I' || procDiv === 'OUTER_1U' || procDiv === 'ADMIN_EDIT') {
        if (e.itemCode === 'MEND_RATE') {
          const before = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_BEFORE_WEIGHT');
          const afterWeight = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_AFTER_WEIGHT');
            if (afterWeight > 0) {
            //这里计算一下修磨折算重量
            //设定修磨率
            const mendRate = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_RATE');
            //金属去除速度
            const mendMetalRate = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_METAL_RATE');
            let wt = 0;
                if (mendRate > 0 && mendMetalRate > 0) {
                    wt =
                    ((afterWeight * (mendRate / 100) * 1000 * (18.3 / afterWeight)) / 238) *
                    (10.25 / mendMetalRate) *
                    afterWeight;
                }
                erFormHelper.setControlValueEx('layoutControlGroup1', {
                    MEND_WEIGHT: wt.toFixed(2)
                });
          }
        }
        if (e.itemCode === 'MEND_AFTER_WEIGHT') {
          const before = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_BEFORE_WEIGHT');
          const afterWeight = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_AFTER_WEIGHT');

            if (afterWeight > before) {
                erFormHelper.messageError('修磨电子记录，填写的磨后重量比磨前重量大，请核实填入的磨后重量');
                return;
            }       
          


          let rate = (((before - afterWeight) / before) * 100).toFixed(2) + '%';
            if (afterWeight == 0) {
                rate = '0';
          }

          //这里计算一下修磨折算重量
          //设定修磨率
          const mendRate = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_RATE');
          //金属去除速度
          const mendMetalRate = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_METAL_RATE');
          let wt = 0;
            if (mendRate > 0 && mendMetalRate > 0) {
                wt =
                ((afterWeight * (mendRate / 100) * 1000 * (18.3 / afterWeight)) / 238) *
                (10.25 / mendMetalRate) *
                afterWeight;
            }

            erFormHelper.setControlValueEx('layoutControlGroup1', {
                MEND_CALCULATE_RATE: rate,
                MEND_WEIGHT: wt.toFixed(2)
            });
            /**
             *  日期：20240604
             *  原因：判断磨屑量是否大于3顿，电子记录会提示
             */

            if ((before - afterWeight) > 3 && afterWeight > 0) {
                erFormHelper.messageError('磨屑量大于3吨，请核实填写的磨后重量');
                return;
            }
        }
    }
    if (procDiv === 'INNER_2I' || procDiv === 'OUTER_2U') {
        if (e.itemCode === 'MEND_RATE') {
          const before = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_AFTER_WEIGHT');
          const secondWeight = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_SECOND_WEIGHT');
            if (secondWeight > 0) {
            //这里计算一下修磨折算重量
            //设定修磨率
            const mendRate = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_RATE');
            //金属去除速度
            const mendMetalRate = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_METAL_RATE');
            let wt = 0;
                if (mendRate > 0 && mendMetalRate > 0) {
                    wt =
                    ((secondWeight * (mendRate / 100) * 1000 * (18.3 / secondWeight)) / 238) *
                    (10.25 / mendMetalRate) *
                    secondWeight;
                }
                erFormHelper.setControlValueEx('layoutControlGroup1', {
                    MEND_WEIGHT: wt.toFixed(2)
                });
          }
        }
        if (e.itemCode === 'MEND_SECOND_WEIGHT') {
          const before = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_AFTER_WEIGHT');
          const afterWeight = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_SECOND_WEIGHT');

            if (afterWeight > before) {
                erFormHelper.messageError('填写的再磨重量比磨后重量大，请核实输入的再磨重量');
                return;
            }
          let rate = (((before - afterWeight) / before) * 100).toFixed(2) + '%';
            if (afterWeight == 0) {
                rate = '0';
          }

          //这里计算一下修磨折算重量
          //设定修磨率
          const mendRate = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_RATE');
          //金属去除速度
          const mendMetalRate = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_METAL_RATE');
          let wt = 0;
            if (mendRate > 0 && mendMetalRate > 0) {
                wt =
                ((afterWeight * (mendRate / 100) * 1000 * (18.3 / afterWeight)) / 238) *
                (10.25 / mendMetalRate) *
                afterWeight;
            }

            erFormHelper.setControlValueEx('layoutControlGroup1', {
                MEND_CALCULATE_RATE: rate,
                MEND_WEIGHT: wt.toFixed(2)
            });
        }
    }
};

    //2024-04-02
    const layout_valueChanged5 = (e: any) => {
    if (e.itemCode === 'MEND_AFTER_WEIGHT') {
        const before = erFormHelper.getControlValue('layoutControlGroup5', 'MEND_BEFORE_WEIGHT');
        const afterWeight = erFormHelper.getControlValue('layoutControlGroup5', 'MEND_AFTER_WEIGHT');

        if (afterWeight > before) {
            erFormHelper.messageError('填写的磨后重量比磨前重量大，请核实输入的磨后重量1');
            return;
        }
        let rate = (((before - afterWeight) / before) * 100).toFixed(2) + '%';
        if (afterWeight == 0) {
            rate = '0';
        }
        erFormHelper.setControlValueEx('layoutControlGroup5', {
            MEND_CALCULATE_RATE: rate,
            MEND_WEIGHT: 20
        });
      }
    if (e.itemCode === 'MEND_SECOND_WEIGHT') {
        const before = erFormHelper.getControlValue('layoutControlGroup5', 'MEND_AFTER_WEIGHT');
        const afterWeight = erFormHelper.getControlValue('layoutControlGroup5', 'MEND_SECOND_WEIGHT');

        if (afterWeight > before) {
            erFormHelper.messageError('填写的再磨重量比磨后重量大，请核实输入的再磨重量');
            return;
        }
        let rate = (((before - afterWeight) / before) * 100).toFixed(2) + '%';
        if (afterWeight == 0) {
            rate = '0';
        }
        erFormHelper.setControlValueEx('layoutControlGroup5', {
            MEND_CALCULATE_RATE: rate,
            MEND_WEIGHT: 20
        });
      }
};
    //2024-04-03
    const layout_valueChanged6 = (e: any) => {
    if (e.itemCode === 'MEND_SECOND_WEIGHT') {
        const before = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_AFTER_WEIGHT');
        const afterWeight = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_SECOND_WEIGHT');

        if (afterWeight > before) {
            erFormHelper.messageError('填写的再磨重量比磨后重量大，请核实输入的再磨重量');
            return;
        }
        let rate = (((before - afterWeight) / before) * 100).toFixed(2) + '%';
        if (afterWeight == 0) {
            rate = '0';
        }
        erFormHelper.setControlValueEx('layoutControlGroup4', {
            MEND_CALCULATE_RATE: rate,
            MEND_WEIGHT: 20
        });
      }
    //外弧第一遍电流
    if (e.itemCode === 'MEND_OUTER_1_CURRENT' || e.itemCode === 'MEND_OUTER_1_OUTER_CURRENT') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_1_SPEED');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_1_WIDTH');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_2_CURRENT', 'MEND_OUTER_2_SPEED', 'MEND_OUTER_2_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_1_OUTER_SPEED');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_1_OUTER_WIDTH');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_2_OUTER_CURRENT', 'MEND_OUTER_2_OUTER_SPEED', 'MEND_OUTER_2_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //外弧第一遍台车速度
    if (e.itemCode === 'MEND_OUTER_1_SPEED' || e.itemCode === 'MEND_OUTER_1_OUTER_SPEED') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerrCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_1_CURRENT');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_1_WIDTH');
            if (outerrCurrent1 != '' && outerrCurrent1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_2_CURRENT', 'MEND_OUTER_2_SPEED', 'MEND_OUTER_2_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_1_OUTER_CURRENT');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_1_OUTER_WIDTH');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_2_OUTER_CURRENT', 'MEND_OUTER_2_OUTER_SPEED', 'MEND_OUTER_2_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //外弧第一遍步进宽度
    if (e.itemCode === 'MEND_OUTER_1_WIDTH' || e.itemCode === 'MEND_OUTER_1_OUTER_WIDTH') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerrCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_1_CURRENT');
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_1_SPEED');
            if (outerrCurrent1 != '' && outerrCurrent1 > 0 && outerSpeed1 != '' && outerSpeed1 > 0) {
                itemCodes = ['MEND_OUTER_2_CURRENT', 'MEND_OUTER_2_SPEED', 'MEND_OUTER_2_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_1_OUTER_CURRENT');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_1_OUTER_SPEED');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_2_OUTER_CURRENT', 'MEND_OUTER_2_OUTER_SPEED', 'MEND_OUTER_2_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }

    //外弧第二遍电流
    if (e.itemCode === 'MEND_OUTER_2_CURRENT' || e.itemCode === 'MEND_OUTER_2_OUTER_CURRENT') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_2_SPEED');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_2_WIDTH');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_3_CURRENT', 'MEND_OUTER_3_SPEED', 'MEND_OUTER_3_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_2_OUTER_WIDTH');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_2_OUTER_SPEED');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_3_OUTER_CURRENT', 'MEND_OUTER_3_OUTER_SPEED', 'MEND_OUTER_3_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //外弧第二遍台车速度
    if (e.itemCode === 'MEND_OUTER_2_SPEED' || e.itemCode === 'MEND_OUTER_2_OUTER_SPEED') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerrCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_2_CURRENT');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_2_WIDTH');
            if (outerrCurrent1 != '' && outerrCurrent1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_3_CURRENT', 'MEND_OUTER_3_SPEED', 'MEND_OUTER_3_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_2_OUTER_CURRENT');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_2_OUTER_WIDTH');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_3_OUTER_CURRENT', 'MEND_OUTER_3_OUTER_SPEED', 'MEND_OUTER_3_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //外弧第二遍步进宽度
    if (e.itemCode === 'MEND_OUTER_2_WIDTH' || e.itemCode === 'MEND_OUTER_2_OUTER_WIDTH') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerrCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_2_CURRENT');
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_2_SPEED');
            if (outerrCurrent1 != '' && outerrCurrent1 > 0 && outerSpeed1 != '' && outerSpeed1 > 0) {
                itemCodes = ['MEND_OUTER_3_CURRENT', 'MEND_OUTER_3_SPEED', 'MEND_OUTER_3_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_2_OUTER_SPEED');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_2_OUTER_CURRENT');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_3_OUTER_CURRENT', 'MEND_OUTER_3_OUTER_SPEED', 'MEND_OUTER_3_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }

    //外弧第三遍电流
    if (e.itemCode === 'MEND_OUTER_3_CURRENT' || e.itemCode === 'MEND_OUTER_3_OUTER_CURRENT') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_3_SPEED');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_3_WIDTH');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_4_CURRENT', 'MEND_OUTER_4_SPEED', 'MEND_OUTER_4_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_3_OUTER_SPEED');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_3_OUTER_WIDTH');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_4_OUTER_CURRENT', 'MEND_OUTER_4_OUTER_SPEED', 'MEND_OUTER_4_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //外弧第三遍台车速度
    if (e.itemCode === 'MEND_OUTER_3_SPEED' || e.itemCode === 'MEND_OUTER_3_OUTER_SPEED') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerrCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_3_CURRENT');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_3_WIDTH');
            if (outerrCurrent1 != '' && outerrCurrent1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_4_CURRENT', 'MEND_OUTER_4_SPEED', 'MEND_OUTER_4_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_3_OUTER_CURRENT');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_3_OUTER_WIDTH');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_4_OUTER_CURRENT', 'MEND_OUTER_4_OUTER_SPEED', 'MEND_OUTER_4_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //外弧第三遍步进宽度
    if (e.itemCode === 'MEND_OUTER_3_WIDTH' || e.itemCode === 'MEND_OUTER_3_OUTER_WIDTH') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerrCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_3_CURRENT');
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_3_SPEED');
            if (outerrCurrent1 != '' && outerrCurrent1 > 0 && outerSpeed1 != '' && outerSpeed1 > 0) {
                itemCodes = ['MEND_OUTER_4_CURRENT', 'MEND_OUTER_4_SPEED', 'MEND_OUTER_4_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_3_OUTER_CURRENT');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_3_OUTER_SPEED');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_4_OUTER_CURRENT', 'MEND_OUTER_4_OUTER_SPEED', 'MEND_OUTER_4_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }

    //外弧第四遍电流
    if (e.itemCode === 'MEND_OUTER_4_CURRENT' || e.itemCode === 'MEND_OUTER_4_OUTER_CURRENT') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_4_SPEED');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_4_WIDTH');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_5_CURRENT', 'MEND_OUTER_5_SPEED', 'MEND_OUTER_5_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_4_OUTER_WIDTH');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_4_OUTER_SPEED');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_5_OUTER_CURRENT', 'MEND_OUTER_5_OUTER_SPEED', 'MEND_OUTER_5_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //外弧第四遍台车速度
    if (e.itemCode === 'MEND_OUTER_4_SPEED' || e.itemCode === 'MEND_OUTER_4_OUTER_SPEED') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerrCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_4_CURRENT');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_4_WIDTH');
            if (outerrCurrent1 != '' && outerrCurrent1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_5_CURRENT', 'MEND_OUTER_5_SPEED', 'MEND_OUTER_5_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_4_OUTER_WIDTH');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_4_OUTER_CURRENT');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_5_OUTER_CURRENT', 'MEND_OUTER_5_OUTER_SPEED', 'MEND_OUTER_5_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //外弧第四遍步进宽度
    if (e.itemCode === 'MEND_OUTER_4_WIDTH' || e.itemCode === 'MEND_OUTER_4_OUTER_WIDTH') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerrCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_4_CURRENT');
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_4_SPEED');
            if (outerrCurrent1 != '' && outerrCurrent1 > 0 && outerSpeed1 != '' && outerSpeed1 > 0) {
                itemCodes = ['MEND_OUTER_5_CURRENT', 'MEND_OUTER_5_SPEED', 'MEND_OUTER_5_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_4_OUTER_SPEED');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_4_OUTER_CURRENT');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_5_OUTER_CURRENT', 'MEND_OUTER_5_OUTER_SPEED', 'MEND_OUTER_5_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }

    //外弧第五遍电流
    if (e.itemCode === 'MEND_OUTER_5_CURRENT' || e.itemCode === 'MEND_OUTER_5_OUTER_CURRENT') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_5_SPEED');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_5_WIDTH');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_6_CURRENT', 'MEND_OUTER_6_SPEED', 'MEND_OUTER_6_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_5_OUTER_WIDTH');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_5_OUTER_SPEED');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_6_OUTER_CURRENT', 'MEND_OUTER_6_OUTER_SPEED', 'MEND_OUTER_6_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //外弧第五遍台车速度
    if (e.itemCode === 'MEND_OUTER_5_SPEED' || e.itemCode === 'MEND_OUTER_5_OUTER_SPEED') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerrCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_5_CURRENT');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_5_WIDTH');
            if (outerrCurrent1 != '' && outerrCurrent1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_6_CURRENT', 'MEND_OUTER_6_SPEED', 'MEND_OUTER_6_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_5_OUTER_WIDTH');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_5_OUTER_CURRENT');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_6_OUTER_CURRENT', 'MEND_OUTER_6_OUTER_SPEED', 'MEND_OUTER_6_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //外弧第五遍步进宽度
    if (e.itemCode === 'MEND_OUTER_5_WIDTH' || e.itemCode === 'MEND_OUTER_5_OUTER_WIDTH') {
        let itemCodes = [''];
        if (procDiv === 'OUTER_1U') {
          const outerrCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_5_CURRENT');
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_OUTER_5_SPEED');
            if (outerrCurrent1 != '' && outerrCurrent1 > 0 && outerSpeed1 != '' && outerSpeed1 > 0) {
                itemCodes = ['MEND_OUTER_6_CURRENT', 'MEND_OUTER_6_SPEED', 'MEND_OUTER_6_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'OUTER_2U') {
          const outerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_5_OUTER_SPEED');
          const outerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_OUTER_5_OUTER_CURRENT');
            if (outerSpeed1 != '' && outerSpeed1 > 0 && outerWidth1 != '' && outerWidth1 > 0) {
                itemCodes = ['MEND_OUTER_6_OUTER_CURRENT', 'MEND_OUTER_6_OUTER_SPEED', 'MEND_OUTER_6_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }

    //内弧第一遍电流
    if (e.itemCode === 'MEND_INNER_1_CURRENT' || e.itemCode === 'MEND_INNER_1_OUTER_CURRENT') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_1_SPEED');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_1_WIDTH');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_2_CURRENT', 'MEND_INNER_2_SPEED', 'MEND_INNER_2_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_1_OUTER_SPEED');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_1_OUTER_WIDTH');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_2_OUTER_CURRENT', 'MEND_INNER_2_OUTER_SPEED', 'MEND_INNER_2_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第一遍台车速度

    if (e.itemCode === 'MEND_INNER_1_SPEED' || e.itemCode === 'MEND_INNER_1_OUTER_SPEED') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_1_CURRENT');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_1_WIDTH');
            if (innerCurrent1 != '' && innerCurrent1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_2_CURRENT', 'MEND_INNER_2_SPEED', 'MEND_INNER_2_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_1_OUTER_CURRENT');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_1_OUTER_WIDTH');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_2_OUTER_CURRENT', 'MEND_INNER_2_OUTER_SPEED', 'MEND_INNER_2_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第一遍步进宽度
    if (e.itemCode === 'MEND_INNER_1_WIDTH' || e.itemCode === 'MEND_INNER_1_OUTER_WIDTH') {
        let itemCodes = [''];
        console.log('e.itemCode', procDiv);
        if (procDiv === 'INNER_1I') {
          const innerCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_1_CURRENT');
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_1_SPEED');
            if (innerCurrent1 != '' && innerCurrent1 > 0 && innerSpeed1 != '' && innerSpeed1 > 0) {
            const innerCurrent1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_1_CURRENT');
            const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_1_SPEED');
                if (innerCurrent1 != '' && innerCurrent1 > 0 && innerSpeed1 != '' && innerSpeed1 > 0) {
                    itemCodes = ['MEND_INNER_2_CURRENT', 'MEND_INNER_2_SPEED', 'MEND_INNER_2_WIDTH'];
                    erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                    erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
                }
          }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_1_OUTER_CURRENT');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_1_OUTER_SPEED');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_2_OUTER_CURRENT', 'MEND_INNER_2_OUTER_SPEED', 'MEND_INNER_2_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第二遍电流
    if (e.itemCode === 'MEND_INNER_2_CURRENT' || e.itemCode === 'MEND_INNER_2_OUTER_CURRENT') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerSpeed2 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_2_SPEED');
          const innerWidth2 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_2_WIDTH');
            if (innerSpeed2 != '' && innerSpeed2 > 0 && innerWidth2 != '' && innerWidth2 > 0) {
                itemCodes = ['MEND_INNER_3_CURRENT', 'MEND_INNER_3_SPEED', 'MEND_INNER_3_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_2_OUTER_WIDTH');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_2_OUTER_SPEED');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_3_OUTER_CURRENT', 'MEND_INNER_3_OUTER_SPEED', 'MEND_INNER_3_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第二遍台车速度
    if (e.itemCode === 'MEND_INNER_2_SPEED' || e.itemCode === 'MEND_INNER_2_OUTER_SPEED') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerCurrent2 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_2_CURRENT');
          const innerWidth2 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_2_WIDTH');
            if (innerCurrent2 != '' && innerCurrent2 > 0 && innerWidth2 != '' && innerWidth2 > 0) {
                itemCodes = ['MEND_INNER_3_CURRENT', 'MEND_INNER_3_SPEED', 'MEND_INNER_3_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_2_OUTER_WIDTH');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_2_OUTER_CURRENT');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_2_OUTER_CURRENT', 'MEND_INNER_2_OUTER_SPEED', 'MEND_INNER_2_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第二遍步进宽度
    if (e.itemCode === 'MEND_INNER_2_WIDTH' || e.itemCode === 'MEND_INNER_2_OUTER_WIDTH') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerCurrent2 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_2_CURRENT');
          const innerSpeed2 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_2_SPEED');
            if (innerCurrent2 != '' && innerCurrent2 > 0 && innerSpeed2 != '' && innerSpeed2 > 0) {
                itemCodes = ['MEND_INNER_3_CURRENT', 'MEND_INNER_3_SPEED', 'MEND_INNER_3_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_2_OUTER_WIDTH');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_2_OUTER_SPEED');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_3_OUTER_CURRENT', 'MEND_INNER_3_OUTER_SPEED', 'MEND_INNER_3_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第三遍电流
    if (e.itemCode === 'MEND_INNER_3_CURRENT' || e.itemCode === 'MEND_INNER_3_OUTER_CURRENT') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerSpeed3 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_3_SPEED');
          const innerWidth3 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_3_WIDTH');
            if (innerSpeed3 != '' && innerSpeed3 > 0 && innerWidth3 != '' && innerWidth3 > 0) {
                itemCodes = ['MEND_INNER_4_CURRENT', 'MEND_INNER_4_SPEED', 'MEND_INNER_4_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_3_OUTER_WIDTH');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_3_OUTER_SPEED');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_4_OUTER_CURRENT', 'MEND_INNER_4_OUTER_SPEED', 'MEND_INNER_4_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第三遍台车速度
    if (e.itemCode === 'MEND_INNER_3_SPEED' || e.itemCode === 'MEND_INNER_3_OUTER_SPEED') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerCurrent3 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_3_CURRENT');
          const innerWidth3 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_3_WIDTH');
            if (innerCurrent3 != '' && innerCurrent3 > 0 && innerWidth3 != '' && innerWidth3 > 0) {
                itemCodes = ['MEND_INNER_4_CURRENT', 'MEND_INNER_4_SPEED', 'MEND_INNER_4_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_3_OUTER_WIDTH');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_3_OUTER_CURRENT');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_4_OUTER_CURRENT', 'MEND_INNER_4_OUTER_SPEED', 'MEND_INNER_4_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第三遍步进宽度
    if (e.itemCode === 'MEND_INNER_3_WIDTH' || e.itemCode === 'MEND_INNER_3_OUTER_WIDTH') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerCurrent3 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_3_CURRENT');
          const innerSpeed3 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_3_SPEED');
            if (innerCurrent3 != '' && innerCurrent3 > 0 && innerSpeed3 != '' && innerSpeed3 > 0) {
                itemCodes = ['MEND_INNER_4_CURRENT', 'MEND_INNER_4_SPEED', 'MEND_INNER_4_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_3_OUTER_SPEED');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_3_OUTER_CURRENT');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_4_OUTER_CURRENT', 'MEND_INNER_4_OUTER_SPEED', 'MEND_INNER_4_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第四遍电流
    if (e.itemCode === 'MEND_INNER_4_CURRENT' || e.itemCode === 'MEND_INNER_4_OUTER_CURRENT') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerSpeed4 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_4_SPEED');
          const innerWidth4 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_4_WIDTH');
            if (innerSpeed4 != '' && innerSpeed4 > 0 && innerWidth4 != '' && innerWidth4 > 0) {
                itemCodes = ['MEND_INNER_5_CURRENT', 'MEND_INNER_5_SPEED', 'MEND_INNER_5_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_4_OUTER_SPEED');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_4_OUTER_WIDTH');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_5_OUTER_CURRENT', 'MEND_INNER_5_OUTER_SPEED', 'MEND_INNER_5_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第四遍台车速度
    if (e.itemCode === 'MEND_INNER_4_SPEED' || e.itemCode === 'MEND_INNER_4_OUTER_SPEED') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerCurrent4 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_4_CURRENT');
          const innerWidth4 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_4_WIDTH');
            if (innerCurrent4 != '' && innerCurrent4 > 0 && innerWidth4 != '' && innerWidth4 > 0) {
                itemCodes = ['MEND_INNER_5_CURRENT', 'MEND_INNER_5_SPEED', 'MEND_INNER_5_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_4_OUTER_CURRENT');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_4_OUTER_WIDTH');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_5_OUTER_CURRENT', 'MEND_INNER_5_OUTER_SPEED', 'MEND_INNER_5_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第四遍步进宽度
    if (e.itemCode === 'MEND_INNER_4_WIDTH' || e.itemCode === 'MEND_INNER_4_OUTER_WIDTH') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerCurrent4 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_4_CURRENT');
          const innerSpeed4 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_4_SPEED');
            if (innerCurrent4 != '' && innerCurrent4 > 0 && innerSpeed4 != '' && innerSpeed4 > 0) {
                itemCodes = ['MEND_INNER_5_CURRENT', 'MEND_INNER_5_SPEED', 'MEND_INNER_5_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_4_OUTER_CURRENT');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_4_OUTER_SPEED');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_5_OUTER_CURRENT', 'MEND_INNER_5_OUTER_SPEED', 'MEND_INNER_5_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第五遍电流
    if (e.itemCode === 'MEND_INNER_5_CURRENT' || e.itemCode === 'MEND_INNER_5_OUTER_CURRENT') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerSpeed5 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_5_SPEED');
          const innerWidth5 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_5_WIDTH');
            if (innerSpeed5 != '' && innerSpeed5 > 0 && innerWidth5 != '' && innerWidth5 > 0) {
                itemCodes = ['MEND_INNER_6_CURRENT', 'MEND_INNER_6_SPEED', 'MEND_INNER_6_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_5_OUTER_WIDTH');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_5_OUTER_SPEED');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_6_OUTER_CURRENT', 'MEND_INNER_6_OUTER_SPEED', 'MEND_INNER_6_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第五遍台车速度
    if (e.itemCode === 'MEND_INNER_5_SPEED' || e.itemCode === 'MEND_INNER_5_OUTER_SPEED') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerCurrent5 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_5_CURRENT');
          const innerWidth5 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_5_WIDTH');
            if (innerCurrent5 != '' && innerCurrent5 > 0 && innerWidth5 != '' && innerWidth5 > 0) {
                itemCodes = ['MEND_INNER_6_CURRENT', 'MEND_INNER_6_SPEED', 'MEND_INNER_6_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_5_OUTER_WIDTH');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_5_OUTER_CURRENT');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_6_OUTER_CURRENT', 'MEND_INNER_6_OUTER_SPEED', 'MEND_INNER_6_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
    //内弧第五遍步进宽度
    if (e.itemCode === 'MEND_INNER_5_WIDTH' || e.itemCode === 'MEND_INNER_5_OUTER_WIDTH') {
        let itemCodes = [''];
        if (procDiv === 'INNER_1I') {
          const innerCurrent5 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_5_CURRENT');
          const innerSpeed5 = erFormHelper.getControlValue('layoutControlGroup2', 'MEND_INNER_5_SPEED');
            if (innerCurrent5 != '' && innerCurrent5 > 0 && innerSpeed5 != '' && innerSpeed5 > 0) {
                itemCodes = ['MEND_INNER_6_CURRENT', 'MEND_INNER_6_SPEED', 'MEND_INNER_6_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
            }
        } else if (procDiv === 'INNER_2I') {
          const innerSpeed1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_5_OUTER_SPEED');
          const innerWidth1 = erFormHelper.getControlValue('layoutControlGroup4', 'MEND_INNER_5_OUTER_CURRENT');
            if (innerSpeed1 != '' && innerSpeed1 > 0 && innerWidth1 != '' && innerWidth1 > 0) {
                itemCodes = ['MEND_INNER_6_OUTER_CURRENT', 'MEND_INNER_6_OUTER_SPEED', 'MEND_INNER_6_OUTER_WIDTH'];
                erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
                erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
            }
        }
    }
};
    //2024-03-29
    //是否更换砂轮：否，其他项均不可编辑
    const layout_valueChanged3 = (e: any) => {
    //初磨--内弧
    if (procDiv === 'INNER_1I' || procDiv === 'INNER_2I') {
        if (e.itemCode === 'GRINDING_WHEEL_CHANGE') {
          const isChange = erFormHelper.getControlValue('layoutControlGroup3', 'GRINDING_WHEEL_CHANGE');
            if (isChange == 'N') {
                setControlVisibleGrinding(0);
            } else {
                setControlVisibleGrinding(1);
            }
        }
        if (e.itemCode === 'MEND_SLAG_HOPPER') {
          const isChange = erFormHelper.getControlValue('layoutControlGroup3', 'MEND_SLAG_HOPPER');
            if (isChange == 'N') {
                setControlVisibleHopper(0);
            } else {
                setControlVisibleHopper(1);
            }
        }
    }
    //初磨--外弧
    if (procDiv === 'OUTER_1U' || procDiv === 'OUTER_2U') {
        if (e.itemCode === 'GRINDING_WHEEL_OUTER_CHANGE') {
          const isChange = erFormHelper.getControlValue('layoutControlGroup3', 'GRINDING_WHEEL_OUTER_CHANGE');
            if (isChange == 'N') {
                setControlVisibleOuterGrinding(0);
            } else {
                setControlVisibleOuterGrinding(1);
            }
        }
        if (e.itemCode === 'MEND_SLAG_OUTER_HOPPER') {
          const isChange = erFormHelper.getControlValue('layoutControlGroup3', 'MEND_SLAG_OUTER_HOPPER');
            if (isChange == 'N') {
                setControlVisibleOuterHopper(0);
            } else {
                setControlVisibleOuterHopper(1);
            }
        }
    }
};

    //2024-04-03
    const insert_zx = async(e: any) => {
      let itemCodes = [''];
    if (e.srcElement.innerText == '录2') {
        if (procDiv === 'INNER_1I') {
            itemCodes = ['MEND_INNER_2_CURRENT', 'MEND_INNER_2_SPEED', 'MEND_INNER_2_WIDTH'];
        } else if (procDiv === 'OUTER_1U') {
            itemCodes = ['MEND_OUTER_2_CURRENT', 'MEND_OUTER_2_SPEED', 'MEND_OUTER_2_WIDTH'];
        } else if (procDiv === 'INNER_2I') {
            itemCodes = ['MEND_INNER_2_OUTER_CURRENT', 'MEND_INNER_2_OUTER_SPEED', 'MEND_INNER_2_OUTER_WIDTH'];
        } else if (procDiv === 'OUTER_2U') {
            itemCodes = ['MEND_OUTER_2_OUTER_CURRENT', 'MEND_OUTER_2_OUTER_SPEED', 'MEND_OUTER_2_OUTER_WIDTH'];
        }
    } else if (e.srcElement.innerText == '录3') {
        if (procDiv === 'INNER_1I') {
            itemCodes = ['MEND_INNER_3_CURRENT', 'MEND_INNER_3_SPEED', 'MEND_INNER_3_WIDTH'];
        } else if (procDiv === 'OUTER_1U') {
            itemCodes = ['MEND_OUTER_3_CURRENT', 'MEND_OUTER_3_SPEED', 'MEND_OUTER_3_WIDTH'];
        } else if (procDiv === 'INNER_2I') {
            itemCodes = ['MEND_INNER_3_OUTER_CURRENT', 'MEND_INNER_3_OUTER_SPEED', 'MEND_INNER_3_OUTER_WIDTH'];
        } else if (procDiv === 'OUTER_2U') {
            itemCodes = ['MEND_OUTER_3_OUTER_CURRENT', 'MEND_OUTER_3_OUTER_SPEED', 'MEND_OUTER_3_OUTER_WIDTH'];
        }
    } else if (e.srcElement.innerText == '录4') {
        if (procDiv === 'INNER_1I') {
            itemCodes = ['MEND_INNER_4_CURRENT', 'MEND_INNER_4_SPEED', 'MEND_INNER_4_WIDTH'];
        } else if (procDiv === 'OUTER_1U') {
            itemCodes = ['MEND_OUTER_4_CURRENT', 'MEND_OUTER_4_SPEED', 'MEND_OUTER_4_WIDTH'];
        } else if (procDiv === 'INNER_2I') {
            itemCodes = ['MEND_INNER_4_OUTER_CURRENT', 'MEND_INNER_4_OUTER_SPEED', 'MEND_INNER_4_OUTER_WIDTH'];
        } else if (procDiv === 'OUTER_2U') {
            itemCodes = ['MEND_OUTER_4_OUTER_CURRENT', 'MEND_OUTER_4_OUTER_SPEED', 'MEND_OUTER_4_OUTER_WIDTH'];
        }
    } else if (e.srcElement.innerText == '录5') {
        if (procDiv === 'INNER_1I') {
            itemCodes = ['MEND_INNER_5_CURRENT', 'MEND_INNER_5_SPEED', 'MEND_INNER_5_WIDTH'];
        } else if (procDiv === 'OUTER_1U') {
            itemCodes = ['MEND_OUTER_5_CURRENT', 'MEND_OUTER_5_SPEED', 'MEND_OUTER_5_WIDTH'];
        } else if (procDiv === 'INNER_2I') {
            itemCodes = ['MEND_INNER_5_OUTER_CURRENT', 'MEND_INNER_5_OUTER_SPEED', 'MEND_INNER_5_OUTER_WIDTH'];
        } else if (procDiv === 'OUTER_2U') {
            itemCodes = ['MEND_OUTER_5_OUTER_CURRENT', 'MEND_OUTER_5_OUTER_SPEED', 'MEND_OUTER_5_OUTER_WIDTH'];
        }
    } else if (e.srcElement.innerText == '录6') {
        if (procDiv === 'INNER_1I') {
            itemCodes = ['MEND_INNER_6_CURRENT', 'MEND_INNER_6_SPEED', 'MEND_INNER_6_WIDTH'];
        } else if (procDiv === 'OUTER_1U') {
            itemCodes = ['MEND_OUTER_6_CURRENT', 'MEND_OUTER_6_SPEED', 'MEND_OUTER_6_WIDTH'];
        } else if (procDiv === 'INNER_2I') {
            itemCodes = ['MEND_INNER_6_OUTER_CURRENT', 'MEND_INNER_6_OUTER_SPEED', 'MEND_INNER_6_OUTER_WIDTH'];
        } else if (procDiv === 'OUTER_2U') {
            itemCodes = ['MEND_OUTER_6_OUTER_CURRENT', 'MEND_OUTER_6_OUTER_SPEED', 'MEND_OUTER_6_OUTER_WIDTH'];
        }
    }
    erFormHelper.setControlReadOnly('layoutControlGroup2', false, ...itemCodes);
    erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'white');
    erFormHelper.setControlReadOnly('layoutControlGroup4', false, ...itemCodes);
    erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'white');
};

    //初始化 内弧是否更换砂轮
    const setControlVisibleGrinding = (e: any) => {
    if (0 == e) {
        //默认--内弧相关不可编辑
        erFormHelper.setControlVisible(
            'layoutControlGroup3',
            false,
            'GRINDING_WHEEL_PEOPLE,GRINDING_WHEEL_GRAININESS,GRINDING_WHEEL_MACHINE,GRINDSTONE_SUPPLIER_IN,WHEEL_TYPE_IN',
            'empty'
            );
    } else if (1 == e) {
        //默认--内弧相关不可编辑

        erFormHelper.setControlVisible(
            'layoutControlGroup3',
            true,
            'GRINDING_WHEEL_PEOPLE,GRINDING_WHEEL_GRAININESS,GRINDING_WHEEL_MACHINE,GRINDSTONE_SUPPLIER_IN,WHEEL_TYPE_IN',
            'empty'
            );

        const mendInnerMachine = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_INNER_MACHINE');
        erFormHelper.setControlValueEx('layoutControlGroup3', {
            WHEEL_TYPE_IN: WHEEL_TYPE_IN,
            GRINDSTONE_SUPPLIER_IN: GRINDSTONE_SUPPLIER_IN,
            GRINDING_WHEEL_GRAININESS: GRINDING_WHEEL_GRAININESS,
            GRINDING_WHEEL_PEOPLE: GRINDING_WHEEL_PEOPLE,
            GRINDING_WHEEL_MACHINE: mendInnerMachine
        });
    }
};
    //初始化 外弧是否更换砂轮
    const setControlVisibleOuterGrinding = (e: any) => {
    if (0 == e) {
        //默认--外弧相关不可编辑
        erFormHelper.setControlVisible(
            'layoutControlGroup3',
            false,
            'WHEEL_TYPE_OUT,GRINDSTONE_SUPPLIER_OUT,GRINDING_WHEEL_OUTER_MACHINE,GRINDING_WHEEL_OUTER_GRAININESS,GRINDING_WHEEL_OUTER_PEOPLE',
            'empty'
            );
    } else if (1 == e) {
        //默认--外弧相关不可编辑
        erFormHelper.setControlVisible(
            'layoutControlGroup3',
            true,
            'WHEEL_TYPE_OUT,GRINDSTONE_SUPPLIER_OUT,GRINDING_WHEEL_OUTER_MACHINE,GRINDING_WHEEL_OUTER_GRAININESS,GRINDING_WHEEL_OUTER_PEOPLE',
            'empty'
            );

        const mendInnerMachine = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_OUTER_MACHINE');
        erFormHelper.setControlValueEx('layoutControlGroup3', {
            WHEEL_TYPE_OUT: WHEEL_TYPE_OUT,
            GRINDSTONE_SUPPLIER_OUT: GRINDSTONE_SUPPLIER_OUT,
            GRINDING_WHEEL_OUTER_GRAININESS: GRINDING_WHEEL_OUTER_GRAININESS,
            GRINDING_WHEEL_OUTER_PEOPLE: GRINDING_WHEEL_OUTER_PEOPLE,
            GRINDING_WHEEL_OUTER_MACHINE: mendInnerMachine
        });
    }
};

    //初始化 内弧是否倒渣斗
    const setControlVisibleHopper = (e: any) => {
    if (0 == e) {
        //默认--内弧相关不可编辑
        erFormHelper.setControlVisible(
            'layoutControlGroup3',
            false,
            'MEND_SLAG_HOPPER_MACHINE,MEND_SLAG_HOPPER_OPERATOR,MEND_SLAG_HOPPER_WEIGHT',
            'empty'
            );
    } else if (1 == e) {
        //默认--内弧相关不可编辑
        erFormHelper.setControlVisible(
            'layoutControlGroup3',
            true,
            'MEND_SLAG_HOPPER_MACHINE,MEND_SLAG_HOPPER_OPERATOR,MEND_SLAG_HOPPER_WEIGHT',
            'empty'
            );

        const mendInnerMachine = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_INNER_MACHINE');
        erFormHelper.setControlValueEx('layoutControlGroup3', {
            MEND_SLAG_HOPPER_MACHINE: mendInnerMachine,
            MEND_SLAG_HOPPER_OPERATOR: MEND_SLAG_HOPPER_OPERATOR,
            MEND_SLAG_HOPPER_WEIGHT: MEND_SLAG_HOPPER_WEIGHT
        });
    }
};

    //初始化 外弧是否倒渣斗
    const setControlVisibleOuterHopper = (e: any) => {
    if (0 == e) {
        //默认--外弧相关不可编辑
        erFormHelper.setControlVisible(
            'layoutControlGroup3',
            false,
            'MEND_SLAG_OUTER_HOPPER_MACHINE,MEND_SLAG_OUTER_HOPPER_OPERATOR,MEND_SLAG_OUTER_HOPPER_WEIGHT',
            'empty'
            );
    } else if (1 == e) {
        //默认--外弧相关不可编辑

        erFormHelper.setControlVisible(
            'layoutControlGroup3',
            true,
            'MEND_SLAG_OUTER_HOPPER_MACHINE,MEND_SLAG_OUTER_HOPPER_OPERATOR,MEND_SLAG_OUTER_HOPPER_WEIGHT',
            'empty'
            );
        const mendInnerMachine = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_OUTER_MACHINE');
        erFormHelper.setControlValueEx('layoutControlGroup3', {
            MEND_SLAG_OUTER_HOPPER_MACHINE: mendInnerMachine,
            MEND_SLAG_OUTER_HOPPER_OPERATOR: MEND_SLAG_OUTER_HOPPER_OPERATOR,
            MEND_SLAG_OUTER_HOPPER_WEIGHT: MEND_SLAG_OUTER_HOPPER_WEIGHT
        });
    }
};

    //初始化--初磨，内弧一~六遍相应的值
    const setControlEditableInner = (e: any) => {
      let itemCodes = [
        'MEND_INNER_2_CURRENT',
        'MEND_INNER_2_SPEED',
        'MEND_INNER_2_WIDTH',
        'MEND_INNER_3_CURRENT',
        'MEND_INNER_3_SPEED',
        'MEND_INNER_3_WIDTH',
        'MEND_INNER_4_CURRENT',
        'MEND_INNER_4_SPEED',
        'MEND_INNER_4_WIDTH',
        'MEND_INNER_5_CURRENT',
        'MEND_INNER_5_SPEED',
        'MEND_INNER_5_WIDTH',
        'MEND_INNER_6_CURRENT',
        'MEND_INNER_6_SPEED',
        'MEND_INNER_6_WIDTH'
    ];
    erFormHelper.setControlReadOnly('layoutControlGroup2', true, ...itemCodes);
    erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'LightGray');
};
    //初始化--再磨，内弧
    const setControlSecondEditableInner = (e: any) => {
      let itemCodes = [
        'MEND_INNER_2_OUTER_CURRENT',
        'MEND_INNER_2_OUTER_SPEED',
        'MEND_INNER_2_OUTER_WIDTH',
        'MEND_INNER_3_OUTER_CURRENT',
        'MEND_INNER_3_OUTER_SPEED',
        'MEND_INNER_3_OUTER_WIDTH',
        'MEND_INNER_4_OUTER_CURRENT',
        'MEND_INNER_4_OUTER_SPEED',
        'MEND_INNER_4_OUTER_WIDTH',
        'MEND_INNER_5_OUTER_CURRENT',
        'MEND_INNER_5_OUTER_SPEED',
        'MEND_INNER_5_OUTER_WIDTH',
        'MEND_INNER_6_OUTER_CURRENT',
        'MEND_INNER_6_OUTER_SPEED',
        'MEND_INNER_6_OUTER_WIDTH'
    ];
    erFormHelper.setControlReadOnly('layoutControlGroup4', true, ...itemCodes);
    erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'LightGray');
};

    //初始化，外弧一~六遍相应的值
    const setControlOuterEditableInner = (e: any) => {
      let itemCodes = [
        'MEND_OUTER_2_CURRENT',
        'MEND_OUTER_2_SPEED',
        'MEND_OUTER_2_WIDTH',
        'MEND_OUTER_3_CURRENT',
        'MEND_OUTER_3_SPEED',
        'MEND_OUTER_3_WIDTH',
        'MEND_OUTER_4_CURRENT',
        'MEND_OUTER_4_SPEED',
        'MEND_OUTER_4_WIDTH',
        'MEND_OUTER_5_CURRENT',
        'MEND_OUTER_5_SPEED',
        'MEND_OUTER_5_WIDTH',
        'MEND_OUTER_6_CURRENT',
        'MEND_OUTER_6_SPEED',
        'MEND_OUTER_6_WIDTH'
    ];
    erFormHelper.setControlReadOnly('layoutControlGroup2', true, ...itemCodes);
    erFormHelper.setLayoutItemContentBackColor('layoutControlGroup2', itemCodes, 'LightGray');
};
    //初始化，再磨外弧一~六遍相应的值
    const setControlSecondOuterEditableInner = (e: any) => {
      let itemCodes = [
        'MEND_OUTER_2_OUTER_CURRENT',
        'MEND_OUTER_2_OUTER_SPEED',
        'MEND_OUTER_2_OUTER_WIDTH',
        'MEND_OUTER_3_OUTER_CURRENT',
        'MEND_OUTER_3_OUTER_SPEED',
        'MEND_OUTER_3_OUTER_WIDTH',
        'MEND_OUTER_4_OUTER_CURRENT',
        'MEND_OUTER_4_OUTER_SPEED',
        'MEND_OUTER_4_OUTER_WIDTH',
        'MEND_OUTER_5_OUTER_CURRENT',
        'MEND_OUTER_5_OUTER_SPEED',
        'MEND_OUTER_5_OUTER_WIDTH',
        'MEND_OUTER_6_OUTER_CURRENT',
        'MEND_OUTER_6_OUTER_SPEED',
        'MEND_OUTER_6_OUTER_WIDTH'
    ];
    erFormHelper.setControlReadOnly('layoutControlGroup4', true, ...itemCodes);
    erFormHelper.setLayoutItemContentBackColor('layoutControlGroup4', itemCodes, 'LightGray');
};

    //查询物料信息
    const query_zx = async(e: any) => {
    //第一步，先判断是否有值
    if (e.srcElement.innerText == '修磨结束') {
        if (procDiv == 'INNER_1I' || procDiv == 'INNER_2I') {
          const value = erFormHelper.getControlValue('layoutControlGroup1', 'GRINDING_END_TIME');
            if (value == null || value == undefined) {
            const endDate = new Date();
                erFormHelper.setControlValueEx('layoutControlGroup1', {
                    GRINDING_END_TIME: endDate
                });
            const grindingStartTime = erFormHelper.getControlValue('layoutControlGroup1', 'GRINDING_START_TIME');
            let mendTotalTime = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_TOTAL_TIME');
                if (mendTotalTime == '') {
                    mendTotalTime = Math.floor((endDate.getTime() - new Date(grindingStartTime).getTime()) / (1000 * 60));
                }
                erFormHelper.setControlValueEx('layoutControlGroup1', {
                    MEND_INNER_TOTAL_TIME: Math.floor(
                        (new Date().getTime() - new Date(grindingStartTime).getTime()) / (1000 * 60)
                        ),
                    MEND_TOTAL_TIME: mendTotalTime
                });
          }
        } else if (procDiv == 'OUTER_1U' || procDiv == 'OUTER_2U') {
          const value = erFormHelper.getControlValue('layoutControlGroup1', 'GRINDING_OUTER_END_TIME');
            if (value == null || value == undefined) {
            const endDate = new Date();
                erFormHelper.setControlValueEx('layoutControlGroup1', {
                    GRINDING_OUTER_END_TIME: endDate
                });
            const grindingOuterStartTime = erFormHelper.getControlValue(
                    'layoutControlGroup1',
                    'GRINDING_OUTER_START_TIME'
                    );
            let mendTotalTime = erFormHelper.getControlValue('layoutControlGroup1', 'MEND_TOTAL_TIME');
                if (mendTotalTime != ' ') {
                    mendTotalTime += Math.floor(
                        (new Date().getTime() - new Date(grindingOuterStartTime).getTime()) / (1000 * 60)
                        );
                }
                erFormHelper.setControlValueEx('layoutControlGroup1', {
                    MEND_OUTER_TOTAL_TIME: Math.floor(
                        (endDate.getTime() - new Date(grindingOuterStartTime).getTime()) / (1000 * 60)
                        ),
                    MEND_TOTAL_TIME: mendTotalTime
                });
          }
        }
    } else if (e.srcElement.innerText == '选择日期') {
        const value = erFormHelper.getControlValue('layoutControlGroup1', 'START_TIME');
        if (value == null || value == undefined) {
            erFormHelper.setControlValueEx('layoutControlGroup1', {
                START_TIME: new Date()
            });
        }
      } else if (e.srcElement.innerText == '刷新重量') {

        const value = await erFormHelper.querySql('', ` select MAT_ACT_WT from tmmsm01 where MAT_NO = '${erFormHelper.getControlValue('layoutControlGroup1', 'MAT_NO')}' `);
        console.log('gfvbhjkl', value.getBlock(0).data[0].MAT_ACT_WT)
        let fresh_mat_wt = value.getBlock(0).data[0].MAT_ACT_WT;
        if (value !== null && value !== undefined) {
            console.log('gfvbhjkl', value.getBlock(0).data[0].MAT_ACT_WT)
          erFormHelper.setControlValueEx('layoutControlGroup1', {
                MEND_BEFORE_WEIGHT: fresh_mat_wt
            });
        }
      }
};
    //编辑界面
    const query_edit_xc = async(e: any) => {
    if (e.srcElement.innerText == '内弧结束') {
        const value = erFormHelper.getControlValue('layoutControlGroup5', 'GRINDING_END_TIME');
        if (value == null || value == undefined) {
            erFormHelper.setControlValueEx('layoutControlGroup5', {
                GRINDING_END_TIME: new Date()
            });
        }
      }
    if (e.srcElement.innerText == '外弧结束') {
        const value = erFormHelper.getControlValue('layoutControlGroup5', 'GRINDING_OUTER_END_TIME');
        if (value == null || value == undefined) {
            erFormHelper.setControlValueEx('layoutControlGroup5', {
                GRINDING_OUTER_END_TIME: new Date()
            });
        }
      }
};

    return {
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO,
      F3_DO,
      closeEfDialog,
      efFormInitialized,
      lay,
      query_zx,
      query_edit_xc,
      insert_zx,
      layout_valueChanged1,
      layout_valueChanged3,
      layout_valueChanged5,
      layout_valueChanged6
    };
  }
});
