/*
(c) Copyright 2020 Akamai Technologies, Inc. Licensed under Apache 2 license.
Version: 1.1
Purpose:  Modify an HTML streamed response by replacing a text string across the entire response. The replacement string is stored in NetStorage.
*/

import { httpRequest } from 'http-request';
import { logger } from 'log';
import URLSearchParams from 'url-search-params';  

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
let responseStatusCode = ""; 
let conversationId = "";

export function onOriginResponse (request, response) {
  responseStatusCode = response.status;
  logger.log(responseStatusCode);

  if (responseStatusCode >=400 && responseStatusCode <= 599) {
    payloadMethod = request.method;
    payloadProtocol = request.scheme;
    payloadReferrer = request.getHeader('Referrer');
    logger.log(payloadReferrer);
    conversationId = response.getHeader('conversationId');
    logger.log(conversationId);


    var params = new URLSearchParams(request.query);
    logger.log(params);
    params.append("jaime","woohoo");
    logger.log(params);

    let myURL = request;
    myURL.query.set(params);

    const payloadUrl = `${myURL.scheme}://${myURL.host}${myURL.url}`;
    logger.log(payloadUrl);

  }
}