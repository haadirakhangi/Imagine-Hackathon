import React from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useColorModeValue,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Navbar } from '../../components/navbar';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  gender: yup.string().required('Gender is required'),
  highestEducation: yup.string().required('Highest education is required'),
  dreamJob: yup.string().required('Dream job is required'),
  topSkills: yup.string().required('Please list your top 5 skills'),
  resume: yup
    .mixed()
    .required('Please upload your resume in PDF format')
    .test('fileFormat', 'Only PDF files are allowed', value =>
      value && value[0] && value[0].type === 'application/pdf'
    ),
});

const StudentRegister = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('full_name', data.fullName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('gender', data.gender);
      formData.append('highest_education', data.highestEducation);
      formData.append('dream_job', data.dreamJob);
      formData.append('top_skills', data.topSkills);
      formData.append('resume', data.resume[0]);

      const response = await axios.post('/api/student/register', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.response) {
        toast({
          title: 'Account created.',
          description: "We've created your account. You can log in now!",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: 'User already exists. Please use a different email.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while creating the account.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <Flex bg={useColorModeValue('purple.200', 'purple.800')} direction="column" width='full' align='center' justifyContent='center' minHeight={"100vh"}>
        <Text fontSize="4xl"
          fontWeight="bold"
          color={useColorModeValue('purple.800', 'purple.100')}
          mb={4}
          mt={8}
        >
          Teacher Registration
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
            p={6}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors.fullName} mb={4}>
                <FormLabel>Full Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  {...register('fullName')}
                />
                <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email} mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password} mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...register('password')}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword} mb={4}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Re-enter your password"
                  {...register('confirmPassword')}
                />
                <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.gender} mb={4}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup>
                  <Stack direction="row">
                    <Radio value="male" {...register('gender')}>
                      Male
                    </Radio>
                    <Radio value="female" {...register('gender')}>
                      Female
                    </Radio>
                    <Radio value="other" {...register('gender')}>
                      Other
                    </Radio>
                  </Stack>
                </RadioGroup>
                <FormErrorMessage>{errors.gender?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.highestEducation} mb={4}>
                <FormLabel>Highest Education</FormLabel>
                <RadioGroup>
                  <Stack direction="column">
                    <Radio value="High School (10th grade)" {...register('highestEducation')}>
                      High School (10th grade)
                    </Radio>
                    <Radio
                      value="Higher Secondary (12th grade) or Diploma"
                      {...register('highestEducation')}
                    >
                      Higher Secondary (12th grade) or Diploma
                    </Radio>
                    <Radio value="Undergraduate Degree" {...register('highestEducation')}>
                      Undergraduate Degree
                    </Radio>
                    <Radio value="Postgraduate Degree" {...register('highestEducation')}>
                      Postgraduate Degree
                    </Radio>
                  </Stack>
                </RadioGroup>
                <FormErrorMessage>{errors.highestEducation?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.dreamJob} mb={4}>
                <FormLabel>Dream Job</FormLabel>
                <Input
                  type="text"
                  placeholder="Example: Google, Microsoft"
                  {...register('dreamJob')}
                />
                <FormErrorMessage>{errors.dreamJob?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.topSkills} mb={4}>
                <FormLabel>Top 5 Skills</FormLabel>
                <Input
                  type="text"
                  placeholder="E.g., JavaScript, Python, AI, etc."
                  {...register('topSkills')}
                />
                <FormErrorMessage>{errors.topSkills?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.resume} mb={4}>
                <FormLabel>Resume (PDF only)</FormLabel>
                <Input type="file" accept="application/pdf" {...register('resume')} />
                <FormErrorMessage>{errors.resume?.message}</FormErrorMessage>
              </FormControl>

              <Button type="submit" colorScheme="purple" width="full" mt={4}>
                Submit
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    </div>
  );
};

export default StudentRegister;
