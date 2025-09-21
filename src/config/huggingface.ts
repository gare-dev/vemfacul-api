import { InferenceClient } from "@huggingface/inference";

const HF_TOKEN = process.env.HF_TOKEN

const client = new InferenceClient(HF_TOKEN);

export default client