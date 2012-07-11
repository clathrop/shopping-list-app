/**
* Appcelerator Titanium Mobile
* This is generated code. Do not modify. Your changes *will* be lost.
* Generated code is Copyright (c) 2009-2011 by Appcelerator, Inc.
* All Rights Reserved.
*/
#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"
 
@implementation ApplicationDefaults
  
+ (NSMutableDictionary*) copyDefaults
{
    NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];

    [_property setObject:[TiUtils stringValue:@"rmwKzv7ALvxc7ZPhK3F4alHaiX6PiYXd"] forKey:@"acs-oauth-secret-production"];
    [_property setObject:[TiUtils stringValue:@"iybiKrftXnGuBuJ5H5ezRXDzN8SU3NTT"] forKey:@"acs-oauth-key-production"];
    [_property setObject:[TiUtils stringValue:@"30qDj3of6ek4rxBASwmdsONALyp5ny2N"] forKey:@"acs-api-key-production"];
    [_property setObject:[TiUtils stringValue:@"OL3qW9JFf1vWeBs6qC2iFLSeB6pVqvyz"] forKey:@"acs-oauth-secret-development"];
    [_property setObject:[TiUtils stringValue:@"abugAuwjCSi2WLifWBYG55zvZfhJ3V16"] forKey:@"acs-oauth-key-development"];
    [_property setObject:[TiUtils stringValue:@"JTn9lQBwTXUCLn3j42TJHXfPQhMAKRuk"] forKey:@"acs-api-key-development"];
    [_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];

    return _property;
}
@end
