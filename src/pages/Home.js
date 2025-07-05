import React from 'react';
import { Box, VStack, Heading, Text, Button, Container, SimpleGrid, Icon } from '@chakra-ui/react';
import { FaSearch, FaBuilding } from 'react-icons/fa';

function Home({ user }) {
  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={12} textAlign="center">
        {/* Hero Section */}
        <VStack spacing={6} mb={4}>
          <Heading size="2xl" color="blue.600" _dark={{ color: "blue.400" }} fontWeight="bold">
            CF Cheater Database
          </Heading>
          <Text fontSize="xl" color="gray.600" _dark={{ color: "gray.300" }} maxW="2xl">
            Help maintain the integrity of competitive programming by reporting and tracking Codeforces cheaters.
          </Text>
        </VStack>

        {/* Quick Actions */}
        <Box w="full" mt={2}>
          <SimpleGrid columns={2} spacing={4} maxW="2xl" mx="auto">
            <Box
              bg="white"
              _dark={{ bg: "gray.800" }}
              p={8}
              borderRadius="lg"
              shadow="md"
              textAlign="center"
              transition="all 0.2s"
              _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
            >
              <Icon as={FaSearch} boxSize={8} color="blue.500" mb={4} />
              <Heading size="md" mb={3} color="gray.800" _dark={{ color: "gray.100" }}>
                Search Database
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.300" }} mb={6}>
                Look up users to see if they have been reported for cheating
              </Text>
              <Button colorScheme="blue" size="lg" as="a" href="/search" w="full">
                Search
              </Button>
            </Box>

            <Box
              bg="white"
              _dark={{ bg: "gray.800" }}
              p={8}
              borderRadius="lg"
              shadow="md"
              textAlign="center"
              transition="all 0.2s"
              _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
            >
              <Icon as={FaBuilding} boxSize={8} color="purple.500" mb={4} />
              <Heading size="md" mb={3} color="gray.800" _dark={{ color: "gray.100" }}>
                Search in Organisation
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.300" }} mb={6}>
                Find cheaters within specific organizations or institutions
              </Text>
              <Button colorScheme="purple" size="lg" as="a" href="/search-org" w="full">
                Search Organisation
              </Button>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Chrome Extension Notice */}
        <Box
          w="full"
          maxW="2xl"
          mx="auto"
          mt={12}
          bg="blue.100"
          borderRadius="md"
          px={4}
          py={3}
          border="1px solid"
          borderColor="blue.300"
          _dark={{ 
            bg: "blue.800",
            borderColor: "blue.600" 
          }}
        >
          <Text fontSize="md" color="blue.900" _dark={{ color: "blue.100" }}>
            We also provide a <b>Chrome extension</b> for highlighting cheaters directly on Codeforces. <br />
            <a
              href="https://github.com/macaquedev/cf-cheater-highlighter"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#1a73e8', // brighter link color
                textDecoration: 'underline',
                fontWeight: '500',
              }}
            >
              Get it here on GitHub
            </a>.
          </Text>
        </Box>

        {/* Footer Info */}
        <Box textAlign="center" color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm" mt={8}>
          <Text>
            This database helps maintain fair competition on Codeforces by tracking verified cases of cheating.
          </Text>
          <Text mt={2}>
            All reports are reviewed by administrators before being added to the database.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}

export default Home;