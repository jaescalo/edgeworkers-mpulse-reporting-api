/*
(c) Copyright 2020 Akamai Technologies, Inc. Licensed under Apache 2 license.
Version: 1.1
Purpose:  Modify an HTML streamed response by replacing a text string across the entire response. The replacement string is stored in NetStorage.
*/

import { httpRequest } from 'http-request';
import { logger } from 'log';

// Instantiate with JSON.parse is much faster than literal object
let reportingApiPayload = JSON.parse('{\
  "age":0,\
  "type":"network-error",\
  "url":"",\
  "body": {\
    "sampling_fraction": 1.0,\
    "referrer": "",\
    "server_ip": "111.111.111.111",\
    "protocol": "https",\
    "method": "",\
    "status_code": "",\
    "elapsed_time": 823,\
    "type": "http.protocol.error"\
    }\
  }');

let payloadMethod = "";
let payloadProtocol = "";
let payloadReferrer = "";
let responseStatusCode = "44"; 
let conversationId = "";

export function onClientRequest (request) {
  const referrer = request.getHeader('Referrer');
  logger.log(referrer);
}

export function onOriginResponse (request, response) {
  responseStatusCode = response.status;
  logger.log(responseStatusCode);

  if (responseStatusCode >=400 && responseStatusCode <= 599) {
    payloadMethod = request.method;
    logger.log(payloadMethod);
    payloadProtocol = request.scheme;
    logger.log(payloadProtocol);
    payloadReferrer = request.getHeader('Referrer');
    logger.log(payloadReferrer);
    conversationId = response.getHeader('conversationId');
    logger.log(conversationId);
  }
}

export function onClientResponse (request, response) {
  payloadMethod = request.method;
  logger.log(payloadMethod);
}