import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  NumberInput,
  NumberInputField,
  VStack,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useBreakpointValue,
  Select,
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid'; // Corrected import

// import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import UploadDropzone from './imgUpload/uploadToCloudinary';
import { insertProperty,insertGallery } from '../../utils/insertProperty';
// import { baseUrl, fetchApi } from '../utils/fetchApi';
import { fetchApiForSale, fetchApiForRent } from '../../utils/fetchProperties';
import { deleteProperty } from '../../utils/deleteProperty';
const Profile = () => {
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingIndex, setEditingIndex] = useState(null);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    // coverPhoto: '',
    galleryPhotos: [],
    price: '',
    description: '',
    purpose: '', // Default purpose
    // rentFrequency: '',
    rooms: '',
    title: '',
    baths: '',
    area: '',
    agency: '',
    isVerified: false,
    // externalID: '',
  });
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);
    fetchData()
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      if (storedUser?.isAdmin) {
        fetchData()
      }

    }
  }, []);

  const fetchData = async () => {
    try {
      const propertyForSale = await fetchApiForSale();
      const propertyForRent = await fetchApiForRent();
      console.log('Fetched properties for sale:', propertyForSale?.data);
      setProperties(() => [...propertyForSale?.data, ...propertyForRent?.data]);
      console.log('Fetched properties:', propertyForSale?.data, propertyForRent?.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };
  console.log("Properties", properties);
  const resetForm = () => {
    setForm({
       title: '',
      description : '',

      baths: '',
      area: '',
      rooms: '',
      price: '',
    purpose: '',
      // coverPhoto: '',
      galleryPhotos: [],
      // rentFrequency: '',
     
      // agency: '',
      isVerified: true,
      // externalID: '',
    });
    setEditingIndex(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNumberChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = (e) => {
  const postId = generateFourDigitNumber();

    e.preventDefault();
    // if (editingIndex !== null) {
      const updatedProperties = [...properties];
      updatedProperties[editingIndex] = form;
      alert("Property updated successfully");
      insertProperty({postId, ...form}).then((data) => {
        insertGallery(postId, form.galleryPhotos).then((galleryResponse) => {
          if (galleryResponse) {  console.log("Gallery images inserted successfully");
          } else {  console.error("Failed to insert gallery images");}
        }).catch((galleryError) => {  console.error("Error inserting gallery images:", galleryError);});
        console.log("Property inserted:", data)
      }).catch((error) => {
        console.error("Error inserting property:", error);})
      setProperties(updatedProperties);
    // } else {
    //   setProperties([...properties, form]);
    // }
    console.log("Form submitted:", form);
    resetForm();
    onClose();
  };

  const handleEdit = (index) => {
    setForm(properties[index]);
    setEditingIndex(index);
    onOpen();
  };

  const handleDelete = (index) => {
    console.log("Deleting property at index:", index);
    console.log("Current properties before deletion:", properties[index].id);
    deleteProperty(properties[index].id).then((response) => {
      console.log("Delete response:", response);}).catch((error) => {
      console.error("Error deleting property:", error);});
    const updated = properties.filter((_, i) => i !== index);
    setProperties(updated);
  };

function generateFourDigitNumber() {
  return Math.floor(Math.random() * 9000) + 1000;
}
  return (
    <Box p="6" maxWidth="1000px" mx="auto">
      <Heading mb="6">Profile</Heading>

      <Box mb="6" p="4" borderWidth="1px" borderRadius="md" boxShadow="sm">
        <Text fontWeight="bold" fontSize="xl" mb="2">{user?.name}</Text>
        <Text>Email: {user?.email}</Text>
        {/* <Text>Role: {user?.role}</Text> */}
      </Box>

      {user?.isAdmin && (
        <Button colorScheme="blue" onClick={() => { resetForm(); onOpen(); }} mb="6" >
          Upload Property
        </Button>
      )}

      {/* Responsive Table */}
      <Box overflowX="auto" mb={6}>
        <Table variant="striped" size={useBreakpointValue({ base: "sm", md: "md" })}>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Price</Th>
              <Th>Rooms</Th>
              <Th>Baths</Th>
              <Th>Area</Th>
              {/* <Th>Agency</Th> */}
              {/* <Th>Verified</Th> */}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {properties.map((property, index) => (
              <Tr key={index}>
                <Td>{property.title}</Td>
                <Td>{property.price}</Td>
                <Td>{property.rooms}</Td>
                <Td>{property.baths}</Td>
                <Td>{property.area}</Td>
                {/* <Td>{property.agency}</Td> */}
                {/* <Td>{property.isVerified ? 'Yes' : 'No'}</Td> */}
                <Td>
                  <IconButton
                    icon={<FaEdit />}
                    mr={2}
                    onClick={() => handleEdit(index)}
                    size="sm"
                    colorScheme="teal"
                    aria-label="Edit"
                  />


                  <IconButton
                    icon={<MdDelete />}
                    onClick={() => handleDelete(index)}
                    size="sm"
                    colorScheme="red"
                    aria-label="Delete"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>


      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent my="2rem">
          <ModalHeader>{editingIndex !== null ? 'Edit Property' : 'Upload Property'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxH="60vh" overflowY="auto">
            <form id="upload-property-form" onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">

                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input name="title" value={form.title} onChange={handleChange} placeholder="Property title" />
                </FormControl>
       <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Input name="description" value={form.description} onChange={handleChange} placeholder="Property description" />
                </FormControl>
 <Box maxW="sm" mx="auto" mt={10}>
  <FormLabel>Purpose</FormLabel>
      <Select placeholder="Select option" onChange={handleChange} value={form.purpose}  name="purpose" isRequired>
        <option value="For Sale">Buy</option>
        <option value="For Rent">Rent</option>
      </Select>
    </Box>

                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <NumberInput min={0} value={form.price} onChange={(value) => handleNumberChange('price', value)}>
                    <NumberInputField name="price" placeholder="Enter price" />
                  </NumberInput>
                </FormControl>
                {/* <FormControl isRequired>
                  <FormLabel>Rent Frequency</FormLabel>
                  <Input name="rentFrequency" value={form.rentFrequency} onChange={handleChange} placeholder="e.g., monthly, yearly" />
                </FormControl> */}
                <FormControl isRequired>
                  <FormLabel>Rooms</FormLabel>
                  <NumberInput min={0} value={form.rooms} onChange={(value) => handleNumberChange('rooms', value)}>
                    <NumberInputField name="rooms" placeholder="Number of rooms" />
                  </NumberInput>
                </FormControl>


                <FormControl isRequired>
                  <FormLabel>Baths</FormLabel>
                  <NumberInput min={0} value={form.baths} onChange={(value) => handleNumberChange('baths', value)}>
                    <NumberInputField name="baths" placeholder="Number of baths" />
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Area (sq ft)</FormLabel>
                  <NumberInput min={0} value={form.area} onChange={(value) => handleNumberChange('area', value)}>
                    <NumberInputField name="area" placeholder="Area in square feet" />
                  </NumberInput>
                </FormControl>
                {/* <FormControl isRequired>
                  <FormLabel>Agency</FormLabel>

                  <Input name="agency" value={form.agency} onChange={handleChange} placeholder="Agency name" />
                </FormControl>*/}
                 <FormControl>
                  <Checkbox name="isVerified" isChecked={form.isVerified} onChange={handleChange}>Verified Property</Checkbox>
                 </FormControl>
                {/*   <FormControl isRequired>
                  <FormLabel>External ID</FormLabel>
                  <Input name="externalID" value={form.externalID} onChange={handleChange} placeholder="External property ID" />
                </FormControl> */}

                {/* {editingIndex == null && (
                  <FormControl>
                    <FormLabel>Cover Photo</FormLabel>
                    <UploadDropzone
                      onUploadComplete={(urls) => {
                        if (urls && urls.length > 0) {
                          console.log("Cover photo URL:", urls[0]);
                          setForm(prev => ({
                            ...prev,
                            coverPhoto: urls[0]
                          }));
                        }
                      }}
                      multiple={false}
                    />
                    {form.coverPhoto && (
                      <Box mt={2}>
                        <img
                          src={form.coverPhoto}
                          alt="Cover Preview"
                          style={{ maxWidth: '100%', maxHeight: 150 }}
                          onError={(e) => {
                            console.error("Failed to load image:", form.coverPhoto);
                            e.target.src = "https://via.placeholder.com/150?text=Error";
                          }}
                        />
                      </Box>
                    )}
                  </FormControl>)} */}
                {editingIndex == null && (
                  <FormControl>
                    <FormLabel>Gallery Photos</FormLabel>
                    <UploadDropzone
                      onUploadComplete={(urls) => {
                        if (urls && urls.length > 0) {
                          console.log("Gallery photo URLs:", urls);
                          setForm(prev => ({
                            ...prev,
                            galleryPhotos: [...(prev.galleryPhotos || []), ...urls]
                          }));
                        }
                      }}
                      multiple={true}
                      endpoint="propertyGallery"
                    />
                    {form.galleryPhotos && form.galleryPhotos.length > 0 && (
                      <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                        {form.galleryPhotos.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Gallery Preview ${idx + 1}`}
                            style={{ maxWidth: 100, maxHeight: 100, objectFit: 'cover' }}
                          />
                        ))}
                      </Box>
                    )}
                  </FormControl>

                )}
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit" form="upload-property-form">
              {editingIndex !== null ? 'Update' : 'Submit'}
            </Button>
            <Button onClick={() => { onClose(); resetForm(); }}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Profile
