/*
 * @Author: wqjiao
 * @Date: 2019-05-07 11:03:22
 * @Last Modified by: wqjiao
 * @Last Modified time: 2019-05-10 15:29:57
 * @Description: BasicBar 基本柱状图
 */
import React from 'react';
import {Chart, Geom, Axis, Tooltip, Label} from 'bizcharts';

class BasicBar extends React.Component {
    render() {
        const {x, y, data, name, padding = [30, 'auto', 'auto', 'auto'], hasLabel} = this.props;
        // const count = data && data.length;
        const width = document.body.clientWidth;
        const cols = {
            [x]: {
                type: 'cat',
                tickCount: width < 1366 ? 5 : null, // 设置坐标轴上刻度点的个数
                // range: [1 / (2 * count - 1), 1 - 1 / (2 * count - 1)], // 输出数据的范围
            },
            [y]: {
                min: 0,
                // tickInterval: 20
            },
        };
        // 提示信息
        const tooltip = [
            `${x}*${y}`,
            (x, y) => {
                return {
                    title: x,
                    name: name,
                    value: y,
                };
            },
        ];
        const labelX = {
            offset: 50, // 与坐标轴线的距离
            rotate: 30,
            formatter(text) {
                return `${text.slice(0, 10)}\n${text.slice(10, 20)}\n${text.slice(
                    20,
                    text.length
                )}`;
            }, // 坐标文案换行
        };
        const color = 'rgba(24, 144, 255, 0.85)';

        return (
            <Chart height={400} data={data} scale={cols} forceFit placeholder padding={padding}>
                <Axis name={x} label={labelX} />
                <Axis name={y} />
                <Tooltip crosshairs={false} />
                <Geom type="interval" position={`${x}*${y}`} color={color} tooltip={tooltip}>
                    {hasLabel && (
                        <Label
                            content="interval"
                            formatter={(val, item) => {
                                return item.point[y];
                            }}
                        />
                    )}
                </Geom>
            </Chart>
        );
    }
}

export default BasicBar;
