/**
 * 功能描述：鱼雷罐铁水成分查询
 * 界面代码：MMSM11AS2N
 * 创建人：李晓明
 * 创建时间：2024年3月8日16点37分
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
import * as echarts from "echarts";

export default defineComponent({
    name: 'MMSM11AS2N',
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
        const array_x = reactive(new Array);
        const array_x1 = reactive(new Array);
        const array_x2 = reactive(new Array);
        const array_x3 = reactive(new Array);
        const array_y = reactive(new Array);
        const array_y1 = reactive(new Array);
        const array_y2 = reactive(new Array);
        const array_y3 = reactive(new Array);
        const initializeFlag = ref(0);
        const state = reactive({
            option: {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['铁包1','铁包2','鱼雷罐1', '鱼雷罐2']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: array_x
                },
                {
                    type: 'category',
                    data: array_x3,

                },
                {
                    type: 'category',
                    data: array_x1,

                },
                {
                    type: 'category',
                    data: array_x2,

                }
                ],
                yAxis: {},
                series: [
                    {
                        name: '铁包1',
                        type: 'line',
                        data: array_y,
                        smooth: true
                    },
                    {
                        name: '铁包2',
                        type: 'line',
                        data: array_y3,
                        smooth: true
                    },
                    {
                        name: '鱼雷罐1',
                        type: 'line',
                        data: array_y1,
                        smooth: true
                    },

                    {
                        name: '鱼雷罐2',
                        type: 'line',
                        data: array_y2,
                        smooth: true
                    },
                ]
            }
        })
        let formPartition: string;
        let formName = "MMSM11Q";

        //界面加载方法
        const efFormReady = (e: any) => {
            efFormInfo.value = e.formInfo;
            formPartition = efFormInfo.value.formPartition;     // 分区

            initializePage();
        }

        const initializePage = async () => {
            // 获取各个数据轴数据
            const initialResult = await erFormHelper.Initialize(
                formPartition,
                formName,
                "",
                ""
            );

            if ((initialResult).flag > 0) {
                initializeFlag.value = 1;
                nextTick(() => {
                    nextTick(() => {
                        initData();
                    });
                });
            } else {
                erFormHelper.messageError(
                    'ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!'
                );
            }
        }

        const initData = async () => {
            array_x.length=0;
            array_x1.length=0;
            array_x2.length=0;
            array_x3.length=0;
            array_y.length=0;
            array_y1.length=0;
            array_y2.length=0;
            array_y3.length=0;
            const inInfo = new EI.EIInfo();
            const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
            inInfo.addBlock(eiBlock, 'Table0');
            const outInfo = await erFormHelper.callService('mmsm11q_inq', inInfo, false, false,true);
            if (outInfo.sys.status < 0) {
                //维护完成重新查询
                erFormHelper.messageError('查询错误：' + outInfo.sys.msg);
                return false;
            } else {
                for (let i = 0; i < outInfo.getBlock(0).data.length; i++) {
                    if (outInfo.getBlock(0).data[i]["ITEM_NAME"] == "Hm1Wgt") {
                        array_x.push(outInfo.getBlock(0).data[i]['TIME_STAMP']);
                        array_y.push(outInfo.getBlock(0).data[i]['ITEM_VALUE']);
                    }
                    if (outInfo.getBlock(0).data[i]["ITEM_NAME"] == "Ladle1Wgt") {
                        array_x1.push(outInfo.getBlock(0).data[i]['TIME_STAMP']);
                        array_y1.push(outInfo.getBlock(0).data[i]['ITEM_VALUE']);
                    }
                    if (outInfo.getBlock(0).data[i]["ITEM_NAME"] == "Ladle2Wgt") {
                        array_x2.push(outInfo.getBlock(0).data[i]['TIME_STAMP']);
                        array_y2.push(outInfo.getBlock(0).data[i]['ITEM_VALUE']);
                    }
                    if (outInfo.getBlock(0).data[i]["ITEM_NAME"] == "Hm2Wgt") {
                        array_x3.push(outInfo.getBlock(0).data[i]['TIME_STAMP']);
                        array_y3.push(outInfo.getBlock(0).data[i]['ITEM_VALUE']);
                    }
                }
            }
            initeCharts();
        }
        const initeCharts = () => {
            let myChart = echarts.init(document.getElementById("myChart"));
            // 绘制图表
            myChart.setOption(state.option);
        };
        //F2点击事件
        const F2_DO = async (e: any) => {
            initData();
        }


        return {
            initializeFlag,
            erFormHelper,
            efFormReady,
            F2_DO, state

        }
    }
});
