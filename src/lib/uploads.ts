import os from "node:os";
import path from "node:path";

/**
 * Where uploaded files live. On serverless hosts (Vercel) the project folder is
 * read-only, so uploads go to the temp folder and are served back through
 * /api/upload/[name]; elsewhere they go to public/uploads.
 */
export const SERVERLESS = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

export const UPLOAD_DIR = SERVERLESS
  ? path.join(os.tmpdir(), "cf360-uploads")
  : path.resolve(process.cwd(), "public", "uploads");
