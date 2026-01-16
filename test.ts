import { ObjktClient } from "./objkt";

ObjktClient.getLastAudios(0, 4).then((audios) => {
    console.log(audios);
});