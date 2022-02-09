#include "esp8266_http_client.hpp"

#define LED 13

void setup() {
  pinMode( LED , OUTPUT );
  String response;
  String endpoint = "/example";
  esp8266_http_client::init();
  response = esp8266_http_client::request( endpoint );

  if( response == "OK" ){
    digitalWrite( LED , HIGH );
    Serial.println( "DONE" );
  }else{
    digitalWrite( LED , LOW );
  }
}

void loop() {
  /* Nothing to do */
}
