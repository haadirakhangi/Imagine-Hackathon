import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useColorModeValue,
  useToast,
  Text,
} from "@chakra-ui/react";
import { Navbar } from '../../components/navbar';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";

const schema = yup.object().shape({
  companyName: yup.string().required("Company name is required"),
  userName: yup.string().required("User name is required"),
  companyMail: yup
    .string()
    .email("Please provide a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters.")
    .required("Password is required"),
  companyLogo: yup.mixed().test("fileType", "Only image files are allowed", (value) => {
    if (!value.length) return false;
    const fileType = value[0]?.type;
    return ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"].includes(fileType);
  }),
});

const SingleStepRegister = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('company_name', data.companyName);
      formData.append('user_name', data.userName);
      formData.append('company_mail', data.companyMail);
      formData.append('password', data.password);
      formData.append('company_logo', data.companyLogo[0]);

      const response = await axios.post('/api/company/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.response) {
        toast({
          title: 'Registration successful!',
          description: 'Your account has been created.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Registration failed.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during registration.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <Navbar />
      <Flex
        bg={useColorModeValue('purple.200', 'purple.800')}
        direction="column"
        width='full'
        align='center'
        justifyContent='center'
        minHeight="100vh"
      >
        <Text
          fontSize="4xl"
          fontWeight="bold"
          color={useColorModeValue('purple.800', 'purple.100')}
          mb={4}
          mt={8}
        >
          Company Registration
        </Text>
        <Box
          bg={useColorModeValue('purple.200', 'purple.800')}
          minHeight="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={4}
          width={'100%'}
        >
          <Box
            rounded="lg"
            bg={useColorModeValue('white', 'gray.900')}
            shadow="lg"
            width={'50%'}
            borderColor={useColorModeValue('purple.400', 'gray.900')}
            p={6}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors.companyName} mb="4%">
                <FormLabel>Company Name</FormLabel>
                <Input placeholder="Company name" {...register("companyName")} />
                <FormErrorMessage>{errors.companyName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.userName} mb="4%">
                <FormLabel>User Name</FormLabel>
                <Input placeholder="User name" {...register("userName")} />
                <FormErrorMessage>{errors.userName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.companyMail} mb="4%">
                <FormLabel>Email Address</FormLabel>
                <Input placeholder="Email address" {...register("companyMail")} />
                <FormErrorMessage>{errors.companyMail?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password} mb="4%">
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder="Enter password" {...register("password")} />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.companyLogo} mb="4%">
                <FormLabel>Company Logo</FormLabel>
                <Input type="file" accept="image/*" {...register("companyLogo")} />
                <FormErrorMessage>{errors.companyLogo?.message}</FormErrorMessage>
              </FormControl>

              <Button type="submit" colorScheme="purple" mt={4} width="full">
                Register
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    </div>
  );
};

export default SingleStepRegister;
