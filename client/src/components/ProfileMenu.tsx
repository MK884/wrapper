import React from 'react'
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { Avatar, Divider, ToolMenuWrapper, ToolOptions } from 'ui';

const ProfileMenu = () => {
  return (
    <div>
        <ToolMenuWrapper direction='rtl' header={<Avatar size='sm'/>}>
            <ToolOptions label='My Profile' Icon={CgProfile}/>
            <ToolOptions label='Settings' Icon={IoSettingsOutline}/>
            <Divider />
            <ToolOptions label='Logout' Icon={IoLogOutOutline} IconStyles={{
                color:'#D72D39'
            }}/>
        </ToolMenuWrapper>
    </div>
  )
}

export default ProfileMenu