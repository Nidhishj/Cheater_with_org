import { Box, Heading, Text, Input, Button, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import RichTextEditor from '../components/RichTextEditor';

const Appeal = () => {
  const [appealUsername, setAppealUsername] = useState('');
  const [appealMessage, setAppealMessage] = useState('');
  const [appealStatus, setAppealStatus] = useState(null);
  const [appealDisabled, setAppealDisabled] = useState(false);

  const verifyName = 'cf-cheater-appeal';

  const handleAppealSubmit = async () => {
    if (!appealUsername.trim() || !appealMessage.trim()) {
      setAppealStatus({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    const normalizedUsername = appealUsername.trim().replace(/\s+/g, '').toLowerCase();
    // Check if user is in cheaters DB
    const cheatersRef = collection(db, 'cheaters');
    const cheaterQuery = query(cheatersRef, where('username', '==', normalizedUsername));
    const cheaterSnapshot = await getDocs(cheaterQuery);
    if (cheaterSnapshot.empty) {
      setAppealStatus({ type: 'error', text: `User "${appealUsername}" is not in the cheater database. Only users marked as cheaters can appeal.` });
      return;
    }
    // Check if an appeal already exists for this user
    const appealsRef = collection(db, 'appeals');
    const existingAppealQuery = query(appealsRef, where('username', '==', normalizedUsername));
    const existingAppealSnapshot = await getDocs(existingAppealQuery);
    if (!existingAppealSnapshot.empty) {
      const status = existingAppealSnapshot.docs[0].data().status;
      if (status === 'declined' || status === 'pending') {
        setAppealStatus({ type: 'error', text: `You can only appeal once. Your previous appeal was ${status}.` });
      } else {
        setAppealStatus({ type: 'error', text: `An appeal for this user is already pending. Please wait for admin review.` });
      }
      return;
    }
    // Check if the user's name is "cf-cheater-appeal"
    const cfResponse = await fetch(`https://codeforces.com/api/user.info?handles=${normalizedUsername}&checkHistoricHandles=false`);
      const cfData = await cfResponse.json();
      const firstName = (cfData.result[0].firstName || '').toLowerCase().trim();
      if (firstName !== verifyName) {
        setAppealStatus({ type: 'error', text: `We cannot verify your Codeforces account. Please change your account's first name to "${verifyName}" (without quotes) <a href="https://codeforces.com/settings/social" style="color: blue;">here</a>.` });
        return;
      }
    // Submit the appeal
    await addDoc(appealsRef, {
      username: normalizedUsername,
      message: appealMessage.trim(),
      status: 'pending',
      submittedAt: new Date(),
    });
    setAppealStatus({ type: 'success', text: `Appeal for "${appealUsername}" submitted successfully!` });
    setAppealUsername('');
    setAppealMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAppealDisabled(true);
    await handleAppealSubmit();
    setAppealDisabled(false);
  };

  return (
    <Box maxW="2xl" mx="auto" px={6}>
      <Box bg="white" _dark={{ bg: 'gray.800' }} p={8} rounded="md" shadow="md">
        <Heading size="lg" mb={6} color="blue.600" _dark={{ color: "blue.400" }} textAlign="center">
          Appeal a Cheater Mark
        </Heading>
        <Text mb={4} fontSize="sm" color="gray.700" _dark={{ color: 'gray.200' }}>
          If you believe you were wrongly marked as a cheater, you can submit an appeal. Only users currently in the cheater database can appeal. Each user can only appeal once.
          <br/>
          <b>Before you appeal, you must verify your identity by going <a href="https://codeforces.com/settings/social" style={{color: "blue"}}>here</a> and changing your account's first name to "{verifyName}" (without quotes).</b>
        </Text>
        {appealStatus && (
          <Box p={3} mb={4} rounded="md" bg={
            appealStatus.type === 'success' ? 'green.100' :
            'red.100'
          } color={
            appealStatus.type === 'success' ? 'green.800' :
            'red.800'
          } borderWidth={1} borderColor={
            appealStatus.type === 'success' ? 'green.200' :
            'red.200'
          } _dark={{
            bg: appealStatus.type === 'success' ? 'green.900' : 'red.900',
            color: appealStatus.type === 'success' ? 'green.200' : 'red.200',
            borderColor: appealStatus.type === 'success' ? 'green.700' : 'red.700'
          }}>
            <Text dangerouslySetInnerHTML={{__html: appealStatus.text}}></Text>
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Box>
              <label htmlFor="appeal-username" style={{ color: 'inherit' }}>Codeforces Username</label>
              <Input
                id="appeal-username"
                placeholder="Enter username (case-insensitive)"
                value={appealUsername}
                onChange={(e) => setAppealUsername(e.target.value)}
                required
                mt={1}
              />
            </Box>
            <Box>
              <label htmlFor="appeal-message" style={{ color: 'inherit' }}>Appeal Message</label>
              <RichTextEditor
                value={appealMessage}
                onChange={setAppealMessage}
                placeholder="Enter appeal message with formatting options above"
                rows={4}
              />
            </Box>
            <Button colorScheme="blue" type="submit" w="full" size="lg" disabled={appealDisabled}>
              Submit Appeal
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default Appeal; 