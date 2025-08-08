# Rebuild the source code only when needed
FROM node:20 AS builder

# Accept the build argument in the builder stage
ARG APP_VERSION
ARG CLICKHOUSE_HOST
ARG CLICKHOUSE_USER
ARG CLICKHOUSE_PASSWORD
ARG DATABASE_URL

WORKDIR /service

# Set proxy environment variables
ENV http_proxy=http://192.168.0.152:10811
ENV https_proxy=http://192.168.0.152:10811
ENV HTTP_PROXY=http://192.168.0.152:10811
ENV HTTPS_PROXY=http://192.168.0.152:10811
ENV no_proxy=localhost,127.0.0.1,::1
ENV NO_PROXY=localhost,127.0.0.1,::1

RUN yarn set version 4.1.1

ENV PATH="$PATH:/root/.temporalio/bin"

COPY ./packages/admin-cli/scripts/install-deps.sh ./
COPY ./packages/admin-cli/scripts/admin.sh ./
RUN chmod +x ./install-deps.sh && \
    chmod +x ./admin.sh && \
    ./install-deps.sh

COPY *.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY ./packages/admin-cli/*.json ./packages/admin-cli/
COPY ./packages/backend-lib/*.json ./packages/backend-lib/
COPY ./packages/isomorphic-lib/*.json ./packages/isomorphic-lib/
COPY ./packages/emailo/*.json ./packages/emailo/

RUN yarn workspaces focus backend-lib admin-cli emailo

COPY ./packages/backend-lib/ ./packages/backend-lib
COPY ./packages/isomorphic-lib/ ./packages/isomorphic-lib
COPY ./packages/admin-cli/ ./packages/admin-cli
COPY ./packages/emailo/ ./packages/emailo

# Set build-time environment variables to satisfy config validation
ENV CLICKHOUSE_HOST=${CLICKHOUSE_HOST:-http://localhost:8123}
ENV CLICKHOUSE_USER=${CLICKHOUSE_USER:-dittofeed}
ENV CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD:-password}
ENV DATABASE_URL=${DATABASE_URL:-postgresql://postgres:password@localhost:5432/dittofeed}

RUN yarn workspace emailo build && \
    yarn workspace backend-lib build && \
    yarn workspace admin-cli build

# Set the environment variable
ENV APP_VERSION=${APP_VERSION}

# Clear proxy environment variables in production stage
ENV http_proxy=
ENV https_proxy=
ENV HTTP_PROXY=
ENV HTTPS_PROXY=
ENV no_proxy=
ENV NO_PROXY=

ENTRYPOINT ["./admin.sh"]
