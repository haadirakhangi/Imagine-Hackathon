import React, { useState, useEffect } from 'react';
import {
    ChakraProvider,
    Box,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    theme,
    extendTheme,
    Text,
    VStack,
    Progress,
    Center,
    useToast,
    Stack,
    Heading
} from '@chakra-ui/react';
import { Navbar } from '../../components/navbar';
import axios from 'axios';
import { UserProfile } from './UserProfile';
import { SkillAssess } from './SkillAssess';
import { RecommendCourses } from './RecommendCourses';
import JobRoleCard from '../../components/JobRoleCard';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import NeedleChart from '../../components/NeedleChart'

interface UserData {
    full_name: string;
    age: string;
    gender: string;
    email: string;
    soft_skill_assessment: {
        quiz: {
            summary: string;
            observations: { [key: string]: string };
            recommendations: { [key: string]: string };
        },
        roleplay: {}[];
    };
    technical_assessment: {
        knowledgeScores: { [key: string]: { score: number; maxScore: number } };
        interestScores: { [key: string]: { score: number; maxScore: number } };
    }
    required_skills: { [key: string]: number };
}

const purpleTheme = extendTheme({
    ...theme,
    colors: {
        ...theme.colors,
        purple: {
            ...theme.colors.purple,
            500: '#805AD5',
        },
    },
});


const Dashboard = () => {

    const toast = useToast();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
        const [formattedData, setFormattedData] = useState<any>([]);
        const [recommendations, setRecommendations] = useState<any>([]);
    
    const strengthsAndWeaknesses = {
        strengths: ['Time Management', 'Prioritization', 'Delegation'],
        weaknesses: ['Communication', 'Stress Management', 'Articulation'],
        improvementAreas: ['Confidence Building', 'Presentation Skills', 'Risk Assessment'],
    };

       const [skillGapData, setSkillGapData] = useState<any>(null);

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/student/user-dashboard', { withCredentials: true });
                console.log(response)
                setUserData(response.data.user_data);
                setSkillGapData(response.data.user_data.skill_gap_analysis);
                setRecommendations(response.data.user_data.recommendations)

                const formatted = Object.entries(response.data.user_data.required_skills || {}).map(([key, value]) => ({
                    skill: key,
                    demand: value,
                    fullMark: 150,
                }));

                setFormattedData(formatted)
                setLoading(false);


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
        fetchUserData();
    }, [toast]);

    //     try {
    //         // Send the job title as part of the POST request
    //         const response = await axios.post('/api/student/skill-gap-analysis', { job_role });
    //         setSkillGapData(response.data.skill_gap_analysis);
    //         setInDemandData(response.data.required_skills)
    //         const formatted = Object.entries(response.data.required_skills || {}).map(([key, value]) => ({
    //             skill: key,
    //             demand: value,
    //             fullMark: 150,
    //         }));
    //         setFormattedData(formatted);
    //     } catch (error) {
    //         console.error('Error fetching skill gap data:', error);
    //     } 
    // };

        const renderSkills = (skills: any) => {
            if (!skills || typeof skills !== 'object') {
                return <Text>No skills data available</Text>;
            }
            return Object.entries(skills).map(([skill, description]) => (
                <Box key={skill} mb="3">
                    <Heading size="sm">{skill}</Heading>
                    <Text>{description}</Text>
                </Box>
            ));
        };

    if (error) {
        return <Center><Text>{error}</Text></Center>;
    }

    return (
        <ChakraProvider theme={purpleTheme}>
            <Navbar />
            <Box mx="auto" p={4}>
                <Tabs isFitted variant="enclosed">
                    <TabList mb="1em">
                        <Tab _selected={{ bgColor: 'purple.500', color: 'white' }}>User Profile</Tab>
                        <Tab _selected={{ bgColor: 'purple.500', color: 'white' }}>Skill Assessments</Tab>
                        <Tab _selected={{ bgColor: 'purple.500', color: 'white' }}>Recommended Courses</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {userData && (
                                <UserProfile jobMarketData={userData.required_skills} name={userData.full_name} age={userData.age} gender={userData.gender} email={userData.email} strengthsAndWeaknesses={strengthsAndWeaknesses} />
                            )}
                        </TabPanel>
                        <TabPanel>
                            {userData && <SkillAssess userData={userData} />}

                            <Box>
                    <Box>
                        {loading ? (
                            <Box textAlign="center" p="5">
                                <Text>Fetching your skill gap analysis...</Text>
                                <Progress size="sm" isIndeterminate colorScheme="purple" mt="4" />
                            </Box>
                        ) : skillGapData ? (
                            <Stack spacing="4">
                                <Box mb={6}>
                                    <Heading size="md" color="purple.600" mb={4}>
                                        Required Skills:
                                    </Heading>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="skill" />
                                            <PolarRadiusAxis />
                                            <Radar name="Demand" dataKey="demand" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Box>
                                    <Heading size="md" color="purple.600" marginBottom={2}>Transferable Skills:</Heading>
                                    {renderSkills(skillGapData.transferable_skills)}
                                </Box>

                                <Box>
                                    <Heading size="md" color="purple.600" marginBottom={2}>Required Skill Development:</Heading>
                                    {renderSkills(skillGapData.required_skill_development)}
                                </Box>

                                <NeedleChart level={skillGapData.journey_assessment.level} justification={skillGapData.journey_assessment.justification} />
                            </Stack>
                        ) : (
                            <Text>No data available</Text>
                        )}
                    </Box>
                </Box>
                        </TabPanel>
                        <TabPanel>
                            <RecommendCourses recommendedCourses={recommendations} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </ChakraProvider>
    );
};

export default Dashboard;
