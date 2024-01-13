'use client'
import OpenAI from "openai";
import { Button } from "@/components/ui/button"
import CardComponent from "@/components/cardComponent"
import { useState, useRef } from "react";
import axios from "axios"

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const [bae64Image1, setBase64Image1] = useState(null)
  const [bae64Image2, setBase64Image2] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);


  async function main() {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 100));

    const targetElement = document.getElementById('loading');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    try {

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "You are the highly knowledgeable scientific image analysis expert. Your task is to compare both the images and write a detailed case study of less then 1300 characters and greater then 800 characters in a paragraph after comparing both the images." },
              {
                type: "image_url",
                image_url: {
                  "url": bae64Image1,
                },
              },
              {
                type: "image_url",
                image_url: {
                  "url": bae64Image2,
                },
              },
            ],
          },
        ],
        max_tokens: 500
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      setAiResponse(response.data.choices[0].message.content);
      setLoading(false);
      await new Promise(resolve => setTimeout(resolve, 100));

      const Gptreponse = document.getElementById('gpt-reponse');
      if (Gptreponse) {
        Gptreponse.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      alert(error.message);
    }
  }
  const OpenAIButtonClick = () => {
    main();
  }
  const clearFileData = () => {
    if (fileInputRef1.current) {
      fileInputRef1.current.value = null;
    }
    if (fileInputRef2.current) {
      fileInputRef2.current.value = null;
    }
    setBase64Image1(null);
    setBase64Image2(null);
    setAiResponse(null);
  }

  return (
    <container>
      <div className='bg-slate-200 min-h-screen max-w-screen overflow-hidden flex flex-col justify-center items-center shadow-xl'>
        <h1 className='font-bold font-mono text-xl mb-6 mt-5'>Case Study of Images</h1>
        <div className="flex justify-center items-center flex-wrap">
          <CardComponent setBase64Image={setBase64Image1} Base64Image={bae64Image1} fileref={fileInputRef1} number={1} />
          <CardComponent setBase64Image={setBase64Image2} Base64Image={bae64Image2} fileref={fileInputRef2} number={2} />
        </div>
        <Button disabled={!bae64Image1 || !bae64Image2} onClick={OpenAIButtonClick} className="mt-4">Ask ChatGPt to write Case Study of Images</Button>
        {
          aiResponse && <div className="flex flex-col justify-center items-center m-10 bg-white p-4 rounded-md shadow-xl max-w-[800px]">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-2xl mb-4 border-b" id="gpt-reponse">
              AI Response
            </h1>
            <p classname="mt-3 li"> <p dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br>') }} /></p>
            <Button className="my-4" onClick={clearFileData}>Reset</Button>
          </div>
        }
        {
          loading && <p classname="text-center text-4xl" id="loading" style={{ marginTop: "20px", fontSize: "20px" }}>Loading ...</p>
        }
      </div>
    </container>
  )
}
