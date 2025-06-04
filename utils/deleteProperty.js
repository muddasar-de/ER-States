import axios from 'axios';

export const deleteProperty = async (id) => {
    try {
         // Generate UUID properly
        const { data } = await axios.post(`https://xplodev.com/webproj/DeletePost.php`, {
          "postid"  : id,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return data.status === 'success';
     
        
    } catch (error) {
        console.error("Error in insertProperty:", error);
        return false;
    }
}