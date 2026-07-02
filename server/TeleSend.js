import axios from 'axios';


export const TeleSned = () => {

    const Send = async (des) => {
        const body = {
          content: "Hacker",
          tts: false,
          color: "white",
          embeds: [
            {
              title: " مدونة زاجل ",
              description: des,
           },
          ],
    };
            
        await axios.post("https://discord.com/api/webhooks/1451531321435492453/ME4NDKIyzYsmCeRiodqcFERBn6LLPB6XR89JtNoawJJt1iX3v5uD9-TqIGAu4pZR3zus",body)
             
    }
  return {
    Send,
}
}

export default TeleSned;