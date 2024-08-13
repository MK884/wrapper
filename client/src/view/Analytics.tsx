import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { usePrivateAxios } from '../services/api';
import { getStatsByProjectId } from '../services/urls';


// {
//     "_id": "66b1df1b2c9d1f868521acc9",
//     "projectId": "66b0ee8d45e979b5c8065ab1",
//     "projectType": "Url",
//     "city": "Mumbai",
//     "country": "India",
//     "region": "Maharashtra",
//     "device": "desktop",
//     "createdAt": "2024-08-06T08:30:19.829Z",
//     "updatedAt": "2024-08-06T08:30:19.829Z",
//     "__v": 0
// },


interface Stats {
    _id: string,
    projectId:string,
    projectType:string,
    city?:string,
    country?:string,
    region?:string,
    device?:string,
    createdAt?:string,
    updatedAt?:string,
}

const Analytics = () => {
    const { projectId } = useParams();

    const privateAxios = usePrivateAxios();

    const location = useLocation();

    if(location?.state) console.log(location.state)

    const [totalClicks, setTotalClicks] = React.useState<number>(0);
    const [statas, setStats] = React.useState<Stats[] | []>([]);


    const devices: { [key: string]:number} = {};
    const countrys: { [key: string]:number} = {};
    const citys: { [key: string]:number} = {};
    const regions: { [key: string]:number} = {};

    statas.length && statas.forEach(item=>{
        let device = item?.device;

        if(device){
            if(devices[device]){
                devices[device] +=1 
            }else{
                devices[device] = 1
            }
        }

        let city = item?.city;


        if(city){
            if(citys[city]){
                citys[city] +=1
            }else{
                citys[city] =1
            }
        }


        let country = item?.country;

        
        if(country){
            if(countrys[country]){
                countrys[country] +=1
            }else{
                countrys[country] =1
            }
        }

        let region = item?.region;

         if(region){
            if(regions[region]){
                regions[region] +=1
            }else{
                regions[region]=1
            }
        }

    })

    console.log("Devices => ",devices);
    console.log("Countrys => ",countrys);
    console.log("Citys => ",citys);
    console.log("Regions => ", regions);
    

    React.useEffect(() => {

        const getStats = async () => {
            if (!projectId) return;

            try {
                const stats = await getStatsByProjectId(
                    projectId,
                    privateAxios
                );

                setTotalClicks(stats.data.clicks);
                setStats(stats.data.statics);
            } catch (error) {
                console.error(error);
            }
        };

        getStats();
    }, []);

    return (
        <div>
            {projectId}
            <p>clicks : {totalClicks}</p>
            
        </div>
    );
};

export default Analytics;
