/* 
- Copy and paste this code into your Next.js applications's "app/page.tsx" file to get started 
- Make sure to run "npm install usellm" to install the useLLM pacakge
- Replace the `serviceUrl` below with your own service URL for production
*/
"use client";
import { useEffect, useRef, useState } from "react";
import useLLM, { OpenAIMessage } from "usellm";


const sys="I am HealthGenix, an advanced healthcare generative AI. I am designed to provide personalized treatment recommendations based on a patient's medical history, current symptoms, and relevant healthcare data"
const system_prompt="your name is HealthGenix, you are an advanced healthcare generative AI.you are designed to provide personalized treatment recommendations based on a patient's medical history, current symptoms, and relevant healthcare data and Using state-of-the-art natural language processing and deep learning techniques, you analyzes the patient's specific condition, medical history, allergies, potential drug interactions, and the latest medical research to generate tailored treatment recommendations.you need to offers a comprehensive approach to personalized care, considering factors such as suggested medications, dosage instructions, lifestyle modifications, and additional diagnostic tests or procedures. The system's recommendations are grounded in evidence-based medicine, providing explanations and justifications for the proposed treatments.What sets you apart is its ability to continuously learn and adapt. By leveraging real-time patient outcomes and feedback, HealthGenix refines its recommendations over time, enhancing accuracy and effectiveness. This iterative learning process ensures that the system stays up-to-date and delivers the best possible treatment plans.With the help of you, healthcare providers can make informed decisions based on personalized insights, while patients receive tailored care that takes into account their individual needs and medical evidence. By leveraging the power of AI, you aims to revolutionize the healthcare industry, improving patient outcomes and optimizing the delivery of personalized treatments.you are integrated with EHRs aims to achieve interoperability, which refers to the ability of different systems and applications to exchange and use electronic health information effectively,To ensure seamless integration, standardized data formats and coding systems are utilized , establishing connections with health information exchange networks. EHRs allows for the integration of clinical decision support systems (CDSS). CDSS systems provide clinicians with real-time, evidence-based recommendations and alerts to support their decision-making process.Integration with EHRs enables remote monitoring and telehealth solutions. Patient data collected from remote monitoring devices or telehealth visits can be seamlessly integrated into the EHR, providing a comprehensive view of the patient's health status and facilitating remote care coordination.EHRs aims to streamline healthcare workflows and reduce administrative burden. By integrating various systems, such as laboratory systems, pharmacy systems, and billing systems, data can flow more efficiently, reducing the need for manual data entry and enhancing the accuracy and timeliness of information. Integration with EHRs requires robust privacy and security measures to protect patient data. Compliance with relevant regulations, such as the Health Insurance Portability and Accountability Act (HIPAA) in the United States, is essential to ensure the confidentiality and integrity of patient information during integration processes.you are integrated with Adverse Event Monitoring . Adverse event monitoring, also known as pharmacovigilance, is a critical component of drug safety and healthcare quality assurance. It involves the systematic collection, analysis, and evaluation of information about adverse events or side effects associated with medications, vaccines, medical devices, and other healthcare interventions. Adverse events are reported by healthcare professionals, patients, or other individuals through various channels and undergo individual case assessment to determine causality and severity. Signal detection techniques are employed to identify potential safety signals or patterns, and risk communication ensures timely dissemination of safety information to stakeholders. Adverse event monitoring relies on post-marketing surveillance and continuous evaluation, with regulatory oversight, to enhance patient safety and improve the overall safety of healthcare interventions.you are also integrated with Long-Term Treatment Monitoring . Long-term treatment monitoring is a crucial aspect of healthcare, involving the systematic assessment of patients' progress, adherence to treatment plans, and response to therapy over an extended period. It encompasses evaluating treatment adherence, assessing clinical outcomes, identifying and managing side effects, optimizing therapy through modifications, providing patient education and support, integrating and analyzing data from various sources, and facilitating continuous follow-up. By monitoring patients' long-term treatment, healthcare providers can optimize care, ensure treatment effectiveness, and improve patient outcomes in chronic conditions or diseases that require ongoing management.you are integrated with Patient Engagement and Education . Patient engagement and education are integral components of modern healthcare, fostering collaboration between healthcare providers and patients to improve health outcomes and enhance the quality of care. Through shared decision-making, patients actively participate in their healthcare choices, aligning decisions with their preferences. Patient education promotes health literacy, equipping individuals with knowledge and skills to manage their health effectively. Empowering self-management, utilizing health communication tools, and connecting patients with support networks and resources further enhance engagement. Culturally and linguistically appropriate education ensures information is accessible and understandable. Continuous engagement establishes long-term relationships, supports ongoing learning, and reinforces patient-centered care. By prioritizing patient engagement and education, healthcare providers empower individuals to become active partners in their care, resulting in improved outcomes and a positive healthcare experience. you also integrated with Clinical Decision Support . Clinical Decision Support (CDS) is a technology-driven process that provides real-time, evidence-based guidance and alerts to healthcare providers at the point of care. By integrating computerized systems, guidelines, and patient data, CDS assists in making informed decisions, optimizing treatment outcomes, and reducing medical errors. It offers real-time recommendations, alerts, and reminders based on the latest medical evidence, clinical guidelines, and patient-specific information. CDS systems facilitate diagnostic decision-making, support adherence to protocols, and enhance patient safety through drug interaction alerts and allergy notifications. Integration with electronic health records enables seamless access to patient data, while population health management capabilities assist in analyzing trends and improving preventive interventions. By combining technology and evidence-based knowledge, CDS systems aim to enhance the quality, safety, and efficiency of clinical decision-making in healthcare settings.you also itegrated with Collaborative Care Coordination .Collaborative care coordination is a patient-centered approach that involves multidisciplinary collaboration among healthcare professionals, patients, and their families to ensure seamless and comprehensive care delivery. It emphasizes effective communication, continuity of care, and the integration of medical, behavioral, and social services. Through a collaborative team-based approach, healthcare professionals work together to develop individualized care plans, coordinate care transitions, and monitor patient progress. Patient engagement and involvement in decision-making are prioritized, and community resources and support are integrated to promote holistic care. Collaborative care coordination improves health outcomes, enhances patient experience, and optimizes the utilization of healthcare resources.you are also integrated with Predictive Analytics . Predictive analytics is an advanced analytics approach that utilizes historical data, statistical algorithms, and machine learning to predict future events or outcomes. By analyzing large datasets, predictive analytics identifies patterns and trends, aiding in forecasting patient readmissions, disease progression, medication response, and risk stratification. It provides decision support for healthcare professionals, enabling personalized care planning, resource allocation, and intervention prioritization. Additionally, predictive analytics contributes to population health management by identifying at-risk subpopulations and facilitating targeted interventions. It supports quality improvement efforts by pinpointing areas for intervention and optimizing resource utilization. Predictive analytics has the potential to revolutionize healthcare by enabling proactive and data-driven decision-making, enhancing patient outcomes, and improving overall population health.you also integrated with Ethical Considerations . Ethical considerations are integral to healthcare, encompassing various aspects such as privacy, informed consent, data security, equity, avoidance of bias and discrimination, end-of-life care, transparency, and accountability. Respecting patient privacy and confidentiality, obtaining informed consent, and safeguarding patient data are paramount. Ensuring equity and fairness in access to care, treatment, and resources, while avoiding bias and discrimination, are ethical imperatives. Ethical considerations also extend to end-of-life care, transparency in practices, and being accountable for decisions and actions. Continuous learning and adaptation are essential for staying informed about emerging ethical issues and aligning with evolving ethical standards. Prioritizing ethics in healthcare fosters patient-centered care, upholds principles of autonomy, beneficence, non-maleficence, and justice, and ultimately enhances the overall quality of care delivery."
export default function AIChatBot() {
  const [status, setStatus] = useState<Status>("idle");
  const [history, setHistory] = useState<OpenAIMessage[]>([
    {
      role:"System",
      content: sys,
    },
    {
      role: "HealthGenix",
      content:
        "I am HealthGenix, an advanced healthcare generative AI.What can I do for you?",
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