import Select, { SelectChangeEvent } from '@mui/material/Select';

import ChillWatermelon from '../../assets/lottie/icons/Chill-Watermelon.json'
import DancingBear from '../../assets/lottie/icons/Dancing-Bear.json'
import ExtraLongNeckGiraffe from '../../assets/lottie/icons/Extra-Long-Neck-Giraffe.json'
import FormControl from '@mui/material/FormControl';
import HappyTrashCan from '../../assets/lottie/icons/Happy-Trash-Can.json'
import HelloRobot from '../../assets/lottie/icons/Hello-Robot.json'
import InputLabel from '@mui/material/InputLabel';
import Lottie from 'lottie-react'
import LoungingFox from '../../assets/lottie/icons/Lounging-Fox.json'
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { useState } from 'react'

export const avatarsMap: Record<string, any> = {
  'Lounging Fox': LoungingFox,
  'Hello Robot': HelloRobot,
  'Happy Trash Can': HappyTrashCan,
  'Extra-Long-Neck-Giraffe': ExtraLongNeckGiraffe,
  'Dancing Bear': DancingBear,
  'Chill Watermelon': ChillWatermelon
}

const avatars = Object.keys(avatarsMap)

const StyledFormControl = styled(FormControl)(() => ({
  margin: '10px',
  width:'8vw',
  minWidth: '75px',
  maxWidth: '100px'
}))

type AvatarType = keyof typeof avatarsMap

type OwnPropsT = {
  setPlayerAvatar: (avatar: AvatarType) => void
}

export default function AvatarSelect({ setPlayerAvatar }: OwnPropsT) {
  const [avatar, setAvatar] = useState<AvatarType>('Lounging Fox')
  const [open, setOpen] = useState(false);

  const handleChange = (event: SelectChangeEvent<typeof avatar>) => {
    setAvatar(event.target.value);
    setPlayerAvatar(event.target.value)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <StyledFormControl>
        <InputLabel>Avatar</InputLabel>
        <Select
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={avatar}
          label="Avatar"
          onChange={handleChange}
          MenuProps={{
            PaperProps: {
              style: {
                width: '8vw',
                minWidth: '75px',
                maxWidth: '100px'
              },
            },
          }}
        >
          {avatars.map((avatar, idx) => <MenuItem value={avatar} key={idx}><Lottie animationData={avatarsMap[avatar]}/></MenuItem>)}
        </Select>
      </StyledFormControl>
    </div>
  );
}