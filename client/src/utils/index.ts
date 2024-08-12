import QrCode from 'qrcode'


const generateQrCod  = async ( data:string ) =>{
    try {
        const qrCode = await QrCode.toDataURL(data, { type:'image/png', margin: 1 });
        return qrCode;
    } catch (error) {   
        console.error(error);
        
    }
}

function isValidHttpsUrl(url: string) {
    try {
        const parsedUrl = new URL(url);
        return (
            parsedUrl.protocol === 'https:' &&
            !parsedUrl.hostname.includes('localhost') &&
            parsedUrl.hostname !== '127.0.0.1'
        );
    } catch (error) {
        return false;
    }
}


export { generateQrCod, isValidHttpsUrl}