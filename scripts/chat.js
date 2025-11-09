// Import AWS SDK v3
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const askChatbot = async (question) => {
  try {
    const region = "us-east-1";
    const model = "openai.gpt-oss-120b-1:0"; // OpenAI GPT-OSS-20B model
    const client = new BedrockRuntimeClient({ region });

    // Prepare the request payload for GPT-OSS-20B
    const requestBody = {
      messages: [
        {
          role: "system",
          content:
            "You are a coding assistant. Analyze the user's question and answer accordingly.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      max_tokens: 200,
      temperature: 0.1,
    };

    const command = new InvokeModelCommand({
      modelId: model,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(requestBody),
    });

    console.log(command);

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log("Bedrock response:", responseBody);
    const aiResponse = responseBody.choices[0]?.message?.content;

    return aiResponse;
  } catch (e) {
    console.log(e);
  }
};

askChatbot("what is f string in python").then((response) => {
  console.log(response);
});
