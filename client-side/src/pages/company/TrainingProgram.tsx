import { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Stack,
  Radio,
  Box,
  Tooltip,
  IconButton,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Navbar } from "../../components/navbar";
const TrainingProgram = () => {
  const [jobRole, setJobRole] = useState("");
  const [skills, setSkills] = useState([
    {
      id: 1,
      jobRole: '',
      webSearch: null,
      pdfFiles: [],
      links: [],
    },
  ]);
  const [scenarios, setScenarios] = useState([
    { id: 1, explanation: "", link: "" },
  ]);
  const handleSkillChange = (skillId: number, field: string, value: any) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === skillId ? { ...skill, [field]: value } : skill
      )
    );
  };
  
  const handleAddLink = () => {
    setSkills((prevSkills) => [
      ...prevSkills,
      {
        id: prevSkills.length + 1,
        jobRole: '',
        webSearch: null,
        pdfFiles: [],
        links: [],
      },
    ]);
  };
  const handleRemoveSkill = (id) => {
    setSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== id));
  };
  const handleAddScenario = () => {
    setScenarios((prevScenarios) => [
      ...prevScenarios,
      { id: prevScenarios.length + 1, explanation: "", link: "" },
    ]);
  };
  const handleScenarioChange = (id, key, value) => {
    setScenarios((prevScenarios) =>
      prevScenarios.map((scenario) =>
        scenario.id === id ? { ...scenario, [key]: value } : scenario
      )
    );
  };
  const handleRemoveScenario = (id) => {
    setScenarios((prevScenarios) =>
      prevScenarios.filter((scenario) => scenario.id !== id)
    );
  };
  const handleSave = () => {
    console.log("Job Role:", jobRole);
    console.log("Skills:", skills);
    console.log("Scenarios:", scenarios);
  };
  return (
    <Box bg="purple.200" minHeight={"100vh"} minWidth={"100vw"}>
      <Navbar />
      <Box
        width={"full"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={10}
      >
        <Box
          maxWidth="5xl"
          bg="white"
          width="100%"
          p={10}
          borderWidth={1}
          borderRadius="xl"
          boxShadow="lg"
        >
          <VStack width={["full"]} spacing={6} align="stretch">
            <FormControl isRequired>
              <FormLabel className="feature-heading" letterSpacing={2}>
                <b>Job Role</b>
              </FormLabel>
              <Input
                type="text"
                placeholder="Enter job role"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                borderColor="purple.600"
                _hover={{ borderColor: "purple.600" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel className="feature-heading" letterSpacing={2}>
                <b>Required Skills</b>
              </FormLabel>
              {skills.map((skill) => (
                <Box
                  key={skill.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                  mb={4}
                >
                  <FormControl mb={2}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter name"
                      value={skill.name}
                      onChange={(e) =>
                        handleSkillChange(skill.id, "name", e.target.value)
                      }
                      borderColor="purple.600"
                      _hover={{ borderColor: "purple.600" }}
                    />
                  </FormControl>
                  <FormControl mb={2}>
                    <FormLabel>PDF</FormLabel>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        handleSkillChange(
                          skill.id,
                          "pdf",
                          e.target.files?.[0] || null
                        )
                      }
                      borderColor="purple.600"
                      _hover={{ borderColor: "purple.600" }}
                    />
                  </FormControl>
                  <FormControl mb={2}>
                    <FormLabel>Web Search</FormLabel>
                    <RadioGroup
                      value={skill.webSearch}
                      onChange={(value) =>
                        handleSkillChange(skill.id, "webSearch", value)
                      }
                      colorScheme="purple"
                    >
                      <Stack direction="row">
                        <Radio value="none">None</Radio>
                        <Radio value="web">Web</Radio>
                        <Radio value="links">Links</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                  {skill.webSearch === "links" && (
                    <FormControl>
                      <FormLabel className="feature-heading" letterSpacing={2}>
                        <b>Links</b>
                      </FormLabel>
                      {skill.links.map((link, index) => (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="center"
                          mb={2}
                        >
                          <Input
                            placeholder={`Enter link ${index + 1}`}
                            value={link}
                            onChange={(e) =>
                              handleSkillChange(skill.id, "links", [
                                ...skill.links.slice(0, index),
                                e.target.value,
                                ...skill.links.slice(index + 1),
                              ])
                            }
                            borderColor="purple.600"
                            _hover={{ borderColor: "purple.600" }}
                          />
                          <Tooltip label="Delete Link">
                            <IconButton
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              size="sm"
                              ml={2}
                              aria-label="Delete Link"
                              onClick={() =>
                                handleSkillChange(
                                  skill.id,
                                  "links",
                                  skill.links.filter((_, i) => i !== index)
                                )
                              }
                            />
                          </Tooltip>
                        </Box>
                      ))}
                      <Tooltip label="Add new Link">
                        <IconButton
                          icon={<AddIcon />}
                          onClick={() =>
                            handleSkillChange(skill.id, "links", [
                              ...skill.links,
                              "",
                            ])
                          }
                          aria-label="Add Link"
                          colorScheme="purple"
                          size="sm"
                          mt={2}
                        />
                      </Tooltip>
                    </FormControl>
                  )}
                  <Tooltip label="Delete Skill">
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      size="sm"
                      aria-label="Delete Skill"
                      onClick={() => handleRemoveSkill(skill.id)}
                    />
                  </Tooltip>
                </Box>
              ))}
              <Button
                leftIcon={<AddIcon />}
                onClick={handleAddLink}
                colorScheme="purple"
              >
                Add More Skill
              </Button>
            </FormControl>
            {/* Scenarios */}
            <FormControl>
              <FormLabel className="feature-heading" letterSpacing={2}>
                <b>Scenarios</b>
              </FormLabel>
              {scenarios.map((scenario) => (
                <Box
                  key={scenario.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                  mb={4}
                >
                  <FormControl mb={2}>
                    <FormLabel>Explanation</FormLabel>
                    <Textarea
                      placeholder="Explain the scenario"
                      value={scenario.explanation}
                      onChange={(e) =>
                        handleScenarioChange(
                          scenario.id,
                          "explanation",
                          e.target.value
                        )
                      }
                      borderColor="purple.600"
                      _hover={{ borderColor: "purple.600" }}
                    />
                  </FormControl>
                  <FormControl mb={2}>
                    <FormLabel>Link</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter link"
                      value={scenario.link}
                      onChange={(e) =>
                        handleScenarioChange(
                          scenario.id,
                          "link",
                          e.target.value
                        )
                      }
                      borderColor="purple.600"
                      _hover={{ borderColor: "purple.600" }}
                    />
                  </FormControl>
                  <Tooltip label="Delete Scenario">
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      size="sm"
                      aria-label="Delete Scenario"
                      onClick={() => handleRemoveScenario(scenario.id)}
                    />
                  </Tooltip>
                </Box>
              ))}
              <Button
                leftIcon={<AddIcon />}
                onClick={handleAddScenario}
                colorScheme="purple"
              >
                Add Another Scenario
              </Button>
            </FormControl>
            {/* Save Button */}
            <Button colorScheme="green" onClick={handleSave}>
              Save
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};
export default TrainingProgram;