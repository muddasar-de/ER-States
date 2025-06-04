// const id = require('uuid');
// import axios from 'axios';
// export const insertProperty = async (formData) => {
//     try {
        
//     } catch (error) {
        
//     }
//   const { data } = await axios.post(`https://xplodev.com/webproj/insertProperty.php`,  {
//     "postid": id,
//     "amount": formData.price,
//     "bedrooms": formData.rooms,
//     "washrooms": formData.baths,
//     "area": formData.area,
//     "p_pic_url": "https://cdn-icons-png.flaticon.com/512/149/149071.png",
//     "title": formData.title,
//     "desc": formData.description,
//     "type": "House",
//     "purpose": formData.purpose,
//     "furnishing_status": "Semi-Furnished"
//     } ,

//     {
//     headers: {
//       'Content-Type': 'application/json'
//     },

 
//   });
//   console.log("insertProperty called with formData:", data);

//      if (data.status === 'success') {
//               const { data } = await axios.post(`https://xplodev.com/webproj/insertGallery.php`,  {
//                 "sImg_Url": "www.example.com",
//                 "i_PostId": id
//               },
//               {
//                 headers: {
//                   'Content-Type': 'application/json'
//                 },
//               });
//   console.log("Inserted Gallery called with formData:", data);

//             return true;
//         } else {
//             return false;
//         }
// }


import { v4 as uuidv4 } from 'uuid'; // Corrected import
import axios from 'axios';

export const insertProperty = async (formData) => {
    try {
         // Generate UUID properly
        const { data } = await axios.post(`https://xplodev.com/webproj/insertProperty.php`, {
            "postid": formData.postId,
            "amount": formData.price,
            "bedrooms": formData.rooms,
            "washrooms": formData.baths,
            "area": formData.area,
            "p_pic_url": "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            "title": formData.title,
            "desc": formData.description,
            "type": "House",
            "purpose": formData.purpose,
            "furnishing_status": "Semi-Furnished"
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log("insertProperty called with formData:", data);

     
        
    } catch (error) {
        console.error("Error in insertProperty:", error);
        return false;
    }
}

export const insertGallery = async (postId, imageUrl) => {
    try {
        console.log("insertGallery called with postId:", postId);
        console.log("imageUrl array:", imageUrl);
        
        // Check if imageUrl is an array
        if (!Array.isArray(imageUrl)) {
            console.error("imageUrl should be an array");
            return false;
        }
        
        const results = [];
        
        // Loop through each image URL and make API call
        for (let i = 0; i < imageUrl.length; i++) {
            try {
                const { data } = await axios.post(`https://xplodev.com/webproj/insertGallerynew.php`, {
                    "sImg_Url": imageUrl[i], // Use actual image URL from array
                    "i_PostId": postId
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log(`Image ${i + 1} inserted:`, data);
                results.push(data.success || data.status === 'success');
                
            } catch (singleError) {
                console.error(`Error inserting image ${i + 1}:`, singleError);
                results.push(false);
            }
        }
        
        // Return true if all insertions were successful
        const allSuccessful = results.every(result => result === true);
        console.log("All insertions successful:", allSuccessful);
        
        return allSuccessful;
        
    } catch (error) {
        console.error("Error in insertGallery:", error);
        return false;
    }
}