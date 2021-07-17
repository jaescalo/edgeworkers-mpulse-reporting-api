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
    "protocol": "",\
    "method": "",\
    "status_code": "",\
    "elapsed_time": 823,\
    "type": "http.protocol.error"\
    }\
  }');

export function onOriginResponse (request, response) {
  let responseStatusCode = response.status;
  logger.log(responseStatusCode);

  if (responseStatusCode >=400 && responseStatusCode <= 599) {
    let payloadMethod = request.method;
    let payloadProtocol = request.scheme;
    let payloadReferrer = request.getHeader('Referrer');
    let conversationId = response.getHeader('conversationId');

    // Append the conversatioId to the QS
    var params = new URLSearchParams(request.query);
    logger.log(params);
    params.append("conversationId",conversationId);
    logger.log(params);
    let payloadUrl = `${request.scheme}://${request.host}${request.path}?${params}`;
    logger.log(payloadUrl);

    // Write payload
    reportingApiPayload["url"] = payloadUrl; 
    reportingApiPayload["body"]["referrer"] = payloadReferrer;
    reportingApiPayload["body"]["protocol"] = payloadProtocol;
    reportingApiPayload["body"]["method"] = payloadMethod;
    reportingApiPayload["body"]["status_code"] = responseStatusCode; 
    
    logger.log(JSON.stringify(reportingApiPayload));

    const options = {}

    options.method = "POST";
    options.headers = { "Content-Type": "application/json", 'User-Agent': 'EdgeWorker ID #####' };
    options.body = JSON.stringify(reportingApiPayload);

    // For prod replace MPULSEKEY with the actual API key.
    httpRequest("https://reporting.go-mpulse.net/report/MPULSEKEY", options);
  }
}