/* 
- Copy and paste this code into your Next.js applications's "app/page.tsx" file to get started 
- Make sure to run "npm install usellm" to install the useLLM pacakge
- Replace the `serviceUrl` below with your own service URL for production
*/
"use client";
import { useEffect, useRef, useState } from "react";
import useLLM, { OpenAIMessage } from "usellm";

const system_prompt="I am HealthGenix, an advanced healthcare generative AI, is designed to provide personalized treatment recommendations based on a patient's medical history, current symptoms, and relevant healthcare data. Using state-of-the-art natural language processing and deep learning techniques, HealthGenix analyzes the patient's specific condition, medical history, allergies, potential drug interactions, and the latest medical research to generate tailored treatment recommendations.HealthGenix offers a comprehensive approach to personalized care, considering factors such as suggested medications, dosage instructions, lifestyle modifications, and additional diagnostic tests or procedures. The system's recommendations are grounded in evidence-based medicine, providing explanations and justifications for the proposed treatments.What sets HealthGenix apart is its ability to continuously learn and adapt. By leveraging real-time patient outcomes and feedback, HealthGenix refines its recommendations over time, enhancing accuracy and effectiveness. This iterative learning process ensures that the system stays up-to-date and delivers the best possible treatment plans.With HealthGenix, healthcare providers can make informed decisions based on personalized insights, while patients receive tailored care that takes into account their individual needs and medical evidence. By leveraging the power of AI, HealthGenix aims to revolutionize the healthcare industry, improving patient outcomes and optimizing the delivery of personalized treatments"

export default function AIChatBot() {
  const [status, setStatus] = useState<Status>("idle");
  const [history, setHistory] = useState<OpenAIMessage[]>([
    {
      role:"system",
      content: system_prompt,
    },
    {
      role: "assistant",
      content:
        "I'm a chatbot powered by the ChatGPT API .Ask me anything!",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const llm = useLLM({
    serviceUrl: "https://usellm.org/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });

  let messagesWindow = useRef<Element | null>(null);

  useEffect(() => {
    if (messagesWindow?.current) {
      messagesWindow.current.scrollTop = messagesWindow.current.scrollHeight;
    }
  }, [history]);

  async function handleSend() {
    if (!inputText) {
      return;
    }
    try {
      setStatus("streaming");
      const newHistory = [...history, { role: "user", content: inputText }];
      setHistory(newHistory);
      setInputText("");
      const { message } = await llm.chat({
        messages: newHistory,
        stream: true,
        onStream: ({ message }) => setHistory([...newHistory, message]),
      });
      setHistory([...newHistory, message]);
      setStatus("idle");
    } catch (error: any) {
      console.error(error);
      window.alert("Something went wrong! " + error.message);
    }
  }

  async function handleRecordClick() {
    try {
      if (status === "idle") {
        await llm.record();
        setStatus("recording");
      } else if (status === "recording") {
        setStatus("transcribing");
        const { audioUrl } = await llm.stopRecording();
        const { text } = await llm.transcribe({ audioUrl });
        setStatus("streaming");
        const newHistory = [...history, { role: "user", content: text }];
        setHistory(newHistory);
        const { message } = await llm.chat({
          messages: newHistory,
          stream: true,
          onStream: ({ message }) => setHistory([...newHistory, message]),
        });
        setHistory([...newHistory, message]);
        setStatus("idle");
      }
    } catch (error: any) {
      console.error(error);
      window.alert("Something went wrong! " + error.message);
    }
  }

  const Icon = status === "recording" ? Square : Mic;

  return (
    <div className="flex flex-col h-full max-h-[600px] overflow-y-hidden">
      <div
        className="w-full flex-1 overflow-y-auto px-4"
        ref={(el) => (messagesWindow.current = el)}
      >
        {history.map((message, idx) => (
          <Message {...message} key={idx} />
        ))}
      </div>
      <div className="w-full pb-4 flex px-4">
        <input
          className="p-2 border rounded w-full block dark:bg-gray-900 dark:text-white"
          type="text"
          placeholder={getInputPlaceholder(status)}
          value={inputText}
          disabled={status !== "idle"}
          autoFocus
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium ml-2"
          onClick={handleSend}
        >
          Send
        </button>
        <button
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium ml-2"
          onClick={handleRecordClick}
        >
          <Icon />
        </button>
      </div>
    </div>
  );
}

const Mic = () => (
  // you can also use an icon library like `react-icons` here
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" x2="12" y1="19" y2="22"></line>
  </svg>
);

const Square = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
  </svg>
);

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

type Status = "idle" | "recording" | "transcribing" | "streaming";

function getInputPlaceholder(status: Status) {
  switch (status) {
    case "idle":
      return "Ask me anthing...";
    case "recording":
      return "Recording audio...";
    case "transcribing":
      return "Transcribing audio...";
    case "streaming":
      return "Wait for my response...";
  }
}

function Message({ role, content }: OpenAIMessage) {
  return (
    <div className="my-4">
      <div className="font-semibold text-gray-800 dark:text-white">
        {capitalize(role)}
      </div>
      <div className="text-gray-600 dark:text-gray-200 whitespace-pre-wrap mt-1">
        {content}
      </div>
    </div>
  );
}