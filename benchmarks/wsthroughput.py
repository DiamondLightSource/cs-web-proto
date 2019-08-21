#!/usr/bin/env python

# WS server example

import time
import subprocess
import subprocess
import argparse
import asyncio
import sys
import websockets

PARSER = argparse.ArgumentParser(description='')
PARSER.add_argument('--count', type=int, help='')
PARSER.add_argument('--size', type=int, help='')
PARSER.add_argument('--browser', action='store_true', help='Use a browser for testing')
args = PARSER.parse_args()


def server(message_count, message_size):
    async def inner(websocket, path):
        start = None
        for i in range(message_count):
            start = start or time.time()
            await websocket.send("h" * message_size + "\n")
        print("Closing")
        taken = time.time() - start
        print('messages per second:', message_count / taken, '; bytes per second:', message_size * message_count / taken)
        await websocket.close()
    return inner


async def client():
    uri = "ws://localhost:8765"
    start = time.time()
    async with websockets.connect(uri) as websocket:
        while True:
            try:
                message = await websocket.recv()
            except websockets.ConnectionClosed:
                sys.exit()
                print(message)

start_server = websockets.serve(server(args.count, args.size), "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)

if args.browser:
    subprocess.Popen(['sensible-browser', 'wsthroughput.html'])
else:
    time.sleep(2)
    asyncio.get_event_loop().run_until_complete(client())

asyncio.get_event_loop().run_forever()
