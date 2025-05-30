import { Box, Flex, Spacer, Text } from '@chakra-ui/layout';
import { Avatar } from '@chakra-ui/avatar';
import { FaBed, FaBath } from 'react-icons/fa';
import { BsGridFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';
import millify from 'millify';
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser'; // <-- Import EmailJS
import { useRouter } from 'next/router';

import { baseUrl, fetchApi,fetchApiByID } from '../../utils/fetchProperties';
import ImageScrollbar from '../../components/ImageScrollbar';

const PropertyDetails = ({
  propertyDetails: {
    price, rentFrequency, rooms, title, baths, area, agency, isVerified, description, type, purpose, furnishingStatus, amenities, photos
  }
  
}) => {
  // EmailJS form logic
  const formRef = useRef();
  const [emailStatus, setEmailStatus] = useState('');
  const router = useRouter();
  const propertyId = router.query.id;

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(
      'service_qthbdms', // replace with your EmailJS service ID
      'template_e91jl68', // replace with your EmailJS template ID
      formRef.current,
      'WUZjkG19ufx27eTz5' // replace with your EmailJS public key
    )
      .then((result) => {
        setEmailStatus('Message sent!');
      }, (error) => {
        setEmailStatus('Failed to send message.');
      });
  };

  return (
    <Box maxWidth='1000px' margin='auto' p='4'>
      {photos && <ImageScrollbar data={photos} />}
      <Box w='full' p='6'>
        <Flex paddingTop='2' alignItems='center'>
          <Box paddingRight='3' color='green.400'>{isVerified && <GoVerified />}</Box>
          <Text fontWeight='bold' fontSize='lg'>
            AUD {price} {rentFrequency && ` / ${rentFrequency}`}
          </Text>
          <Spacer />
          <Avatar size='sm' src={agency?.logo?.url}></Avatar>
        </Flex>
        <Flex alignItems='center' p='1' justifyContent='space-between' w='250px' color='blue.400'>
          {rooms}<FaBed /> | {baths} <FaBath /> | {area} sqft <BsGridFill />
        </Flex>
      </Box>
      <Flex marginTop='2' gap={8} alignItems="flex-start">
        {/* Description Box */}
        <Box flex="2" pr={8}>
          <Text fontSize='lg' marginBottom='2' fontWeight='bold'>{title}</Text>
          <Text lineHeight='2' color='gray.600'>{description}</Text>
        </Box>
        {/* EmailJS Contact Form */}
        <Box flex="1" p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="gray.50">
          <form ref={formRef} onSubmit={sendEmail}>
            <Text fontWeight="bold" mb={2}>Contact Agent</Text>

            {/* Property ID field unchangeable */}
            <Box mb={2} >
            <input
              type="text"
              name="property_id"
              value={propertyId || ''}
              readOnly
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                background: '#f5f5f5',
                color: '#888'
              }}
              tabIndex={-1}
            />
            </Box>

            <Box mb={2}>
              <input
                type="text"
                name="user_name"
                placeholder="Your Name"
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </Box>
            <Box mb={2}>
              <input
                type="email"
                name="user_email"
                placeholder="Your Email"
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </Box>
            <Box mb={2}>
              <textarea
                name="message"
                placeholder="Your Message"
                required
                rows={4}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </Box>
            <button
              type="submit"
              style={{
                background: '#3182ce',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
            {emailStatus && (
              <Text mt={2} color={emailStatus === 'Message sent!' ? 'green.500' : 'red.500'}>
                {emailStatus}
              </Text>
            )}
          </form>
        </Box>
      </Flex>
      <Flex flexWrap='wrap' textTransform='uppercase' justifyContent='space-between'>
        <Flex justifyContent='space-between' w='400px' borderBottom='1px' borderColor='gray.100' p='3'>
          <Text>Type</Text>
          <Text fontWeight='bold'>{type}</Text>
        </Flex>
        <Flex justifyContent='space-between' w='400px' borderBottom='1px' borderColor='gray.100' p='3'>
          <Text>Purpose</Text>
          <Text fontWeight='bold'>{purpose}</Text>
        </Flex>
        {furnishingStatus && (
          <Flex justifyContent='space-between' w='400px' borderBottom='1px' borderColor='gray.100' p='3' >
            <Text>Furnishing Status</Text>
            <Text fontWeight='bold'>{furnishingStatus}</Text>
          </Flex>
        )}
      </Flex>
      <Box>
        {amenities.length && <Text fontSize='2xl' fontWeight='black' marginTop='5'>Facilites:</Text>}
        <Flex flexWrap='wrap'>
          {amenities?.map((amenity) => (
              <Text key={amenity.name} fontWeight='bold' color='blue.400' fontSize='l' p='2' bg='gray.200' m='1' borderRadius='5'>
                {amenity.name}
              </Text>
            
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default PropertyDetails;

// ...existing getServerSideProps...

export async function getServerSideProps({ params: { id } }) {
  const data = await fetchApiByID(id);

  return {
    props: {
      propertyDetails: data?.data,
    },
  };
}
