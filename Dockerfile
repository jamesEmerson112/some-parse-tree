# Build stage
FROM swift:5.9-jammy as builder

WORKDIR /app

# Copy package files first for better caching
COPY backend/Package.swift ./
RUN swift package resolve

# Copy source code
COPY backend/Sources ./Sources

# Build release binary
RUN swift build -c release

# Runtime stage
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    libcurl4 \
    libxml2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the built binary
COPY --from=builder /app/.build/release/Run ./

# Copy Swift runtime libraries
COPY --from=builder /usr/lib/swift/linux/libswiftCore.so /usr/lib/swift/linux/
COPY --from=builder /usr/lib/swift/linux/libswiftGlibc.so /usr/lib/swift/linux/
COPY --from=builder /usr/lib/swift/linux/libswift_Concurrency.so /usr/lib/swift/linux/
COPY --from=builder /usr/lib/swift/linux/libswift_StringProcessing.so /usr/lib/swift/linux/
COPY --from=builder /usr/lib/swift/linux/libswift_RegexParser.so /usr/lib/swift/linux/
COPY --from=builder /usr/lib/swift/linux/libdispatch.so /usr/lib/swift/linux/
COPY --from=builder /usr/lib/swift/linux/libBlocksRuntime.so /usr/lib/swift/linux/
COPY --from=builder /usr/lib/swift/linux/libFoundation.so /usr/lib/swift/linux/
COPY --from=builder /usr/lib/swift/linux/libFoundationEssentials.so /usr/lib/swift/linux/
COPY --from=builder /usr/lib/swift/linux/libFoundationInternationalization.so /usr/lib/swift/linux/
COPY --from=builder /usr/lib/swift/linux/lib_FoundationICU.so /usr/lib/swift/linux/

ENV LD_LIBRARY_PATH=/usr/lib/swift/linux
ENV SWIFT_BACKTRACE=enable=yes

EXPOSE 8080

ENTRYPOINT ["./Run"]
CMD ["serve", "--env", "production", "--hostname", "0.0.0.0", "--port", "8080"]
