'use client'
import { Configuration, OpenAIApi } from "openai-edge";
import { Button } from "@/components/ui/button"
import CardComponent from "@/components/cardComponent"
import { useState, useRef } from "react";
import ChatOpneAi from "@/components/chatComponent";
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Home() {
  const [base64Image1, setBase64Image1] = useState(null)
  const [base64Image2, setBase64Image2] = useState(null)
  const [aiResponse, setAiResponse] = useState(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [serviceOption, setServiceOption] = useState(null);
  const [openAIType, setOpenAiType] = useState({
    imageComparison: false,
    imageGenerate: false,
    Texttotext: false
  })
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const ImageGenerate = async () => {
    const response = await openai.createImage({
      model: "dall-e-3",
      prompt: "a white siamese cat",
      size: "1024x1024",
    });
    console.log(response);
  }

  async function main() {
    setAiResponse("Loading...")
    await new Promise(resolve => setTimeout(resolve, 100));
    const Gptreponse = document.getElementById('gpt-reponse');
    if (Gptreponse) {
      Gptreponse.scrollIntoView({ behavior: 'smooth' });
    }
    try {
      await fetch("api/OpenAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          base64Image1, base64Image2
        })
      }).then(async (response) => {
        const reader = response.body?.getReader();
        setAiResponse("");
        while (true) {
          const { done, value } = await reader?.read();
          if (done) {
            break;
          }
          var currentChunk = new TextDecoder().decode(value);
          console.log(currentChunk)
          setAiResponse((prev) => prev + currentChunk);
          window.scrollTo(0, document.body.scrollHeight)
        }
      });


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

  const generateImage = () => {
    ImageGenerate();
  }
  return (
    <container>
      <div className='bg-slate-200 min-h-screen max-w-screen overflow-hidden flex flex-col justify-center items-center shadow-xl'>
        {!serviceOption &&
          <>
            <h1 className='font-bold font-mono text-xl mb-6 mt-5'>Hi 👋 We are the team of developers</h1>
            <p className='font-normal max-w-[800px] text-center leading-9 text-lg mb-3 m-5'>We provide service ranging from Imgaes Case study, text to image generator using DALLE2 and Product guidance to provide user with accurate and precise information. Select the service below and make your life easier.</p>
            <Select onValueChange={(value) => { setServiceOption(value * 1) }}>
              <SelectTrigger className="w-[180px] my-8">
                <SelectValue placeholder="Select The Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Images Case Study Generator</SelectItem>
                <SelectItem value="2">Text to Image generator</SelectItem>
                <SelectItem value="3">Ui/UX and Product guidance</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        {serviceOption &&
          <Button onClick={() => { setServiceOption(null) }} className="mt-4">Reset Selection</Button>
        }
        {
          serviceOption === 1 && <>
            <h1 className='font-bold font-mono text-xl mb-6 mt-5'>Case Study of Images</h1>
            <div className="flex justify-center items-center flex-wrap">
              <CardComponent setBase64Image={setBase64Image1} Base64Image={base64Image1} fileref={fileInputRef1} number={1} />
              <CardComponent setBase64Image={setBase64Image2} Base64Image={base64Image2} fileref={fileInputRef2} number={2} />
            </div>
            <Button disabled={!base64Image1 || !base64Image2} onClick={OpenAIButtonClick} className="mt-4">Ask ChatGPt to write Case Study of Images</Button>
            {
              aiResponse && <div className="flex flex-col justify-center items-center m-10 bg-white p-4 rounded-md shadow-xl max-w-[800px]">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-2xl mb-4 border-b" id="gpt-reponse">
                  AI Response
                </h1>
                <p className="mt-3 li"> <p dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br>') }} /></p>
                <div className="flex justify-center items-center">
                  <Button className="my-4" onClick={clearFileData}>Reset</Button>
                  <Button className="my-4 ml-3" onClick={OpenAIButtonClick}>Regenerate</Button>
                </div>
              </div>
            }
            <div id="end-screen"></div>
          </>
        }
        {
          serviceOption === 2 && <div>
            <Button className="my-4 ml-3" onClick={generateImage}>Generate</Button>
            {
              imageUrl && <img src={imageUrl} alt='' />
            }
          </div>
        }
        {
          serviceOption === 3 && <ChatOpneAi />
        }
      </div>

    </container>
  )
}
