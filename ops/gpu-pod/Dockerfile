# Multi-stage build. Targets:
#   - linux/amd64 with CUDA   → Runpod / Lambda / Vast.ai
#   - linux/arm64 with TRT    → Jetson Orin
ARG BASE=nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04
FROM ${BASE}

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-dev git curl \
    libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY nepa_runtime/requirements.txt /app/requirements.txt
RUN pip3 install --upgrade pip && \
    pip3 install -r /app/requirements.txt && \
    pip3 install onnxruntime-gpu

COPY nepa_runtime /app/nepa_runtime
COPY nepa_runtime/proto /app/proto

# Generate proto stubs at build time
RUN python3 -m grpc_tools.protoc -I proto \
      --python_out=nepa_runtime --grpc_python_out=nepa_runtime \
      proto/nepa.proto && \
    sed -i 's/^import nepa_pb2 as nepa__pb2/from . import nepa_pb2 as nepa__pb2/' \
      nepa_runtime/nepa_pb2_grpc.py

EXPOSE 8080 50051

ENV NEPA_BACKEND=onnx \
    NEPA_GRPC_PORT=50051 \
    NEPA_BRIDGE_PORT=8080 \
    NEPA_GRPC_ADDR=localhost:50051

# Start gRPC + HTTP bridge together
COPY ops/gpu-pod/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
