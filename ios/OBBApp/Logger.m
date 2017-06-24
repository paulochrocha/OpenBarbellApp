//
//  Logger.m
//  OBBApp
//
//  Created by N A on 6/23/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "Logger.h"

#define logKey  @"log"

@implementation Logger {
  NSString *lastDataReceivedDateString;
  NSDateFormatter *dateFormatter;
}

+ (Logger *)sharedLogger
{
  static Logger *logger = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    logger = [[Logger alloc] init];
  });
  return logger;
}

- (id) init {
  if (self = [super init]) {
    lastDataReceivedDateString = @"";
    dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
  }
  return self;
}

- (void)setLastDataReceivedDate:(NSDate *)date {
  @synchronized (self) {
    lastDataReceivedDateString = [dateFormatter stringFromDate:date];
  }
}

- (void)log:(NSString *)message {
  @synchronized (self) {
    // get array
    NSArray *existingLog = [[NSUserDefaults standardUserDefaults] objectForKey:logKey];
    if (existingLog == nil) {
      existingLog = @[];
    }
    NSMutableArray *array = [NSMutableArray arrayWithArray:existingLog];
    
    // new entry
    NSDictionary *dictionary = @{
                                 @"timestamp": [dateFormatter stringFromDate:[NSDate date]],
                                 @"data_received": lastDataReceivedDateString,
                                 @"message": message
                                 };
    [array addObject:dictionary];
    
    // store
    [[NSUserDefaults standardUserDefaults] setObject:array forKey:logKey];
    [[NSUserDefaults standardUserDefaults] synchronize];
    
    NSLog(@"%@", dictionary);
  }
}

@end
