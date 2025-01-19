import React, { useState } from 'react';
import {
  Box, Stack, Heading, Image, Card, CardBody, CardFooter, Button, Divider, ButtonGroup, Flex, Text
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import courseraLogo from '../assets/cards/coursera.png'; // Import Coursera icon
import upgradLogo from '../assets/cards/upgrad.jpg'; // Import upGrad icon

interface CourseCardProps {
  source: string;
  title: string;
  logo: string; // Base64 string for the logo
  link: string;
  job_description: string;
  job_role: string;
  program_code: string;
}

const RecommendedCard: React.FC<CourseCardProps> = ({ source, title, logo, link, job_description, job_role, program_code }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Map source names to their corresponding icons
  const sourceIcons: { [key: string]: string } = {
    Coursera: courseraLogo,
    upGrad: upgradLogo,
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <Box boxShadow='lg' rounded='md' position="relative" w="85%" overflow="hidden">
      <Card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <CardBody>
          <Flex direction="column" justify="space-between">
            <Image
              src={`data:image/png;base64,${logo}`} // Use the logo prop directly
              alt='Course Logo'
              borderRadius='lg'
              h="230px"
              objectFit="scale-down" // Ensure the logo fits nicely within the space
            />

            <Stack mt='3' spacing='3'>
              <Stack direction="row" align="center" spacing="2">
                <Heading size='md'>{title}</Heading>
              </Stack>
              <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                <strong>Role:</strong> {job_role}
              </Text>
              <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                <strong>Description:</strong> {job_description}
              </Text>
              <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                <strong>Program Code:</strong> {program_code}
              </Text>
            </Stack>
          </Flex>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing='2' justifyContent="center">
            <Button
              as="a"
              href={link}
              target="_blank"
              variant='solid'
              bg={'purple.400'}
              color={useColorModeValue('white', 'white')}
              _hover={{
                bg: useColorModeValue('purple.600', 'purple.600'),
                color: useColorModeValue('white', 'white'),
                transform: "scale(1.05)",
              }}
            >
              Start Learning
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </Box>
  );
};

export default RecommendedCard;
