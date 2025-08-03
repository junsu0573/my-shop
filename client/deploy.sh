#!/bin/bash
npm run build &&
aws s3 sync ./dist s3://hanwoo-bc.com --delete &&
aws cloudfront create-invalidation \
  --distribution-id E1JRBQ067U3Q1Y \
  --paths "/*"