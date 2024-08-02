import * as cheerio from "cheerio";
import publicAxios from "../services/api";
const useMetaData = () =>{
    const fetchMetaData = async (url:string)=>{
        try {
            const respnse = await fetch(url);
            const content = await respnse.text();
            // const response  = await publicAxios(url, { withCredentials:true})
            // const content = response?.data
            const $ = cheerio.load(content);
            const head = $('head');

            return head;
            return content
    


        } catch (error) {
            console.error("Metadata fetch error", error);
            
        }
    }

    return fetchMetaData
}


export default useMetaData;