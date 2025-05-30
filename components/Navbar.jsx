import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { fetchApiForRent } from '../utils/fetchProperties';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Flex,
  Box,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
  useDisclosure,
  HStack,
} from '@chakra-ui/react';
import { FcMenu, FcHome, FcAbout, FcPortraitMode } from 'react-icons/fc';
import { BsSearch } from 'react-icons/bs';
import { FiKey } from 'react-icons/fi';

import { userLoginAPI, userRegisterAPI } from '../utils/userRegistration';
const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [authMode, setAuthMode] = useState('signin');

  // Load user from localStorage on component mount
  useEffect(async() => {
    await fetchApiForRent()
      .then((data) => console.log(data))
      .catch((error) => console.error('Error fetching properties:', error));
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuthMenuClick = () => {
    onOpen();
  };

const userLogin = async (email, password) => {
  try {
    const response = await userLoginAPI(email, password);
    
    
    const data = response;
    
    // Check for success (your PHP returns 'status' not 'success')
    if (data && data.status === true) {
      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin || false,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      onClose();
      router.push(`/profile/${userData.id}`);
    } else {
      // Show the actual error message from PHP
      alert(data.message || 'Login failed');
      console.log('Login failed:', data.message);
    }
  } catch (error) {
    console.log('Login error details:', error);
    console.log('Error response:', error.response?.data);
    
    // Better error message handling
    let errorMessage = 'An error occurred during login';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.status) {
      errorMessage = `Server error: ${error.response.status}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(errorMessage);
  }
};

const userRegister=async (name, email, password) => {
  console.log('Registering user:', { name, email, password });
  try {
    const response = await userRegisterAPI(name, email, password);
    
    const data = response;
    // Check for success (your PHP returns 'status' not 'success')
    if (data && data.status === true) {
      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin || false,
      };
      setUser(userData);
      console.log('User registered successfully:', userData);
      localStorage.setItem('user', JSON.stringify(userData));
      onClose();
userLogin(email, password)
      // router.push(`/profile/${userData.id}`);
    } else {
      // Show the actual error message from PHP
      alert(data.message || 'Registration failed');
      console.log('Registration failed:', data.message);
    }
  } catch (error) {
    console.log('Registration error details:', error);
    console.log('Error response:', error.response?.data);
    
    // Better error message handling
    let errorMessage = 'An error occurred during registration';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.status) {
      errorMessage = `Server error: ${error.response.status}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(errorMessage);
  }
}
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    onClose();
    router.push('/');
  };

  const goToProfile = () => {
    router.push(`/profile/${user?.id}`);
  };

  return (
    <>
      <Flex p="2" borderBottom="1px" borderColor="gray.100" alignItems="center">
        <Box fontSize="3xl" color="blue.400" fontWeight="bold">
          <Link href="/" passHref>
            <Box as="a" paddingLeft="2" cursor="pointer">
              ER-States
            </Box>
          </Link>
        </Box>
        <Spacer />
        <Box>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FcMenu />}
              variant="outline"
              color="red.400"
            />
            <MenuList>
              <Link href="/" passHref>
                <MenuItem icon={<FcHome />}>Home</MenuItem>
              </Link>
              <Link href="/search" passHref>
                <MenuItem icon={<BsSearch />}>Search</MenuItem>
              </Link>
              <Link href="/search?purpose=Buy" passHref>
                <MenuItem icon={<FcAbout />}>Buy Property</MenuItem>
              </Link>
              <Link href="/search?purpose=Rent" passHref>
                <MenuItem icon={<FiKey />}>Rent Property</MenuItem>
              </Link>

              {user ? (
                <>
                  <MenuItem onClick={goToProfile} icon={<FcPortraitMode />}>
                    {user?.name}
                  </MenuItem>
                  <MenuItem onClick={handleLogout} icon={<FcAbout />}>
                    Logout
                  </MenuItem>
                </>
              ) : (
                <MenuItem
                  onClick={() => {
                    setAuthMode('signin');
                    handleAuthMenuClick();
                  }}
                  icon={<FcAbout />}
                >
                  Sign In / Sign Up
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Box>
      </Flex>

      {/* Modal for Sign In / Sign Up */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <HStack spacing={4} mb={4} justifyContent="center">
              <Button
                onClick={() => setAuthMode('signin')}
                colorScheme={authMode === 'signin' ? 'blue' : 'gray'}
                variant={authMode === 'signin' ? 'solid' : 'outline'}
              >
                Sign In
              </Button>
              <Button
                onClick={() => setAuthMode('signup')}
                colorScheme={authMode === 'signup' ? 'blue' : 'gray'}
                variant={authMode === 'signup' ? 'solid' : 'outline'}
              >
                Sign Up
              </Button>
            </HStack>

            {authMode === 'signin' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.preventDefault();
                  const email = e.target[0].value;
                  const password = e.target[1].value;
                  userLogin(email, password);
                }}
              >
                <FormControl mb={3}>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="Enter your email" required />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="Enter your password" required />
                </FormControl>
                <Button colorScheme="blue" width="full" mt={4} type="submit">
                  Sign In
                </Button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = e.target[0].value;
                   const email = e.target[1].value;
                  const password = e.target[2].value;
                  userRegister(name,email, password);
                }}
              >
                <FormControl mb={3}>
                  <FormLabel>Full Name</FormLabel>
                  <Input type="text" placeholder="Enter your full name" required />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="Enter your email" required />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="Create a password" required />
                </FormControl>
                <Button colorScheme="blue" width="full" mt={4} type="submit">
                  Sign Up
                </Button>
              </form>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;
