import { register, login, logout, refreshAccessToken, updateAvatar, updateUser, deleteUser } from "./user.controller";
import { getMetaData, getAllShortUrlOfUser, getAllStaticsByProjectId, shortUrl, getShortLink, deleteUrl, getTotalClicks } from "./url.controller";
export {
    register,
    login,
    logout,
    refreshAccessToken,
    updateAvatar,
    updateUser,
    deleteUser,
    getMetaData,
    getAllShortUrlOfUser,
    getAllStaticsByProjectId,
    getShortLink, 
    shortUrl,
    deleteUrl,
    getTotalClicks
}