# Pin Go version to latest at time of development.
FROM golang:1.16.5 as build

WORKDIR /go/src/api

# Install dependencies.
COPY go.* .
RUN go mod download

# Copy application code.
COPY . .

# Build a statically linked binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -o api .

# Move the binary to a small footprint
FROM alpine:3.13 as final

# Set up non-root user & group named 'api'
RUN addgroup -S api && adduser -S api -G api

WORKDIR /api

# Copy binary from build, xfer ownership to api user.
COPY --from=build --chown=api:api /go/src/api/api .

# Run as api user.
USER api

EXPOSE 3030

CMD ./api
