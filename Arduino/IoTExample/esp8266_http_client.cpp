#include "esp8266_http_client.hpp"

const String esp8266_http_client::host = "http://192.168.0.1";

void esp8266_http_client::init(void){
  Serial.begin( 115200 );
}
String esp8266_http_client::request( String &endpoint ){
  String uri = host + endpoint;
  Serial.println( uri );
  uri = "OK";
  return uri;
}
