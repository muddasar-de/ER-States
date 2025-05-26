import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
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

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [authMode, setAuthMode] = useState('signin');

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuthMenuClick = () => {
    onOpen();
  };

  const handleDummyLogin = async (email, password ) => {
  try {
    // const params = new URLSearchParams();
    // params.append('email', email);
    // params.append('password', password);

     const response = await axios.post(
      'https://xplodev.com/webproj/login_user.php',
      {
        email: 'ali@example.com',
        password: '123456'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        }
      }
    );
    console.log(response);
    const data = await response.json();
      if (data && data.success) {
        // Adjust according to your API's response structure
        const userData = {
          id: data.id || "323651",
          name: data.name || 'John Doe',
          email: data.email || email,
          isAdmin: data.isAdmin || true,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        onClose();
        router.push(`/profile/${userData.id}`);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Login error');
    }
  };
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
              <Link href="/search?purpose=for-sale" passHref>
                <MenuItem icon={<FcAbout />}>Buy Property</MenuItem>
              </Link>
              <Link href="/search?purpose=for-rent" passHref>
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
                  handleDummyLogin(email, password);
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
                  handleDummyLogin();
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
