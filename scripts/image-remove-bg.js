// Import AWS SDK v3
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { readFileSync, writeFileSync } from "fs";

import dotenv from "dotenv";

dotenv.config();

const removeBackground = async (imagePath) => {
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

    // Read the input image
    const imageBuffer = readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    const requestBody = {
      taskType: "BACKGROUND_REMOVAL",
      backgroundRemovalParams: {
        image: imageBase64,
      },
      imageGenerationConfig: {
        numberOfImages: 1,
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
    const backgroundImageBase64 = responseBody.images[0];

    // Save the generated image to a file
    writeFileSync(
      `images/removed_bg_image_${new Date().getTime()}.png`,
      Buffer.from(backgroundImageBase64, "base64")
    );
    console.log("Image bg removed and saved");
  } catch (e) {
    console.log(e);
  }
};

removeBackground("input_image/GXO1qxfWoAAAnQP.jpg");
