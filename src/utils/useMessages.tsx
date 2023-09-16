import { useToast } from '@apideck/components'
import { ChatCompletionRequestMessage } from 'openai'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { sendMessage } from './sendMessage'

interface ContextProps {
  messages: ChatCompletionRequestMessage[]
  addMessage: (content: string) => Promise<void>
  isLoadingAnswer: boolean
  updateUserAnswers: (answers: any[]) => void
}

interface MessagesProviderProps {
  children: ReactNode
  sessionID: string
}

const ChatsContext = createContext<Partial<ContextProps>>({})

export function MessagesProvider({ children, sessionID }: MessagesProviderProps) {
  const { addToast } = useToast()
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const [userAnswers, setUserAnswers] = useState([]);

  const updateUserAnswers = (answers) => {
    setUserAnswers(answers);
  }

  useEffect(() => {
    async function fetchUserAnswers() {
      if (sessionID) {
        const response = await fetch(`/api/getUserAnswers?sessionID=${sessionID}`);
        const data = await response.json();

        // Update the user's answers in the context
        updateUserAnswers(data.userAnswers);

        const lastAnswer = data.userAnswers[data.userAnswers.length - 1];

        // Initialize the chat with the welcome message
        const systemMessage: ChatCompletionRequestMessage = {
          role: 'system',
          content: 'You are a hyper-intelligent Nigerian educational tutor, designed to help students study for materials they complete quizzes on.'
        }
        const welcomeMessage: ChatCompletionRequestMessage = {
          role: 'assistant',
          content: `You answered the question "${lastAnswer.question}" with "${lastAnswer.userAnswer}". This is ${lastAnswer.isCorrect ? 'correct' : 'incorrect'}. I'm your tutor, here to help you. Can you tell me how you got your answer?`
        }
        setMessages([systemMessage, welcomeMessage])
      }
    }

    fetchUserAnswers();
  }, [sessionID]);

  const addMessage = async (content: string) => {
    setIsLoadingAnswer(true)
    try {
      const newMessage: ChatCompletionRequestMessage = {
        role: 'user',
        content
      }
      const newMessages = [...messages, newMessage]

      setMessages(newMessages)

      const { data } = await sendMessage(newMessages)
      const reply = data.choices[0].message

      setMessages([...newMessages, reply])
    } catch (error) {
      addToast({ title: 'An error occurred', type: 'error' })
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  return (
    <ChatsContext.Provider value={{ messages, addMessage, isLoadingAnswer, updateUserAnswers }}>
      {children}
    </ChatsContext.Provider>
  )
}

export const useMessages = () => {
  return useContext(ChatsContext) as ContextProps
}