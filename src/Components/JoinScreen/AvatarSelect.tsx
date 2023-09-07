import Select, { SelectChangeEvent } from '@mui/material/Select';

import ElephantCircus from '../../assets/avatars/elephant-circus.png'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import KawaiiDinosaur from '../../assets/avatars/kawaii-dinosaur.png'
import MenuItem from '@mui/material/MenuItem';
import RubberDuck from '../../assets/avatars/rubber-duck.png'
import SantasLittleHelper from '../../assets/avatars/santas-little-helper.png'
import { styled } from '@mui/material/styles';
import { useState } from 'react'

export const avatarsMap: Record<string, string> = {
  ['Elephant Circus']: ElephantCircus, 
  ['Kawaii Dinosaur']: KawaiiDinosaur, 
  ['Rubber Duck']: RubberDuck, 
  ['Santas Little Helper']: SantasLittleHelper
}
const avatars = Object.keys(avatarsMap)

const AvatarIcon = styled('img')(() => ({
    width: '75%',
    height: 'auto',
}));

const StyledFormControl = styled(FormControl)(() => ({
  margin: '10px',
}))

type AvatarType = keyof typeof avatarsMap

type OwnPropsT = {
  setPlayerAvatar: (avatar: AvatarType) => void
}

export default function AvatarSelect({ setPlayerAvatar }: OwnPropsT) {
  const [avatar, setAvatar] = useState<AvatarType>('Elephant Circus')
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
        >
          {avatars.map((avatar, idx) => {
            return(
              <MenuItem value={avatar} key={idx}><AvatarIcon src={avatarsMap[avatar]}/></MenuItem>
            )
          })}
        </Select>
      </StyledFormControl>
    </div>
  );
}