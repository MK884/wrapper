import React from 'react';
import style from '../styles/chart/barChart.module.scss';
import { FaDesktop } from 'react-icons/fa';
import { CiMobile1 } from 'react-icons/ci';
import { IoTabletLandscapeOutline } from 'react-icons/io5';
import { LuTv } from 'react-icons/lu';
import { CountryNameToCode } from '../constant';

type BarColors = 'green' | 'yellow' | 'purple' | 'pink' | 'accent' | 'blue';
const color: BarColors[] = [
    'green',
    'yellow',
    'purple',
    'blue',
    'pink',
    'accent',
];

const deviceIons: { [key: string]: JSX.Element } = {
    desktop: <FaDesktop />,
    mobile: <CiMobile1 />,
    smarttv: <LuTv />,
    tablet: <IoTabletLandscapeOutline />,
};

interface Data {
    [key: string]: number | string;
}

const BarChart = ({
    data,
    isLocation = false,
}: {
    data: Data;
    isLocation?: boolean;
}) => {
    if (!Object.keys(data).length) return <>No devices</>;

    return (
        <div className={style['wrapper']}>
            {isLocation
                ? Object.keys(data).map((item, idx) => {
                      let randomIdx = Math.floor(Math.random() * 6);
                      
                      return (
                          <>
                              <div
                                  className={`${style['bar-wrapper']} ${style[color[idx % 6]]}`}
                                  key={item}
                              >
                                  <div
                                      className={style['bar']}
                                      data-bg="#dcfce7"
                                  >
                                      {/* <img
                                        //   src={`https://flagcdn.com/16x12/${CountryNameToCode['india']?.toLowerCase()}.png`}
                                          src={`https://flagsapi.com/${CountryNameToCode[item]}/shiny/24.png`}
                                          alt="flag"
                                      /> */}
                                      <span>{item}</span>
                                  </div>
                                  <div className={style['clicks']}>
                                      {data[item]}
                                  </div>
                              </div>
                          </>
                      );
                  })
                : Object.keys(data).map((item, idx) => {
                      let randomIdx = Math.floor(Math.random() * 6);
                      return (
                          <>
                              <div
                                  className={`${style['bar-wrapper']} ${style[color[idx % 6]]}`}
                                  key={item}
                              >
                                  <div
                                      className={style['bar']}
                                      data-bg="#dcfce7"
                                  >
                                      {deviceIons[item]}
                                      <span>{item}</span>
                                  </div>
                                  <div className={style['clicks']}>
                                      {data[item]}
                                  </div>
                              </div>
                          </>
                      );
                  })}
        </div>
    );
};

export default BarChart;
