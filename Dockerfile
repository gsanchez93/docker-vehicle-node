FROM node_app_base

RUN mkdir -p /VehicleNode

WORKDIR /VehicleNode

COPY ./ /

RUN npm install

EXPOSE 8081

CMD ["npm", "start"]
