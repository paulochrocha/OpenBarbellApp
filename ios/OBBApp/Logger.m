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
    NSArray *existingLogs = [[NSUserDefaults standardUserDefaults] objectForKey:logKey];
    if (existingLogs == nil) {
      existingLogs = @[];
    }
    NSMutableArray *array = [NSMutableArray arrayWithArray:existingLogs];
    
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

- (void)syncLogs {
  // check if allowed to sync logs
  if (![[NSUserDefaults standardUserDefaults] objectForKey:@"canLog"]) {
    NSLog(@"not allowed to log, not special user");
    return;
  }
  
  // check if logs
  NSArray *existingLogs = [[NSUserDefaults standardUserDefaults] objectForKey:logKey];
  if (existingLogs == nil || existingLogs.count == 0) {
    NSLog(@"No logs to sync, backing out");
    return;
  }
  
  // TODO: update this to live once it's ready
  NSURL *url = [NSURL URLWithString:@"https://obbstaging.herokuapp.com/log"];
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:existingLogs options:NSJSONWritingPrettyPrinted error:nil];

  [request setHTTPMethod:@"POST"];
  [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
  [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
  [request setValue:[NSString stringWithFormat:@"%lu", (unsigned long)[jsonData length]] forHTTPHeaderField:@"Content-Length"];
  [request setHTTPBody: jsonData];

  NSURLConnection *connection = [[NSURLConnection alloc] initWithRequest:request delegate:nil];
  NSLog(@"Log sync attempted");
}

@end
