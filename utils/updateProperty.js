import axios from 'axios';

export const updateProperty = async (formData) => {
    try {
         // Generate UUID properly
        const { data } = await axios.put('https://xplodev.com/webproj/updateproperty.php', {
            "postid": formData.postId,
            "amount": formData.price,
            "bedrooms": formData.rooms,
            "washrooms": formData.baths,
            "area": formData.area,
            "title": formData.title,
            "desc": formData.description,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // console.log("updateProperty called with formData:", data);

     
        
    } catch (error) {
        console.error("Error in updateProperty:", error);
        return false;
    }
}
