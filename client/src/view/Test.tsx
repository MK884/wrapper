import Button from '../ui/Button';
import Avatar, { AvatarGroup } from '../ui/Avatar';
import Switch from '../ui/Switch';
import TextInput from '../ui/TextInput';

import ToolMenu from '../ui/ToolMenuWrapper';
import MainMenu from '../components/MainMenu';

import style from "../styles/test.module.scss"
import { BarLoader, ColorLoader, Loader } from '../ui';

const Test = () => {
    return (
        <div
            
            className={style['test']}
        >
          {/* <Loader /> */}
          {/* <BarLoader /> */}
          <ColorLoader />

            {/* <Switch /> */}
            {/* <TextInput placeholder="Enter your Name" type="text" />
            <Avatar
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww"
                string="khalid"
            />
            <AvatarGroup avatars={avatars} />
            <Button label="Test" Icon={FaRegTrashAlt} variant="warning" />
            <Button label="Test" Icon={FaRegTrashAlt} variant="success" />
            <Button label="Test" Icon={FaRegTrashAlt} variant="danger" />
            <Button label="Test" Icon={FaRegTrashAlt} /> */}
            {/* <MainMenu /> */}
  
        </div>
    );
};

export default Test;
