import QrCode from 'qrcode'


export const generateQrCod  = async ( data:string ) =>{
    try {
        const qrCode = await QrCode.toDataURL(data, { type:'image/png', margin: 0 });
        return qrCode;
    } catch (error) {   
        console.error(error);
        
    }
}