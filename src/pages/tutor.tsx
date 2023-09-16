import MessageForm from '../components/MessageForm'
import MessagesList from '../components/MessageList'
import { NextPage } from 'next'
import { MessagesProvider, useMessages } from '../utils/useMessages'
import Layout from '../components/Layout'
import React, { useState, useEffect } from 'react';

const IndexPage: NextPage = () => {
  const [sessionID, setSessionID] = useState(null);

  useEffect(() => {
    const retrievedUUID = localStorage.getItem('userUUID');
    const sessionTimestamp = localStorage.getItem('sessionTimestamp');
    const combinedUUID = `${retrievedUUID}-${sessionTimestamp}`;
    console.log("Retrieved sessionID:", combinedUUID);
    setSessionID(combinedUUID);
  }, []);

  return (
    <MessagesProvider sessionID={sessionID}>
      <Layout>
        <MessagesList />
        <div className="fixed bottom-0 right-0 left-0">
          <MessageForm />
        </div>
      </Layout>
    </MessagesProvider>
  )
}

export default IndexPage