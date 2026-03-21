#!/usr/bin/env python3
"""Start Flask backend and capture errors"""

import subprocess
import sys
import time

print("Starting Flask backend...")
print("=" * 60)

process = subprocess.Popen(
    [sys.executable, "backend/app.py"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    universal_newlines=True,
    cwd=r"d:\Projects\waste_classification_ml\waste_classification_ml"
)

# Capture output for 10 seconds
try:
    for i in range(100):  # 10 seconds with 100ms intervals
        line = process.stdout.readline()
        if line:
            print(line.rstrip())
        time.sleep(0.1)
        
        # Check if process crashed
        if process.poll() is not None:
            print("\nProcess exited with code:", process.returncode)
            # Read remaining output
            for line in process.stdout.readlines():
                print(line.rstrip())
            break
except KeyboardInterrupt:
    print("\nStopping...")
finally:
    process.terminate()
    process.wait()
