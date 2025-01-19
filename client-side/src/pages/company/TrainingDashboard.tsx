import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  Flex,
  Spinner,
  IconButton,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Switch,
} from '@chakra-ui/react';
import { Navbar } from '../../components/navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import { IoMdMore } from "react-icons/io";

type TrainingProgram = {
  id: string;
  job_role: string;
  program_code: string;
  job_description: string;
};

const TeacherDashboard = () => {
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const appliedEmails = ['email1', 'email2', 'email3'];

  useEffect(() => {
    const fetchTrainingPrograms = async () => {
      try {
        const response = await axios.get('/api/company/get-training-program');
        setTrainingPrograms(response.data.programs);
      } catch (error) {
        console.error('Error fetching training programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingPrograms();
  }, []);

  const handleViewSessions = (program: TrainingProgram) => {
    localStorage.setItem('program_name', program.job_role);
    localStorage.setItem('program_id', program.id);
    navigate('/company/dashboard');
  };

  const handleCopyProgramCode = (programCode: string) => {
    navigator.clipboard.writeText(programCode).then(() => {
      toast({
        title: 'Program Code Copied!',
        description: `Program code ${programCode} has been copied to clipboard.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }).catch((error) => {
      toast({
        title: 'Failed to Copy',
        description: 'An error occurred while copying the program code.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const handleCreateProgram = async () => {
    try {
      const response = await axios.post('/api/company/new-training-program', {
        jobRole,
        jobDescription,
        requiredSkills,
      });
      toast({
        title: 'Training Program Created!',
        description: 'Your training program has been successfully created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTrainingPrograms((prev) => [...prev, response.data.newProgram]);
      setIsModalOpen(false);
      setJobRole('');
      setJobDescription('');
      setRequiredSkills('');
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Failed to Create Program',
        description: 'An error occurred while creating the training program.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="90vh">
        <Spinner size="xl" color="purple.500" />
        <Heading ml={4}>Fetching Training Programs...</Heading>
      </Flex>
    );
  }

  return (
    <div>
      <Navbar />
      <Box p={5} position="relative">
        <Flex justify="space-between" alignItems="center" mb={6}>
          <Heading textAlign="center" color="purple.600">
            My Training Programs
          </Heading>
          <Button colorScheme="purple" onClick={() => setIsModalOpen(true)}>
            Create New Training Program
          </Button>
        </Flex>

        {trainingPrograms.length === 0 ? (
          <Flex justify="center" align="center" height="50vh">
            <Heading color="gray.500" size="lg">
              No training programs created yet.
            </Heading>
          </Flex>
        ) : (
          <Grid gap={6} templateColumns="repeat(auto-fit, minmax(250px, 0.2fr))">
            {trainingPrograms.map((program) => (
              <Box
                key={program.id}
                position="relative"
                p={5}
                borderWidth="1px"
                borderRadius="lg"
                bg={useColorModeValue('gray.100', 'gray.700')}
                color={useColorModeValue('gray.700', 'gray.100')}
                boxShadow="lg"
                maxWidth="350px"
              >
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Text fontWeight="bold" fontSize="lg" color="purple.500">
                    {program.job_role}
                  </Text>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<IoMdMore />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      {/* <MenuItem onClick={() => handleDeleteProgram(program.id)}>Delete Program</MenuItem> */}
                      <MenuItem display={"flex"} ><Text width={"full"}>Delete Program</Text>                  <IconButton
                    aria-label="Delete Course"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    // onClick={() => handleDeleteCourse(course.id)}
                  /></MenuItem>
                      <MenuItem>
                        <Box width={"full"}>
                          <Text fontSize="sm" fontWeight="bold">Applied Emails:</Text>
                          {appliedEmails.map((email, index) => (
                            <Flex key={index} alignItems="center" width={"full"} justifyContent="space-between" mt={2}>
                              <Text fontSize="sm" width={"full"}>{email}</Text>
                              <Flex gap={2}>
                                <IconButton
                                  aria-label="Approve"
                                  icon={<CheckIcon />}
                                  size="xs"
                                  colorScheme="green"
                                // onClick={() => handleApproveEmail(email)}
                                />
                                <IconButton
                                  aria-label="Reject"
                                  icon={<CloseIcon />}
                                  size="xs"
                                  colorScheme="red"
                                // onClick={() => handleRejectEmail(email)}
                                />
                              </Flex>
                            </Flex>
                          ))}
                        </Box>

                      </MenuItem>
                        <MenuItem>                  <Flex alignItems="center">
                          <Text fontSize="sm" mr={2}>
                            Private
                          </Text>
                          <Switch
                            colorScheme="purple"
                          // onChange={() => handlePrivacyToggle(course.id)}
                          // isChecked={course.isPublic}
                          />
                          <Text fontSize="sm" ml={2}>
                            Public
                          </Text>
                        </Flex></MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>

                <VStack align="start" spacing={3} flex="1">
                  <Text fontSize="sm">
                    <b>Program Code: </b>
                    <Text
                      as="span"
                      fontWeight="bold"
                      color="purple.600"
                      cursor="pointer"
                      onClick={() => handleCopyProgramCode(program.program_code)}
                    >
                      {program.program_code}
                    </Text>
                  </Text>
                  <Text fontSize="sm" noOfLines={3}>
                    <b>Job Description:</b> {program.job_description}
                  </Text>

                </VStack>

                <Button
                  size="sm"
                  width="100%"
                  bg="purple.600"
                  color="white"
                  _hover={{ bg: "purple.500" }}
                  mt={3}
                  onClick={() => handleViewSessions(program)}
                >
                  Generate Training Program
                </Button>
              </Box>
            ))}
          </Grid>
        )}

        {/* Modal for creating new training program */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Training Program</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Input
                  placeholder="Job Role"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                />
                <Textarea
                  placeholder="Job Description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <Input
                  placeholder="Required Skills (comma-separated)"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="purple" onClick={handleCreateProgram}>
                Create
              </Button>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} ml={3}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </div>
  );
};

export default TeacherDashboard;
