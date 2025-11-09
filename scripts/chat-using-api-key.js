// Import AWS SDK v3
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

import dotenv from "dotenv";

dotenv.config();

const askChatbot = async (question) => {
  try {
    const region = "us-east-1";
    const model = "qwen.qwen3-coder-30b-a3b-v1:0"; // OpenAI GPT-OSS-20B model
    const client = new BedrockRuntimeClient({
      region,
      credentials: {
        async get() {
          return {
            accessToken: process.env.BEDROCK_KEY,
            expiration: undefined,
          };
        },
      },
    });

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
      guardrailIdentifier:
        "arn:aws:bedrock:us-east-1:220954963572:guardrail/jm0b98kqxxph",
      guardrailVersion: "DRAFT",
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

askChatbot("can you explain what is js.").then((response) => {
  console.log(response);
});
