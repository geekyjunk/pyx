import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const region = process.env.NEXT_PUBLIC_AWS_REGION;
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

const s3 =
  region && accessKeyId && secretAccessKey
    ? new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
      })
    : null;

export async function POST(req: Request) {
  if (!s3 || !bucket) {
    return NextResponse.json(
      { error: "Missing AWS configuration on server." },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const key = `${Date.now()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(arrayBuffer),
        ContentType: file.type || "application/octet-stream",
      })
    );

    return NextResponse.json({ ok: true, key });
  } catch {
    return NextResponse.json({ error: "Failed to upload to S3." }, { status: 500 });
  }
}
