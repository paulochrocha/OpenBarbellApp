//
//  Logger.h
//  OBBApp
//
//  Created by N A on 6/23/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Logger : NSObject

+ (Logger *) sharedLogger;
- (void)setLastDataReceivedDate:(NSDate *)date;
- (void) log:(NSString *)message;

@end
