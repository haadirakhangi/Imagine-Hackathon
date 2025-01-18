import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Input,
  Flex,
  Spinner,
  Button,
  FormControl,
  FormLabel,
  Center,
  Text,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  HStack,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../../components/navbar';
import { useDisclosure } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import * as yup from 'yup';

const schema = yup.object().shape({
  NumLects: yup.string().required('Number of lectures is required'),
});

type LessonData = {
  [key: string]: string;
};

const CourseCreate = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [lessonData, setLessonData] = useState<LessonData>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [courseTopics, setCourseTopics] = useState('');

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      NumLects: '',
    },
  });

  useEffect(() => {
    const fetchRequiredSkills = async () => {
      const programId = localStorage.getItem('program_id');

      if (!programId) {
        toast({
          title: 'Error',
          description: 'Program ID not found in local storage.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        const response = await axios.get('/api/company/get-program-info', {
          params: { program_id: programId },
        });
        setRequiredSkills(response.data.required_skills || []);
      } catch (error) {
        toast({
          title: 'Error fetching required skills',
          description: 'Failed to fetch required skills for the program.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchRequiredSkills();
  }, [toast]);

  const onSubmit = async (data: { [key: string]: any }) => {
    const programId = localStorage.getItem('program_id');
    if (!programId) {
      toast({
        title: 'Error',
        description: 'Program ID not found in local storage.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('program_id', programId);
    formData.append('required_skill', selectedSkill);
    formData.append('num_lectures', data.NumLects);
    formData.append('course_topics', courseTopics);

    setLoading(true);

    try {
      const response = await axios.post('/api/company/generate-course', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.response) {
        setLessonData(response.data.lessons);
        onOpen();
      } else {
        toast({
          title: 'Failed to create lesson',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      const programId = localStorage.getItem('program_id');
      if (!programId) return;

      const values = getValues();
      formData.append('program_id', programId);
      formData.append('required_skill', selectedSkill);
      formData.append('num_lectures', values.NumLects);
      formData.append('lessons', JSON.stringify(lessonData));

      const response = await axios.post('/api/company/create-course', formData);
      localStorage.setItem('course_name', response.data.course_name);
      localStorage.setItem('course_id', response.data.course_id);

      if (response.status === 200) {
        toast({
          title: 'Lessons and Course saved successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/company/scheduler');
      } else {
        toast({
          title: 'Failed to save lessons',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred while saving lessons',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (key: keyof LessonData, value: LessonData[keyof LessonData]) => {
    setLessonData((prevData) => ({ ...prevData, [key]: value }));
  };

  const reorderLessons = (index: number, direction: number) => {
    const entries = Object.entries(lessonData);
    if (index + direction < 0 || index + direction >= entries.length) {
      return;
    }
    const [removed] = entries.splice(index, 1);
    entries.splice(index + direction, 0, removed);
    setLessonData(Object.fromEntries(entries));
  };

  return (
    <>
      {loading ? (
        <>
          <Navbar />
          <Flex justify="center" align="center" width="100vw" height="90vh" textAlign="center">
            <VStack>
              <Spinner size="xl" color="purple.500" />
              <Heading>Generating Lesson Plan...</Heading>
            </VStack>
          </Flex>
        </>
      ) : (
        <>
          <Box bg="purple.200" minHeight="100vh" minWidth="100vw">
            <Navbar />
            <Box display="flex" alignItems="center" justifyContent="center" p={10}>
              <Box maxWidth="5xl" bg="white" width="40%" p={10} borderWidth={1} borderRadius="xl" boxShadow="lg">
                <Center>
                  <Text className="main-heading" fontSize="5xl" color="purple.600">
                    <b>Generate Course</b>
                  </Text>
                </Center>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl mb="5" isRequired>
                    <FormLabel className="feature-heading" letterSpacing={2}>
                      <b>Required Skills:</b>
                    </FormLabel>
                    <Select
                      placeholder="Select a skill"
                      value={selectedSkill}
                      onChange={(e) => setSelectedSkill(e.target.value)}
                      borderColor="purple.600"
                      _hover={{ borderColor: 'purple.600' }}
                    >
                      {requiredSkills.map((skill, index) => (
                        <option key={index} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl mb="5" isInvalid={!!errors.NumLects} isRequired>
                    <FormLabel className="feature-heading" letterSpacing={2}>
                      <b>Minimum Number of Lectures:</b>
                    </FormLabel>
                    <Input
                      placeholder="Enter the number of lectures"
                      {...register('NumLects')}
                      borderColor="purple.600"
                      _hover={{ borderColor: 'purple.600' }}
                    />
                    <FormErrorMessage>{errors.NumLects?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl mb="5" isRequired>
                    <FormLabel className="feature-heading" letterSpacing={2}>
                      <b>Enter Course Topics</b>
                    </FormLabel>
                    <Textarea
                      placeholder="Start typing..."
                      value={courseTopics}
                      onChange={(e) => setCourseTopics(e.target.value)}
                      borderColor="purple.600"
                      _hover={{ borderColor: 'purple.600' }}
                    />
                  </FormControl>

                  <Button
                    colorScheme="purple"
                    _hover={{ bg: useColorModeValue('purple.600', 'purple.800'), color: useColorModeValue('white', 'white') }}
                    variant="outline"
                    type="submit"
                    width="full"
                    mt={4}
                  >
                    Generate Base Lesson
                  </Button>
                </form>
              </Box>
            </Box>
          </Box>
          <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalOverlay />
            <ModalContent height="90vh" overflow="scroll">
              <ModalHeader>Edit Lessons</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  {Object.entries(lessonData).map(([lesson, description], index) => (
                    <HStack key={lesson} spacing={4} alignItems="center">
                      <VStack align="stretch" flex="1" p={5}>
                        <HStack key={lesson} spacing={4} alignItems="center">
                          <Text fontWeight="bold" color="purple.600">
                            {index + 1}.
                          </Text>
                          <Input
                            value={lesson}
                            onChange={(e) => handleEdit(e.target.value, description)}
                            placeholder="Lesson Name"
                          />
                        </HStack>

                        <Textarea
                          value={description}
                          ml={8}
                          onChange={(e) => handleEdit(lesson, e.target.value)}
                          placeholder="Lesson Description"
                        />
                      </VStack>
                      <VStack spacing={1}>
                        <IconButton
                          icon={<ArrowUpIcon />}
                          onClick={() => reorderLessons(index, -1)}
                          isDisabled={index === 0}
                          aria-label="Move Up"
                        />
                        <IconButton
                          icon={<ArrowDownIcon />}
                          onClick={() => reorderLessons(index, 1)}
                          isDisabled={index === Object.entries(lessonData).length - 1}
                          aria-label="Move Down"
                        />
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="purple" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default CourseCreate;
