import {
  Heading,
  SlideFade,
  Grid,
  Center,
} from '@chakra-ui/react';
import RecommendedCard from '../../components/RecommendedCard';

export const RecommendCourses = ({ recommendedCourses }) => {

  return (
      <>
      <Center><Heading mb={4}>Top Recommendations for You</Heading></Center>
      <Grid templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
        {recommendedCourses.map((course, index) => (
          <SlideFade in={true} transition={{ enter: { duration: 0.7 } }} offsetY='50px' key={index}>
            <RecommendedCard
              source={course.source}
              title={course.title}
              link={course.link}
              logo={course.logo}
              job_description={course.job_description} // Added job_description prop
              job_role={course.job_role}             // Added job_role prop
              program_code={course.program_code}     // Added program_code prop
            />
          </SlideFade>
        ))}
      </Grid>
    </>
  );
};
