import React, { useState, useRef, useEffect } from 'react';
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
  IconButton,
  Center,
  Text,
  Tooltip,
  Select,
  Checkbox,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  RadioGroup,
  Radio,
  Stack
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../../components/navbar';
import { SubmoduleModal } from './submoduleModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  course_description: yup.string().required('Course Description is required'),
  links: yup.array().of(yup.string().url('Invalid URL')),
  skill_name: yup.string().required('Skill name is required'),
  course_type: yup.string().required('Course type is required'),
  skill_area: yup.string().required('Skill area is required'),
});

const LessonCreate = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [includeImages, setIncludeImages] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submodules, setSubmodules] = useState<Record<string, string>>({});
  const [links, setLinks] = useState<string[]>([]);
  const [webSearch, setWebSearch] = useState<boolean>(false);
  const lessonNameInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      course_description: '',
      course_type: '',
      skill_name: '',
      skill_area: '',
      links: [],
    },
  });

  useEffect(() => {
    if (lessonNameInputRef.current) {
      lessonNameInputRef.current.focus();
    }
  }, []);

  const handleAddLink = () => {
    setLinks([...links, '']);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: { [key: string]: any }) => {
    const formData = new FormData();
    formData.append('skill_area', data.skill_area || '');
    formData.append('skill_name', data.skill_name || '');
    formData.append('course_description', data.course_description);
    formData.append('course_type', data.course_type);
    formData.append('links', JSON.stringify(links));
    formData.append('includeImages', includeImages.toString());
    if(webSearch!= null){
      formData.append('search_web', webSearch.toString());
    }

    if (pdfFile) {
      formData.append('files[]', pdfFile);
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/company/multimodal-rag-submodules', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.submodules) {
        setSubmodules(response.data.submodules);
        setIsModalOpen(true);
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

  const handleModalSubmit = async (updatedSubmodules: Record<string, string>) => {
    try {
      const response = await axios.post('/api/company/update-submodules', updatedSubmodules);

      if (response.status === 200) {
        toast({
          title: 'Submodules updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/company/course');
      } else {
        throw new Error('Failed to update submodules.');
      }
    } catch (error) {
      toast({
        title: 'Failed to update submodules.',
        description: 'An error occurred while updating submodules.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Navbar />
          <Flex justify="center" align="center" width="100vw" height="90vh" textAlign="center">
            <VStack>
              <Spinner size="xl" color="purple.500" />
              <Heading>Generating Lessons...</Heading>
            </VStack>
          </Flex>
        </>
      ) : (
        <Box bg="purple.200" minHeight={'100vh'} minWidth={'100vw'}>
          <Navbar />
          <Box width={'full'} display="flex" alignItems="center" justifyContent="center" p={10}>
            <Box maxWidth="5xl" bg="white" width="100%" p={10} borderWidth={1} borderRadius="xl" boxShadow="lg">
              <Center>
                <Text className='main-heading' fontSize={"5xl"} color={"purple.600"}>
                  <b>Generate Course</b>
                </Text>
              </Center>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction={['column', 'row']} justify="space-between" gap={6}>
                  {/* Left Section */}
                  <VStack width={['full', '45%']} spacing={6} align="stretch">

                  <FormControl isInvalid={!!errors.skill_area} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Skill Area:</b></FormLabel>
                      <Input
                        placeholder="Ex. Programming Language"
                        {...register('skill_area')}
                        ref={lessonNameInputRef}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}/>
                    </FormControl>



                    <FormControl isInvalid={!!errors.skill_name} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Skill Name:</b></FormLabel>
                      <Input
                        placeholder="Ex. Python"
                        {...register('skill_name')}
                        ref={lessonNameInputRef}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}/>
                    </FormControl>


                    <FormControl isInvalid={!!errors.course_description} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Course Description</b></FormLabel>
                      <Input
                        placeholder="Describe the lesson"
                        {...register('course_description')}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}
                      />
                      <FormErrorMessage>{errors.course_description?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.course_type} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Course Type</b></FormLabel>
                      <Select
                        placeholder="Select lesson type"
                        {...register('course_type')}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}
                      >
                        <option value="theoretical">Theoretical</option>
                        <option value="mathematical">Mathematical</option>
                        <option value="practical">Practical</option>
                      </Select>
                      <FormErrorMessage>{errors.course_type?.message}</FormErrorMessage>
                    </FormControl>
                  </VStack>

                  {/* Right Section */}
                  <VStack width={['full', '45%']} spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Upload Course Related PDFs</b></FormLabel>
                      <Input
                        type="file"
                        borderColor={'purple.600'}
                        p={1}
                        multiple={true}
                        _hover={{ borderColor: "purple.600" }}
                        accept=".pdf"
                        onChange={handleFileChange}
                      />
                    </FormControl>

                    <FormLabel m={0} as="legend" className='feature-heading' letterSpacing={2}><b>Select Search Method</b></FormLabel>
                    <RadioGroup value={webSearch === true ? 'web' : webSearch === false ? 'links' : 'none'}
                      onChange={(value) => {
                        if (value === 'web') {
                          setWebSearch(true);
                        } else if (value === 'links') {
                          setWebSearch(false);
                        } else if (value === 'none') {
                          setWebSearch(null);
                        }
                      }} 
                      colorScheme='purple'>
                      <Stack>
                        <Radio value="none">None</Radio>
                        <Radio value="web" isChecked={webSearch}>Web Search</Radio>
                        <Radio value="links" isChecked={!webSearch}>Links</Radio>
                      </Stack>
                    </RadioGroup>
                    {webSearch !== null && !webSearch && (
                      <FormControl>
                        <FormLabel className='feature-heading' letterSpacing={2}><b>Links</b></FormLabel>
                        {links.map((link, index) => (
                          <Box key={index} display="flex" alignItems="center" mb={2}>
                            <Input
                              placeholder={`Enter link ${index + 1}`}
                              value={link}
                              onChange={(e) => handleLinkChange(index, e.target.value)}
                              borderColor={'purple.600'}
                              _hover={{ borderColor: "purple.600" }}
                            />
                            <Tooltip label="Delete Link">
                              <IconButton
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                size="sm"
                                ml={2}
                                aria-label="Delete Link"
                                onClick={() => handleRemoveLink(index)}
                              />
                            </Tooltip>
                          </Box>
                        ))}
                        <Tooltip label="Add new Link">
                          <IconButton
                            icon={<AddIcon />}
                            onClick={handleAddLink}
                            aria-label="Add Link"
                          />
                        </Tooltip>
                      </FormControl>
                    )}


                    {(pdfFile || links.some(link => link.trim() !== '')) && (
                      <FormControl display="flex" alignItems="center" mt={4}>
                        <Checkbox
                          isChecked={includeImages}
                          size={'lg'}
                          borderColor={"purple.700"}
                          _focus={{ outline: 'none', boxShadow: 'none' }}
                          variant={"solid"}
                          onChange={(e) => setIncludeImages(e.target.checked)}
                          colorScheme="purple"
                          className='feature-heading'
                          letterSpacing={2}
                        >
                          <b>Include Images</b>
                        </Checkbox>
                      </FormControl>
                    )}
                  </VStack>
                </Flex>
                <Button colorScheme="purple" _hover={{ bg: useColorModeValue('purple.600', 'purple.800'), color: useColorModeValue('white', 'white') }} variant="outline" type="submit" width="full" mt={4}>
                  Generate Base Course
                </Button>
              </form>
            </Box>
          </Box>
        </Box>
      )}
      <SubmoduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSubmodules={submodules}
        onSubmit={handleModalSubmit}
      />
    </>
  );
}

export default LessonCreate;