import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Flex, Text, RadioGroup, Radio, VStack, Progress } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface Question {
  skill_area: string;
  question: string;
  options: string[];
  answer: string;
}

const QuizPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [knowledgeQuestions, setKnowledgeQuestions] = useState<Question[]>([]);
  const [knowledgeResponses, setKnowledgeResponses] = useState<{ skill_area: string; question: string; answer: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [knowledgeScore, setKnowledgeScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/student/knowledge-assessment');
        setKnowledgeQuestions(response.data.quiz_questions);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        toast({
          title: 'Failed to load questions.',
          description: 'Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchQuestions();
  }, [toast]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    if (timeLeft === 0) {
      handleNext('None');
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleNext = (defaultAnswer: string = selectedOption) => {
    if (!defaultAnswer) {
      toast({
        title: 'Please select an option before proceeding.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const currentQuestion = knowledgeQuestions[currentQuestionIndex];
    setKnowledgeResponses((prev) => [
      ...prev,
      {
        skill_area: currentQuestion.skill_area,
        question: currentQuestion.question,
        answer: defaultAnswer,
      },
    ]);

    if (defaultAnswer === currentQuestion.answer) {
      setKnowledgeScore(knowledgeScore + 1);
    }

    setSelectedOption('');
    setTimeLeft(60);

    if (currentQuestionIndex < knowledgeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const knowledgeScores = knowledgeQuestions.reduce((acc, question, index) => {
        acc[question.skill_area] = acc[question.skill_area] || { score: 0, maxScore: 0 };
        acc[question.skill_area].maxScore += 1;
        const response = knowledgeResponses[index];
        if (response && response.answer === question.answer) {
          acc[question.skill_area].score += 1;
        }
        return acc;
      }, {} as Record<string, { score: number; maxScore: number }>);

      await axios.post(
        '/api/student/submit-technical-quiz',
        {
          knowledgeScores,
        },
        { withCredentials: true }
      );

      Swal.fire({
        title: 'Congratulations!',
        text: 'Your technical assessment has been submitted successfully.',
        icon: 'success',
        confirmButtonText: 'Next',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/student/assessment');
        }
      });
    } catch (error) {
      toast({
        title: 'Failed to submit quiz.',
        description: 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isSubmitting) {
    return (
      <Flex direction="column" align="center" justify="center" h="100vh" bg="gray.100">
        <Text fontSize="xl" color="purple.700">
          {isSubmitting ? 'Submitting your quiz...' : 'Generating questions...'}
        </Text>
        <Progress size="sm" isIndeterminate colorScheme="purple" w="100%" />
      </Flex>
    );
  }

  const currentQuestion = knowledgeQuestions[currentQuestionIndex];

  return (
    <Flex direction="column" align="center" justify="center" position="relative" h="100vh" bg="gray.100">
      <Text fontSize="xl" fontWeight="bold" color="purple.700" position="absolute" top="20px">
        Time Left: {timeLeft}s
      </Text>
      <Box w="85%" mx="auto" mt="50px" p="6" boxShadow="lg" bg="white" borderRadius="md">
        <Progress value={(timeLeft / 60) * 100} colorScheme="purple" size="sm" borderRadius="md" mb="4" />

        <Text fontSize="2xl" fontWeight="bold" mb="4" color="purple.700">
          Technical Skill Quiz
        </Text>

        <Text fontSize="lg" mb="2" color="purple.600">
          <strong>{currentQuestionIndex + 1}.</strong> {currentQuestion.question}
        </Text>

        <RadioGroup onChange={handleOptionChange} value={selectedOption}>
          <VStack spacing={4} align="start">
            {currentQuestion.options.map((option, index) => (
              <Radio key={index} value={option} colorScheme="purple">
                {`${index + 1}. ${option}`}
              </Radio>
            ))}
          </VStack>
        </RadioGroup>

        <Box mt="6" textAlign="center">
          <Button colorScheme="purple" onClick={() => handleNext()}>
            {currentQuestionIndex === knowledgeQuestions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default QuizPage;
