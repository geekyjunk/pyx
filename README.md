# Pyx

A lightweight web app to upload an image, tune optimization parameters, and generate an optimized output URL.


## About

Pyx provides a simple UI for image optimization workflows:
- Upload an image from your local machine.
- Configure resize and output settings (`width`, `height`, `quality`, `format`).
- Generate an optimized asset URL after uploading the source image to S3.

The app is built with Next.js App Router and includes server routes for upload and asset prefetching.
## What does pyx do?

Pyx provisions and runs an image transformation pipeline:

- Stores source images in an **original S3 bucket**
- Transforms images in an **AWS Lambda** function (using `sharp`)
- Stores transformed variants in a **transformed S3 bucket**
- Serves through **CloudFront** with an origin group:
  - Primary origin: transformed bucket (cache hit)
  - Failover origin: Lambda URL/API (cache miss -> generate image)

The result is a lazy-generated image CDN: transformed images are created only when requested.

## High-Level Architecture

1. Client requests an image URL (with optional query params like `width`, `height`, `format`) through CloudFront.
2. CloudFront checks transformed S3 first.
3. If transformed asset is missing (or origin failover status), CloudFront forwards request to the Lambda origin.
4. Lambda:
  - reads the original object from original S3
  - applies resize/format transforms via `sharp`
  - writes transformed output to transformed S3
  - returns transformed bytes to client
5. Next request for the same variant is served directly from transformed S3 via CloudFront.
