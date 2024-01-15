import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input"
import OpenAI from "openai";
import { Button } from "@/components/ui/button"

const ChatOpneAi = () => {
  const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
  const [inputMessage, setInputMessage] = useState("");
  const [generateResponse, setGenerateResponse] = useState(false);
  const [chatMessages, setChatMessages] = useState(JSON.parse(localStorage.getItem('chat_messages')) || []);
  const MoveToTop = (e) => {
    e.preventDefault();
    const Gptreponse = document.getElementById('bottom-data');
    if (Gptreponse) {
      Gptreponse.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const scrollToTop = () => {
    const Gptreponse = document.getElementById('bottom-data');
    if (Gptreponse) {
      Gptreponse.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async function main() {
    const messages = [...chatMessages, {
      role: 'user',
      content: inputMessage
    }]
    setChatMessages([...chatMessages, {
      role: 'user',
      content: inputMessage
    }])
    setInputMessage("");
    scrollToTop();
    messages.unshift({
      role: "system", content: "You are the highly knowledgeable and you will advices and helps people related to uiux and product design stuff and clear all there doubt in less then 100 words"
    })
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });
    messages.shift();
    messages.push({
      role: 'assistant',
      content: completion.choices[0].message.content
    })

    scrollToTop();
    setChatMessages(messages)
    setGenerateResponse(false);
  }
  useEffect(() => {
    if (generateResponse) main();
  }, [generateResponse])

  const Generate = (e) => {
    MoveToTop(e);
    e.preventDefault()
    setGenerateResponse(true)
  }
  useEffect(()=>{
    localStorage.setItem('chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages])

  const clearChat = (e) => {
    e.preventDefault()
    setChatMessages([]);
    setInputMessage("");
  }
  return (
    <Card
      className="m-3 shadow-3xl"
      style={{
        height: "85vh",
        maxWidth: "450px",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardHeader>
        <CardTitle className="text-center mt-1">Chatbot Helper</CardTitle>
      </CardHeader>
      <ScrollArea
        className="rounded-md border h-full w-full"
        style={{
          height: "73vh",
          maxWidth: "500px",
          width: "100%",
          overflow: "auto",
          border: "none",
          padding: "0 0 100px 0",
          margin: "10px 10px",
        }}
      >
        <CardContent style={{ overflowY: "auto" }}>
          <form className="relative">
            <div className="grid gap-4">
              <div
                className='flex justify-start'>
                <p
                  className={`bg-slate-100 px-3 p-2 rounded-md w-2/3 border-slate-900 border-solid`}
                >
                  Hi👋 I am here to advices and helps people related to uiux and product design stuff
                </p>
              </div>
              {chatMessages.map((Item) => (
                <div
                  className={`flex ${Item.role !== "user" ? "justify-start" : "justify-end"
                    }`}
                >
                  <p
                    className={`${Item.role !== "user" ? "bg-slate-100" : "bg-blue-200"
                      } px-3 p-2 rounded-md w-2/3 border-slate-900 border-solid`}
                  >
                    {Item.content}
                  </p>
                </div>
              ))}
              <div id="bottom-data"></div>
            </div>
            <div style={{ maxWidth: "390px", width: "100%", marginTop: "20px" }} className="flex justify-center items-center fixed bottom-11">
              <Input onChange={(e) => { setInputMessage(e.target.value) }} style={{ border: "1px solid #000", maxWidth: "370px", width: "100%" }} className="" type="text" placeholder="Message" value={inputMessage} />
              <Button onClick={Generate} disabled={!inputMessage.length} className="ml-3 bg-black text-white px-3 py-2 rounded-md">Send</Button>
              <Button onClick={clearChat} disabled={!chatMessages.length} className="ml-3 bg-black text-white px-2 py-2 rounded-md">Clear</Button>
            </div>
          </form>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default ChatOpneAi;
