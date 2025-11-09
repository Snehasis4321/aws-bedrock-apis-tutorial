// Import AWS SDK v3
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { writeFileSync } from "fs";

import dotenv from "dotenv";

dotenv.config();

const generateImage = async (prompt) => {
  try {
    const region = "us-east-1";
    const model = "amazon.nova-canvas-v1:0";
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

    const requestBody = {
      taskType: "TEXT_IMAGE",
      textToImageParams: {
        text: prompt,
      },
      imageGenerationConfig: {
        numberOfImages: 1,
        height: 512,
        width: 512,
        cfgScale: 8.0,
        seed: 0,
      },
    };

    const command = new InvokeModelCommand({
      modelId: model,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(requestBody),
      //   guardrailIdentifier:
      //     "arn:aws:bedrock:us-east-1:220954963572:guardrail/jm0b98kqxxph",
      //   guardrailVersion: "DRAFT",
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log(responseBody);
    const imageBase64 = responseBody.images[0];

    // Save the generated image to a file
    writeFileSync(
      `images/generated_image_${new Date().getTime()}.png`,
      Buffer.from(imageBase64, "base64")
    );
    console.log("Image generated and saved");
  } catch (e) {
    console.log(e);
  }
};

generateImage("a man with a dog");
