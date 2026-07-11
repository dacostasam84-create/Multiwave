import uvicorn
import signal

signal.signal(signal.SIGINT, signal.SIG_IGN)
signal.signal(signal.SIGTERM, signal.SIG_IGN)

uvicorn.run("main:app", host="127.0.0.1", port=5000)